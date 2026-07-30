import React, { useMemo, useState, useEffect } from "react";
import { View, TouchableOpacity, DimensionValue, ViewStyle } from "react-native";
import { Calendar } from "react-native-big-calendar";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { CalendarEvent } from "./DayScheduleTimeline";

type Props = {
  events: CalendarEvent[];
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

export default function WeekScheduleTimeLine({
  events,
  height = 650,
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

  // Lọc chỉ giữ các sự kiện trong ngày (loại bỏ các sự kiện kéo dài nhiều ngày > 20 tiếng khỏi lưới giờ)
  const timedEventsOnly = useMemo(() => {
    if (!events) return [];
    return events.filter((e) => {
      const durationHours =
        (e.end.getTime() - e.start.getTime()) / (1000 * 60 * 60);
      return durationHours < 20;
    });
  }, [events]);

  // Tính toán minHour và maxHour
  const { minHour, maxHour, scrollOffsetMinutes } = useMemo(() => {
    if (!timedEventsOnly || timedEventsOnly.length === 0) {
      return { minHour: 6, maxHour: 23, scrollOffsetMinutes: 6 * 60 };
    }

    const earliestEvent = timedEventsOnly.reduce((earliest, current) => {
      return current.start.getTime() < earliest.start.getTime()
        ? current
        : earliest;
    }, timedEventsOnly[0]);

    const startHour = earliestEvent.start.getHours();
    const min = Math.max(0, startHour - 1);

    return {
      minHour: min,
      maxHour: 23,
      scrollOffsetMinutes: min * 60,
    };
  }, [timedEventsOnly]);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Calendar
        events={timedEventsOnly}
        height={height}
        mode="week"
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
            nowIndicator: "#EF4444",
          },
        }}
        renderHeader={hideHeader ? () => null : undefined}
        headerContainerStyle={
          hideHeader ? { display: "none", height: 0 } : undefined
        }
        calendarContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0 }}
        bodyContainerStyle={{ paddingHorizontal: 0, marginHorizontal: 0, marginRight: 0 }}
        hourComponent={({ hour }) => {
          const isCurrentHour = now.getHours() === hour;

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
              <Text variant="muted" className="text-[10px] font-medium">
                {`${hour.toString().padStart(2, "0")}:00`}
              </Text>

              {isCurrentHour && (
                <View
                  style={{
                    position: "absolute",
                    top: Math.max(0, (now.getMinutes() / 60) * cellHeight - 8),
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
        calendarCellStyle={() => ({
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          borderStyle: "dashed",
          borderLeftWidth: 1,
          borderLeftColor: "#F3F4F6",
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

          const bgColor =
            mainColor.startsWith("#") && mainColor.length === 7
              ? `${mainColor}33`
              : "rgba(59, 130, 246, 0.15)";

          const count = event.overlapCount || 1;
          const pos = event.overlapPosition || 0;
          const gap = 1;

          const overlapStyle: ViewStyle = {
            width: (count > 1 ? `${100 / count - 1}%` : "100%") as DimensionValue,
            left: (count > 1 ? `${(pos / count) * 100}%` : "0%") as DimensionValue,
            paddingRight: count > 1 && pos < count - 1 ? gap : 0,
            start: undefined,
            end: undefined,
          };

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
              className="border-l-2 rounded-sm px-0.5 py-0.5 overflow-hidden justify-center"
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="font-bold text-[9px] text-foreground leading-tight"
              >
                {event.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}