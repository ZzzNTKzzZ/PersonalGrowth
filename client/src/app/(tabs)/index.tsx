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
import { LineChart } from "react-native-gifted-charts";

export default function HomeScreen() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const data = [
    { value: 40 },
    { value: 45 },
    { value: 52 },
    { value: 50 },
    { value: 60 },
    { value: 68 },
  ];
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
            <Ionicons name="person-circle-outline" size={40} />
          </View>
        </View>
        <View className="flex-row flex-wrap justify-between pb-6">
          <Card className="flex-col gap-0.5 p-6 w-[48%] mb-4">
            <View className="flex-row gap-2 items-center">
              <View className="p-2 rounded-full border border-border bg-primary/20 items-center justify-center">
                <Ionicons name="leaf" color="#22C55E" size={16} />
              </View>
              <Text variant={"h4"}>Habit Score</Text>
            </View>
            <Text variant={"h2"} className="text-primary p-0">
              85
            </Text>
            <View className="flex-row items-center">
              <View>
                <View className="flex-row gap-1 items-center">
                  <Ionicons name="arrow-up" color="#22C55E" size={16} />
                  <Text variant={"h2"} className="text-primary text-base p-0">
                    12 %
                  </Text>
                </View>
                <Text variant={"p"} className="mt-0 sm:mt-0">
                  so với hôm qua
                </Text>
              </View>
              <View
                className="mt-2 w-full overflow-hidden"
                style={{ height: 40 }}
              >
                <LineChart
                  data={data}
                  color="#22C55E"
                  thickness={3}
                  hideDataPoints
                  hideRules
                  hideAxesAndRules
                  hideYAxisText
                  initialSpacing={0}
                  spacing={15}
                  height={40}
                />
              </View>
            </View>
          </Card>
          <Card className="flex-col gap-0.5 p-6 w-[48%] mb-4">
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
          <Card className="flex-col gap-0.5 p-6 w-[48%] mb-4">
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
          <Card className="flex-col gap-0.5 p-6 w-[48%] mb-4">
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
        <Card className="px-6 py-4">
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
              <Text variant={"p"} className="m-0 flex-1 px-3" numberOfLines={1}>
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
      </ScrollView>
    </View>
  );
}
