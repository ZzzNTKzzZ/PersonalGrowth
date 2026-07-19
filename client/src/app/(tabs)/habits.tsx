import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Text } from '@/components/ui/text';
import { Calendar } from '@/components/ui/calendar';
import HabitCard from '@/components/habits/card';
import { Card } from '@/components/ui/card';

export default function HabitsScreen() {
  const [isReadChecked, setIsReadChecked] = useState(false);
  const [isMeditateChecked, setIsMeditateChecked] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-20" showsVerticalScrollIndicator={false}>
        
        {/* Tiêu đề */}
        <Text variant="h1" className="text-primary mb-6 mt-3 text-left">
          Habit Tracker
        </Text>
        
        {/* 1. Lịch Đánh Dấu (Calendar) tích hợp Icon Lửa & Dot */}
        <View className="mb-8">
          <Text variant="h3" className="mb-4">Lịch trình tháng này</Text>
          
          <Card className="rounded-3xl p-1 bg-card border-border shadow-sm overflow-hidden">
            <Calendar 
              // Truyền dữ liệu Demo để xem icon lửa và dot
              markedDates={{
                "2026-07-20": { streak: true, marked: true, dotColor: "#86a789" },
                "2026-07-21": { streak: true },
                "2026-07-22": { streak: true, marked: true, dotColor: "#ef4444" },
                "2026-07-23": { streak: true },
                "2026-07-27": { marked: true, dotColor: "#86a789" },
              }}
              hideExtraDays={true}
              firstDay={1} // Tuần bắt đầu bằng thứ 2
            />
          </Card>
        </View>

        {/* 2. Danh sách Thói quen (Sử dụng Component HabitCard) */}
        <View>
          <Text variant="h3" className="mb-4">Thói quen hôm nay</Text>
          
          <HabitCard 
            iconName="book"
            name="Đọc sách"
            rule="Đọc 30 trang"
            checked={isReadChecked}
            setChecked={setIsReadChecked}
          />
          
          <HabitCard 
            iconName="leaf"
            name="Thiền định"
            rule="15 phút thư giãn"
            checked={isMeditateChecked}
            setChecked={setIsMeditateChecked}
          />
          
          <HabitCard 
            iconName="water"
            name="Uống nước"
            rule="3/8 Cốc"
            checked={false}
            setChecked={() => {}}
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}
