import React, { useMemo, useState, useEffect } from "react";
import { View, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";

export type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  color?: string; // Ví dụ: "#3B82F6", "#10B981", "#8B5CF6"
  icon?: keyof typeof Ionicons.glyphMap;
  description?: string;
};

type Props = {
  events: CalendarEvent[];
  mode?: "day" | "week" | "month";
  height?: number;
  date?: Date;
  hideHeader?: boolean;
  swipeEnabled?: boolean;
  onChangeDate?: (date: Date) => void;
  onPressEvent?: (event: CalendarEvent) => void;
};

// Hàm format giờ HH:mm
const formatTime = (d: Date) => {
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function DayScheduleTimeline({
  events,
  mode = "day",
  height = 600,
  date,
  hideHeader = true,
  swipeEnabled = true,
  onChangeDate,
  onPressEvent,
}: Props) {
  // State thời gian thực (Cập nhật liên tục mỗi phút)
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  // 1. Tính toán minHour và maxHour: Cắt bỏ hoàn toàn các giờ trước mốc (1 giờ trước công việc đầu tiên)
  const { minHour, maxHour, scrollOffsetMinutes } = useMemo(() => {
    if (!events || events.length === 0) {
      return { minHour: 6, maxHour: 23, scrollOffsetMinutes: 6 * 60 };
    }

    // Tìm công việc có thời gian bắt đầu sớm nhất
    const earliestEvent = events.reduce((earliest, current) => {
      return current.start.getTime() < earliest.start.getTime()
        ? current
        : earliest;
    }, events[0]);

    // Tìm công việc có thời gian kết thúc muộn nhất
    const latestEvent = events.reduce((latest, current) => {
      return current.end.getTime() > latest.end.getTime()
        ? current
        : latest;
    }, events[0]);

    const startHour = earliestEvent.start.getHours();
    const endHour = Math.ceil(
      latestEvent.end.getHours() + latestEvent.end.getMinutes() / 60
    );

    // Lấy mốc giờ bắt đầu sớm nhất (lùi 1 giờ trước sự kiện, VD: sự kiện 8h thì hiển thị từ 7h)
    const min = Math.max(0, startHour - 1);
    const max = Math.min(24, Math.max(min + 2, endHour + 1));

    return {
      minHour: min,
      maxHour: max,
      scrollOffsetMinutes: min * 60,
    };
  }, [events]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        events={events}
        height={height}
        mode={mode}
        date={date}
        minHour={minHour}
        maxHour={maxHour}
        scrollOffsetMinutes={scrollOffsetMinutes}
        swipeEnabled={swipeEnabled}
        // onChangeDate={onChangeDate}
        hideNowIndicator={false}
        enableEnrichedEvents={true}
        isEventOrderingEnabled={true}
        overlapOffset={0}
        ampm={false}
        showTime={true}
        theme={{
          palette: {
            nowIndicator: "#EF4444", // Đường vạch đỏ dính liền theo dòng thời gian khi cuộn
          },
        }}
        hourComponent={({ hour }) => {
          const isCurrentHour = now.getHours() === hour;
          const currentMinutes = now.getMinutes();

          const totalHours = maxHour - minHour;
          const cellHeight = totalHours > 0 ? height / totalHours : 60;

          return (
            <View
              style={{
                height: cellHeight,
                position: "relative",
                alignItems: "center",
              }}
            >
              <Text variant="muted" className="text-[10px] font-medium ">
                {`${hour.toString().padStart(2, "0")}:00`}
              </Text>

              {/* Nhãn thời gian hiện tại nằm ngay cạnh vạch đỏ chỉ giờ */}
              {isCurrentHour && (
                <View
                  style={{
                    position: "absolute",
                    left: 2,
                    right: 2,
                    backgroundColor: "#EF4444",
                    borderRadius: 4,
                    paddingVertical: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 999,
                  }}
                >
                  <Text className="text-white text-[9px] font-bold text-center">
                    {formatTime(now)}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        dayHeaderHighlightColor="transparent"
        weekDayHeaderHighlightColor="transparent"
        renderHeader={hideHeader ? () => null : undefined}
        headerContainerStyle={
          hideHeader ? { display: "none", height: 0 } : undefined
        }
        calendarContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        bodyContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0, marginRight: 5 }}
        calendarCellStyle={() => ({
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          borderStyle: "dashed",
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        })}
        onPressEvent={onPressEvent}
        renderEvent={(
          event: CalendarEvent & { overlapPosition?: number; overlapCount?: number },
          touchableOpacityProps
        ) => {
          const { key, style: originalStyle, ...otherProps } = touchableOpacityProps;
          const mainColor = event.color || "#3B82F6";

          // Màu nền 20% opacity (nếu là hex #RRGGBB thì ghép thêm '33' ở cuối)
          const bgColor =
            mainColor.startsWith("#") && mainColor.length === 7
              ? `${mainColor}33`
              : "rgba(59, 130, 246, 0.15)";

          const count = event.overlapCount || 1;
          const pos = event.overlapPosition || 0;
          const gap = 12; // 4px mỗi bên -> tạo khoảng cách 8px rộng rãi giữa các sự kiện trùng mốc giờ

          const overlapStyle: ViewStyle = {
            width: (count > 1 ? `${100 / count - 2}%` : "100%") as DimensionValue,
            left: (count > 1 ? `${(pos / count) * 100}%` : "0%") as DimensionValue,
            paddingLeft: 0,
            paddingRight: count > 1 && pos < count - 1 ? gap : 0,
            start: undefined,
            end: undefined,
          };

          // Tính toán thời lượng sự kiện (phút) để tự động điều chỉnh hiển thị gọn gàng
          const durationMinutes =
            (event.end.getTime() - event.start.getTime()) / (1000 * 60);
          const isShortEvent = durationMinutes <= 35;

          // Trường hợp đặc biệt: Sự kiện ngắn (<= 30 phút) VÀ bị chia cột hẹp (count > 1)
          // Khung quá nhỏ về cả chiều cao lẫn chiều rộng -> Chỉ hiện icon hoặc 1 dòng chữ nhỏ căn giữa
          const isTooSmallForText = isShortEvent && count > 1;

          return (
            <TouchableOpacity
              key={key}
              {...otherProps}
              style={[
                originalStyle,
                overlapStyle,
                {
                  backgroundColor: bgColor,
                  borderLeftColor: mainColor,
                  shadowColor: "transparent",
                  shadowOpacity: 0,
                  shadowRadius: 0,
                  elevation: 0,
                },
              ]}
              className={`border-l-4 rounded-lg px-1 overflow-hidden ${
                isShortEvent ? "py-0.5 justify-center" : "py-1"
              }`}
            >
              {isTooSmallForText ? (
                /* Ô quá nhỏ: Ưu tiên hiện icon căn giữa, nếu không có icon mới hiện chữ ngắn */
                <View className="flex-row items-center justify-center">
                  {event.icon ? (
                    <Ionicons name={event.icon} size={13} color={mainColor} />
                  ) : (
                    <Text
                      numberOfLines={1}
                      className="px-2 font-semibold text-[10px] text-foreground text-center"
                    >
                      {event.title}
                    </Text>
                  )}
                </View>
              ) : (
                /* Khung tiêu chuẩn */
                <View className="px-2">
                  <View className="flex-row items-center gap-1">
                    {event.icon && (
                      <Ionicons
                        name={event.icon}
                        size={isShortEvent ? 12 : 14}
                        color={mainColor}
                      />
                    )}
                    <Text
                      numberOfLines={isShortEvent ? 1 : 2}
                      className="font-semibold text-xs text-foreground flex-1"
                    >
                      {event.title}
                    </Text>
                  </View>

                  {!isShortEvent && (
                    <Text
                      numberOfLines={1}
                      variant="muted"
                      className="text-[10px] mt-0.5"
                    >
                      {`${formatTime(event.start)} - ${formatTime(event.end)}`}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
