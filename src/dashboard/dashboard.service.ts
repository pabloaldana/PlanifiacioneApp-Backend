import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { PlanificacionService } from 'src/planificacion/planificacion.service';
import { CompraService } from 'src/compra/compra.service';
import { User } from 'src/auth/entities/auth.entity';

const MESES_ABREVIADOS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

const MESES_COMPLETOS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

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

  async getTeacherStatistics(userId: string) {
    const currentYear = new Date().getFullYear();

    const [
      ingresosTotales,
      totalVentas,
      masVendida,
      ventasPorMesRaw,
      montoPorMesRaw,
      ventasPorMateria,
      planificacionesVendidas,
    ] = await Promise.all([
      this.compraService.getRevenueBySeller(userId),
      this.compraService.getTotalSalesCountBySeller(userId),
      this.compraService.getBestSellingByUser(userId),
      this.compraService.getMonthlySalesCountBySellerForYear(userId, currentYear),
      this.compraService.getMonthlyRevenueBySellerForYear(userId, currentYear),
      this.compraService.getSalesBySubjectForSeller(userId),
      this.compraService.getSoldPlanificacionesBySeller(userId),
    ]);

    const ventasPorMes = MESES_ABREVIADOS.map((mes, index) => {
      const found = ventasPorMesRaw.find((row) => row.month === index + 1);
      return { mes, ventas: found ? found.ventas : 0 };
    });

    const mejorMesEntry = montoPorMesRaw.reduce<{ month: number; monto: number } | null>(
      (best, current) => (!best || current.monto > best.monto ? current : best),
      null,
    );

    const mejorMes = mejorMesEntry
      ? { mes: MESES_COMPLETOS[mejorMesEntry.month - 1], monto: mejorMesEntry.monto }
      : null;

    return {
      ingresosTotales,
      totalVentas,
      masVendida,
      mejorMes,
      ventasPorMes,
      ventasPorMateria,
      planificacionesVendidas,
    };
  }
}
