/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true, // 🔥 MUHIM
    });
  }

  async validate(req: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { username, password } = req.body;

    if (!username || !password) {
      throw new UnauthorizedException('Username yoki parol kiritilmadi');
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Username yoki parol noto'g'ri");
    }

    return user;
  }
}
