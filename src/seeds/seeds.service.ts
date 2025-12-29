import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/entities/category.entity';
import { Question } from '../question/entities/question.entity';
import questions from './questions.json';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,

    @InjectRepository(Question)
    private questionRepo: Repository<Question>,
  ) {}

  async seed() {
    for (const q of questions as Array<{
      category: string;
      question: string;
      options?: string[];
      correctAnswerIndex?: number;
      correctTextAnswer?: string;
    }>) {
      // 1️⃣ Category topamiz yoki yaratamiz
      let category = await this.categoryRepo.findOne({
        where: { name: q.category },
      });

      if (!category) {
        category = this.categoryRepo.create({ name: q.category });
        category = await this.categoryRepo.save(category);
      }

      // 2️⃣ Question yaratamiz
      const question = this.questionRepo.create({
        question: q.question,
        options: q.options ?? null,
        correctAnswerIndex: q.correctAnswerIndex ?? null,
        correctTextAnswer: q.correctTextAnswer ?? null,
        category: category,
      });

      await this.questionRepo.save(question);
    }

    return { message: '✅ Bo‘limlar va savollar muvaffaqiyatli qo‘shildi' };
  }
}
