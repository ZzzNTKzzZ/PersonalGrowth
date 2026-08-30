import { Redirect } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  // Tự động chuyển vào (tabs) nếu đã đăng nhập, ngược lại chuyển vào login
  return <Redirect href={isAuthenticated ? "/(tabs)" : "/(auth)/login"} />;
}

