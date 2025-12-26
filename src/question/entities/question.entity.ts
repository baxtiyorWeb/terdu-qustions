import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number; // Savol ID

  @Column({ type: 'text' })
  question: string; // Savol matni

  @Column('simple-array', { nullable: true })
  options: string[] | null; // Javob variantlari (Massiv), agar null bo'lsa – matnli savol

  @Column('int', { nullable: true })
  correctAnswerIndex: number | null; // To'g'ri javob indeksi (0-based), agar null bo'lsa – matnli savol

  @Column({ type: 'text', nullable: true })
  correctTextAnswer: string | null; // To'g'ri matnli javob (agar savol matnli bo'lsa)

  @ManyToOne(() => Category, (category) => category.questions, {
    onDelete: 'CASCADE',
  })
  category: Category; // Kategoriya bilan bog'lanish
}
