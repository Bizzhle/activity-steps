import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Validate } from 'class-validator';
import { UserPasswordValidator } from '../types/validators/user-password.validators';

export class CreateUserDto {
  @ApiProperty({ description: 'Email Address', example: 'test@gmail.com' })
  @IsEmail()
  emailAddress: string;

  @ApiProperty({ description: 'password of user', example: 'Pass12345' })
  @Validate(UserPasswordValidator)
  @IsNotEmpty()
  password: string;
}
