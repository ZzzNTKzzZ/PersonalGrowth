import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useRouter } from "expo-router";
import { Icon } from "@/components/ui/icon";
import {
  Zap,
  Smile,
  Dumbbell,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trophy,
  PenSquare,
  CheckCheck,
  LucideIcon,
} from "lucide-react-native";
import { dayReviewApi, DayReview } from "@/services/day-review.service";

interface MetricConfig {
  key: "productivity" | "moodScore" | "healthScore" | "satisfaction";
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  getFeedback: (val: number) => { text: string; emoji: string };
}

const METRICS: MetricConfig[] = [
  {
    key: "productivity",
    title: "Hiệu suất làm việc",
    subtitle: "Mức độ hoàn thành mục tiêu và tập trung hôm nay",
    icon: Zap,
    color: "#3B82F6",
    bgColor: "bg-blue-500/10",
    getFeedback: (val: number) => {
      if (val >= 9) return { text: "Cực kỳ năng suất, vượt mong đợi!", emoji: "🚀" };
      if (val >= 7) return { text: "Tập trung tốt, hoàn thành hầu hết mục tiêu.", emoji: "🎯" };
      if (val >= 5) return { text: "Năng suất ở mức vừa phải, có phân tâm.", emoji: "⚖️" };
      return { text: "Chậm tiến độ, cần tối ưu lại kế hoạch.", emoji: "⏳" };
    },
  },
  {
    key: "moodScore",
    title: "Tâm trạng & Cảm xúc",
    subtitle: "Cảm nhận tinh thần và năng lượng tích cực của bạn",
    icon: Smile,
    color: "#F59E0B",
    bgColor: "bg-amber-500/10",
    getFeedback: (val: number) => {
      if (val >= 9) return { text: "Tràn đầy phấn khởi và niềm vui!", emoji: "🌟" };
      if (val >= 7) return { text: "Tâm trạng thoải mái, vui vẻ và an yên.", emoji: "😊" };
      if (val >= 5) return { text: "Bình thường, hơi trầm lặng.", emoji: "😐" };
      return { text: "Căng thẳng hoặc mệt mỏi, cần được thư giãn.", emoji: "🌧️" };
    },
  },
  {
    key: "healthScore",
    title: "Sức khỏe & Thể chất",
    subtitle: "Vận động, chế độ dinh dưỡng và giấc ngủ",
    icon: Dumbbell,
    color: "#10B981",
    bgColor: "bg-emerald-500/10",
    getFeedback: (val: number) => {
      if (val >= 9) return { text: "Cơ thể dồi dào sinh lực, sung mãn!", emoji: "💪" };
      if (val >= 7) return { text: "Khỏe khoắn, ăn uống và nghỉ ngơi tốt.", emoji: "🥗" };
      if (val >= 5) return { text: "Hơi thiếu ngủ hoặc ít vận động.", emoji: "🥱" };
      return { text: "Uể oải, cơ thể đang báo động cần nghỉ ngơi.", emoji: "🔋" };
    },
  },
  {
    key: "satisfaction",
    title: "Mức độ hài lòng",
    subtitle: "Sự trọn vẹn và ý nghĩa của ngày hôm nay",
    icon: Star,
    color: "#8B5CF6",
    bgColor: "bg-purple-500/10",
    getFeedback: (val: number) => {
      if (val >= 9) return { text: "Một ngày tuyệt vời đáng nhớ!", emoji: "✨" };
      if (val >= 7) return { text: "Rất hài lòng với những gì đã trải qua.", emoji: "🌻" };
      if (val >= 5) return { text: "Tạm ổn, có những điều có thể làm tốt hơn.", emoji: "🌱" };
      return { text: "Chưa như kỳ vọng, ngày mai sẽ là cơ hội mới.", emoji: "🔄" };
    },
  },
];

export default function DailyReviewScreen() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [productivity, setProductivity] = useState(8);
  const [moodScore, setMoodScore] = useState(8);
  const [healthScore, setHealthScore] = useState(7);
  const [satisfaction, setSatisfaction] = useState(8);
  const [note, setNote] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);

  const dateString = selectedDate.toISOString().split("T")[0];

  useEffect(() => {
    loadReviewForDate(dateString);
  }, [dateString]);

  const loadReviewForDate = async (date: string) => {
    try {
      setIsLoading(true);
      const res = await dayReviewApi.getByDate(date);
      const data = ((res as any)?.data?.data || (res as any)?.data || res) as DayReview;

      if (data && data.id) {
        setExistingReviewId(data.id);
        setProductivity(data.productivity ?? 8);
        setMoodScore(data.moodScore ?? 8);
        setHealthScore(data.healthScore ?? 7);
        setSatisfaction(data.satisfaction ?? 8);
        setNote(data.note || "");
      } else {
        setExistingReviewId(null);
        setProductivity(8);
        setMoodScore(8);
        setHealthScore(7);
        setSatisfaction(8);
        setNote("");
      }
    } catch (err) {
      // Chưa có review cho ngày này
      setExistingReviewId(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  const averageScore = Number(
    ((productivity + moodScore + healthScore + satisfaction) / 4).toFixed(1)
  );

  const getScoreValue = (key: MetricConfig["key"]) => {
    switch (key) {
      case "productivity":
        return productivity;
      case "moodScore":
        return moodScore;
      case "healthScore":
        return healthScore;
      case "satisfaction":
        return satisfaction;
    }
  };

  const setScoreValue = (key: MetricConfig["key"], val: number) => {
    switch (key) {
      case "productivity":
        setProductivity(val);
        break;
      case "moodScore":
        setMoodScore(val);
        break;
      case "healthScore":
        setHealthScore(val);
        break;
      case "satisfaction":
        setSatisfaction(val);
        break;
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await dayReviewApi.upsert({
        productivity,
        moodScore,
        healthScore,
        satisfaction,
        note: note.trim() || undefined,
        reviewDate: dateString,
      });

      Alert.alert(
        "Thành công! 🎉",
        `Đã lưu đánh giá cho ngày ${selectedDate.toLocaleDateString("vi-VN")}. Bạn đạt ${averageScore}/10 điểm phát triển!`,
        [{ text: "Đồng ý", onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert("Lỗi", error?.message || "Không thể lưu đánh giá ngày. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header Bar */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-3 border-b border-border/40">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-card border border-border items-center justify-center"
        >
          <Icon as={ArrowLeft} size={20} color="#374151" />
        </TouchableOpacity>
        <Text variant="h3" className="font-bold">
          Đánh giá cuối ngày
        </Text>
        <TouchableOpacity
          onPress={handleToday}
          className={`px-3 py-1.5 rounded-full border ${
            isToday
              ? "bg-primary/10 border-primary"
              : "bg-card border-border"
          }`}
        >
          <Text className={`text-xs font-semibold ${isToday ? "text-primary" : "text-muted-foreground"}`}>
            Hôm nay
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerClassName="p-5 pb-24"
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selector Navigation */}
        <View className="flex-row items-center justify-between bg-card border border-border rounded-2xl px-4 py-3 mb-4 shadow-xs">
          <TouchableOpacity onPress={handlePrevDay} className="p-1">
            <Icon as={ChevronLeft} size={22} color="#6B7280" />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="font-bold text-sm text-foreground">
              {selectedDate.toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
            <Text className="text-[11px] text-muted-foreground mt-0.5">
              {existingReviewId ? "✅ Đã có bản đánh giá" : "📝 Chưa đánh giá"}
            </Text>
          </View>
          <TouchableOpacity onPress={handleNextDay} className="p-1">
            <Icon as={ChevronRight} size={22} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="py-16 items-center justify-center">
            <ActivityIndicator size="large" color="#22C55E" />
            <Text className="text-muted-foreground text-xs mt-2">
              Đang tải dữ liệu đánh giá...
            </Text>
          </View>
        ) : (
          <>
            {/* Overall Growth Score Card */}
            <Card className="p-5 mb-5 rounded-3xl bg-primary/5 border border-primary/20 shadow-xs">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-3">
                  <Text className="text-xs font-bold text-primary uppercase tracking-wider">
                    Điểm phát triển bản thân
                  </Text>
                  <Text variant="h2" className="text-3xl font-extrabold text-foreground mt-1">
                    {averageScore}
                    <Text className="text-base font-normal text-muted-foreground">/10</Text>
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">
                    {averageScore >= 8.5
                      ? "🌟 Xuất sắc! Bạn đang duy trì phong độ đỉnh cao."
                      : averageScore >= 7
                      ? "💚 Ngày làm việc hiệu quả và cân bằng rất tốt."
                      : averageScore >= 5
                      ? "🌱 Một ngày ổn định, tiếp tục nỗ lực hơn nhé!"
                      : "💪 Đừng nản lòng, nghỉ ngơi để bứt phá vào ngày mai."}
                  </Text>
                </View>
                <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center shadow-sm">
                  <Icon as={Trophy} size={32} color="#FFFFFF" />
                </View>
              </View>
            </Card>

            {/* 4 Score Metric Cards */}
            {METRICS.map((metric) => {
              const currentVal = getScoreValue(metric.key);
              const feedback = metric.getFeedback(currentVal);

              return (
                <Card
                  key={metric.key}
                  className="p-5 mb-4 rounded-3xl bg-card border-border shadow-xs"
                >
                  {/* Card Header */}
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                      <View
                        className={`w-9 h-9 rounded-xl items-center justify-center ${metric.bgColor}`}
                      >
                        <Icon
                          as={metric.icon}
                          size={20}
                          color={metric.color}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="font-bold text-sm text-foreground">
                          {metric.title}
                        </Text>
                        <Text className="text-[11px] text-muted-foreground" numberOfLines={1}>
                          {metric.subtitle}
                        </Text>
                      </View>
                    </View>

                    {/* Score Badge */}
                    <View
                      className="px-3 py-1 rounded-full border"
                      style={{
                        backgroundColor: `${metric.color}15`,
                        borderColor: `${metric.color}35`,
                      }}
                    >
                      <Text
                        style={{ color: metric.color }}
                        className="font-extrabold text-sm"
                      >
                        {currentVal}/10
                      </Text>
                    </View>
                  </View>

                  {/* Feedback line */}
                  <View className="flex-row items-center gap-1.5 my-2.5 bg-muted/30 px-3 py-2 rounded-xl">
                    <Text className="text-sm">{feedback.emoji}</Text>
                    <Text className="text-xs font-medium text-foreground flex-1">
                      {feedback.text}
                    </Text>
                  </View>

                  {/* 1 - 10 Score Selector Pills */}
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-1.5 pt-1"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
                      const isSelected = currentVal === score;
                      return (
                        <TouchableOpacity
                          key={score}
                          activeOpacity={0.7}
                          onPress={() => setScoreValue(metric.key, score)}
                          className={`w-9 h-10 rounded-xl items-center justify-center border ${
                            isSelected
                              ? "bg-primary border-primary shadow-xs"
                              : "bg-muted/20 border-border"
                          }`}
                        >
                          <Text
                            className={`font-bold text-xs ${
                              isSelected ? "text-white" : "text-foreground"
                            }`}
                          >
                            {score}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </Card>
              );
            })}

            {/* Reflection Note Card */}
            <Card className="p-5 mb-6 rounded-3xl bg-card border-border shadow-xs">
              <View className="flex-row items-center gap-2 mb-2">
                <Icon as={PenSquare} size={20} color="#10B981" />
                <Text className="font-bold text-sm text-foreground">
                  Ghi chú suy ngẫm & Bài học
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground mb-3">
                Điều đáng nhớ nhất hôm nay hoặc bài học bạn muốn rút ra cho ngày mai:
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="VD: Hôm nay hoàn thành dự án đúng hạn, cần chú ý ngủ sớm hơn..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                maxLength={500}
                textAlignVertical="top"
                className="bg-muted/30 border border-border rounded-2xl p-4 text-foreground text-xs min-h-[100px]"
              />
              <Text className="text-[10px] text-muted-foreground text-right mt-1.5">
                {note.length}/500 ký tự
              </Text>
            </Card>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={isSaving}
              className={`w-full py-4 rounded-2xl items-center justify-center flex-row gap-2 shadow-md ${
                isSaving ? "bg-primary/70" : "bg-primary"
              }`}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon as={CheckCheck} size={20} color="#FFFFFF" />
                  <Text className="font-bold text-base text-white">
                    {existingReviewId ? "Cập nhật đánh giá ngày" : "Lưu đánh giá ngày"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
