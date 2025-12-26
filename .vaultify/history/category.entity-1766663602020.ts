import { Question } from './../../question/entities/question.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number; // Kategoriya ID

  @Column({ unique: true })
  name: string; // Kategoriya nomi (masalan: Fonetika)

  @OneToMany(() => Question, (question) => question.category)
  questions: Question[]; // Kategoriya bilan bog'langan savollar
}
