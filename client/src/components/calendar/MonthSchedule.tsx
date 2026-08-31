import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Calendar, CustomMarking } from "../ui/calendar";
import { Icon } from "../ui/icon";
import {
  Briefcase,
  BookOpen,
  Dumbbell,
  User,
  Plane,
  Lightbulb,
  Calendar as CalendarIcon,
  GitCommitHorizontal,
  ChevronRight,
  Clock,
  CalendarX,
  LucideIcon,
} from "lucide-react-native";
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
  { hex: string; bg: string; icon: LucideIcon }
> = {
  "Công việc": { hex: "#3B82F6", bg: "bg-blue-500/15", icon: Briefcase },
  "Học tập": { hex: "#8B5CF6", bg: "bg-violet-500/15", icon: BookOpen },
  "Sức khỏe": { hex: "#22C55E", bg: "bg-emerald-500/15", icon: Dumbbell },
  "Cá nhân": { hex: "#F43F5E", bg: "bg-rose-500/15", icon: User },
  "Du lịch": { hex: "#F59E0B", bg: "bg-amber-500/15", icon: Plane },
  "Hội thảo": { hex: "#06B6D4", bg: "bg-cyan-500/15", icon: Lightbulb },
};

const DEFAULT_COLOR = { hex: "#3B82F6", bg: "bg-blue-500/15", icon: CalendarIcon };

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

  // 1. Phân loại và tạo danh sách markedDates (không dùng streak) + đếm sự kiện dồn cho từng ngày
  const { markedDates, eventsByDate } = useMemo(() => {
    const marks: Record<string, CustomMarking> = {};

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

    // Tạo mảng dấu chấm thói quen/sự kiện cho từng ngày (không có icon streak)
    Object.keys(byDate).forEach((dateStr) => {
      const dayEvents = byDate[dateStr];
      const dots = dayEvents.slice(0, 4).map((ev, idx) => {
        const categoryConfig =
          CATEGORY_COLORS[ev.description || ""] || DEFAULT_COLOR;
        return {
          key: `dot-${idx}`,
          color: ev.color || categoryConfig.hex,
        };
      });

      marks[dateStr] = { dots, marked: dots.length > 0 };
    });

    // Đánh dấu ngày active đang được chọn
    const selectedKey = formatYYYYMMDD(activeDate);
    marks[selectedKey] = {
      ...marks[selectedKey],
      selected: true,
      selectedColor: "#22C55E",
    };

    return { markedDates: marks, eventsByDate: byDate };
  }, [events, activeDate]);

  // Danh sách sự kiện của ngày đang được chọn (Agenda Timeline)
  const selectedDateKey = formatYYYYMMDD(activeDate);
  const selectedDayEvents = eventsByDate[selectedDateKey] || [];

  return (
    <View className="w-full bg-background">
      {/* 1. Lưới Lịch Tháng dạng Grid dùng Component Calendar custom */}
      <View className="px-1 py-1">
        <Calendar
          current={selectedDateKey}
          markedDates={markedDates}
          onDayPress={(day: any) => {
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
          onMonthChange={(month: any) => {
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
          hideExtraDays={true}
        />
      </View>

      {/* 2. Phần Agenda dạng Vertical Timeline ở nửa dưới màn hình */}
      <View
        className="w-full p-4 border-t border-border bg-card"
        style={{ minHeight: 280 }}
      >
        {/* Header Agenda */}
        <View className="flex-row items-center justify-between mb-3.5 px-1">
          <View className="flex-row items-center gap-2">
            <Icon as={GitCommitHorizontal} size={18} color="#22C55E" />
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
              <Icon as={ChevronRight} size={12} color="#22C55E" />
            </TouchableOpacity>
          )}
        </View>

        {/* Danh sách sự kiện ngày chọn dạng Vertical Timeline */}
        {selectedDayEvents.length > 0 ? (
          <View className="w-full relative pl-0 pr-1 pt-1 pb-2">
            {/* Trục đường kẻ dọc Timeline */}
            <View
              className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border/80"
              style={{ borderRadius: 1 }}
            />

            {selectedDayEvents.map((item, index) => {
              const categoryConfig =
                CATEGORY_COLORS[item.description || ""] || DEFAULT_COLOR;
              const itemColor = item.color || categoryConfig.hex;

              const isAllDay =
                (item.end.getTime() - item.start.getTime()) / (1000 * 60 * 60) >=
                20;

              return (
                <View
                  key={index}
                  className="flex-row items-start mb-3.5 relative"
                >
                  {/* Nút mốc thời gian Node Dot trên trục Timeline */}
                  <View className="w-8 items-center justify-center pt-3 z-10">
                    <View
                      style={{ borderColor: itemColor }}
                      className="w-4 h-4 rounded-full bg-background border-2 items-center justify-center shadow-xs"
                    >
                      <View
                        style={{ backgroundColor: itemColor }}
                        className="w-1.5 h-1.5 rounded-full"
                      />
                    </View>
                  </View>

                  {/* Thẻ Card sự kiện dạng Timeline */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => onPressEvent?.(item)}
                    className="flex-1 border-b border-border p-3.5 shadow-xs"
                  >
                    <View className="flex-row items-center justify-between mb-1.5">
                      <View className="flex-row items-center gap-1">
                        <Icon
                          as={Clock}
                          size={13}
                          color={itemColor}
                        />
                        <Text
                          style={{ color: itemColor }}
                          className="text-xs font-bold"
                        >
                          {isAllDay
                            ? "Cả ngày"
                            : `${formatTime(item.start)} - ${formatTime(
                                item.end
                              )}`}
                        </Text>
                      </View>

                      {item.description && (
                        <View
                          style={{ backgroundColor: `${itemColor}1F` }}
                          className="flex-row items-center gap-1 px-2 py-0.5 rounded-lg"
                        >
                          <Icon
                            as={categoryConfig.icon}
                            size={11}
                            color={itemColor}
                          />
                          <Text
                            style={{ color: itemColor }}
                            className="text-[10px] font-bold"
                          >
                            {item.description}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Tiêu đề sự kiện */}
                    <Text className="font-bold text-sm text-foreground">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : (
          /* Trạng thái trống */
          <View className="flex-1 items-center justify-center py-8 bg-background border border-dashed border-border rounded-xl">
            <Icon
              as={CalendarX}
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
