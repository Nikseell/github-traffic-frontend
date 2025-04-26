export interface TrafficPoint {
  date: string;
  views?: number;
  uniqueViews?: number;
  clones?: number;
  uniqueClones?: number;
}

export interface ChartData {
  clonesChartData: TrafficPoint[];
  viewsChartData: TrafficPoint[];
}

export interface TrafficTotals {
  clones: number;
  uniqueClones: number;
  uniqueViews: number;
  views: number;
}

export interface TrafficData {
  chartData: ChartData;
  name: string;
  totals: TrafficTotals;
}
