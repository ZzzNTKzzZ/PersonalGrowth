import { Dimensions, Platform, View } from "react-native";
import { Card } from "../ui/card";
import { Text } from "../ui/text";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient, Stop } from "react-native-svg";
import { useMemo } from "react";

type Props = {
    data: {
        date: string, value: number
    }[]
}

export default function WeekSummaryCard({data}: Props) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];

        // Mốc gốc luôn là ngày hiện tại của hệ thống
        const anchorDate = new Date();
        const today = new Date();

        return Array.from({ length: 7 }).map((_, index) => {
            const d = new Date(anchorDate);
            d.setDate(d.getDate() - (6 - index));
            
            const match = data.find(item => {
                if (item.date.includes('/')) {
                    const parts = item.date.split('/');
                    const day = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10) - 1;
                    return d.getDate() === day && d.getMonth() === month;
                }
                const itemDate = new Date(item.date);
                if (!isNaN(itemDate.getTime())) {
                    return itemDate.getDate() === d.getDate() && 
                           itemDate.getMonth() === d.getMonth() && 
                           itemDate.getFullYear() === d.getFullYear();
                }
                return item.date === d.toISOString().split('T')[0];
            });

            // Kiểm tra xem ngày đang vẽ có phải là ngày hôm nay không
            const isToday = d.getDate() === today.getDate() && 
                            d.getMonth() === today.getMonth() && 
                            d.getFullYear() === today.getFullYear();

            return {
                value: match ? match.value : 0,
                labelComponent: () => (
                    // marginLeft: -25 để căn giữa chính xác đoạn text rộng 50px ngay dưới dấu dot
                    <View style={{ width: 50, marginLeft: -10 }}>
                        <Text style={{ 
                            color: isToday ? '#F59E0B' : '#9CA3AF', 
                            fontWeight: isToday ? 'bold' : 'normal',
                            fontSize: 10, 
                            textAlign: 'center'
                        }}>
                            {d.getDate()}/${d.getMonth() + 1}
                        </Text>
                    </View>
                )
            };
        });
    }, [data]);

    const yAxisLabelWidth = 36;
    const cardPadding = 48; // px-6 tương đương 24px mỗi bên
    const availableWidth = Dimensions.get("window").width - cardPadding - yAxisLabelWidth - (Platform.OS === 'web' ? 96 : 56);
    
    // Để nhãn X (rộng 50px) ở đầu và cuối không bị cắt mất, ta thêm initialSpacing và endSpacing
    const initialSpacing = 20; 
    const endSpacing = 20;
    
    // Khoảng cách giữa các điểm (6 khoảng cho 7 ngày)
    const spacing = (availableWidth - initialSpacing - endSpacing) / (chartData.length > 1 ? chartData.length - 1 : 1);
    
    // Vì dữ liệu giá trị lên tới 100, nên maxValue là 100 và chia 5 khoảng (mỗi khoảng 20)
    const maxValue = 100;

    // Tính toán ngày bắt đầu để hiển thị ở góc biểu đồ
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    const startDateString = `${startDate.getDate()}/${startDate.getMonth() + 1}`;

    return (
        <Card className="px-6 py-4 mb-6 overflow-hidden">
            <View className="flex-row justify-between items-center">
              <Text variant={"lead"} className="font-bold">
                Xu hướng cảm xúc (7 ngày)
              </Text>
            </View>
            <View className="w-full items-center">
            <LineChart
              areaGradientId={"1243"}
              areaGradientComponent={() => (
                <LinearGradient id={"1243"} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={"#F59E0B"} stopOpacity="0.25" />
                  <Stop offset="1" stopColor={"#F59E0B"} stopOpacity="0.02" />
                </LinearGradient>
              )}
              curved
              data={chartData}
              areaChart
              initialSpacing={initialSpacing}
              endSpacing={endSpacing}
              color={"#F59E0B"}
              thickness={2}
              dataPointsColor={"#F59E0B"}
              hideYAxisText={false}
              yAxisLabelWidth={yAxisLabelWidth}
              yAxisTextStyle={{ paddingRight: 4, color: '#9CA3AF'}}
              xAxisThickness={0}
              yAxisThickness={0}
              rulesType="solid"
              xAxisType={"solid"}
              dashGap={0}
              noOfSections={4}
              maxValue={maxValue}
              showVerticalLines={true}
              verticalLinesColor={"rgba(156, 163, 175, 0.2)"}
              verticalLinesThickness={1}
              rulesColor={"rgba(156, 163, 175, 0.2)"}
              width={availableWidth}
              spacing={spacing}
              height={60}
              pointerConfig={{
                pointerStripHeight: 80,
                pointerStripColor: 'rgba(245, 158, 11, 0.5)',
                pointerStripWidth: 2,
                pointerColor: '#F59E0B',
                radius: 4,
                pointerLabelWidth: 80,
                pointerLabelHeight: 30,
                autoAdjustPointerLabelPosition: true,
              
              }}
            />
          </View>
        </Card>
    )
}
