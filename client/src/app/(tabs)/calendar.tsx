import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Calendar(params: any) {
  // Sửa giá trị khởi tạo khớp với value của Item
  const [typeCalendar, setTypeCalendar] = useState("day");

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
        </View>

        <View className="mb-4">
          <Text variant="h2">Lịch trình</Text>
        </View>

        {/* Căn giữa hoặc cho ToggleGroup chiếm chiều ngang tùy ý */}
        <View className="items-center w-full mt-2">
          <ToggleGroup
            type="single"
            value={typeCalendar}
            onValueChange={(val) => {
              console.log("Toggle clicked! Value received:", val);
              if (val) setTypeCalendar(val);
            }}
            variant={"outline"}
            size={"default"}
          >
            <ToggleGroupItem value="day" isFirst>
              <Text>Ngày</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="week">
              <Text>Tuần</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="month" isLast>
              <Text>Tháng</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </ScrollView>
    </View>
  );
}
