import { ChartData } from "./chartData";
import { DashboardData } from "./dashboardData";
import { Transaction } from "./transaction";

export interface ProcessedData {
  dashboard: DashboardData;
  chartData: ChartData[];
  transactions: Transaction[];
}