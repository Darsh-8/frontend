// TypeScript interfaces based on your database schema

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string | null;
  created_at: string;
  status: 'active' | 'banned';
  is_email_verified?: boolean;
}

export interface Facility {
  id: number;
  owner?: number;
  name: string;
  description?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  amenities?: Amenity[];
  courts?: Court[];
  avg_rating?: number;
  review_count?: number;
  images?: string[];
}

export interface Amenity {
  amenity_id: number;
  name: string;
}

export interface Court {
  id: number;
  facility: number;
  name: string;
  sport_type: string;
  price_per_hour: number;
  operating_start: string;
  operating_end: string;
}

export interface Schedule {
  id: number;
  court: number;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface BlockedSlot {
  id: number;
  court: number;
  date: string;
  start_time: string;
  end_time: string;
  reason: string;
}

export interface Booking {
  id: number;
  user: number | User;
  court: number | Court;
  date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  method: string;
  status: 'pending' | 'paid' | 'failed';
}

export interface Review {
  id: number;
  facility: number;
  user: number | User;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface DynamicPricing {
  pricing_id: number;
  court_id: number;
  date: string;
  base_price: number;
  adjusted_price: number;
  reason: string;
}

export interface AIRecommendation {
  rec_id: number;
  user_id: number;
  recommended_facility_id: number;
  generated_at: string;
  reason: string;
  // Populated fields
  facility?: Facility;
}

export interface Report {
  report_id: number;
  reporter_id: number;
  target_type: 'facility' | 'user';
  target_id: number;
  reason: string;
  status: 'open' | 'resolved';
}

export interface AdminAction {
  action_id: number;
  admin_id: number;
  action_type: string;
  details: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Search and Filter types
export interface SearchFilters {
  sport_type?: string;
  location?: string;
  date?: string;
  time_start?: string;
  time_end?: string;
  price_min?: number;
  price_max?: number;
  amenities?: number[];
  rating_min?: number;
  radius?: number;
  sort_by?: 'price' | 'rating' | 'distance' | 'popularity';
  sort_order?: 'asc' | 'desc';
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'owner';
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
    refresh_token?: string;
  };
  message?: string;
}