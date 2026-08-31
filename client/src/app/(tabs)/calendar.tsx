import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Icon } from "@/components/ui/icon";
import { Bell, Plus, Briefcase, Calendar as CalendarIcon } from "lucide-react-native";
import { useState, useEffect } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import DayScheduleTimeline from "@/components/calendar/DayScheduleTimeline";
import WeekDateSelector from "@/components/calendar/WeekDateSelector";
import WeekScheduleTimeLine from "@/components/calendar/WeekSchedule";
import MonthScheduleTimeline from "@/components/calendar/MonthSchedule";
import EventModal from "@/components/calendar/EventModal";
import { taskApi, Task as ApiTask } from "@/services/task.service";

export default function Calendar(params: any) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<any>(null);
  const [typeCalendar, setTypeCalendar] = useState<{
    name: "Ngày" | "Tuần" | "Tháng";
    value: "day" | "week" | "month";
  }>({
    name: "Ngày",
    value: "day",
  });
  const [apiTasks, setApiTasks] = useState<ApiTask[]>([]);

  useEffect(() => {
    fetchTasksFromApi();
  }, []);

  const fetchTasksFromApi = async () => {
    try {
      const res = await taskApi.getTasks();
      const tasks = (Array.isArray(res) ? res : (res as any)?.data || []) as ApiTask[];
      if (tasks && tasks.length > 0) {
        setApiTasks(tasks);
      }
    } catch (err) {
      console.log("Dùng lịch trình mẫu local (Backend chưa bật hoặc chưa Auth)");
    }
  };

  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diffToMon = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const monday = new Date(today.getFullYear(), today.getMonth(), diffToMon);

  const getDayDate = (offsetDays: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offsetDays);
    return d;
  };

  // Map API Tasks từ NestJS Backend thành danh sách sự kiện hiển thị trên Lịch
  const singleDayEvents = (apiTasks || []).map((t) => {
    const start = t.startTime
      ? new Date(t.startTime)
      : t.dueDate
      ? new Date(t.dueDate)
      : new Date();
    const end = t.endTime
      ? new Date(t.endTime)
      : new Date(start.getTime() + 60 * 60 * 1000); // 1 tiếng mặc định

    return {
      id: t.id,
      title: t.name,
      start,
      end,
      color: t.category?.color || "#3B82F6",
      description: t.category?.name || "Công việc",
    };
  });

  // Tự động nhóm task theo từng ngày trong tuần cho WeekDateSelector
  const c = Array.from({ length: 7 }).map((_, idx) => {
    const dayDate = getDayDate(idx);
    const dayStr = `${dayDate.getDate()}/${dayDate.getMonth() + 1}`;
    const dayTasks = (apiTasks || []).filter((t) => {
      const taskDate = t.startTime ? new Date(t.startTime) : t.dueDate ? new Date(t.dueDate) : null;
      return taskDate && taskDate.toDateString() === dayDate.toDateString();
    });

    return {
      date: dayStr,
      task: dayTasks.map((t) => ({
        id: t.id,
        name: t.name,
        dueDate: t.startTime ? new Date(t.startTime).toLocaleString("vi-VN") : "",
      })),
    };
  });

  // Lọc các sự kiện diễn ra nhiều ngày (All Day / Multi-day) từ API
  const aDay = (apiTasks || [])
    .filter((t) => {
      if (!t.startTime || !t.endTime) return false;
      const startDate = new Date(t.startTime);
      const endDate = new Date(t.endTime);
      return endDate.getDate() !== startDate.getDate();
    })
    .map((t) => ({
      id: t.id,
      name: t.name,
      category: t.category?.name || "Công việc",
      icon: (t.category?.color ? Briefcase : CalendarIcon),
      color: t.category?.color || "#8B5CF6",
      startDate: new Date(t.startTime!),
      endDate: new Date(t.endTime!),
    }));

  const handlePressEvent = (event: any) => {
    setSelectedEventToEdit(event);
    setIsModalVisible(true);
  };

  return (
    <View className="flex-1 bg-background relative">
      <ScrollView contentContainerClassName="p-5">
        <View className="flex-row justify-between items-center pb-4">
          <View className="flex-col flex-1 pr-4">
            <View className="flex-row items-center flex-wrap">
              <Text variant="h3">Chào buổi sáng, Khánh 👋</Text>
            </View>
          </View>

          <View className="flex-row gap-3 items-center">
            <View className="relative">
              <Icon as={Bell} size={28} />
              <View className="w-3 h-3 rounded-full bg-error absolute -top-0.5 -right-0.5 border-[1.5px] border-white z-10" />
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-1">
            <View className="flex-row items-baseline gap-1.5 flex-wrap">
              <Text variant="h1">Lịch trình</Text>
              <Text className="text-sm font-semibold text-primary">
                ({selectedDate.toLocaleDateString("vi-VN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "2-digit",
                })})
              </Text>
            </View>
          </View>

          <View className="flex-1">
            <SegmentedControl
              options={["Ngày", "Tuần", "Tháng"]}
              selectedOption={typeCalendar.name}
              onOptionPress={(val) => {
                console.log("SegmentedControl clicked! Value received:", val);

                // Tạo một object map để suy ra 'value' từ 'name'
                const valueMap: Record<string, "day" | "week" | "month"> = {
                  Ngày: "day",
                  Tuần: "week",
                  Tháng: "month",
                };

                // Cập nhật lại state với đúng định dạng object { name, value }
                setTypeCalendar({
                  name: val as "Ngày" | "Tuần" | "Tháng",
                  value: valueMap[val],
                });
              }}
            />
          </View>
        </View>

        {typeCalendar.value === "day" && (
          <Card className="my-2 p-0 overflow-hidden">
            <WeekDateSelector
              data={c}
              type={typeCalendar.value}
              allDay={aDay}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <DayScheduleTimeline
              events={singleDayEvents}
              mode="day"
              date={selectedDate}
              onChangeDate={setSelectedDate}
              swipeEnabled={true}
              onPressEvent={handlePressEvent}
            />
          </Card>
        )}

        {typeCalendar.value === "week" && (
          <Card className="my-2 p-0 overflow-hidden">
            <WeekDateSelector
              data={c}
              type={typeCalendar.value}
              allDay={aDay}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
            <WeekScheduleTimeLine
              events={singleDayEvents}
              date={selectedDate}
              onChangeDate={setSelectedDate}
              swipeEnabled={true}
              hideHeader={true}
              onPressEvent={handlePressEvent}
            />
          </Card>
        )}

        {typeCalendar.value === "month" && (
          <Card className="my-2 p-0 overflow-hidden">
            <MonthScheduleTimeline
              events={[
                ...singleDayEvents,
                ...aDay.map((item) => ({
                  title: item.name,
                  start: item.startDate || today,
                  end: item.endDate || today,
                  color: item.color || "#8B5CF6",
                  description: item.category,
                })),
              ]}
              date={selectedDate}
              onChangeDate={setSelectedDate}
              swipeEnabled={true}
              onPressEvent={handlePressEvent}
              onSwitchToDayView={() => {
                setTypeCalendar({ name: "Ngày", value: "day" });
              }}
            />
          </Card>
        )}
      </ScrollView>
      {/* Floating Action Button (FAB) thêm sự kiện / công việc mới */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          setSelectedEventToEdit(null);
          setIsModalVisible(true);
        }}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full border-[#ffffff] border-2 bg-primary items-center justify-center shadow-lg  elevation-6 z-50"
      >
        <Icon as={Plus} size={30} color="#FFFFFF" />
      </TouchableOpacity>

      <EventModal 
        visible={isModalVisible} 
        onClose={() => setIsModalVisible(false)} 
        onSuccess={() => fetchTasksFromApi()} 
        initialDate={selectedDate}
        eventToEdit={selectedEventToEdit}
      />
    </View>
  );
}
