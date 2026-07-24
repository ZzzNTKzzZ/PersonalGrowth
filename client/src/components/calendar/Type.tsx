import { View } from "react-native";
import { Card } from "../ui/card";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "../ui/text";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

const EVENT_COLORS = [
  { bg: "bg-blue-500/20", badge: "bg-blue-500", hex: "#3B82F6" },
  { bg: "bg-emerald-500/20", badge: "bg-emerald-500", hex: "#10B981" },
  { bg: "bg-violet-500/20", badge: "bg-violet-500", hex: "#8B5CF6" },
  { bg: "bg-amber-500/20", badge: "bg-amber-500", hex: "#F59E0B" },
  { bg: "bg-rose-500/20", badge: "bg-rose-500", hex: "#F43F5E" },
];

type Props = {
  type: "day" | "week" | "month";
  data: {
    date: string;
    task: { name: string; dueDate: string }[];
  }[];
  allDay?: {
    name: string;
    category: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
  }[];
};

const getWeekDays = () => {
  const today = new Date();
  const days = [];
  // Lấy 3 ngày trước, ngày hiện tại (0), và 3 ngày sau
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const getDayOfWeek = (d: Date) => {
  const day = d.getDay();
  if (day === 0) return "CN";
  return `T${day + 1}`;
};

export default function Type({ type = "day", data, allDay }: Props) {
  const weekDays = getWeekDays();
  const today = new Date();
  const todayFormatted = `${today.getDate()}/${today.getMonth() + 1}`;

  return (
    <View>
      <View className="flex-row items-center justify-between w-full border-b border-border pb-2 px-2">
        <Ionicons name="chevron-back" size={24} color={"#6B7280"} />
        <View className="flex-1 flex-row items-center justify-between px-1">
          {weekDays.map((d, index) => {
            const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
            const dayOfWeek = getDayOfWeek(d);
            const isToday = dateStr === todayFormatted;

            // Kiểm tra xem ngày này có task nào trong mảng data không
            const dayData = data.find((item) => item.date === dateStr);
            const hasTask = dayData && dayData.task && dayData.task.length > 0;

            return (
              <View
                key={index}
                className={`flex-1 items-center py-2 mx-0.5 rounded-lg ${isToday ? "bg-primary" : ""}`}
              >
                {/* Hiển thị Thứ (T2, T3...) */}
                <Text
                  className={`text-[11px] mb-1 ${isToday ? "text-[#ffffff] opacity-90" : "text-muted-foreground"}`}
                >
                  {dayOfWeek}
                </Text>

                {/* Hiển thị Ngày */}
                <View className="items-center justify-center">
                  <Text
                    className={`text-base font-semibold ${isToday ? "text-[#ffffff]" : "text-foreground"}`}
                  >
                    {d.getDate()}
                  </Text>
                </View>

                {/* Dấu chấm (dot) hiển thị có công việc */}
                <View className="h-1.5 mt-1 items-center justify-center">
                  {hasTask && (
                    <View
                      className={`w-1.5 h-1.5 rounded-full ${isToday ? "bg-[#ffffff]" : "bg-primary"}`}
                    />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        <Ionicons name="chevron-forward" size={24} color={"#6B7280"} />
      </View>

      {/* Phần Sự kiện cả ngày */}
      <View className="pt-4 px-2">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="calendar-clear-outline" size={20} />
            <Text variant={"p"} className="font-bold mt-0 text-sm">
              Sự kiện cả ngày
            </Text>
          </View>

          <Ionicons
            name="chevron-forward-outline"
            size={18}
            color={"#6B7280"}
          />
        </View>

        {allDay && allDay.length > 0 && (
          <View className="flex-row flex-wrap justify-between">
            {allDay.map((event, idx) => {
              const theme = EVENT_COLORS[idx % EVENT_COLORS.length];
              return (
              <View key={idx} className="mb-4 w-[48%] relative pt-2">
                {/* Phần box chính (Nền và bo góc) */}
                <View className={cn("flex-row items-start p-3 pt-4 rounded-xl", theme.bg)}>
                  <Ionicons 
                    name={event.icon} 
                    size={22} 
                    color={event.color || theme.hex} 
                  />
                  <Text className="font-semibold text-sm flex-1 ml-2">
                    {event.name}
                  </Text>
                </View>

                {/* Badge đính nổi lên trên viền box */}
                <View className="absolute top-0 left-2 z-10">
                  <Badge className={cn("rounded-md px-2 py-0.5 shadow-sm border-0", theme.badge)}>
                    <Text className="text-[10px] text-[#ffffff] font-medium">
                        {event.category}
                    </Text>
                  </Badge>
                </View>
              </View>
            )})}
          </View>
        )}
      </View>
    </View>
  );
}
