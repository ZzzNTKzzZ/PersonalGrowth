import React, { useState } from "react";
import { View, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import HabitCard from "@/components/habits/card";
import TaskCard from "../task/card";
import MyCalendarScreen from "@/components/ui/calendar";
import JournalCard from "@/components/journal/card";

export default function HomeScreen() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [checked, setChecked] = useState<boolean>(false);

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-2">
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-8 mt-5">
          <View>
            <Text variant={"muted"}>{today}</Text>
            <View className="flex-row items-center">
              <Text variant="h2" className="border-b-0 pb-0">
                Chào buổi sáng,{" "}
              </Text>
              <Text variant="h2" className="border-b-0 pb-0 text-secondary">
                Khánh
              </Text>
            </View>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-primary justify-center items-center shadow-sm">
            <Ionicons name="person" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* AI Coach Card */}
        <Card className="mb-8 rounded-3xl shadow-sm border-border bg-card">
          <CardHeader className="flex-row items-center">
            <Ionicons name="sparkles" size={20} color="#86a789" />
            <CardTitle className="text-secondary ml-2 text-base font-semibold">
              Gợi ý từ AI Trợ lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="p" className="mt-0 text-[15px] leading-relaxed">
              Bạn đang duy trì chuỗi 3 ngày thiền định rất tốt. Tâm trí của bạn
              đang dần trở nên tĩnh lặng và tập trung hơn, hãy tiếp tục phát huy
              nhé!
            </Text>
          </CardContent>
        </Card>

        {/* Section: Today's Habits */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3">Thói quen hôm nay</Text>
            <Text variant="small" className="text-secondary">
              Xem tất cả
            </Text>
          </View>

          {/* Habit 1 */}
          <HabitCard
            iconName="water"
            name="Uống nước lọc"
            rule="3/8 Cốc (Còn 5 cốc)"
            checked={checked}
            setChecked={setChecked}
          />
          <HabitCard
            iconName="leaf"
            name="Thiền"
            rule="Mục tiêu: 15 phút"
            checked={checked}
            setChecked={setChecked}
          />
        </View>

        {/* Section: Upcoming Tasks */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3">Nhiệm vụ sắp tới</Text>
            <Text variant="small" className="text-secondary">
              Xem tất cả
            </Text>
          </View>

          <TaskCard
            iconName="document-text"
            name="Hoàn thành báo cáo Tuần"
            checked={checked}
            setChecked={setChecked}
            dueDate={new Date()}
            status="Todo"
            category="Công việc"
          />
        </View>

        {/* Section: Calendar */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4"></View>
          <MyCalendarScreen />
        </View>

        {/* Section: Journal */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text variant="h3">Nhật ký</Text>
            <Text variant="small" className="text-secondary">
              Xem tất cả
            </Text>
          </View>
          <JournalCard
            iconName="flower"
            name="Tìm lại sự cân bằng"
            date={new Date()}
            mood="Peaceful"
            content="Sáng nay thức dậy với một chút áp lực, nhưng nhờ 10 phút ngồi thiền và viết ra những việc cần làm, mình đã kiểm soát được cảm xúc. Dần nhận ra rằng đôi khi chỉ cần bước chậm lại một chút để đi xa hơn."
          />
          <JournalCard
            iconName="sparkles"
            name="Kỷ luật tạo nên tự do"
            date={new Date()}
            mood="Proud"
            content="Cuối cùng cũng hoàn thành xong bản báo cáo Tuần - thứ mà mình đã định trì hoãn. Chiến thắng được sự lười biếng của bản thân luôn là chiến thắng ngọt ngào nhất!"
          />
        </View>
      </ScrollView>
    </View>
  );
}
