import React, { useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import DailySummaryCard from "@/components/dashboard/DailySummaryCard";
import WeekSummaryCard from "@/components/dashboard/WeekSummaryCard";

export default function HomeScreen() {
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const data = [
    { value: 20 },
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
  const s = [
    { name: "Công việc", total: 9, done: 7, icon: "briefcase-outline", color: "#3B82F6" },
    { name: "Thói quen", total: 6, done: 5, icon: "checkmark-circle-outline", color: "#10B981" },
    { name: "Điểm TB", total: 10, done: 8.2, icon: "star-outline", color: "#F59E0B" },
    { name: "Tập trung", time: '6h 30m', icon: "time-outline", color: "#8B5CF6" }
  ];

  const wMood = [
    { date: "16/7", value: 50},
    { date: "17/7", value: 30},
    { date: "18/7", value: 80},
    { date: "19/7", value: 20},
    { date: "20/7", value: 80},
    { date: "21/7", value: 90},
    { date: "22/7", value: 10},
  ]
  type HabitState = { name: string; checked: boolean; streak: number }[];
  const [t, dispatch] = React.useReducer(
    (state: HabitState, action: { type: string; index: number }) => {
      switch (action.type) {
        case "TOGGLE":
          return state.map((item, idx) =>
            idx === action.index
              ? {
                  ...item,
                  checked: !item.checked,
                  streak: !item.checked ? item.streak + 1 : item.streak - 1,
                }
              : item,
          );
        default:
          return state;
      }
    },
    [
      { name: "Đọc sách", checked: false, streak: 4 },
      { name: "Tập thể dục", checked: false, streak: 5 },
      { name: "Uống nước", checked: false, streak: 8 },
      { name: "Ngủ đúng giờ", checked: false, streak: 4 },
    ],
  );

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
          <DailySummaryCard
            name="Habit Score"
            data={data}
            total={85}
            change={12}
            color="#22C55E"
            dotColor="#22C55E"
            icon="leaf"
          />
          <DailySummaryCard
            name="Mood Score"
            data={data}
            total={72}
            change={8}
            color="#F59E0B"
            dotColor="#edab3a"
            icon="happy-outline"
          />
          <DailySummaryCard
            name="Habit Score"
            data={data}
            total={70}
            change={5}
            color="#3B82F6"
            dotColor="#3B82F6"
            icon="stats-chart-outline"
          />
          <DailySummaryCard
            name="Well-being"
            data={data}
            total={80}
            change={10}
            color="#EF4444"
            dotColor="#EF4444"
            icon="heart-outline"
          />
        </View>
        <Card className="px-6 py-4 mb-6">
          <View className="flex-row justify-between items-end">
            <Text variant={"lead"} className="font-bold">
              Lịch trình hôm nay
            </Text>
            <View className="flex-row gap-1 items-center">
              <Text variant={"lead"} className="text-secondary text-sm">
                Xem tất cả
              </Text>
              <Ionicons
                className="pt-[1px]"
                name="chevron-forward-outline"
                color={"#3B82F6"}
                size={16}
              />
            </View>
          </View>
          {c.map((i, index) => (
            <View key={index} className="flex-row items-center">
              <Text className="font-bold w-12">{i.time}</Text>
              <View className="relative items-center justify-center w-6">
                <View className="w-2 h-2 bg-primary rounded-full z-10" />
                {index !== c.length - 1 && (
                  <View className="absolute top-2 w-[2px] h-[48px] bg-border/50" />
                )}
              </View>
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
        <Card className="px-6 py-4 mb-6">
          <View className="flex-row justify-between items-end ">
            <Text variant={"lead"} className="font-bold">
              Thói quen hôm nay
            </Text>
            <View className="flex-row gap-1 items-center">
              <Text variant={"lead"} className="text-secondary text-sm">
                Xem tất cả
              </Text>
              <Ionicons
                className="pt-[1px]"
                name="chevron-forward-outline"
                color={"#3B82F6"}
                size={16}
              />
            </View>
          </View>
          {t.map((i, index) => (
            <View key={index} className="flex-row items-center gap-3 py-2">
              <Checkbox
                checked={i.checked}
                onCheckedChange={() => dispatch({ type: "TOGGLE", index })}
                className="w-6 h-6"
              />
              <Text
                variant={"p"}
                onPress={() => dispatch({ type: "TOGGLE", index })}
                className={`font-bold flex-1 mt-0 ${i.checked ? "line-through opacity-50" : ""}`}
              >
                {i.name}
              </Text>
              <View
                className="flex-row items-center gap-1 px-2 py-1 rounded-full border"
                style={{
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  borderColor: "rgba(245, 158, 11, 0.3)",
                }}
              >
                <Ionicons name="flame" color="#F59E0B" size={14} />
                <Text
                  style={{ color: "#F59E0B" }}
                  className="font-bold text-xs"
                >
                  {i.streak}
                </Text>
              </View>
            </View>
          ))}
        </Card>
        <Card className="px-6 py-4 mb-6 overflow-hidden">
          <Text variant={"lead"} className="font-bold">
            Chuỗi ngày
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="flame" color={"red"} size={32} />
            <View className="flex-row items-center gap-1 ml-1">
              <Text variant={"h3"} className="my-0">
                12
              </Text>
              <Text variant={"p"} className="my-0 text-muted-foreground">
                ngày liên tiếp
              </Text>
            </View>
          </View>
          <View className="w-full mt-4 items-center overflow-hidden">
            <LineChart
              areaGradientId={"123"}
              areaGradientComponent={() => (
                <LinearGradient id={"123"} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={"#F59E0B"} stopOpacity="0.25" />
                  <Stop offset="1" stopColor={"#F59E0B"} stopOpacity="0.02" />
                </LinearGradient>
              )}
              data={data}
              areaChart
              initialSpacing={0}
              endSpacing={0}
              color={"#F59E0B"}
              thickness={2}
              dataPointsColor={"#F59E0B"}
              hideAxesAndRules
              hideYAxisText
              hideDataPoints
              width={Dimensions.get("window").width - 96}
              spacing={
                (Dimensions.get("window").width - 96) /
                (data.length > 1 ? data.length - 1 : 1)
              }
              height={60}
            />
          </View>
        </Card>
        <Card className="px-6 py-4 mb-6">
          <Text variant={"lead"} className="font-bold">
            Tổng kết hôm nay
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {s.map((i, index) => (
              <Card className="w-[48%] mb-4 bg-muted/30 p-3 rounded-2xl border border-border gap-0" key={index}>
                <View className="flex-row items-center mb-2 gap-2">
                  <View 
                    className="p-1.5 rounded-[8px] border border-border items-center justify-center"
                    style={{ backgroundColor: `${i.color}33` }}
                  >
                    <Ionicons name={i.icon as  keyof typeof Ionicons.glyphMap} color={i.color} size={24} />
                  </View>
                  <Text variant={"h4"} className="flex-1" numberOfLines={1}>{i.name}</Text>
                </View>
                <View>
                  <Text variant={"h4"} className="my-0 ">
                    {i.time ? i.time : `${i.done}/${i.total}`}
                  </Text>
                  <Text variant={"p"} className="text-xs text-muted-foreground mt-0">
                    {i.time ? "đã ghi nhận" : "hoàn thành"}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        </Card>
        <WeekSummaryCard data={wMood}/>
      </ScrollView>
    </View>
  );
}
