
import { BarChartData } from "./barChartData";
import { DashboardData } from "./dashboardData";
import { NuTransactionData } from "./NuTransactionData";
import { PizzaChartData } from "./pizzaChartData";

export interface ProcessedData {
  dashboard: DashboardData;
  barChartData: BarChartData[];
  pizzaChartData: PizzaChartData[];
  transactions: NuTransactionData[];
}