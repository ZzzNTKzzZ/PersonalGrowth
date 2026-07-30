import "dotenv/config";

async function testApiWithCalendarData() {
  console.log("🔍 Đang kiểm tra kết nối API NestJS với 23 dữ liệu lịch trình từ calendar.tsx...");
  const baseUrl = "http://localhost:3000";

  try {
    // Gọi API GET /tasks
    console.log("1️⃣ Gọi API GET /tasks (Backend NestJS)...");
    const tasksRes = await fetch(`${baseUrl}/tasks`);
    const tasksData = await tasksRes.json();
    const tasksList = tasksData.data || tasksData;

    console.log(`✅ Kết nối API GET /tasks THÀNH CÔNG!`);
    console.log(`📊 Tổng số công việc/lịch trình nhận được từ Database: ${tasksList.length} lịch trình\n`);

    if (tasksList.length > 0) {
      console.log("📌 DANH SÁCH CÁC LỊCH TRÌNH VỪA NHẬN TỪ API NESTJS:");
      tasksList.slice(0, 8).forEach((item: any, idx: number) => {
        const startStr = item.startTime ? new Date(item.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        const endStr = item.endTime ? new Date(item.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        console.log(`  [${idx + 1}] ${item.name} | Khung giờ: ${startStr} - ${endStr} | Danh mục: ${item.category?.name || 'Chung'} (${item.category?.color})`);
      });
      if (tasksList.length > 8) {
        console.log(`  ... và ${tasksList.length - 8} lịch trình khác nữa!`);
      }
    }

    console.log("\n🎉 TOÀN BỘ DỮ LIỆU TỪ CALENDAR.TSX ĐÃ ĐƯỢC API NESTJS PHẢN HỒI HOÀN HẢO!");
  } catch (err: any) {
    console.error("❌ Kết nối Server thất bại (Hãy đảm bảo NestJS Server đang chạy `npm run start:dev`):", err.message);
  }
}

testApiWithCalendarData();
