import React, { useState } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Calendar as RNCalendar, CalendarProps } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./card";

export interface CustomMarking {
  streak?: boolean; // Có đang trong chuỗi (Streak) không -> Hiện icon lửa
  marked?: boolean; // Hiện dấu chấm không?
  dotColor?: string; // Màu của dấu chấm
  selected?: boolean; // Ngày đang được chọn
}

// 1. COMPONENT LỊCH ĐÃ ĐƯỢC CUSTOM
export function Calendar({
  markedDates = {},
  ...props
}: CalendarProps & { markedDates?: Record<string, CustomMarking> }) {
  const isDark = false;

  return (
    <RNCalendar
      theme={{
        calendarBackground: isDark ? "#1a1c1a" : "#ffffff",
        textSectionTitleColor: "#86a789",
        monthTextColor: isDark ? "#faf9f6" : "#1e293b",
        arrowColor: "#86a789",
        textMonthFontWeight: "bold",
      }}
      dayComponent={({ date, state }) => {
        const dayMarking = date?.dateString
          ? markedDates[date.dateString]
          : undefined;

        const isStreak = dayMarking?.streak;
        const hasDot = dayMarking?.marked;
        const isSelected = dayMarking?.selected;

        const dotColor = dayMarking?.dotColor || "#ef4444"; // Chấm mặc định màu đỏ

        // Cài đặt màu chữ tuỳ theo trạng thái
        let textColor = isDark ? "#faf9f6" : "#1a1c1a"; // Chữ bình thường
        if (state === "disabled") textColor = isDark ? "#45474c" : "#c5c6cd"; // Chữ mờ
        if (state === "today") textColor = "#86a789"; // Chữ ngày hôm nay
        if (isSelected) textColor = "#ffffff"; // Chữ màu trắng khi được chọn

        return (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (props.onDayPress && date) props.onDayPress(date as any);
            }}
            style={{
              height: 40,
              width: 40,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isSelected ? "#1e293b" : "transparent",
              borderRadius: 20, // Bo tròn khi selected
            }}
          >
            {/* 1. Icon Lửa (Streak) ở góc trên bên phải */}
            {isStreak && (
              <View
                style={{ position: "absolute", top: 0, right: 0, zIndex: 2 }}
              >
                <Ionicons name="flame" size={16} color="#f59e0b" />
              </View>
            )}

            {/* 2. Chữ của Ngày */}
            <Text
              style={{
                color: textColor,
                fontWeight: state === "today" || isSelected ? "bold" : "normal",
                zIndex: 1,
              }}
            >
              {date?.day}
            </Text>

            {/* 3. Dấu chấm (Dot) nằm dưới cùng */}
            {hasDot && (
              <View
                style={{
                  position: "absolute",
                  bottom: 4,
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: dotColor,
                  zIndex: 1,
                }}
              />
            )}
          </TouchableOpacity>
        );
      }}
      {...props}
    />
  );
}

// ---------------------------------------------------------
// 2. MÀN HÌNH DEMO ĐỂ BẠN XEM TRƯỚC KẾT QUẢ
// ---------------------------------------------------------
export default function MyCalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("");

  return (
    <Card
      className="rounded-3xl p-1 bg-card border-2 border-border shadow-sm overflow-hidden"
    >
      <Calendar
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        markedDates={{
          // -- CHUỖI CÓ LỬA + CHẤM ĐỎ Ở VÀI NGÀY --
          "2026-07-20": { streak: true, marked: true, dotColor: "#86a789" },
          "2026-07-21": { streak: true },
          "2026-07-22": { streak: true, marked: true, dotColor: "#ef4444" },
          "2026-07-23": { streak: true },

          // -- NGÀY ĐANG CHỌN (Ghi đè) --
          ...(selectedDate
            ? { [selectedDate]: { selected: true, streak: true } }
            : {}),
        }}
        hideExtraDays={true}
        firstDay={1}
      />
    </Card>
  );
}
