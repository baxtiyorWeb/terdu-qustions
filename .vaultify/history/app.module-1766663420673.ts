import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { QuestionModule } from './question/question.module';
import { ResultModule } from './result/result.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // ===============================
    // 🔹 TypeORM NeonDB config
    // ===============================
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   url: 'postgresql://neondb_owner:npg_sOTStUz8nqi4@ep-still-forest-ablr8jhv-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    //   autoLoadEntities: true, // barcha entity larni avtomatik yuklash
    //   synchronize: true, // dev uchun, production da false qil
    // }),

    // ===============================
    // 🔹 LOCAL POSTGRES (comment)
    // ===============================
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '12345',
    //   database: 'tdutestdb',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true,
    // }),

    UserModule,
    AuthModule,
    CategoryModule,
    QuestionModule,
    ResultModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
