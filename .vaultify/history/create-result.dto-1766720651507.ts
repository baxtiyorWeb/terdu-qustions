import {
  IsNotEmpty,
  IsArray,
  IsInt,
  ValidateNested,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsInt()
  @IsNotEmpty()
  questionId: number; // Savol IDsi

  @IsOptional()
  @IsInt()
  @Min(-1) // Javob bermagan bo'lsa -1 (variantli savollar uchun)
  userAnswerIndex?: number; // Foydalanuvchi tanlagan javob indeksi (variantli uchun)

  @IsOptional()
  @IsString()
  userAnswerText?: string; // Foydalanuvchi kiritgan matn (matnli savollar uchun)
}

export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: "Ism-sharif kamida 2 belgi bo'lishi kerak" })
  studentFullName: string; // O'quvchi ism-sharifi

  @IsInt()
  @IsNotEmpty()
  categoryId: number; // Test kategoriyasi ID si

  @IsOptional()
  @IsString()
  sessionId?: string; // Session ID (ixtiyoriy)

  @IsInt()
  @IsNotEmpty()
  totalQuestions: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  timeSpent: number; // Sarflangan vaqt (sekundda)
}
