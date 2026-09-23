import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service.js';

@Injectable()
export class AuthService {
    static async signUp(data: {
        lastName: string;
        firstName: string;
        email: string;
        password: string;
        shopCode: number;
    }) {
        const { lastName, firstName, email, password, shopCode } = data;

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
                    shopCode,
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
        try {
            const user = await UserService.getUserByEmail(email);
            if (!user) {
                throw new HttpException(
                    'Invalid email or password',
                    HttpStatus.UNAUTHORIZED,
                );
            } else {
                try {
                    const passwordIsValid = await bcrypt.compare(
                        password,
                        user.password,
                    );

                    if (!passwordIsValid) {
                        throw new HttpException(
                            'Invalid email or password',
                            HttpStatus.UNAUTHORIZED,
                        );
                    } else {
                        return 'is connected';
                    }
                } catch (error) {
                    throw new HttpException(
                        'Erreur survenue lors de la tentative de connexion',
                        HttpStatus.INTERNAL_SERVER_ERROR,
                    );
                }
            }
        } catch (error) {
            throw new HttpException(
                'Erreur survenue lors de la tentative de connexion',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
