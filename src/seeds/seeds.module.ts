import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Question } from '../question/entities/question.entity';
import { SeedController } from './seeds.controller';
import { SeedService } from './seeds.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Question])],
  providers: [SeedService],
  controllers: [SeedController],
})
export class SeedsModule {}
