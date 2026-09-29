import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

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
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return await this.authService.signIn(email, password);
    }
}
