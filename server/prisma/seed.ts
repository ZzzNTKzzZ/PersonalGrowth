import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Bắt đầu tạo toàn bộ dữ liệu mẫu từ calendar.tsx (Seeding data)...");

  // 1. Tạo hoặc lấy User khanh@gmail.com
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "khanh@gmail.com" },
    update: {},
    create: {
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

  console.log(`👤 User: ${user.email} (ID: ${user.id})`);

  // Xóa bớt tasks cũ của user để seed sạch sẽ
  await prisma.task.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // 2. Tạo Categories mẫu
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

  console.log(`📋 Đã Seed thành công ${createdCount} Công việc/Lịch trình đầy đủ từ calendar.tsx!`);
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
