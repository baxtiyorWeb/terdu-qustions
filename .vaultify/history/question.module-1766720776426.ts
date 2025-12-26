import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { Result } from 'src/result/entities/result.entity';
import { Question } from './entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Result, Question])],
  providers: [QuestionService],
  controllers: [QuestionController],
})
export class QuestionModule {}
