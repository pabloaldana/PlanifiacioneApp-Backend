import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PlanificacionService } from 'src/planificacion/planificacion.service';
import { CompraService } from 'src/compra/compra.service';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly authService: AuthService,
    private readonly planificacionService: PlanificacionService,
    private readonly compraService: CompraService,
  ) {}

  async getAdminSummary() {
    const [totalUsers, totalPlanificaciones, monthlyRevenue, recentUsers] = await Promise.all([
      this.authService.countUsers(),
      this.planificacionService.count(),
      this.compraService.getMonthlyRevenue(),
      this.authService.findRecentUsers(5),
    ]);

    return {
      totalUsers,
      totalPlanificaciones,
      monthlyRevenue,
      recentUsers,
    };
  }

  async getTeacherSummary(userId: string) {
    const [totalPlanificaciones, totalRevenue, topPlanificaciones, ventasRecientes, usuariosActivos] = await Promise.all([
      this.planificacionService.countByUser(userId),
      this.compraService.getRevenueBySeller(userId),
      this.compraService.getTopSellingByUser(userId),
      this.compraService.getRecentSalesByUser(userId),
      this.authService.countActiveUsers(),
    ]);

    return {
      totalPlanificaciones,
      totalRevenue,
      topPlanificaciones,
      ventasRecientes,
      usuariosActivos,
    };
  }

  async getBuyerSummary(user: User) {
    const [purchases, totalSpent] = await Promise.all([
      this.compraService.findMyPurchases(user),
      this.compraService.getTotalSpentByUser(user.id),
    ]);

    return {
      purchases,
      totalSpent,
    };
  }
}
