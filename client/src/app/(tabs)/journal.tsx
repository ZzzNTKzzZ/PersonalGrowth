import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import JournalCard from "@/components/journal/card";
import { Icon } from "@/components/ui/icon";
import {
  Sparkles,
  ChevronRight,
  BookOpen,
  Plus,
  Flower2,
  Coffee,
  Dumbbell,
} from "lucide-react-native";
import JournalModal from "@/components/journal/JournalModal";
import { Journal, journalApi } from "@/services/journal.service";
import { useRouter } from "expo-router";

export default function JournalScreen() {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedJournalToEdit, setSelectedJournalToEdit] = useState<
    Journal | null
  >();
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [journals, setJournals] = useState<Journal[]>([]);

  useEffect(() => {
    fetchJournalsFromApi();
  }, []);

  const fetchJournalsFromApi = async () => {
    try {
      setIsLoadingApi(true);
      const res = await journalApi.getJournals();
      let list: Journal[] = [];
      if (Array.isArray(res)) {
        list = res;
      } else if (Array.isArray((res as any)?.data)) {
        list = (res as any).data;
      } else if (Array.isArray((res as any)?.data?.data)) {
        list = (res as any).data.data;
      } else if (Array.isArray((res as any)?.items)) {
        list = (res as any).items;
      }
      setJournals(list);
    } catch (error) {
      console.log("Lỗi khi lấy journals api:", error);
      setJournals([]);
    } finally {
      setIsLoadingApi(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchJournalsFromApi();
  };

  const handleCreateNew = () => {
    setSelectedJournalToEdit(null);
    setIsModalVisible(true);
  };

  const handleEditJournal = (journal: Journal) => {
    setSelectedJournalToEdit(journal);
    setIsModalVisible(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="p-5 pb-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#22C55E"]}
          />
        }
      >
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text variant="h1">
              Nhật ký
            </Text>
            <Text variant="muted" className="text-xs mt-0.5">
              Ghi lại những khoảnh khắc đáng nhớ ✨
            </Text>
          </View>
        </View>

        {/* Daily Review Quick Access Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/journal/daily-review")}
          className="mb-5"
        >
          <Card className="p-4 rounded-3xl bg-primary/10 border border-primary/25 flex-row items-center justify-between shadow-xs">
            <View className="flex-row items-center gap-3 flex-1 pr-2">
              <View className="w-11 h-11 rounded-2xl bg-primary items-center justify-center shadow-xs">
                <Icon as={Sparkles} size={22} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-sm text-foreground">
                  Đánh giá cuối ngày
                </Text>
                <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>
                  Chấm điểm hiệu suất, cảm xúc & sức khỏe hôm nay
                </Text>
              </View>
            </View>
            <Icon as={ChevronRight} size={18} color="#22C55E" />
          </Card>
        </TouchableOpacity>

        {isLoadingApi && journals.length === 0 ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#22C55E" />
            <Text className="text-muted-foreground text-sm mt-3">
              Đang tải danh sách nhật ký...
            </Text>
          </View>
        ) : journals.length === 0 ? (
          <View className="py-16 items-center justify-center bg-card rounded-3xl p-6 border border-border">
            <Icon as={BookOpen} size={48} color="#9CA3AF" />
            <Text variant="h3" className="mt-3 text-center">
              Chưa có bài nhật ký nào
            </Text>
            <Text className="text-muted-foreground text-sm text-center mt-1">
              Hãy nhấn nút dấu cộng (+) bên dưới để bắt đầu viết trang nhật ký
              đầu tiên!
            </Text>
          </View>
        ) : (
          <View className="flex-col">
            {Array.isArray(journals) &&
              journals.map((j, idx) => (
                <JournalCard
                  key={j.id}
                  iconName={
                    [
                      Flower2,
                      Coffee,
                      Dumbbell,
                      Sparkles,
                      BookOpen,
                    ][idx % 5]
                  }
                  name={j.name || "Nhật ký không tên"}
                  date={new Date(j.createdAt)}
                  content={j.content}
                  onPress={() => handleEditJournal(j)}
                />
              ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) thêm nhật ký mới */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleCreateNew}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full border-[#ffffff] border-2 bg-primary items-center justify-center shadow-lg elevation-6 z-50"
      >
        <Icon as={Plus} size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <JournalModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={fetchJournalsFromApi}
        journalToEdit={selectedJournalToEdit}
      />
    </SafeAreaView>
  );
}

