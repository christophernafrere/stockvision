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

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('sign-up')
    async signUp(
        @Body()
        body: {
            lastName: string;
            firstName: string;
            email: string;
            password: string;
            shopCode: number;
        },
    ) {
        const { lastName, firstName, email, password, shopCode } = body;

        const newUser = await this.authService.signUp({
            lastName,
            firstName,
            email,
            password,
            shopCode,
        });

        return newUser;
    }

    @Post('login')
    async login(
        @Body() body: { email: string; password: string },
        @Res({ passthrough: true }) response: Response,
    ) {
        const { email, password } = body;
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
            accesToken: result.accessToken,
        };
    }

    @Post('logout')
    async logout() {}
}
