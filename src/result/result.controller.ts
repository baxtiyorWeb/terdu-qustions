import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ResultService } from './result.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateResultDto } from './dto/create-result.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Result } from './entities/result.entity';

@Controller('results')
export class ResultController {
  constructor(private readonly resultService: ResultService) {}

  @Post()
  async create(@Body() createResultDto: CreateResultDto): Promise<{
    score: number;
    total: number;
    percentage: string;
    timeSpent: number;
    detailedAnswers: any[];
  }> {
    const savedResult: Result =
      await this.resultService.processAndSaveResult(createResultDto);

    return {
      score: savedResult.totalScore,
      total: savedResult.totalQuestions,
      percentage: (
        (savedResult.totalScore / savedResult.totalQuestions) *
        100
      ).toFixed(1),
      timeSpent: savedResult.timeSpent,
      detailedAnswers: savedResult.detailedAnswers ?? [],
    };
  }
  @Get('teacher-all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  findAll() {
    return this.resultService.findAll();
  }

  @Get('by-student/:studentFullName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  findByStudent(@Param('studentFullName') studentFullName: string) {
    return this.resultService.findByStudent(studentFullName);
  }

  @Get('by-category/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  findByCategory(@Param('categoryId') categoryId: string) {
    return this.resultService.findByCategory(+categoryId);
  }

  @Get('student-stats/:studentFullName')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  getStudentStats(@Param('studentFullName') studentFullName: string) {
    return this.resultService.getStudentStats(studentFullName);
  }

  @Get('category-stats/:categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  getCategoryStats(@Param('categoryId') categoryId: string) {
    return this.resultService.getCategoryStats(+categoryId);
  }

  // O'quvchi o'z natijalarini ko'radi (sessionId bo'yicha)
  @Get('my/:sessionId')
  findStudentResults(@Param('sessionId') sessionId: string) {
    return this.resultService.findStudentResults(sessionId);
  }
}
