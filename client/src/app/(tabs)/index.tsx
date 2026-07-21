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
import { Badge } from "@/components/ui/badge";

export default function HomeScreen() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const c = [
    { time: "08:00", name: "Học React cơ bản", category: "Học tập" },
    { time: "10:00", name: "Họp nhóm dự án", category: "Công việc" },
    { time: "13:00", name: "Đọc sách 30 phút ", category: "Cá nhân" },
    { time: "18:00", name: "Tập thể dục", category: "Sức khỏe" },
    { time: "22:00", name: "Viết nhật ký", category: "Cá nhân" },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-2">
        <View className="grid grid-cols-2 gap-4 pb-6">
          <Card className="flex-column gap-0.5 p-6">
            <Text variant={"h4"}>Habit Score</Text>
            <Text variant={"h2"} className="text-primary p-0">
              85
            </Text>
            <View className="flex-row gap-1 items-center">
              <Ionicons name="arrow-up" color="#22C55E" size={16} />
              <Text variant={"h2"} className="text-primary text-base p-0">
                12 %
              </Text>
            </View>
          </Card>
          <Card className="flex-column gap-0.5 p-6">
            <Text variant={"h4"}>Habit Score</Text>
            <Text variant={"h2"} className="text-primary p-0">
              85
            </Text>
            <View className="flex-row gap-1 items-center">
              <Ionicons name="arrow-up" color="#22C55E" size={16} />
              <Text variant={"h2"} className="text-primary text-base p-0">
                12 %
              </Text>
            </View>
          </Card>
          <Card className="flex-column gap-0.5 p-6">
            <Text variant={"h4"}>Habit Score</Text>
            <Text variant={"h2"} className="text-primary p-0">
              85
            </Text>
            <View className="flex-row gap-1 items-center">
              <Ionicons name="arrow-up" color="#22C55E" size={16} />
              <Text variant={"h2"} className="text-primary text-base p-0">
                12 %
              </Text>
            </View>
          </Card>
          <Card className="flex-column gap-0.5 p-6">
            <Text variant={"h4"}>Habit Score</Text>
            <Text variant={"h2"} className="text-primary p-0">
              85
            </Text>
            <View className="flex-row gap-1 items-center">
              <Ionicons name="arrow-up" color="#22C55E" size={16} />
              <Text variant={"h2"} className="text-primary text-base p-0">
                12 %
              </Text>
            </View>
          </Card>
        </View>
        <View>
          <Card className="pxup -6 py-4">
            <View className="flex-row justify-between items-center gap-2">
              <Text variant={"lead"} className="font-bold">
                Hôm nay
              </Text>
              <Text variant={"lead"} className="text-secondary text-sm">
                Xem tất cả
              </Text>
            </View>
            {c.map((i, index) => (
              <View key={index} className="flex-row items-center">
                <Text className="font-bold w-12">{i.time}</Text>
                <Text
                  variant={"p"}
                  className="m-0 flex-1 px-3"
                  numberOfLines={1}
                >
                  {i.name}
                </Text>
                <View className="w-24 items-end">
                  <Badge variant={"outline"}>
                    <Text>{i.category}</Text>
                  </Badge>
                </View>
              </View>
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
