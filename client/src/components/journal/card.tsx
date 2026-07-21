import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "../ui/badge";

export default function JournalCard({
  iconName,
  name,
  date,
  mood,
  content,
}: {
  iconName?: keyof typeof Ionicons.glyphMap;
  name: string;
  date: Date;
  mood?: string;
  content?: string;
}) {
  return (
    <Card className="mb-4 rounded-3xl p-5 shadow-sm border-border bg-card">
      <View className="flex-col gap-3">
        {/* Header: Ngày tháng & Icon */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-2">
              <Badge variant="outline" className="bg-background">
                <Text className="text-[10px] uppercase font-bold text-muted-foreground">
                  {date.toLocaleString("vi-VN", {
                    weekday: "long",
                    day: "2-digit",
                    month: "short",
                  })}
                </Text>
              </Badge>
              {mood && (
                <Badge variant="secondary" className="ml-2 bg-secondary/10">
                  <Text className="text-secondary text-xs">{mood}</Text>
                </Badge>
              )}
            </View>
            <Text variant="h3" className="text-primary mb-1 leading-tight">
              {name}
            </Text>
          </View>
          
          <View className="w-12 h-12 rounded-2xl bg-primary/5 justify-center items-center">
            {iconName && <Ionicons name={iconName} size={24} color="#22C55E" />}
          </View>
        </View>
        
        {/* Content */}
        {content && (
          <Text className="text-foreground/80 leading-relaxed text-[15px] line-clamp-2">
            {content}
          </Text>
        )}
      </View>
    </Card>
  );
}
