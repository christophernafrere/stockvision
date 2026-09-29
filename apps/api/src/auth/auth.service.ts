import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';
import { prisma } from '@stockvision/prisma';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async signUp(data: {
        lastName: string;
        firstName: string;
        email: string;
        password: string;
        shopCode: number;
    }) {
        const { lastName, firstName, email, password, shopCode } = data;

        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            throw new ConflictException();
        }
        try {
            const hash = await bcrypt.hash(password, 15);

            try {
                const user = await UserService.createUser({
                    lastName,
                    firstName,
                    email,
                    shopCode,
                    password: hash,
                });

                return user;
            } catch (error) {
                throw new InternalServerErrorException();
            }
        } catch {
            throw new InternalServerErrorException();
        }
    }

    async signIn(email: string, password: string) {
        const user = await UserService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException();
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);
        if (!passwordIsValid) {
            throw new UnauthorizedException();
        }

        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        });

        const refreshToken = await this.jwtService.signAsync(
            { sub: user.id, sid: session.id },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '30d',
            },
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        await prisma.session.update({
            where: { id: session.id },
            data: {
                refreshTokenHash,
            },
        });

        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string) {
        let payload: { sub: string; sid: string };

        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch {
            throw new UnauthorizedException();
        }

        const session = await prisma.session.findUnique({
            where: {
                id: payload.sid,
            },
        });

        if (!session) {
            throw new UnauthorizedException();
        }

        if (session.userId !== payload.sub) {
            throw new UnauthorizedException();
        }

        if (session.revokedAt) {
            throw new UnauthorizedException();
        }

        if (!session.refreshTokenHash) {
            throw new UnauthorizedException();
        }

        if (session.expiresAt < new Date()) {
            throw new UnauthorizedException();
        }

        const valid = await bcrypt.compare(
            refreshToken,
            session.refreshTokenHash,
        );

        if (!valid) {
            throw new UnauthorizedException();
        }

        const accessToken = await this.jwtService.signAsync(
            {
                sub: payload.sub,
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        const newRefreshToken = await this.jwtService.signAsync(
            {
                sub: payload.sub,
                sid: session.id,
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '30d',
            },
        );

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                refreshTokenHash: newRefreshTokenHash,
            },
        });

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(refreshToken: string) {
        let payload: { sub: string; sid: string };

        try {
            payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });
        } catch {
            return;
        }

        const session = await prisma.session.findUnique({
            where: {
                id: payload.sid,
            },
        });

        if (!session) {
            return;
        }

        if (session.userId !== payload.sub) {
            return;
        }

        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}
