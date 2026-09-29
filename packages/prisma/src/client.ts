import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL is missing. Load it from apps/api/.env or set it before booting Prisma.",
    );
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as typeof globalThis & {
    prisma?: PrismaClient;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
