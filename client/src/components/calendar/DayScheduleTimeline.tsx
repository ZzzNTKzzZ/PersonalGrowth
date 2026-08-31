import React, { useMemo, useState, useEffect } from "react";
import { View, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { LucideIcon } from "lucide-react-native";
import { Text } from "../ui/text";

export type CalendarEvent = {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  color?: string; // Ví dụ: "#3B82F6", "#10B981", "#8B5CF6"
  icon?: LucideIcon;
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

  // Lọc các sự kiện thuộc ngày đang chọn VÀ loại bỏ các sự kiện kéo dài > 16 tiếng (như Du lịch 3 ngày) khỏi lưới giờ
  const activeEvents = useMemo(() => {
    if (!date || !events) return events || [];
    const targetDateStr = date.toDateString();
    return events.filter((e) => {
      const s = new Date(e.start);
      const durationHours =
        (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
      return (mode !== "day" || s.toDateString() === targetDateStr) && durationHours < 16;
    });
  }, [events, date, mode]);

  // Hàm tạo key duy nhất cho mỗi sự kiện (dựa trên tiêu đề + thời gian)
  const getEventKey = (e: CalendarEvent) =>
    `${e.title}_${new Date(e.start).getTime()}_${new Date(e.end).getTime()}`;

  // Thuật toán phân bổ cột động thông minh theo mốc thời gian thực (Smart Dynamic Column Slotting)
  const eventColumnMap = useMemo(() => {
    const map = new Map<string, { count: number; pos: number }>();
    if (!activeEvents || activeEvents.length === 0) return map;

    // Sắp xếp sự kiện theo thời gian bắt đầu (sự kiện kéo dài hơn xếp trước)
    const sorted = [...activeEvents].sort((a, b) => {
      if (a.start.getTime() !== b.start.getTime()) {
        return a.start.getTime() - b.start.getTime();
      }
      return b.end.getTime() - a.end.getTime();
    });

    // Mảng lưu thời điểm kết thúc của từng cột (slot)
    const slotsEndTime: number[] = [];

    sorted.forEach((event) => {
      const eStart = new Date(event.start).getTime();
      const eEnd = new Date(event.end).getTime();

      // 1. Tìm tất cả các sự kiện giao nhau về mặt thời gian với event này
      const overlapping = sorted.filter(
        (other) =>
          new Date(other.start).getTime() < eEnd &&
          new Date(other.end).getTime() > eStart
      );

      // 2. Tái sử dụng slot đầu tiên đã giải phóng (slot kết thúc <= eStart)
      let assignedSlot = -1;
      for (let i = 0; i < slotsEndTime.length; i++) {
        if (slotsEndTime[i] <= eStart) {
          assignedSlot = i;
          slotsEndTime[i] = eEnd;
          break;
        }
      }

      // Nếu không có slot nào rảnh, mở slot mới
      if (assignedSlot === -1) {
        assignedSlot = slotsEndTime.length;
        slotsEndTime.push(eEnd);
      }

      // 3. Tính số lượng công việc cùng diễn ra đồng thời nhiều nhất trong khung giờ này
      let maxSimultaneousInWindow = 1;
      overlapping.forEach((other) => {
        const oStart = new Date(other.start).getTime();
        const oEnd = new Date(other.end).getTime();
        const concurrent = overlapping.filter(
          (o) =>
            new Date(o.start).getTime() < oEnd &&
            new Date(o.end).getTime() > oStart
        );
        if (concurrent.length > maxSimultaneousInWindow) {
          maxSimultaneousInWindow = concurrent.length;
        }
      });

      map.set(getEventKey(event), {
        pos: assignedSlot,
        count: Math.max(maxSimultaneousInWindow, assignedSlot + 1),
      });
    });

    return map;
  }, [activeEvents]);

  // 1. Tính toán minHour và maxHour
  const { minHour, maxHour, scrollOffsetMinutes } = useMemo(() => {
    if (!activeEvents || activeEvents.length === 0) {
      return { minHour: 6, maxHour: 23, scrollOffsetMinutes: 6 * 60 };
    }

    const earliestEvent = activeEvents.reduce((earliest, current) => {
      return current.start.getTime() < earliest.start.getTime()
        ? current
        : earliest;
    }, activeEvents[0]);

    const startHour = earliestEvent.start.getHours();
    const min = Math.max(0, startHour - 1);

    return {
      minHour: min,
      maxHour: 23,
      scrollOffsetMinutes: min * 60,
    };
  }, [activeEvents]);

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        events={activeEvents}
        height={height}
        mode={mode}
        date={date}
        minHour={minHour}
        maxHour={maxHour}
        scrollOffsetMinutes={scrollOffsetMinutes}
        swipeEnabled={swipeEnabled}
        onSwipeEnd={(newDate: Date) => {
          if (!onChangeDate) return;
          if (newDate instanceof Date && !isNaN(newDate.getTime())) {
            const localDate = new Date(
              newDate.getFullYear(),
              newDate.getMonth(),
              newDate.getDate(),
              12,
              0,
              0
            );
            if (!date || localDate.toDateString() !== date.toDateString()) {
              onChangeDate(localDate);
            }
          }
        }}
        onChangeDate={(val: any) => {
          if (!onChangeDate) return;
          const rawDate = Array.isArray(val) ? val[0] : val;
          if (rawDate) {
            const d = rawDate instanceof Date ? rawDate : new Date(rawDate);
            if (!isNaN(d.getTime())) {
              const localDate = new Date(
                d.getFullYear(),
                d.getMonth(),
                d.getDate(),
                12,
                0,
                0
              );
              if (!date || localDate.toDateString() !== date.toDateString()) {
                onChangeDate(localDate);
              }
            }
          }
        }}
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
                width: 50,
                height: cellHeight,
                position: "relative",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingTop: 4,
                borderTopWidth: 1,
                borderTopColor: "#E5E7EB",
                borderStyle: "dashed",
                borderRightWidth: 1,
                borderRightColor: "#F3F4F6",
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
                    top: Math.max(0, (now.getMinutes() / 60) * cellHeight),
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
                  <Text variant={'p'} className="text-white text-[12px] font-bold text-center">
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
        bodyContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0, marginRight: 0 }}
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
          touchableOpacityProps = {} as any
        ) => {
          const { key, style: originalStyle, ...otherProps } = touchableOpacityProps || {};
          const mainColor = event.color || "#3B82F6";

          // Màu nền 20% opacity (nếu là hex #RRGGBB thì ghép thêm '33' ở cuối)
          const bgColor =
            mainColor.startsWith("#") && mainColor.length === 7
              ? `${mainColor}33`
              : "rgba(59, 130, 246, 0.15)";

          // Lấy vị trí cột rảnh (pos) và số lượng slot đồng thời từ eventColumnMap bằng string key
          const eventKey = getEventKey(event);
          const overlapInfo = eventColumnMap.get(eventKey) || {
            count: event.overlapCount || 1,
            pos: event.overlapPosition || 0,
          };
          const count = overlapInfo.count;
          const pos = overlapInfo.pos;

          const overlapStyle: ViewStyle = {
            width: (count > 1 ? `${100 / count - 2}%` : "100%") as DimensionValue,
            left: (count > 1 ? `${(pos / count ) * 100}%` : "0%") as DimensionValue,
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
              className={`border-l-4 rounded-lg px-1.5 overflow-hidden ${
                isShortEvent ? "py-0.5 justify-center" : "py-1"
              }`}
            >
              <View className="flex-1 justify-center">
                <Text
                  numberOfLines={isShortEvent ? 1 : undefined}
                  className="font-semibold text-xs text-foreground"
                >
                  {event.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
