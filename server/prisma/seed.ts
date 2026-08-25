import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Bắt đầu tạo dữ liệu mẫu sạch sẽ (Seeding data)...");

  // =========================================================================
  // 1. XÓA SẠCH TOÀN BỘ DỮ LIỆU CŨ THEO THỨ TỰ RÀNG BUỘC KHÓA NGOẠI
  // =========================================================================
  console.log("🧹 Đang xóa sạch toàn bộ dữ liệu cũ trong cơ sở dữ liệu...");
  await prisma.habitRecord.deleteMany({});
  await prisma.habit.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.journal.deleteMany({});
  await prisma.dayReview.deleteMany({});
  await prisma.mood.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("✨ Đã xóa sạch toàn bộ dữ liệu cũ thành công!");

  // =========================================================================
  // 2. TẠO USER MẪU (khanh@gmail.com / password123)
  // =========================================================================
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "khanh@gmail.com",
      password: hashedPassword,
      profile: {
        create: {
          fullName: "Khánh",
          timezone: "Asia/Ho_Chi_Minh",
        },
      },
    },
  });

  console.log(`👤 Đã tạo User: ${user.email} (ID: ${user.id})`);

  // =========================================================================
  // 3. TẠO CÁC DANH MỤC (CATEGORIES)
  // =========================================================================
  const categoriesData = [
    { name: "Công việc", color: "#3B82F6", icon: "briefcase-outline" },
    { name: "Học tập", color: "#8B5CF6", icon: "book-outline" },
    { name: "Sức khỏe", color: "#22C55E", icon: "fitness-outline" },
    { name: "Cá nhân", color: "#F43F5E", icon: "person-outline" },
    { name: "Du lịch", color: "#F59E0B", icon: "airplane-outline" },
    { name: "Hội thảo", color: "#06B6D4", icon: "bulb-outline" },
  ];

  const categoriesMap: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        color: cat.color,
        icon: cat.icon,
        userId: user.id,
      },
    });
    categoriesMap[cat.name] = created;
  }
  console.log(`🏷️ Đã khởi tạo ${Object.keys(categoriesMap).length} Danh mục (Categories)`);

  // 3. Tính toán các ngày trong tuần hiện tại (Mon -> Sun)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMon = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const monday = new Date(now.getFullYear(), now.getMonth(), diffToMon);

  const getDayDate = (offsetDays: number) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offsetDays);
    return d;
  };

  // 4. Danh sách toàn bộ các sự kiện từ calendar.tsx
  const allEvents = [
    // --- Lịch đa ngày (aDay) ---
    {
      name: "Khóa đào tạo Leadership (3 ngày)",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(0)).setHours(8, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(2)).setHours(17, 0, 0, 0)),
      status: "IN_PROGRESS" as const,
    },
    {
      name: "Du lịch Đà Lạt (3 ngày)",
      categoryName: "Du lịch",
      startTime: new Date(new Date(getDayDate(3)).setHours(6, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(5)).setHours(21, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Sinh nhật đồng nghiệp",
      categoryName: "Cá nhân",
      startTime: new Date(new Date(getDayDate(2)).setHours(18, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(2)).setHours(21, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Hội thảo AI Tech All-Day",
      categoryName: "Hội thảo",
      startTime: new Date(new Date(getDayDate(4)).setHours(8, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(4)).setHours(17, 0, 0, 0)),
      status: "TODO" as const,
    },

    // --- Thứ 2 (Monday) ---
    {
      name: "Họp khởi động tuần mới",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(0)).setHours(8, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(0)).setHours(9, 30, 0, 0)),
      status: "DONE" as const,
    },
    {
      name: "Phỏng vấn Senior Dev",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(0)).setHours(8, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(0)).setHours(9, 0, 0, 0)),
      status: "DONE" as const,
    },
    {
      name: "Review Code với Frontend Team",
      categoryName: "Sức khỏe",
      startTime: new Date(new Date(getDayDate(0)).setHours(10, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(0)).setHours(11, 30, 0, 0)),
      status: "IN_PROGRESS" as const,
    },
    {
      name: "Báo cáo tiến độ cho Manager",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(0)).setHours(14, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(0)).setHours(16, 0, 0, 0)),
      status: "TODO" as const,
    },

    // --- Thứ 3 (Tuesday) ---
    {
      name: "Workshop UI/UX Design System",
      categoryName: "Học tập",
      startTime: new Date(new Date(getDayDate(1)).setHours(9, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(1)).setHours(10, 30, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Họp với Đối tác Khách hàng",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(1)).setHours(10, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(1)).setHours(11, 30, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Lập kế hoạch Release v2.0",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(1)).setHours(15, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(1)).setHours(16, 30, 0, 0)),
      status: "TODO" as const,
    },

    // --- Thứ 4 (Wednesday) ---
    {
      name: "Đào tạo Security & Auth Flow",
      categoryName: "Học tập",
      startTime: new Date(new Date(getDayDate(2)).setHours(8, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(2)).setHours(10, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Testing & QA Benchmark",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(2)).setHours(10, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(2)).setHours(12, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Sync 1-on-1 với Manager",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(2)).setHours(14, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(2)).setHours(15, 0, 0, 0)),
      status: "TODO" as const,
    },

    // --- Thứ 5 (Thursday) ---
    {
      name: "Demo Sản phẩm cho Ban giám đốc",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(3)).setHours(9, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(3)).setHours(10, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Refactor Core Module",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(3)).setHours(10, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(3)).setHours(12, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Họp Retro Sprint",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(3)).setHours(14, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(3)).setHours(16, 0, 0, 0)),
      status: "TODO" as const,
    },

    // --- Thứ 6 (Friday) ---
    {
      name: "Townhall Toàn Công Ty Q3",
      categoryName: "Hội thảo",
      startTime: new Date(new Date(getDayDate(4)).setHours(8, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(4)).setHours(10, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Tổng kết mục tiêu OKR",
      categoryName: "Công việc",
      startTime: new Date(new Date(getDayDate(4)).setHours(10, 30, 0, 0)),
      endTime: new Date(new Date(getDayDate(4)).setHours(11, 30, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Happy Hour & Teambuilding",
      categoryName: "Cá nhân",
      startTime: new Date(new Date(getDayDate(4)).setHours(15, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(4)).setHours(17, 0, 0, 0)),
      status: "TODO" as const,
    },

    // --- Thứ 7 (Saturday) ---
    {
      name: "Lớp học Tiếng Anh Chuyên ngành",
      categoryName: "Học tập",
      startTime: new Date(new Date(getDayDate(5)).setHours(9, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(5)).setHours(11, 0, 0, 0)),
      status: "TODO" as const,
    },
    {
      name: "Tập Gym & Chạy bộ thể thao",
      categoryName: "Sức khỏe",
      startTime: new Date(new Date(getDayDate(5)).setHours(14, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(5)).setHours(16, 0, 0, 0)),
      status: "TODO" as const,
    },

    // --- Chủ nhật (Sunday) ---
    {
      name: "Gặp mặt CLB Sách & Cà phê",
      categoryName: "Cá nhân",
      startTime: new Date(new Date(getDayDate(6)).setHours(10, 0, 0, 0)),
      endTime: new Date(new Date(getDayDate(6)).setHours(12, 0, 0, 0)),
      status: "TODO" as const,
    },
  ];

  let createdCount = 0;
  for (const ev of allEvents) {
    const category = categoriesMap[ev.categoryName] || categoriesMap["Công việc"];
    await prisma.task.create({
      data: {
        name: ev.name,
        startTime: ev.startTime,
        endTime: ev.endTime,
        dueDate: ev.startTime,
        status: ev.status,
        categoryId: category.id,
        userId: user.id,
      },
    });
    createdCount++;
  }

  console.log(`📋 Đã Seed thành công ${createdCount} Công việc/Lịch trình (Tasks)!`);

  // =========================================================================
  // 5. SEED THÓI QUEN (HABITS) KÈM LỊCH SỬ CHECK-IN
  // =========================================================================
  const sampleHabits = [
    { name: "Uống 2L nước mỗi ngày", frequency: "DAILY" as const, checkedToday: true },
    { name: "Chạy bộ / Tập Gym 30 phút", frequency: "DAILY" as const, checkedToday: true },
    { name: "Đọc 15 trang sách", frequency: "DAILY" as const, checkedToday: false },
    { name: "Thiền 10 phút buổi sáng", frequency: "DAILY" as const, checkedToday: true },
    { name: "Ngủ trước 23:00", frequency: "DAILY" as const, checkedToday: false },
  ];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  for (const h of sampleHabits) {
    const createdHabit = await prisma.habit.create({
      data: {
        name: h.name,
        frequency: h.frequency,
        userId: user.id,
      },
    });

    if (h.checkedToday) {
      await prisma.habitRecord.create({
        data: {
          habitId: createdHabit.id,
          completedAt: todayStart,
        },
      });
    }
  }
  console.log(`✨ Đã Seed thành công ${sampleHabits.length} Thói quen (Habits)!`);

  // =========================================================================
  // 6. SEED NHẬT KÝ (JOURNALS)
  // =========================================================================
  const sampleJournals = [
    {
      name: "Hoàn thành báo cáo Tuần",
      content:
        "Hôm nay tôi rất vui vì đã giải quyết xong núi công việc chất đống từ đầu tuần. Cảm giác thật nhẹ nhõm và tự hào về bản thân!",
      createdAt: new Date(),
    },
    {
      name: "Cà phê sáng Chủ Nhật",
      content:
        "Một buổi sáng yên bình với ly Latte yêu thích tại quán quen. Đọc nốt cuốn sách còn dang dở và chuẩn bị kế hoạch cho tuần mới.",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Buổi tập đầu tiên",
      content:
        "Vượt qua sự lười biếng để đến phòng gym. Tuy cơ bắp hơi đau nhức nhưng tinh thần lại cực kỳ sảng khoái.",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Ý tưởng phát triển ứng dụng mới",
      content:
        "Đã phác thảo xong sơ đồ luồng tính năng theo dõi chỉ số cá nhân. Cảm giác rất hào hứng để bắt tay vào code!",
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      name: "Gặp gỡ bạn bè cũ",
      content:
        "Một buổi tối trò chuyện rôm rả, ôn lại kỷ niệm thời đại học và chia sẻ về những dự định tương lai.",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const j of sampleJournals) {
    await prisma.journal.create({
      data: {
        name: j.name,
        content: j.content,
        createdAt: j.createdAt,
        userId: user.id,
      },
    });
  }

  console.log(`📖 Đã Seed thành công ${sampleJournals.length} bài Nhật ký (Journals)!`);
  console.log("🎉 Hoàn tất Seed Dữ liệu thành công!");
}

main()
  .catch((e) => {
    console.error("❌ Lỗi Seed data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
