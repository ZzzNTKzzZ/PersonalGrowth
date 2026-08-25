import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import JournalCard from '@/components/journal/card';
import { Ionicons } from '@expo/vector-icons';
import JournalModal from '@/components/journal/JournalModal';

export default function JournalScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-20" showsVerticalScrollIndicator={false}>
        <Text variant="h1" className="text-primary mb-6">
          Nhật ký
        </Text>

        <View className="flex-col">
          <JournalCard 
            iconName='flower' 
            name='Hoàn thành báo cáo Tuần' 
            date={new Date()} 
            mood="Happy" 
            content="Hôm nay tôi rất vui vì đã giải quyết xong núi công việc chất đống từ đầu tuần. Cảm giác thật nhẹ nhõm và tự hào về bản thân!"
          />
          
          <JournalCard 
            iconName='cafe' 
            name='Cà phê sáng Chủ Nhật' 
            date={new Date(new Date().setDate(new Date().getDate() - 1))} 
            mood="Relaxed" 
            content="Một buổi sáng yên bình với ly Latte yêu thích tại quán quen. Đọc nốt cuốn sách còn dang dở và chuẩn bị kế hoạch cho tuần mới."
          />

          <JournalCard 
            iconName='fitness' 
            name='Buổi tập đầu tiên' 
            date={new Date(new Date().setDate(new Date().getDate() - 2))} 
            mood="Energetic" 
            content="Vượt qua sự lười biếng để đến phòng gym. Tuy cơ bắp hơi đau nhức nhưng tinh thần lại cực kỳ sảng khoái."
          />
        </View>
      </ScrollView>

      {/* Floating Action Button (FAB) thêm nhật ký mới */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setIsModalVisible(true);
        }}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full border-[#ffffff] border-2 bg-primary items-center justify-center shadow-lg elevation-6 z-50"
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <JournalModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => {}}
      />
    </SafeAreaView>
  );
}
