// E-Waste Types
export interface WasteType {
  id: number;
  name: string;
  description: string;
  price_per_unit: number;
  unit: string; // 'piece', 'kg', 'liter'
  image_url?: string;
  category: string;
}

export interface WasteItem {
  waste_type_id: number;
  quantity: number;
  waste_type?: WasteType;
}

export interface WasteSubmissionForm {
  pickup_address: string;
  landmark?: string;
  items: WasteItem[];
  payment_method: 'MOMO' | 'CASH';
  notes?: string;
}
