export interface Analitics {
  type: string;
  "x-axis": string;
  "y-axis": string[];
}

export interface Result {
  BrandID: number;
  DivisionID: number;
  HQID: number;
  ID: number;
  Name: string;
  PrimarySalesAMT: number;
  PrimarySalesQty: number;
  SecondarySalesAMT: number;
  SecondarySalesQty: number;
  StockistID: number;
  TargetSalesAMT: number;
  TargetSalesQty: number;
  TimeKey: string;
}

export interface QueryData {
  analitics: Analitics[];
  query: string;
  result: Record<string, any>[] | string;
}
