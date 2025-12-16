export enum FoundationType {
  SINGLE = 'SINGLE', // Móng đơn
  PILE = 'PILE', // Móng cọc
  RAFT = 'RAFT', // Móng bè
  ICE = 'ICE' // Móng băng
}

export enum RoofType {
  CONCRETE = 'CONCRETE', // Mái BTCT
  CORRUGATED_IRON = 'CORRUGATED_IRON', // Mái tôn
  TILE_TRUSS = 'TILE_TRUSS', // Mái ngói kèo sắt
  TILE_CONCRETE = 'TILE_CONCRETE' // Mái ngói BTCT
}

export enum BasementType {
  DEPTH_LT_13 = 'DEPTH_LT_13', // < 1.3m
  DEPTH_13_LT_17 = 'DEPTH_13_LT_17', // 1.3m - < 1.7m
  DEPTH_17_LT_20 = 'DEPTH_17_LT_20', // 1.7m - < 2.0m
  DEPTH_GT_20 = 'DEPTH_GT_20', // > 2.0m
}

export interface CalculationInputs {
  width: number;
  length: number;
  floors: number;
  
  hasBasement: boolean;
  basementType: BasementType; // Selected basement depth type

  hasTerrace: boolean;
  // Mezzanine
  hasMezzanine: boolean;
  mezzaninePercent: number; // Percentage of base area (0-100)
  
  // Yards
  frontYardArea: number;
  backYardArea: number;

  foundationType: FoundationType;
  roofType: RoofType;
  
  // Custom Pricing
  roughPrice: number;
  finishingBasicPrice: number;
  finishingPremiumPrice: number;
  usePremiumFinishing: boolean;
}

export interface AreaBreakdownItem {
  name: string;
  originalArea: number;
  coefficient: number;
  convertedArea: number;
  note: string;
  cost: number;
}

export interface CalculationResult {
  breakdown: AreaBreakdownItem[];
  totalConvertedArea: number;
  unitPrice: number;
  totalCost: number;
}