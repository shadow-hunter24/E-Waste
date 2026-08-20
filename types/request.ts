import { User } from './user';
import { WasteItem } from './waste';

// Request Types
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'ON_ROUTE' | 'COMPLETED' | 'REJECTED';

export interface PickupRequest {
  id: number;
  user_id: number;
  user?: User;
  status: RequestStatus;
  pickup_address: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  total_amount: number;
  payment_method: 'MOMO' | 'CASH';
  items: WasteItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_pickup_time?: string;
  driver_name?: string;
  driver_phone?: string;
}
