import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Checkbox } from '@/components/ui/checkbox';
import HabitCard from '@/components/habits/card';

export default function HomeScreen() {
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: "long",
    day: "numeric"
  })

  const [checked, setChecked] = useState<boolean>(false)

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6 pb-20">
        
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-8 mt-5">
          <View>
          <Text variant={'muted'}>{today}</Text>
          <View className='flex-row items-center'>
            <Text variant="h2" className='border-b-0 pb-0'>Good Morning, </Text>
            <Text variant="h2" className="border-b-0 pb-0 text-secondary">Alex</Text>
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
            <CardTitle className="text-secondary ml-2 text-base font-semibold">AI Mindful Coach</CardTitle>
          </CardHeader>
          <CardContent>
            <Text variant="p" className="mt-0 text-[15px] leading-relaxed">
              You're on a 3-day streak with your meditation habit. Keep it up to build a lasting routine!
            </Text>
          </CardContent>
        </Card>

        {/* Section: Today's Habits */}
        <View className="mb-8">
          <View className='flex-row justify-between items-center mb-4'>
            <Text variant="h3">Today's Habits</Text>
            <Text variant='small'className='text-secondary'>See all</Text>
          </View>
          
          {/* Habit 1 */}
          <HabitCard iconName='water'  name='Drink Water' rule='3/8 Glassess' checked={checked} setChecked={setChecked}/>
          <HabitCard iconName='leaf' name='Meditation' rule='10 mins' checked={checked} setChecked={setChecked}/>
        </View>

        {/* Section: Upcoming Tasks */}
        <View className="mb-8">
          <View className='flex-row justify-between items-center mb-4'>
            <Text variant="h3">Task</Text>
            <Text variant='small'className='text-secondary'>See all</Text>
          </View>
          
          {/* Habit 1 */}
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}