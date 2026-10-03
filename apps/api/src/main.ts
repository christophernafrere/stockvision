import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        instrument: ObserveInstrument,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    app.use(cookieParser());
    await app.listen(process.env.PORT ?? 4000);
}
await bootstrap();
