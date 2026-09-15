import { Injectable } from '@nestjs/common';
import { prisma } from '@stockvision/prisma';

@Injectable()
export class UserService {
    static async createUser(data: {
        lastName?: string;
        firstName?: string;
        email: string;
        password: string;
    }) {
        return prisma.user.create({
            data,
        });
    }

    static async getAllUsers() {
        return prisma.user.findMany();
    }

    static async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    static async getUserById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    static async updateUser(
        id: string,
        data: Partial<{
            lastName?: string;
            firstName?: string;
            email?: string;
            password?: string;
        }>,
    ) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }

    static async deleteUser(id: string) {
        return prisma.user.delete({
            where: { id },
        });
    }
}
