import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Calendar as RNCalendar, CalendarProps } from "react-native-calendars";
import { Icon } from "./icon";
import { Flame } from "lucide-react-native";
import { Text } from "./text";
import { cn } from "@/lib/utils";

export interface CustomMarking {
  streak?: boolean; // Có đang trong chuỗi (Streak) không -> Hiện icon lửa
  marked?: boolean; // Hiện dấu chấm không?
  dotColor?: string; // Màu của dấu chấm đơn
  dots?: { key?: string; color: string }[]; // Danh sách các chấm thói quen trong ngày
  selected?: boolean; // Ngày đang được chọn
  selectedColor?: string; // Màu phủ khi ngày được chọn (Default #22C55E)
}

export function Calendar({
  markedDates = {},
  ...props
}: CalendarProps & { markedDates?: Record<string, CustomMarking> }) {
  return (
    <RNCalendar
      theme={{
        calendarBackground: "transparent",
        textSectionTitleColor: "#6B7280",
        monthTextColor: "#111827",
        arrowColor: "#22C55E",
        textMonthFontWeight: "bold",
      }}
      dayComponent={({ date, state }) => {
        const dayMarking = date?.dateString
          ? markedDates[date.dateString]
          : undefined;

        const isStreak = dayMarking?.streak;
        const hasDot = dayMarking?.marked;
        const isSelected = dayMarking?.selected;
        const selectedBgColor = dayMarking?.selectedColor || "#22C55E";

        // Lấy danh sách dots từ markedDates (hỗ trợ nhiều chấm thói quen)
        const dots =
          dayMarking?.dots ||
          (hasDot ? [{ color: dayMarking?.dotColor || "#22C55E" }] : []);

        const isToday = state === "today";
        const isDisabled = state === "disabled";

        return (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              if (props.onDayPress && date) props.onDayPress(date as any);
            }}
            className={cn(
              "h-10 w-10 items-center justify-center pb-1.5 rounded-lg relative",
              isSelected ? "bg-primary" : "bg-transparent"
            )}
            style={
              isSelected && selectedBgColor !== "#22C55E"
                ? { backgroundColor: selectedBgColor }
                : undefined
            }
          >
            {/* 1. Icon Lửa (Streak) góc trên bên phải */}
            {isStreak && (
              <View className="absolute top-0.5 right-0.5 z-20">
                <Icon as={Flame} size={14} color="#F59E0B" />
              </View>
            )}

            {/* 2. Chữ Số Ngày sử dụng Component Text UI custom có variant */}
            <Text
              variant={
                isSelected || isToday ? "small" : isDisabled ? "subtle" : "default"
              }
              className={cn(
                "text-xs z-10 text-center",
                isSelected
                  ? "font-bold text-white"
                  : isDisabled
                  ? "text-muted-foreground/40 font-normal"
                  : isToday
                  ? "font-extrabold text-primary"
                  : "font-medium text-foreground"
              )}
            >
              {date?.day}
            </Text>

            {/* 3. Các Chấm Thói Quen (Habit Dots) */}
            {dots.length > 0 && (
              <View className="absolute bottom-1.5 flex-row items-center justify-center gap-0.5 z-10">
                {dots.slice(0, 4).map((dot, idx) => (
                  <View
                    key={idx}
                    className={cn(
                      "w-1 h-1 rounded-full",
                      isSelected ? "bg-white" : ""
                    )}
                    style={
                      !isSelected
                        ? { backgroundColor: dot.color || "#22C55E" }
                        : undefined
                    }
                  />
                ))}
              </View>
            )}
          </TouchableOpacity>
        );
      }}
      {...props}
    />
  );
}

export default function MyCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("2026-07-23");

  return (
    <Calendar
      onDayPress={(day: any) => setSelectedDate(day.dateString)}
      markedDates={{
        "2026-07-20": {
          streak: true,
          dots: [{ color: "#22C55E" }, { color: "#8B5CF6" }, { color: "#3B82F6" }],
        },
        "2026-07-21": { streak: true, dots: [{ color: "#22C55E" }] },
        "2026-07-22": {
          streak: true,
          dots: [
            { color: "#22C55E" },
            { color: "#8B5CF6" },
            { color: "#3B82F6" },
            { color: "#F59E0B" },
          ],
        },
        "2026-07-23": { streak: true, dots: [{ color: "#22C55E" }] },
        ...(selectedDate
          ? { [selectedDate]: { selected: true, selectedColor: "#22C55E" } }
          : {}),
      }}
      hideExtraDays={true}
      firstDay={1}
    />
  );
}
