import {
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayMinSize,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string; // Savol matni

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  options?: string[]; // Javob variantlari massivi (ixtiyoriy, agar bo'sh bo'lsa – matnli savol)

  @IsOptional()
  @IsInt()
  @Min(0)
  correctAnswerIndex?: number; // options massividagi to'g'ri javob indeksi (ixtiyoriy)

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  correctTextAnswer?: string; // To'g'ri matnli javob (agar savol matnli bo'lsa, majburiy emas)

  @IsInt()
  @IsNotEmpty()
  categoryId: number; // Qaysi kategoriyaga tegishliligi
}

export class UpdateQuestionDto extends CreateQuestionDto {} // Savolni tahrirlash uchun Create DTOni kengaytiramiz
