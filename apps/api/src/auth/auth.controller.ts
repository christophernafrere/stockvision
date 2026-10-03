import {
    Body,
    Controller,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('sign-up')
    async signUp(
        @Body()
        dto: RegisterDto,
    ) {
        const {
            lastName,
            firstName,
            email,
            password,
            phone,
            birthday,
            shopCode,
        } = dto;

        const newUser = await this.authService.signUp({
            lastName,
            firstName,
            email,
            birthday,
            phone,
            password,
            shopCode,
        });

        return newUser;
    }

    @Post('sign-in')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const { email, password } = dto;
        const { accessToken, refreshToken } = await this.authService.signIn(
            email,
            password,
        );

        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return { accessToken };
    }

    @Post('refresh')
    async refreshAccesToken(
        @Req() req: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const result = await this.authService.refresh(refreshToken);

        response.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/auth',
        });

        return {
            accessToken: result.accessToken,
        };
    }

    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = request.cookies.refresh_token;

        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }

        response.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/auth',
        });

        return {
            message: 'logged out successfully',
        };
    }
}
