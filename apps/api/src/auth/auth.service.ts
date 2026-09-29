import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service.js';
import { JwtService } from '@nestjs/jwt';

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

        return { accessToken };
    }
}
