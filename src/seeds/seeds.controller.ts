import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seeds.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  seedAll() {
    return this.seedService.seed();
  }
}
