import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Result } from './entities/result.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { Question } from '../question/entities/question.entity';

// TypeORM QueryBuilder'dan qaytgan natija uchun interfeys
interface QuestionForScoring {
  id: number;
  options: string[] | null;
  correctAnswerIndex: number | null;
  correctTextAnswer: string | null;
}

@Injectable()
export class ResultService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>, // Savollarni olish uchun
  ) {}

  /**
   * O'quvchi javoblarini tekshiradi va natijani saqlaydi (yoki yangilaydi).
   */
  async processAndSaveResult(
    createResultDto: CreateResultDto,
  ): Promise<Result> {
    const { studentFullName, categoryId, answers, totalQuestions, timeSpent } =
      createResultDto;

    // 1. Database'dan to'g'ri javoblarni olish
    const questionIds = answers.map((a) => a.questionId);

    // Tipni aniq belgilash uchun Type Assertion ishlatildi (QueryBuilder xatolarini hal qilish)
    const questions: QuestionForScoring[] = (await this.questionsRepository
      .createQueryBuilder('q')
      .select([
        'q.id',
        'q.options',
        'q.correctAnswerIndex',
        'q.correctTextAnswer',
      ])
      .whereInIds(questionIds)
      .getMany()) as QuestionForScoring[];

    if (questions.length !== questionIds.length) {
      throw new BadRequestException(
        "Yuborilgan savollar to'plamida xato mavjud.",
      );
    }

    let score = 0;
    const questionMap = new Map<number, QuestionForScoring>(
      questions.map((q) => [q.id, q]),
    );

    // 2. Javoblarni tekshirish va hisoblash
    answers.forEach((answer) => {
      const q: QuestionForScoring | undefined = questionMap.get(
        answer.questionId,
      );
      if (!q) return;

      if (q.options && q.options.length > 0) {
        // Variantli savol
        if (
          answer.userAnswerIndex !== undefined &&
          q.correctAnswerIndex !== null &&
          answer.userAnswerIndex === q.correctAnswerIndex
        ) {
          score++;
        }
      } else {
        // Matnli savol
        if (
          answer.userAnswerText &&
          q.correctTextAnswer !== null &&
          answer.userAnswerText.trim().toLowerCase() ===
            q.correctTextAnswer.trim().toLowerCase()
        ) {
          score++;
        }
      }
    });

    // 3. Natijani yaratish yoki yangilash
    const sessionId = createResultDto.sessionId || `ghost_${Date.now()}`;

    // Avvalgi natijani qidirish (studentFullName va categoryId bo'yicha)
    const existingResult = await this.resultsRepository.findOne({
      where: {
        studentFullName: studentFullName,
        categoryId: categoryId,
      },
    });

    const resultData: Partial<Result> = {
      studentFullName,
      categoryId,
      sessionId,
      totalScore: score,
      totalQuestions,
      timeSpent,
      detailedAnswers: answers,
    };

    try {
      if (existingResult) {
        await this.resultsRepository.update(existingResult.id, resultData);
        const updatedResult = await this.resultsRepository.findOne({
          where: { id: existingResult.id },
        });

        if (!updatedResult) {
          throw new InternalServerErrorException(
            'Yangilangan natija topilmadi.',
          );
        }
        return updatedResult;
      } else {
        const newResult = this.resultsRepository.create(resultData);
        return this.resultsRepository.save(newResult);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Natijani saqlashda kutilmagan xato yuz berdi.';

      throw new InternalServerErrorException(errorMessage);
    }
  }

  findAll(): Promise<Result[]> {
    return this.resultsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByStudent(studentFullName: string): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { studentFullName },
      order: { createdAt: 'DESC' },
    });
  }

  async findByCategory(categoryId: number): Promise<Result[]> {
    return this.resultsRepository.find({
      where: { categoryId },
      order: { createdAt: 'DESC' },
    });
  }

  async getStudentStats(studentFullName: string): Promise<any> {
    const results = await this.findByStudent(studentFullName);
    if (results.length === 0) {
      throw new BadRequestException('Natijalar topilmadi.');
    }

    const totalScores = results.reduce((sum, r) => sum + r.totalScore, 0);
    const averageScore = totalScores / results.length;
    const bestResult = results.reduce(
      (max, r) => (r.totalScore > max.totalScore ? r : max),
      results[0],
    );

    return {
      totalTests: results.length,
      averageScore,
      bestResult: {
        score: bestResult.totalScore,
        categoryId: bestResult.categoryId,
        date: bestResult.createdAt,
      },
    };
  }

  async getCategoryStats(categoryId: number): Promise<any> {
    const results = await this.findByCategory(categoryId);
    if (results.length === 0) {
      throw new BadRequestException('Natijalar topilmadi.');
    }

    const totalScores = results.reduce((sum, r) => sum + r.totalScore, 0);
    const averageScore = totalScores / results.length;

    return {
      totalSubmissions: results.length,
      averageScore,
      averageTimeSpent:
        results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length,
    };
  }

  async findStudentResults(sessionId: string): Promise<Result[]> {
    if (!sessionId || sessionId.trim() === '') {
      throw new BadRequestException("Session ID bo'sh bo'lishi mumkin emas.");
    }

    const results = await this.resultsRepository.find({
      where: { sessionId: sessionId.trim() },
      order: { createdAt: 'DESC' },
    });

    return results;
  }
}
