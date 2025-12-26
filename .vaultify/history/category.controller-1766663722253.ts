import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('categories') // Asosiy endpoint
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // 1. Yangi kategoriya yaratish (CREATE) - Faqat O'qituvchi
  // POST /categories
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Kategoriya servisini chaqirish
    return this.categoryService.create(createCategoryDto);
  }

  // 2. Barcha kategoriyalarni olish (READ All) - Hamma uchun ochiq
  // GET /categories
  @Get()
  findAll(): Promise<Category[]> {
    // Barcha test turlarini o'quvchilar va o'qituvchilar ko'rishi mumkin
    return this.categoryService.findAll();
  }

  // 3. Kategoriyani ID bo'yicha olish (READ One) - Faqat O'qituvchi
  // GET /categories/:id
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(+id);
  }

  // 4. Kategoriyani tahrirlash (UPDATE) - Faqat O'qituvchi
  // PATCH /categories/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  // 5. Kategoriyani o'chirish (DELETE) - Faqat O'qituvchi
  // DELETE /categories/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content statusini qaytarish
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.TEACHER)
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(+id);
  }
}
