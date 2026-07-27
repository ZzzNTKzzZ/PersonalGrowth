import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import DayScheduleTimeline from "@/components/calendar/DayScheduleTimeline";
import WeekDateSelector from "@/components/calendar/WeekDateSelector";
import WeekScheduleTimeLine from "@/components/calendar/WeekSchedule";
import MonthScheduleTimeline from "@/components/calendar/MonthSchedule";

export default function Calendar(params: any) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [typeCalendar, setTypeCalendar] = useState<{
    name: "Ngày" | "Tuần" | "Tháng";
    value: "day" | "week" | "month";
  }>({
    name: "Ngày",
    value: "day",
  });

  const c: {
    date: string;
    task: { name: string; dueDate: string }[];
  }[] = [
    {
      date: "20/7",
      task: [
        { name: "Lập kế hoạch tuần mới", dueDate: "20/7/2026 08:30" },
        { name: "Viết báo cáo tuần", dueDate: "20/7/2026 15:00" },
      ],
    },
    {
      date: "21/7",
      task: [{ name: "Phỏng vấn ứng viên", dueDate: "21/7/2026 09:30" }],
    },
    {
      date: "22/7",
      task: [
        { name: "Tập gym", dueDate: "22/7/2026 17:30" },
        { name: "Học tiếng Anh", dueDate: "22/7/2026 20:00" },
      ],
    },
    {
      date: "23/7",
      task: [
        { name: "Gặp khách hàng quan trọng", dueDate: "23/7/2026 10:00" },
        { name: "Ăn trưa cùng team", dueDate: "23/7/2026 12:00" },
      ],
    },
    {
      date: "24/7",
      task: [{ name: "Review code dự án", dueDate: "24/7/2026 14:00" }],
    },
    {
      date: "25/7",
      task: [
        { name: "Đi siêu thị mua sắm", dueDate: "25/7/2026 09:00" },
        { name: "Xem phim giải trí", dueDate: "25/7/2026 20:30" },
      ],
    },
    {
      date: "26/7",
      task: [], // Ngày nghỉ, không có task
    },
  ];

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMon = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const monday = new Date(today.getFullYear(), today.getMonth(), diffToMon);

  const getDayDate = (offsetDays: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offsetDays);
    return d;
  };

  const aDay: {
    name: string;
    category: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
    startDate?: Date;
    endDate?: Date;
  }[] = [
    {
      name: "Khóa đào tạo Leadership (3 ngày)",
      category: "Công việc",
      icon: "briefcase-outline",
      color: "#8B5CF6",
      startDate: getDayDate(0), // Thứ 2
      endDate: getDayDate(2), // Thứ 4
    },
    {
      name: "Du lịch Đà Lạt (3 ngày)",
      category: "Du lịch",
      icon: "airplane-outline",
      color: "#F43F5E",
      startDate: getDayDate(3), // Thứ 5
      endDate: getDayDate(5), // Thứ 7
    },
    {
      name: "Sinh nhật đồng nghiệp",
      category: "Cá nhân",
      icon: "alert-outline",
      color: "#3B82F6",
      startDate: getDayDate(2), // Thứ 4
      endDate: getDayDate(2),
    },
    {
      name: "Hội thảo AI Tech All-Day",
      category: "Hội thảo",
      icon: "bulb-outline",
      color: "#10B981",
      startDate: getDayDate(4), // Thứ 6
      endDate: getDayDate(4),
    },
  ];

  const singleDayEvents = [
    // Thứ 2 (Monday)
    {
      title: "Họp khởi động tuần mới",
      start: new Date(new Date(getDayDate(0)).setHours(8, 0, 0, 0)),
      end: new Date(new Date(getDayDate(0)).setHours(9, 30, 0, 0)),
      color: "#3B82F6",
    },
    {
      title: "Phỏng vấn Senior Dev",
      start: new Date(new Date(getDayDate(0)).setHours(8, 30, 0, 0)),
      end: new Date(new Date(getDayDate(0)).setHours(9, 0, 0, 0)),
      color: "#06B6D4",
    },
    {
      title: "Review Code với Frontend",
      start: new Date(new Date(getDayDate(0)).setHours(10, 0, 0, 0)),
      end: new Date(new Date(getDayDate(0)).setHours(11, 30, 0, 0)),
      color: "#10B981",
    },
    {
      title: "Báo cáo tiến độ cho Manager",
      start: new Date(new Date(getDayDate(0)).setHours(14, 30, 0, 0)),
      end: new Date(new Date(getDayDate(0)).setHours(16, 0, 0, 0)),
      color: "#8B5CF6",
    },

    // Thứ 3 (Tuesday)
    {
      title: "Workshop UI/UX Design System",
      start: new Date(new Date(getDayDate(1)).setHours(9, 0, 0, 0)),
      end: new Date(new Date(getDayDate(1)).setHours(10, 30, 0, 0)),
      color: "#F59E0B",
    },
    {
      title: "Họp với Đối tác Khách hàng",
      start: new Date(new Date(getDayDate(1)).setHours(10, 0, 0, 0)),
      end: new Date(new Date(getDayDate(1)).setHours(11, 30, 0, 0)),
      color: "#EC4899",
    },
    {
      title: "Lập kế hoạch Release v2.0",
      start: new Date(new Date(getDayDate(1)).setHours(15, 0, 0, 0)),
      end: new Date(new Date(getDayDate(1)).setHours(16, 30, 0, 0)),
      color: "#3B82F6",
    },

    // Thứ 4 (Wednesday)
    {
      title: "Đào tạo Security & Auth Flow",
      start: new Date(new Date(getDayDate(2)).setHours(8, 30, 0, 0)),
      end: new Date(new Date(getDayDate(2)).setHours(10, 0, 0, 0)),
      color: "#EF4444",
    },
    {
      title: "Testing & QA Benchmark",
      start: new Date(new Date(getDayDate(2)).setHours(10, 30, 0, 0)),
      end: new Date(new Date(getDayDate(2)).setHours(12, 0, 0, 0)),
      color: "#6366F1",
    },
    {
      title: "Sync 1-on-1 với Manager",
      start: new Date(new Date(getDayDate(2)).setHours(14, 0, 0, 0)),
      end: new Date(new Date(getDayDate(2)).setHours(15, 0, 0, 0)),
      color: "#06B6D4",
    },

    // Thứ 5 (Thursday)
    {
      title: "Demo Sản phẩm cho Ban giám đốc",
      start: new Date(new Date(getDayDate(3)).setHours(9, 0, 0, 0)),
      end: new Date(new Date(getDayDate(3)).setHours(10, 0, 0, 0)),
      color: "#8B5CF6",
    },
    {
      title: "Refactor Core Module",
      start: new Date(new Date(getDayDate(3)).setHours(10, 30, 0, 0)),
      end: new Date(new Date(getDayDate(3)).setHours(12, 0, 0, 0)),
      color: "#10B981",
    },
    {
      title: "Họp Retro Sprint",
      start: new Date(new Date(getDayDate(3)).setHours(14, 30, 0, 0)),
      end: new Date(new Date(getDayDate(3)).setHours(16, 0, 0, 0)),
      color: "#F59E0B",
    },

    // Thứ 6 (Friday)
    {
      title: "Townhall Toàn Công Ty Q3",
      start: new Date(new Date(getDayDate(4)).setHours(8, 30, 0, 0)),
      end: new Date(new Date(getDayDate(4)).setHours(10, 0, 0, 0)),
      color: "#3B82F6",
    },
    {
      title: "Tổng kết mục tiêu OKR",
      start: new Date(new Date(getDayDate(4)).setHours(10, 30, 0, 0)),
      end: new Date(new Date(getDayDate(4)).setHours(11, 30, 0, 0)),
      color: "#EC4899",
    },
    {
      title: "Happy Hour & Teambuilding",
      start: new Date(new Date(getDayDate(4)).setHours(15, 0, 0, 0)),
      end: new Date(new Date(getDayDate(4)).setHours(17, 0, 0, 0)),
      color: "#F59E0B",
    },

    // Thứ 7 (Saturday)
    {
      title: "Lớp học Tiếng Anh Chuyên ngành",
      start: new Date(new Date(getDayDate(5)).setHours(9, 0, 0, 0)),
      end: new Date(new Date(getDayDate(5)).setHours(11, 0, 0, 0)),
      color: "#10B981",
    },
    {
      title: "Tập Gym & Chạy bộ thể thao",
      start: new Date(new Date(getDayDate(5)).setHours(14, 0, 0, 0)),
      end: new Date(new Date(getDayDate(5)).setHours(16, 0, 0, 0)),
      color: "#06B6D4",
    },

    // Chủ nhật (Sunday)
    {
      title: "Gặp mặt CLB Sách & Cà phê",
      start: new Date(new Date(getDayDate(6)).setHours(10, 0, 0, 0)),
      end: new Date(new Date(getDayDate(6)).setHours(12, 0, 0, 0)),
      color: "#8B5CF6",
    },
  ];

  return (
    <View className="flex-1 bg-background relative">
      <ScrollView contentContainerClassName="p-6">
        <View className="flex-row justify-between items-center pb-6">
          <View className="flex-col flex-1 pr-4">
            <View className="flex-row items-center flex-wrap">
              <Text variant="h3">Chào buổi sáng, Khánh 👋</Text>
            </View>
          </View>

          <View className="flex-row gap-3 items-center">
            <View className="relative">
              <Ionicons name="notifications-outline" size={28} />
              <View className="w-3 h-3 rounded-full bg-error absolute -top-0.5 -right-0.5 border-[1.5px] border-white z-10" />
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <Text variant="h1">
              Lịch trình
            </Text>
          </View>

          <View className="flex-1">
            <SegmentedControl
              options={["Ngày", "Tuần", "Tháng"]}
              selectedOption={typeCalendar.name}
              onOptionPress={(val) => {
                console.log("SegmentedControl clicked! Value received:", val);

                // Tạo một object map để suy ra 'value' từ 'name'
                const valueMap: Record<string, "day" | "week" | "month"> = {
                  Ngày: "day",
                  Tuần: "week",
                  Tháng: "month",
                };

                // Cập nhật lại state với đúng định dạng object { name, value }
                setTypeCalendar({
                  name: val as "Ngày" | "Tuần" | "Tháng",
                  value: valueMap[val],
                });
              }}
            />
          </View>
        </View>

        {typeCalendar.value === "day" && (
          <Card className="my-3 p-0 overflow-hidden">
            <View className="py-2">
              <WeekDateSelector
                data={c}
                type={typeCalendar.value}
                allDay={aDay}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </View>
            <DayScheduleTimeline
              events={singleDayEvents}
              mode="day"
              date={selectedDate}
              onChangeDate={setSelectedDate}
              swipeEnabled={true}
            />
          </Card>
        )}

        {typeCalendar.value === "week" && (
          <Card className="my-3 p-0 overflow-hidden">
            <View className="py-2">
              <WeekDateSelector
                data={c}
                type={typeCalendar.value}
                allDay={aDay}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            </View>
            <WeekScheduleTimeLine
              events={singleDayEvents}
              date={selectedDate}
              onChangeDate={setSelectedDate}
              swipeEnabled={true}
              hideHeader={true}
            />
          </Card>
        )}

        {typeCalendar.value === "month" && (
          <Card className="my-3 p-0 overflow-hidden">
            <MonthScheduleTimeline
              events={[
                ...singleDayEvents,
                ...aDay.map((item) => ({
                  title: item.name,
                  start: item.startDate || today,
                  end: item.endDate || today,
                  color: item.color || "#8B5CF6",
                  description: item.category,
                })),
              ]}
              date={selectedDate}
              onChangeDate={setSelectedDate}
              swipeEnabled={true}
              onSwitchToDayView={() => {
                setTypeCalendar({ name: "Ngày", value: "day" });
              }}
            />
          </Card>
        )}
      </ScrollView>
      {/* Floating Action Button (FAB) thêm sự kiện / công việc mới */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          console.log("Tạo sự kiện/công việc mới");
        }}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full border-[#ffffff] border-2 bg-primary items-center justify-center shadow-lg  elevation-6 z-50"
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
