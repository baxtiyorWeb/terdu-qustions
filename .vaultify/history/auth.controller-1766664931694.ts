/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ===============================
  // 🔹 TEACHER / ADMIN login
  // ===============================
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  // ===============================
  // 🔹 STUDENT login = register
  // ===============================
  @Public()
  @Post('student')
  studentLoginOrRegister(
    @Body()
    body: {
      username: string;
      password: string;
    },
  ) {
    return this.authService.studentLoginOrRegister(body);
  }

  // ===============================
  // 🔹 GUEST login
  // ===============================
  @Public()
  @Post('guest')
  guestLogin() {
    return this.authService.guestLogin();
  }
}
