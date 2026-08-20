import { ApiResponse } from '@/types/api';
import { AuthResponse, LoginForm, RegisterForm, User } from '@/types/user';
import { PickupRequest } from '@/types/request';
import { WasteSubmissionForm, WasteType } from '@/types/waste';
import AsyncStorage from '@react-native-async-storage/async-storage';

// If running on a physical device, replace localhost with your PC LAN IP
// and ensure the path matches your XAMPP htdocs folder name.
// API is hosted in separate XAMPP folder E-Waste-API (backend/public inside it)
const API_BASE_URL = 'http://192.168.107.16/E-Waste/backend/public';
const USE_MOCK_DATA = false; // Use real backend data

// Mock data for development
const mockUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+233 20 123 4567',
  momo_number: '+233 20 123 4567',
  address: 'Accra, Ghana',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockWasteTypes: WasteType[] = [
  { id: 1, name: 'Computers & Laptops', description: 'Desktop computers, laptops, and accessories', price_per_unit: 15.00, unit: 'kg', category: 'Devices' },
  { id: 2, name: 'Mobile Phones', description: 'Smartphones, feature phones, and accessories', price_per_unit: 25.00, unit: 'kg', category: 'Devices' },
  { id: 3, name: 'TVs & Monitors', description: 'Televisions, computer monitors, and displays', price_per_unit: 12.00, unit: 'kg', category: 'Displays' },
  { id: 4, name: 'Batteries', description: 'Rechargeable batteries and power banks', price_per_unit: 8.00, unit: 'kg', category: 'Batteries' },
  { id: 5, name: 'Printers & Scanners', description: 'Printers, scanners, and office equipment', price_per_unit: 10.00, unit: 'kg', category: 'Office' },
  { id: 6, name: 'Other Electronics', description: 'Miscellaneous electronic devices', price_per_unit: 5.00, unit: 'kg', category: 'Other' },
];

const mockRequests: PickupRequest[] = [
  {
    id: 1,
    user_id: 1,
    pickup_address: '123 Main Street, Accra',
    total_amount: 45.00,
    status: 'COMPLETED',
    payment_method: 'CASH',
    items: [
      { waste_type_id: 1, quantity: 2 },
      { waste_type_id: 4, quantity: 1.875 },
    ],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    pickup_address: '456 Oak Avenue, Kumasi',
    total_amount: 32.50,
    status: 'ON_ROUTE',
    payment_method: 'CASH',
    items: [
      { waste_type_id: 2, quantity: 1.3 },
    ],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class ApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }


  private async loadToken() {
    try {
      this.token = await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private async saveToken(token: string) {
    try {
      await AsyncStorage.setItem('auth_token', token);
      this.token = token;
    } catch (error) {
      console.error('Error saving token:', error);
    }
  }

  private async clearToken() {
    try {
      await AsyncStorage.removeItem('auth_token');
      this.token = null;
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return this.handleMockRequest<T>(endpoint, options);
    }

    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const status = response.status;
      let data: any = null;
      try {
        data = await response.json();
      } catch (_) {
        // no-op: non-JSON response
      }

      if (status === 401) {
        await this.clearToken();
        return { success: false, error: 'Unauthorized' } as ApiResponse<T>;
      }

      if (!response.ok) {
        const message = data?.error || `HTTP ${status}`;
        return { success: false, error: message } as ApiResponse<T>;
      }

      return data as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      } as ApiResponse<T>;
    }
  }

  private handleMockRequest<T>(endpoint: string, options: RequestInit = {}): ApiResponse<T> {
    const method = options.method || 'GET';

    // Auth endpoints
    if (endpoint.includes('/auth/login.php') && method === 'POST') {
      const credentials = JSON.parse(options.body as string);
      if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
        this.saveToken('mock_token_123');
        return {
          success: true,
          data: {
            user: mockUser,
            token: 'mock_token_123',
          } as T,
        } as ApiResponse<T>;
      }
      return {
        success: false,
        error: 'Invalid credentials',
      } as ApiResponse<T>;
    }

    if (endpoint.includes('/auth/register.php') && method === 'POST') {
      const userData = JSON.parse(options.body as string);
      const newUser = { ...mockUser, ...userData, id: Date.now() };
      this.saveToken('mock_token_123');
      return {
        success: true,
        data: {
          user: newUser,
          token: 'mock_token_123',
        } as T,
      } as ApiResponse<T>;
    }

    if (endpoint.includes('/auth/forgot-password.php') && method === 'POST') {
      const { email } = JSON.parse(options.body as string);
      if (!email || typeof email !== 'string') {
        return { success: false, error: 'Invalid email' } as ApiResponse<T>;
      }
      return { success: true, data: { message: 'Password reset email sent' } as T } as ApiResponse<T>;
    }

    // User endpoints
    if (endpoint.includes('/user/profile.php') && method === 'GET') {
      return {
        success: true,
        data: mockUser as T,
      } as ApiResponse<T>;
    }

    if (endpoint.includes('/user/update.php') && method === 'PUT') {
      const updates = JSON.parse(options.body as string);
      const updatedUser = { ...mockUser, ...updates };
      return {
        success: true,
        data: updatedUser as T,
      } as ApiResponse<T>;
    }

    // Waste types
    if (endpoint.includes('/waste-types.php') && method === 'GET') {
      return {
        success: true,
        data: mockWasteTypes as T,
      } as ApiResponse<T>;
    }

    // Requests
    if (endpoint.includes('/requests/list.php') && method === 'GET') {
      return {
        success: true,
        data: mockRequests as T,
      } as ApiResponse<T>;
    }

    if (endpoint.includes('/requests/create.php') && method === 'POST') {
      const requestData = JSON.parse(options.body as string) as WasteSubmissionForm;
      const totalAmount = requestData.items.reduce((sum: number, item) => {
        const wt = mockWasteTypes.find(w => w.id === item.waste_type_id);
        if (!wt) return sum;
        return sum + (wt.price_per_unit * item.quantity);
      }, 0);

      const newRequest: PickupRequest = {
        id: Date.now(),
        user_id: 1,
        pickup_address: requestData.pickup_address,
        total_amount: parseFloat(totalAmount.toFixed(2)),
        status: 'PENDING',
        payment_method: requestData.payment_method,
        items: requestData.items,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockRequests.unshift(newRequest);
      return {
        success: true,
        data: newRequest as T,
      } as ApiResponse<T>;
    }

    if (endpoint.includes('/requests/details.php') && method === 'GET') {
      const requestId = parseInt(endpoint.split('=')[1]);
      const request = mockRequests.find(r => r.id === requestId);
      if (request) {
        return {
          success: true,
          data: request as T,
        } as ApiResponse<T>;
      }
      return {
        success: false,
        error: 'Request not found',
      } as ApiResponse<T>;
    }

    // Payments
    if (endpoint.includes('/payments/history.php') && method === 'GET') {
      return {
        success: true,
        data: mockRequests as T,
      } as ApiResponse<T>;
    }

    // Default response for unknown endpoints
    return {
      success: false,
      error: 'Endpoint not implemented in mock mode',
    } as ApiResponse<T>;
  }

  // Auth Methods
  async login(credentials: LoginForm): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && (response as any).data) {
      await this.saveToken((response as any).data.token);
    }

    return response as AuthResponse;
  }

  async register(userData: RegisterForm): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && (response as any).data) {
      await this.saveToken((response as any).data.token);
    }

    return response as AuthResponse;
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/forgot-password.php', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async logout(): Promise<void> {
    await this.clearToken();
  }

  // User Methods
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile.php');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/user/update.php', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Removed uploadAvatar while reverting profile picture feature

  // Waste Types
  async getWasteTypes(): Promise<ApiResponse<WasteType[]>> {
    return this.request<WasteType[]>('/waste-types.php');
  }

  // Pickup Requests
  async createRequest(requestData: WasteSubmissionForm): Promise<ApiResponse<PickupRequest>> {
    return this.request<PickupRequest>('/requests/create.php', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async getRequests(): Promise<ApiResponse<PickupRequest[]>> {
    return this.request<PickupRequest[]>('/requests/list.php');
  }

  async getRequestDetails(requestId: number): Promise<ApiResponse<PickupRequest>> {
    return this.request<PickupRequest>(`/requests/details.php?id=${requestId}`);
  }

  async cancelRequest(requestId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/requests/cancel.php?id=${requestId}`, {
      method: 'PUT',
    });
  }

  // Payments
  async getPaymentHistory(): Promise<ApiResponse<PickupRequest[]>> {
    return this.request<PickupRequest[]>('/payments/history.php');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Get current token
  getToken(): string | null {
    return this.token;
  }
}

export const apiService = new ApiService();
