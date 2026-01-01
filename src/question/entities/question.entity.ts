import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  question: string;

  @Column({ type: 'jsonb', nullable: true })
  options: string[] | null;

  @Column('int', { nullable: true })
  correctAnswerIndex: number | null;

  @Column({ type: 'text', nullable: true })
  correctTextAnswer: string | null;

  @ManyToOne(() => Category, (category) => category.questions, {
    onDelete: 'CASCADE',
  })
  category: Category; // Kategoriya bilan bog'lanish
}
