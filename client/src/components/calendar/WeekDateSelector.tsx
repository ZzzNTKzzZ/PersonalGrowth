import { View, TouchableOpacity } from "react-native";
import { Card } from "../ui/card";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const EVENT_COLORS = [
  { bg: "bg-blue-500/20", badge: "bg-blue-500", hex: "#3B82F6" },
  { bg: "bg-emerald-500/20", badge: "bg-emerald-500", hex: "#22C55E" },
  { bg: "bg-violet-500/20", badge: "bg-violet-500", hex: "#8B5CF6" },
  { bg: "bg-amber-500/20", badge: "bg-amber-500", hex: "#F59E0B" },
  { bg: "bg-rose-500/20", badge: "bg-rose-500", hex: "#F43F5E" },
];

export type AllDayEvent = {
  name: string;
  category: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  bg?: string;
  startDate?: Date | string;
  endDate?: Date | string;
};

type Props = {
  type: "day" | "week" | "month";
  data: {
    date: string;
    task: { name: string; dueDate: string }[];
  }[];
  allDay?: AllDayEvent[];
  selectedDate?: Date;
  onSelectDate?: (date: Date) => void;
};

const getWeekDays = (centerDate: Date) => {
  const d = new Date(centerDate);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Tính mốc ngày Thứ 2 (Monday) đầu tuần
  const diff = d.getDate() - (day === 0 ? 6 : day - 1);
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    days.push(dayDate);
  }
  return days;
};

const getDayOfWeek = (d: Date) => {
  const day = d.getDay();
  if (day === 0) return "CN";
  return `T${day + 1}`;
};

// Hàm tính mốc cột bắt đầu và số lượng cột nối dài của sự kiện nhiều ngày
const getEventSpan = (event: AllDayEvent, weekDays: Date[]) => {
  if (!event.startDate || !event.endDate) return null;

  const parseDate = (d: Date | string) => {
    if (d instanceof Date) return d;
    const parts = d.split("/");
    if (parts.length >= 2) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parts.length >= 3 ? parseInt(parts[2], 10) : new Date().getFullYear();
      return new Date(year, month, day);
    }
    return new Date(d);
  };

  const start = parseDate(event.startDate);
  const end = parseDate(event.endDate);

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

  const evStart = startOfDay(start).getTime();
  const evEnd = endOfDay(end).getTime();

  const wStart = startOfDay(weekDays[0]).getTime();
  const wEnd = endOfDay(weekDays[6]).getTime();

  if (evEnd < wStart || evStart > wEnd) return null;

  let startCol = -1;
  let endCol = -1;

  for (let i = 0; i < 7; i++) {
    const dayStart = startOfDay(weekDays[i]).getTime();
    const dayEnd = endOfDay(weekDays[i]).getTime();

    if (evStart <= dayEnd && startCol === -1) {
      startCol = i;
    }
    if (evEnd >= dayStart) {
      endCol = i;
    }
  }

  if (startCol === -1) startCol = 0;
  if (endCol === -1) endCol = 6;

  const colSpan = endCol - startCol + 1;
  return { startCol, colSpan };
};

export default function WeekDateSelector({
  type = "day",
  data = [],
  allDay = [],
  selectedDate,
  onSelectDate,
}: Props) {
  const activeDate =
    selectedDate instanceof Date && !isNaN(selectedDate.getTime())
      ? selectedDate
      : new Date();

  const weekDays = getWeekDays(activeDate);

  const handlePrevDay = () => {
    const prev = new Date(activeDate);
    prev.setDate(activeDate.getDate() - (type === "week" ? 7 : 1));
    onSelectDate?.(prev);
  };

  const handleNextDay = () => {
    const next = new Date(activeDate);
    next.setDate(activeDate.getDate() + (type === "week" ? 7 : 1));
    onSelectDate?.(next);
  };

  return (
    <View>
      <View className="w-full border-b border-border pb-2">
        <View className="flex-row items-center justify-between w-full">
          {/* Lệch trái trùng khớp với độ rộng cột mốc giờ 50px */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePrevDay}
            style={{ width: 50 }}
            className="items-center justify-center py-1"
          >
            <Ionicons name="chevron-back" size={22} color={"#6B7280"} />
          </TouchableOpacity>

          <View className="flex-1 flex-row items-center justify-between">
            {weekDays.map((d, index) => {
              const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
              const dayOfWeek = getDayOfWeek(d);

              const isSelected =
                d.getDate() === activeDate.getDate() &&
                d.getMonth() === activeDate.getMonth() &&
                d.getFullYear() === activeDate.getFullYear();

              // Kiểm tra xem ngày này có task nào trong mảng data không
              const dayData = (data || []).find((item) => item && item.date === dateStr);
              const hasTask = dayData && dayData.task && dayData.task.length > 0;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => onSelectDate?.(d)}
                  className={`flex-1 items-center py-1.5 mx-0.5 rounded-lg ${
                    isSelected ? "bg-primary" : ""
                  }`}
                >
                  {/* Hiển thị Thứ (T2, T3...) */}
                  <Text
                    className={`text-[11px] mb-0.5 ${
                      isSelected ? "text-[#ffffff] opacity-90" : "text-muted-foreground"
                    }`}
                  >
                    {dayOfWeek}
                  </Text>

                  {/* Hiển thị Ngày */}
                  <View className="items-center justify-center">
                    <Text
                      className={`text-sm font-semibold ${
                        isSelected ? "text-[#ffffff]" : "text-foreground"
                      }`}
                    >
                      {d.getDate()}
                    </Text>
                  </View>

                  {/* Dấu chấm (dot) hiển thị có công việc */}
                  <View className="h-1.5 mt-0.5 items-center justify-center">
                    {hasTask && (
                      <View
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? "bg-[#ffffff]" : "bg-primary"
                        }`}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleNextDay}
            style={{ width: 24 }}
            className="items-center justify-center py-1 pr-1"
          >
            <Ionicons name="chevron-forward" size={22} color={"#6B7280"} />
          </TouchableOpacity>
        </View>

        {/* Thanh dài màu nối liền các ngày của sự kiện nhiều ngày / cả ngày nằm dưới các dấu chấm */}
        {allDay && allDay.length > 0 && (
          <View className="mt-1.5 w-full pl-[50px] pr-[24px]">
            {allDay.map((event, idx) => {
              const span = getEventSpan(event, weekDays);
              if (!span) return null;

              const theme = EVENT_COLORS[idx % EVENT_COLORS.length];
              const barBg = event.color || theme.hex;

              return (
                <View
                  key={idx}
                  className="my-0.5 rounded-md px-1 py-0.5 flex-row items-center overflow-hidden shadow-sm"
                  style={{
                    marginLeft: `${(span.startCol / 7) * 100}%`,
                    width: `${(span.colSpan / 7) * 100}%`,
                    backgroundColor: barBg,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    className="text-[#ffffff] text-[10px] font-bold flex-1 text-center"
                  >
                    {event.name}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
