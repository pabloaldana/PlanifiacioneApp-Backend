import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/auth.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('super-admin')
  @Auth(ValidRoles.superAdmin)
  getAdminSummary() {
    return this.dashboardService.getAdminSummary();
  }

  @Get('admin')
  @Auth(ValidRoles.admin)
  getTeacherSummary(@GetUser('id') userId: string) {
    return this.dashboardService.getTeacherSummary(userId);
  }

  @Get('user')
  @Auth(ValidRoles.user)
  getBuyerSummary(@GetUser() user: User) {
    return this.dashboardService.getBuyerSummary(user);
  }
}
