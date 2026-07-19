import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Get()
  @Auth(ValidRoles.superAdmin)
  executeSeed() {
    return this.seedService.runSeed();
  }

  @Get('init')
  executeInit() {
    return this.seedService.runInit();
  }

}
