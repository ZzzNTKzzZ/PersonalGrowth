import React, { useState } from 'react';
import { View, LayoutChangeEvent, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';
import { Card } from './card';

export interface SegmentedControlProps {
  options: string[];
  selectedOption: string;
  onOptionPress: (option: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  selectedOption,
  onOptionPress,
  className,
}: SegmentedControlProps) {
  const [internalWidth, setInternalWidth] = useState<number>(0);
  const itemWidth = internalWidth / (options.length || 1);

  const selectedIndex = options.indexOf(selectedOption);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      width: itemWidth,
      transform: [
        {
          translateX: withSpring(selectedIndex * itemWidth, {
            damping: 20,
            stiffness: 250,
            mass: 0.5,
          }),
        },
      ],
    };
  }, [selectedIndex, itemWidth]);

  return (
    <Card className={cn('bg-muted p-1 rounded-xl', className)}>
      <View
        className="flex-row items-center relative"
        onLayout={(e: LayoutChangeEvent) => setInternalWidth(e.nativeEvent.layout.width)}
      >
        {internalWidth > 0 && (
          <Animated.View
            className="absolute bg-primary rounded-lg shadow-sm"
            style={[
              indicatorStyle,
              { top: 0, bottom: 0, left: 0 } // Đảm bảo absolute phủ kín chiều cao
            ]}
          />
        )}
        {options.map((option) => {
          const isSelected = option === selectedOption;
          return (
            <Pressable
              key={option}
              className="flex-1 py-1.5 items-center justify-center z-10"
              onPress={() => onOptionPress(option)}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-[#ffffff]' : 'text-muted-foreground'
                )}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
