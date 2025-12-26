import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentFullName: string; // O'quvchi ism-sharifi

  @Column()
  categoryId: number; // Test kategoriyasi ID si

  @Column({ nullable: true })
  sessionId: string; // O'quvchi seansi (keyinchalik natijani ko'rish uchun)

  @Column()
  totalQuestions: number; // Umumiy savollar soni

  @Column()
  totalScore: number; // To'g'ri javoblar soni (ball)

  @Column()
  timeSpent: number; // Sarflangan vaqt (sekundlarda)

  // O'quvchining barcha javoblarini saqlaymiz (tekshirish, qayta ko'rish uchun)
  @Column('jsonb', { nullable: true })
  detailedAnswers: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
