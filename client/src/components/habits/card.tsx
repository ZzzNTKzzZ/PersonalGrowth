import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export default function HabitCard({
  iconName,
  name,
  rule,
  checked,
  setChecked,
  indicatorClassName
}: {
  iconName?: keyof typeof Ionicons.glyphMap;
  name: string;
  rule: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  indicatorClassName?: string;
}) {

  return (
    <Card className="flex-row justify-between items-center mb-3 rounded-2xl p-4 shadow-sm border-border bg-card">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-2xl bg-primary/10 justify-center items-center mr-4">
          {iconName && <Ionicons name={iconName} size={24} color="#1e293b" />}
        </View>
        <View className="justify-center">
          <Text 
            variant="large" 
            className={cn("mb-1", checked && "line-through opacity-50")}
          >
            {name}
          </Text>
          <Text variant="muted">{rule}</Text>
        </View>
      </View>
      <Checkbox
        checked={checked}
        onCheckedChange={setChecked}
        className={cn("w-6 h-6 rounded-md border-primary overflow-hidden", indicatorClassName)}
      />
    </Card>
  );
}
