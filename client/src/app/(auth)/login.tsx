import Logo from "@/components/icons/logo";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 items-center bg-background p-6">
      <Logo />
      <View className="flex-1 items-center gap-2 mt-6">
        <Text variant={"h1"}>Personal Growth Tracker</Text>
        <Text variant={"p"} className="text-muted-foreground text-center">
          {"Đăng nhập để tiếp tục hành trình\nphát triển bản thân của bạn 🌱"}
        </Text>
      </View>

      <Input
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        placeholder="Nhập email của bạn..."
        keyboardType="email-address"
        leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
      />
    </View>
  );
}
