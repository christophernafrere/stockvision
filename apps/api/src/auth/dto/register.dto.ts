import {
    IsEmail,
    IsInt,
    IsNumber,
    IsString,
    Matches,
    Max,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class RegisterDto {
    @IsString()
    @MinLength(1)
    @MaxLength(128)
    lastName: string;

    @IsString()
    @MinLength(1)
    @MaxLength(128)
    firstName: string;

    @IsEmail()
    @Matches(/^[^\s@]+@(m\.)?auchan\.fr$/i, {
        message: 'L’adresse email doit être une adresse Auchan valide',
    })
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string;

    @IsInt()
    @Min(100)
    @Max(999)
    shopCode: number;
}
