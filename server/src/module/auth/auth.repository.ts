import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Register } from "./auth.type.js";

@Injectable()
export default class AuthRepository {
    constructor(private readonly prisma: PrismaService){}

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { profile: true }
        })
    }

    async create(data: Register) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: data.password,
                profile: {
                    create: {
                        fullName: data.fullName
                    }
                }
            }
        })
    }

    async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken }
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { profile: true }
        });
    }
}