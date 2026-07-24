import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import  BigCalendar  from "@/components/calendar/BigCalendar"
import Type from "@/components/calendar/Type";

export default function Calendar(params: any) {
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

  const aDay: {
    name: string;
    category: string;
    icon:  keyof typeof Ionicons.glyphMap
  }[] = [
    {
      name: "Sinh nhật",
      category: "Cá nhân",
      icon: "alert-outline"
    },
    {
      name: "Du lịch Đà Lạt",
      category: "Du lịch",
      icon: "airplane-outline"
    },
  ];

      const today = new Date();

     const singleDayEvents = [
      {
        title: 'Họp khởi động tuần mới',
        start: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 8), // 08:30
        end: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 9, 30),   // 09:30
        color: '#3B82F6', // Màu xanh dương (Tùy chọn)
      },
      {
        title: 'Review Code với Team Frontend',
        start: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 10, 0), // 10:00
        end: new Date(today.getFullYear(), today.getMonth(), 
  today.getDate(), 11, 30), // 11:30
        color: '#10B981', // Màu xanh lá (Tùy chọn)
      },
      {
        title: 'Ăn trưa cùng Khách hàng',
        start: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 12, 0), // 12:00
        end: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 13, 30), // 13:30
        color: '#F59E0B', // Màu cam (Tùy chọn)
      },
      {
        title: 'Báo cáo tiến độ cho Manager',
        start: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 14, 30), // 14:30
        end: new Date(today.getFullYear(), today.getMonth(), 
  today.getDate(), 15, 30), // 15:30
        color: '#8B5CF6', // Màu tím (Tùy chọn)
      },
      {
        title: 'Tập Gym / Thể thao',
        start: new Date(today.getFullYear(), today.getMonth(),
  today.getDate(), 17, 30), // 17:30
        end: new Date(today.getFullYear(), today.getMonth(), 
  today.getDate(), 19, 0),  // 19:00
        color: '#F43F5E', // Màu đỏ hồng (Tùy chọn)
      },
    ];
   
  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-2">
        <View className="flex-row justify-between items-center pb-6">
          <View className="flex-col flex-1 pr-4">
            <View className="flex-row items-center flex-wrap">
              <Text variant="h4">Chào buổi sáng, </Text>
              <Text variant="h3">Khánh</Text>
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
            <Text variant="h2" className="pb-0">
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

        <Card className="py-3">
          <Type data={c} type={typeCalendar.value} allDay={aDay} />
        </Card>
        <Card >
          <BigCalendar events={singleDayEvents} mode={typeCalendar.value}/>
        </Card>
      </ScrollView>
    </View>
  );
}
