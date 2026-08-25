import { Link, Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Không tìm thấy" }} />
      <View className="flex-1 items-center justify-center p-5 bg-background">
        <Text variant="h1" className="text-primary mb-2">
          404
        </Text>
        <Text variant="h3" className="mb-4 text-center">
          Trang bạn tìm kiếm không tồn tại.
        </Text>
        <Link href="/" className="mt-4 py-3 px-5 bg-primary rounded-xl">
          <Text className="text-white font-bold">Về trang chủ</Text>
        </Link>
      </View>
    </>
  );
}
