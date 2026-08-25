import { View, TouchableOpacity } from "react-native";
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
  onPress,
}: {
  iconName?: keyof typeof Ionicons.glyphMap;
  name: string;
  date: Date;
  mood?: string;
  content?: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={onPress ? 0.75 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <Card className="mb-4 rounded-3xl p-5 shadow-sm border-border bg-card">
        <View className="flex-col gap-3">
          {/* Header: Ngày tháng & Icon */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center mb-2">
                <Badge variant="outline" className="bg-background">
                  <Text variant="label" className="text-[10px]">
                    {date.toLocaleString("vi-VN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "short",
                    })}
                  </Text>
                </Badge>
                {mood && (
                  <Badge variant="secondary" className="ml-2 bg-secondary/10">
                    <Text variant="caption" className="text-secondary font-bold">
                      {mood}
                    </Text>
                  </Badge>
                )}
              </View>
              <Text variant="h3" className="text-primary leading-tight">
                {name}
              </Text>
            </View>

            <View className="w-12 h-12 rounded-2xl bg-primary/5 justify-center items-center">
              {iconName && (
                <Ionicons name={iconName} size={24} color="#22C55E" />
              )}
            </View>
          </View>

          {/* Content */}
          {content && (
            <Text
              variant="p"
              className="text-foreground/80 leading-relaxed text-[15px] line-clamp-2"
            >
              {content}
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}
