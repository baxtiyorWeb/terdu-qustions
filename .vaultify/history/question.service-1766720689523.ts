import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    // ... (Mantiq avvalgisidek, o'zgartirishsiz)
    if (!createQuestionDto.options || createQuestionDto.options.length === 0) {
      if (!createQuestionDto.correctTextAnswer) {
        throw new BadRequestException(
          "Matnli savol uchun to'g'ri javob matni majburiy",
        );
      }
      createQuestionDto.options = undefined; // null yoki undefined to'g'ri bo'lishi kerak
      createQuestionDto.correctAnswerIndex = undefined;
    } else {
      // Variantli savol – correctTextAnswer kerak emas
      if (
        createQuestionDto.correctAnswerIndex === undefined ||
        createQuestionDto.correctAnswerIndex >=
          createQuestionDto.options.length ||
        createQuestionDto.correctAnswerIndex < 0
      ) {
        throw new BadRequestException(
          "To'g'ri javob indeksi variantlar sonidan oshmasligi kerak",
        );
      }
      createQuestionDto.correctTextAnswer = undefined; // Matnli javob null
    }

    const question = this.questionsRepository.create({
      ...createQuestionDto,
      category: { id: createQuestionDto.categoryId },
    });
    return this.questionsRepository.save(question);
  }

  async findTestQuestions(categoryId: number): Promise<any[]> {
    const questions = await this.questionsRepository.find({
      where: { category: { id: categoryId } },
      select: ['id', 'question', 'options'], // Faqat id, savol va options (correct ni jo'natmaymiz)
    });

    return questions.sort(() => Math.random() - 0.5);
  }

  findAll(): Promise<Question[]> {
    return this.questionsRepository.find({ relations: ['category'] });
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!question) {
      throw new NotFoundException(`ID ${id} bo'yicha savol topilmadi.`);
    }
    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    // ... (Yangilash mantiqi avvalgisidek, null/undefined tekshiruvlari bilan)
    if (!updateQuestionDto.options || updateQuestionDto.options.length === 0) {
      if (!updateQuestionDto.correctTextAnswer) {
        throw new BadRequestException(
          "Matnli savol uchun to'g'ri javob matni majburiy",
        );
      }
      updateQuestionDto.options = undefined;
      updateQuestionDto.correctAnswerIndex = undefined;
    } else {
      if (
        updateQuestionDto.correctAnswerIndex === undefined ||
        updateQuestionDto.correctAnswerIndex >=
          updateQuestionDto.options.length ||
        updateQuestionDto.correctAnswerIndex < 0
      ) {
        throw new BadRequestException(
          "To'g'ri javob indeksi variantlar sonidan oshmasligi kerak",
        );
      }
      updateQuestionDto.correctTextAnswer = undefined;
    }

    const result = await this.questionsRepository.update(id, {
      ...updateQuestionDto,
      category: { id: updateQuestionDto.categoryId },
    });
    if (result.affected === 0) {
      throw new NotFoundException(`ID ${id} bo'yicha savol topilmadi.`);
    }
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.questionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID ${id} bo'yicha savol topilmadi.`);
    }
  }

  async countByCategory(categoryId: number): Promise<number> {
    return this.questionsRepository.count({
      where: { category: { id: categoryId } },
    });
  }
}
