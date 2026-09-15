import { Body, Controller, Post } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
    @Post('sign-up')
    async signUp(
        @Body()
        body: {
            lastName?: string;
            firstName?: string;
            email: string;
            password: string;
        },
    ) {
        const { lastName, firstName, email, password } = body;

        const newUser = await AuthService.signUp({
            lastName,
            firstName,
            email,
            password,
        });

        return newUser;
    }
}
