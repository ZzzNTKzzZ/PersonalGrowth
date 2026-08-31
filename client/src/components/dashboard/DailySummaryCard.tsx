import React, { useId } from "react";
import { View } from "react-native";
import { Card } from "../ui/card";
import { Icon } from "../ui/icon";
import { ArrowUp, LucideIcon } from "lucide-react-native";
import { Text } from "../ui/text";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";

type Props = {
    name: string,
    change: number,
    total: number,
    data: {
        value: number
    }[],
    color: string,
    dotColor: string,
    icon: LucideIcon
}

export default function DailySummaryCard({name, change, total, data, color, dotColor, icon}: Props) {
    const chartId = useId().replace(/:/g, '');

    return (
        <Card className="flex-col gap-0.5 py-6 px-4 w-[48%] mb-4">
            <View className="flex-row gap-2 items-center">
              <View 
                className="p-2 rounded-full border border-border items-center justify-center"
                style={{ backgroundColor: `${color}33` }}
              >
                <Icon as={icon} color={color} size={16} />
              </View>
              <Text variant={"h4"}>{name}</Text>
            </View>
            <View className="flex-row ">
              <View>
                <Text variant={"h2"} style={{ color }} className="p-0">
                  {total}
                </Text>
                <View className="flex-column items-start">
                  <View className="flex-row gap-1 items-center">
                    <Icon as={ArrowUp} color={color} size={16} />
                    <Text variant={"h2"} style={{ color }} className="text-base p-0">
                      {change} %
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mt-2 w-full">
                <LineChart
                  areaGradientId={chartId}
                  areaGradientComponent={() => (
                    <LinearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor={color} stopOpacity="0.25" />
                      <Stop offset="1" stopColor={color} stopOpacity="0.02" />
                    </LinearGradient>
                  )}
                  data={data}
                  areaChart
                  initialSpacing={5}
                  color={color}
                  thickness={2}
                  dataPointsColor={dotColor}
                  hideAxesAndRules
                  hideYAxisText
                  spacing={12}
                  height={40}
                />
              </View>
            </View>
            <Text variant={"p"} className="mt-0 sm:mt-0">
              so với hôm qua
            </Text>
          </Card>
    )
}