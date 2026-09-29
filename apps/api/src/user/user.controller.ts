import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGUard } from '../auth/guards/jwt-auth.guard.js';
import type { Request } from 'express';

@Controller('user')
export class UserController {
    @Get('me')
    @UseGuards(JwtAuthGUard)
    getMe(@Req() req: Request) {
        return req.user;
    }
}
