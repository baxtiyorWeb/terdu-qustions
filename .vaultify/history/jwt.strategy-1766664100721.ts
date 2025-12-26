import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Tokenni Headerdan olish
      ignoreExpiration: false, // Token muddati tugaganini tekshirish
      secretOrKey: 'tdutest123', // AuthModule dan kelgan maxfiy kalit
    });
  }

  // Token ichidagi ma'lumotlarni (payload) qaytarish
  validate(payload: JwtPayload) {
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
