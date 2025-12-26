/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRole } from '../user/entities/user.entity';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ===============================
  // 🔹 DEFAULT TEACHER
  // ===============================
  async onModuleInit(): Promise<void> {
    const username = this.configService.get<string>('TEACHER_USERNAME');
    const password = this.configService.get<string>('TEACHER_PASSWORD');

    if (!username || !password) {
      console.warn('⚠️ Teacher credentials not found in env');
      return;
    }

    const teacher = await this.usersRepository.findOne({
      where: { username },
    });

    if (!teacher) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newTeacher = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.TEACHER,
      });

      await this.usersRepository.save(newTeacher);
      console.log('✅ Default TEACHER created');
    }
  }

  // ===============================
  // 🔹 STUDENT: login = register
  // ===============================
  async studentLoginOrRegister(data: {
    username: string;
    password: string;
  }): Promise<{ student_access_token: string }> {
    const { username, password } = data;

    let user = await this.usersRepository.findOne({
      where: { username },
    });

    // 🔹 REGISTER
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: UserRole.STUDENT,
      });

      await this.usersRepository.save(user);
    }

    // 🔹 LOGIN
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Parol noto‘g‘ri');
    }

    return {
      student_access_token: this.jwtService.sign({
        sub: user.id,
        username: user.username,
        role: user.role,
      }),
    };
  }

  // ===============================
  // 🔹 TEACHER / ADMIN login (LocalStrategy)
  // ===============================
  async validateUser(
    username: string,
    plainPassword: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) return null;

    const isMatch = await bcrypt.compare(plainPassword, user.password);
    if (!isMatch) return null;

    const { password, ...result } = user;
    return result;
  }

  login(user: Pick<User, 'id' | 'username' | 'role'>): {
    access_token: string;
  } {
    return {
      access_token: this.jwtService.sign({
        sub: user.id,
        username: user.username,
        role: user.role,
      }),
    };
  }

  // ===============================
  // 🔹 GUEST login
  // ===============================
  guestLogin(): { access_token: string } {
    return {
      access_token: this.jwtService.sign({
        sub: -1,
        username: 'GUEST_USER',
        role: UserRole.GUEST,
      }),
    };
  }
}
