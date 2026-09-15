import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
    static async signUp(data: {
        lastName?: string;
        firstName?: string;
        email: string;
        password: string;
    }) {
        const { lastName, firstName, email, password } = data;

        const existingUser = await UserService.getUserByEmail(email);
        if (existingUser) {
            throw new HttpException(
                'User with this email already exists',
                HttpStatus.CONFLICT,
            );
        }
        try {
            const hash = await bcrypt.hash(password, 15);

            try {
                const user = await UserService.createUser({
                    lastName,
                    firstName,
                    email,
                    password: hash,
                });

                return user;
            } catch (error) {
                console.error(error);
                throw new HttpException(
                    'Error creating user',
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        } catch {
            throw new HttpException(
                'Error hashing password',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    static async signIn(email: string, password: string) {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new HttpException(
                'User with this email does not exist',
                HttpStatus.NOT_FOUND,
            );
        }
    }
}
