export type ProgressTab = 'Resumen' | 'Detalle';

export interface SummaryMetric {
  id: string;
  title: string;
  value: string;
}

export interface AverageMetric {
  id: string;
  label: string;
  value: string;
}