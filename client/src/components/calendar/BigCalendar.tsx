import React, { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { Ionicons } from "@expo/vector-icons";

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
  mode?: "day" | "3days" | "week" | "month" | "schedule";
  height?: number;
  date?: Date;
  hideNowIndicator?: boolean;
  hideHeader?: boolean;
  onPressEvent?: (event: CalendarEvent) => void;
};

// Hàm format giờ HH:mm
const formatTime = (d: Date) => {
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function BigCalendar({
  events,
  mode = "day",
  height = 500,
  date,
  hideNowIndicator = true,
  hideHeader = true,
  onPressEvent,
}: Props) {
  // 1. Tính toán minHour và maxHour: Cắt bỏ hoàn toàn các giờ trước mốc (1 giờ trước công việc đầu tiên)
  const { minHour, maxHour, scrollOffsetMinutes } = useMemo(() => {
    if (!events || events.length === 0) {
      return { minHour: 6, maxHour: 23, scrollOffsetMinutes: 6 * 60 }; // Mặc định từ 6:00 đến 23:00 nếu không có sự kiện
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

    // Cắt bỏ hoàn toàn các giờ từ 0 đến trước (startHour - 1)
    const min = Math.max(0, startHour);
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
        hideNowIndicator={hideNowIndicator}
        dayHeaderHighlightColor="transparent"
        weekDayHeaderHighlightColor="transparent"
        renderHeader={hideHeader ? () => null : undefined}
        headerContainerStyle={hideHeader ? { display: "none", height: 0 } : undefined}
        calendarContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        bodyContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        calendarCellStyle={() => ({
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          borderStyle: "dashed",
          borderLeftWidth: 0,
          borderRightWidth: 0,
          borderBottomWidth: 0,
        })}
        onPressEvent={onPressEvent}
        renderEvent={(event: CalendarEvent, touchableOpacityProps) => {
          const mainColor = event.color || "#3B82F6";

          // Màu nền 20% opacity (nếu là hex #RRGGBB thì ghép thêm '33' ở cuối)
          const bgColor =
            mainColor.startsWith("#") && mainColor.length === 7
              ? `${mainColor}33`
              : "rgba(59, 130, 246, 0.15)";

          return (
            <TouchableOpacity
              {...touchableOpacityProps}
              style={[
                touchableOpacityProps.style,
                {
                  backgroundColor: bgColor,
                  borderLeftColor: mainColor,
                  shadowColor: "transparent",
                  shadowOpacity: 0,
                  shadowRadius: 0,
                  elevation: 0,
                },
              ]}
              className="border-l-4 rounded-lg px-2 py-1 overflow-hidden"
            >
              <View className="flex-row items-center gap-1.5">
                {event.icon && (
                  <Ionicons name={event.icon} size={14} color={mainColor} />
                )}
                <Text
                  numberOfLines={1}
                  className="text-xs font-semibold text-gray-900 flex-1"
                >
                  {event.title}
                </Text>
              </View>

              <Text
                numberOfLines={1}
                className="text-[10px] text-gray-600 mt-0.5"
              >
                {`${formatTime(event.start)} - ${formatTime(event.end)}`}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}