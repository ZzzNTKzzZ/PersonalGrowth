import React, { useMemo } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { CalendarEvent } from "./DayScheduleTimeline";

type Props = {
  events: CalendarEvent[];
  date?: Date;
  swipeEnabled?: boolean;
  onChangeDate?: (date: Date) => void;
  onPressEvent?: (event: CalendarEvent) => void;
  onSwitchToDayView?: () => void;
};

// Hệ thống màu theo danh mục sự kiện
const CATEGORY_COLORS: Record<
  string,
  { hex: string; bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  "Công việc": { hex: "#3B82F6", bg: "bg-blue-500/15", icon: "briefcase-outline" },
  "Học tập": { hex: "#8B5CF6", bg: "bg-violet-500/15", icon: "book-outline" },
  "Sức khỏe": { hex: "#10B981", bg: "bg-emerald-500/15", icon: "fitness-outline" },
  "Cá nhân": { hex: "#F43F5E", bg: "bg-rose-500/15", icon: "person-outline" },
  "Du lịch": { hex: "#F59E0B", bg: "bg-amber-500/15", icon: "airplane-outline" },
  "Hội thảo": { hex: "#06B6D4", bg: "bg-cyan-500/15", icon: "bulb-outline" },
};

const DEFAULT_COLOR = { hex: "#3B82F6", bg: "bg-blue-500/15", icon: "calendar-outline" as const };

const formatYYYYMMDD = (d: Date) => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (d: Date) => {
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function MonthScheduleTimeline({
  events = [],
  date,
  swipeEnabled = true,
  onChangeDate,
  onPressEvent,
  onSwitchToDayView,
}: Props) {
  const activeDate =
    date instanceof Date && !isNaN(date.getTime()) ? date : new Date();

  // 1. Phân loại và tạo danh sách markedDates + đếm sự kiện dồn cho từng ngày
  const { markedDates, eventsByDate } = useMemo(() => {
    const marks: Record<
      string,
      {
        dots?: { key: string; color: string }[];
        selected?: boolean;
        selectedColor?: string;
      }
    > = {};

    const byDate: Record<string, CalendarEvent[]> = {};

    const addEventToDate = (dateStr: string, event: CalendarEvent) => {
      if (!byDate[dateStr]) {
        byDate[dateStr] = [];
      }
      byDate[dateStr].push(event);
    };

    (events || []).forEach((event) => {
      if (!event.start || !event.end) return;

      const start =
        event.start instanceof Date ? event.start : new Date(event.start);
      const end = event.end instanceof Date ? event.end : new Date(event.end);

      const startDateStr = formatYYYYMMDD(start);
      const endDateStr = formatYYYYMMDD(end);

      if (startDateStr === endDateStr) {
        addEventToDate(startDateStr, event);
      } else {
        const curr = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate()
        );
        const endLimit = new Date(
          end.getFullYear(),
          end.getMonth(),
          end.getDate()
        );

        let count = 0;
        while (curr <= endLimit && count < 31) {
          addEventToDate(formatYYYYMMDD(curr), event);
          curr.setDate(curr.getDate() + 1);
          count++;
        }
      }
    });

    // Tạo mảng dấu chấm (tối đa 3 chấm) cho từng ngày
    Object.keys(byDate).forEach((dateStr) => {
      const dayEvents = byDate[dateStr];
      const dots = dayEvents.slice(0, 3).map((ev, idx) => {
        const categoryConfig =
          CATEGORY_COLORS[ev.description || ""] || DEFAULT_COLOR;
        return {
          key: `dot-${idx}`,
          color: ev.color || categoryConfig.hex,
        };
      });

      marks[dateStr] = { dots };
    });

    // Đánh dấu ngày active đang được chọn
    const selectedKey = formatYYYYMMDD(activeDate);
    if (!marks[selectedKey]) {
      marks[selectedKey] = { dots: [] };
    }
    marks[selectedKey].selected = true;
    marks[selectedKey].selectedColor = "#10B981";

    return { markedDates: marks, eventsByDate: byDate };
  }, [events, activeDate]);

  // Danh sách sự kiện của ngày đang được chọn (Agenda List)
  const selectedDateKey = formatYYYYMMDD(activeDate);
  const selectedDayEvents = eventsByDate[selectedDateKey] || [];

  return (
    <View className="w-full bg-background">
      {/* 1. Lưới Lịch Tháng dạng Grid */}
      <View className="p-2">
        <RNCalendar
          current={selectedDateKey}
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={(day) => {
            if (!onChangeDate) return;
            const selected = new Date(
              day.year,
              day.month - 1,
              day.day,
              12,
              0,
              0
            );
            onChangeDate(selected);
          }}
          onMonthChange={(month) => {
            if (!onChangeDate) return;
            const selected = new Date(
              month.year,
              month.month - 1,
              month.day || 1,
              12,
              0,
              0
            );
            onChangeDate(selected);
          }}
          enableSwipeMonths={swipeEnabled}
          firstDay={1}
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textSectionTitleColor: "#6B7280",
            selectedDayBackgroundColor: "#10B981",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#EF4444",
            dayTextColor: "#1F2937",
            textDisabledColor: "#D1D5DB",
            dotColor: "#3B82F6",
            selectedDotColor: "#ffffff",
            arrowColor: "#6B7280",
            monthTextColor: "#1F2937",
            indicatorColor: "#10B981",
            textDayFontWeight: "600",
            textMonthFontWeight: "700",
            textDayHeaderFontWeight: "600",
            textDayFontSize: 13,
            textMonthFontSize: 15,
            textDayHeaderFontSize: 11,
          }}
        />
      </View>

      {/* 2. Phần Agenda hiển thị danh sách sự kiện ở nửa dưới màn hình */}
      <View className="w-full p-4 border-t border-border bg-card" style={{ minHeight: 280 }}>
        {/* Header Agenda */}
        <View className="flex-row items-center justify-between mb-3 px-1">
          <View className="flex-row items-center gap-2">
            <Ionicons name="list-outline" size={18} color="#10B981" />
            <Text className="font-bold text-sm text-foreground">
              {`Lịch trình ngày ${activeDate.getDate()}/${
                activeDate.getMonth() + 1
              }/${activeDate.getFullYear()}`}
            </Text>
            <Badge className="bg-primary/20 border-0 rounded-full px-2 py-0.5">
              <Text className="text-[10px] text-primary font-bold">
                {`${selectedDayEvents.length} sự kiện`}
              </Text>
            </Badge>
          </View>

          {onSwitchToDayView && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSwitchToDayView}
              className="flex-row items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg"
            >
              <Text className="text-[11px] font-semibold text-primary">
                Xem dạng ngày
              </Text>
              <Ionicons name="chevron-forward" size={12} color="#10B981" />
            </TouchableOpacity>
          )}
        </View>

        {/* Danh sách sự kiện ngày chọn */}
        {selectedDayEvents.length > 0 ? (
          <View className="w-full">
            {selectedDayEvents.map((item, index) => {
              const categoryConfig =
                CATEGORY_COLORS[item.description || ""] || DEFAULT_COLOR;
              const itemColor = item.color || categoryConfig.hex;
              const isAllDay =
                (item.end.getTime() - item.start.getTime()) / (1000 * 60 * 60) >=
                20;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => onPressEvent?.(item)}
                  className="mb-2 bg-background border border-border rounded-xl p-3 shadow-xs flex-row items-center justify-between"
                  style={{ borderLeftWidth: 4, borderLeftColor: itemColor }}
                >
                  <View className="flex-1 mr-2">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="font-semibold text-xs text-foreground">
                        {item.title}
                      </Text>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1">
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color="#6B7280"
                        />
                        <Text variant="muted" className="text-[11px]">
                          {isAllDay
                            ? "Cả ngày"
                            : `${formatTime(item.start)} - ${formatTime(
                                item.end
                              )}`}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Badge danh mục */}
                  {item.description && (
                    <View className="items-end">
                      <View
                        className={`flex-row items-center gap-1 px-2 py-1 rounded-md ${categoryConfig.bg}`}
                      >
                        <Ionicons
                          name={categoryConfig.icon}
                          size={11}
                          color={categoryConfig.hex}
                        />
                        <Text
                          style={{ color: categoryConfig.hex }}
                          className="text-[10px] font-bold"
                        >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          /* Trạng thái trống */
          <View className="flex-1 items-center justify-center py-8 bg-background border border-dashed border-border rounded-xl">
            <Ionicons
              name="calendar-clear-outline"
              size={32}
              color="#9CA3AF"
            />
            <Text variant="muted" className="text-xs mt-2 text-center">
              Không có sự kiện nào được ghi nhận trong ngày này
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
