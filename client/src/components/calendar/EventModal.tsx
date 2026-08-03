import React, { useState } from "react";
import { Modal, View, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { taskApi } from "@/services/task.service";
import DateTimePicker from "@react-native-community/datetimepicker";

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
}

export default function EventModal({ visible, onClose, onSuccess, initialDate }: EventModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(initialDate || new Date());
  const [endTime, setEndTime] = useState(new Date((initialDate || new Date()).getTime() + 60 * 60 * 1000));
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sự kiện");
      return;
    }
    if (endTime <= startTime) {
      Alert.alert("Lỗi", "Thời gian kết thúc phải sau thời gian bắt đầu");
      return;
    }

    try {
      await taskApi.createTask({
        name,
        description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      onSuccess();
      onClose();
      // Reset form
      setName("");
      setDescription("");
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể tạo sự kiện, vui lòng thử lại sau.");
    }
  };

  const showPicker = (type: "start" | "end", mode: "date" | "time") => {
    setPickerMode(mode);
    if (type === "start") setShowStartPicker(true);
    else setShowEndPicker(true);
  };

  const onStartChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) setStartTime(selectedDate);
  };

  const onEndChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEndTime(selectedDate);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-5">
          <View className="flex-row justify-between items-center mb-5">
            <Text variant="h2">Thêm Sự kiện</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 font-bold text-lg">X</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <Text className="font-semibold mb-2 text-gray-700">Tên sự kiện</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base text-gray-900 bg-gray-50"
              placeholder="VD: Họp team, Đi bơi..."
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
            <Text className="font-semibold mb-2 text-gray-700">Mô tả (tùy chọn)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base text-gray-900 bg-gray-50 h-20"
              placeholder="Ghi chú thêm..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <Text className="font-semibold mb-2 text-gray-700">Bắt đầu</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  className="flex-1 border border-gray-300 rounded-lg p-3 bg-gray-50 items-center"
                  onPress={() => showPicker("start", "date")}
                >
                  <Text>{startTime.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 items-center"
                  onPress={() => showPicker("start", "time")}
                >
                  <Text>{startTime.toLocaleTimeString("vi-VN", {hour: '2-digit', minute: '2-digit'})}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-1">
              <Text className="font-semibold mb-2 text-gray-700">Kết thúc</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  className="flex-1 border border-gray-300 rounded-lg p-3 bg-gray-50 items-center"
                  onPress={() => showPicker("end", "date")}
                >
                  <Text>{endTime.toLocaleDateString("vi-VN")}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="border border-gray-300 rounded-lg p-3 bg-gray-50 items-center"
                  onPress={() => showPicker("end", "time")}
                >
                  <Text>{endTime.toLocaleTimeString("vi-VN", {hour: '2-digit', minute: '2-digit'})}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode={pickerMode}
              display="default"
              onChange={onStartChange}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode={pickerMode}
              display="default"
              onChange={onEndChange}
            />
          )}

          <Button onPress={handleSubmit} className="w-full mt-2" size="lg">
            <Text className="text-white font-bold text-lg">Tạo mới</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}
