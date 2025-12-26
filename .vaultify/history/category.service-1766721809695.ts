import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>, // Category entitetini kiritish
  ) {}

  // Yangi kategoriya yaratish (CREATE)
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Kategoriya nomi takrorlanmasligini tekshirish (Entity da unique bo'lsa ham, xatolikni chiroyli ushlash uchun)
    const existingCategory = await this.categoryRepository.findOneBy({
      name: createCategoryDto.name,
    });

    if (existingCategory) {
      throw new ConflictException(
        `'${createCategoryDto.name}' nomli kategoriya allaqachon mavjud.`,
      );
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  // Barcha kategoriyalarni olish (READ All)
  findAll(): Promise<Category[]> {
    // Savollar bilan birga yuklash shart emas, chunki faqat kategoriya ro'yxati kerak
    return this.categoryRepository.find({
      order: { name: 'ASC' }, // Alifbo bo'yicha saralash
    });
  }

  // Kategoriyani ID bo'yicha olish (READ One)
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`ID ${id} bo'yicha kategoriya topilmadi.`);
    }
    return category;
  }

  // Kategoriyani tahrirlash (UPDATE)
  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // Kategoriya mavjudligini tekshirish
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`ID ${id} bo'yicha kategoriya topilmadi.`);
    }

    // Nomni yangilash
    // `.merge` metodi entitetga yangi ma'lumotlarni qo'shadi
    this.categoryRepository.merge(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  // Kategoriyani o'chirish (DELETE)
  async remove(id: number): Promise<void> {
    // Eslatma: Question entitetida `onDelete: 'CASCADE'` ishlatilganligi sababli,
    // kategoriya o'chirilganda, unga bog'langan savollar ham avtomatik o'chiriladi.
    const result = await this.categoryRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ID ${id} bo'yicha kategoriya topilmadi.`);
    }
  }
}
