import React from "react";
import { View, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DailyReviewScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-20">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text variant="h2">Đánh giá ngày</Text>
        </View>

        <Card className="p-5 rounded-3xl mb-4 bg-card border-border">
          <Text variant="h3" className="mb-2">
            Tổng kết ngày hôm nay
          </Text>
          <Text variant="muted">
            Theo dõi năng suất, cảm xúc và các chỉ số sức khỏe của bạn mỗi ngày.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
