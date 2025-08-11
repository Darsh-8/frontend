// API service for backend integration
import { 
  User, 
  Facility, 
  Court, 
  Booking, 
  Review, 
  Schedule,
  ApiResponse, 
  PaginatedResponse,
  SearchFilters,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AIRecommendation,
  AdminAction,
  Report
} from '../types';

// NOTE: This uses localStorage for simplicity. In a real-world app,
// consider more secure methods for storing authentication tokens.

// Base API configuration
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private token: string | null = null;
  private refreshTokenValue: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
    this.refreshTokenValue = localStorage.getItem('refreshToken');
  }

  // Helper method to set the token for future requests
  private setTokens(accessToken: string, refreshToken?: string) {
    this.token = accessToken;
    localStorage.setItem('authToken', accessToken);
    if (refreshToken) {
      this.refreshTokenValue = refreshToken;
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Helper method to clear all authentication data
  private clearTokens() {
    this.token = null;
    this.refreshTokenValue = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Core request handler with token management
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = data?.detail || data?.message || 'API request failed';
        return { success: false, message } as ApiResponse<T>;
      }

      return { success: true, data } as ApiResponse<T>;
    } catch (error: any) {
      const message = error?.message || 'Network error';
      return { success: false, message } as ApiResponse<T>;
    }
  }

  // -------------------------------------------------------------------------
  // Authentication & User APIs
  // -------------------------------------------------------------------------

  /**
   * Logs in a user, stores tokens, and fetches the user profile.
   * Your backend's CustomTokenObtainPairView accepts username (in this case, email).
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const payload = { username: credentials.email, password: credentials.password };
    
    const tokenResp = await this.request<any>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!tokenResp.success || !tokenResp.data?.access) {
      return { success: false, message: tokenResp.message || 'Invalid credentials' };
    }

    this.setTokens(tokenResp.data.access, tokenResp.data.refresh);
    
    // Fetch current user profile to store role and other details
    const userProfileResp = await this.getCurrentUser();
    if (userProfileResp.success && userProfileResp.data) {
      localStorage.setItem('user', JSON.stringify(userProfileResp.data));
      // Store user role separately for easier access
      localStorage.setItem('userRole', (userProfileResp.data as any).role);
      
      return { 
        success: true, 
        data: { 
          user: userProfileResp.data,
          token: tokenResp.data.access,
          refresh_token: tokenResp.data.refresh 
        } 
      };
    }

    return { success: false, message: 'Failed to fetch user profile' };
  }

  /**
   * Registers a new user account.
   * The backend's RegisterView sends an OTP for verification.
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const username = (userData.name?.trim().replace(/\s+/g, '').toLowerCase()) || userData.email.split('@')[0];
    const payload = { username, email: userData.email, password: userData.password, role: userData.role || 'user' };
    
    const resp = await this.request<any>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!resp.success) return { success: false, message: resp.message };
    
    // Registration uses OTP verification; do not auto-login
    return { success: true, message: 'Registered. Please verify OTP sent to your email, then log in.' };
  }

  /**
   * Verifies the OTP sent during registration or password reset.
   */
  async verifySignupOtp(identifier: string, code: string): Promise<ApiResponse<any>> {
    const payload = { identifier, code, purpose: 'signup' };
    return this.request<any>('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /**
   * Blacklists the refresh token and clears local storage.
   */
  async logout(): Promise<void> {
    const refresh = this.refreshTokenValue;
    if (refresh) {
      await this.request('/auth/token/blacklist/', {
        method: 'POST',
        body: JSON.stringify({ refresh }),
      });
    }
    this.clearTokens();
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  async refreshToken(): Promise<AuthResponse> {
    const refresh = this.refreshTokenValue;
    if (!refresh) {
      return { success: false, message: 'No refresh token available.' };
    }

    const resp = await this.request<any>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });

    if (resp.success && resp.data?.access) {
      this.setTokens(resp.data.access, resp.data.refresh);
      const user = localStorage.getItem('user');
      return { success: true, data: { user: user ? JSON.parse(user) : null, token: resp.data.access, refresh_token: resp.data.refresh } };
    }
    
    this.clearTokens();
    return { success: false, message: resp.message || 'Session expired. Please log in again.' };
  }

  /**
   * Retrieves the profile of the currently authenticated user.
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me/');
  }

  /**
   * Updates the profile of the currently authenticated user.
   */
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me/', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // -------------------------------------------------------------------------
  // Facility APIs
  // -------------------------------------------------------------------------

  /**
   * Fetches a list of facilities, with optional filtering and sorting.
   * This endpoint is role-aware in the backend, but we'll use a specific
   * endpoint for pending facilities for clarity.
   */
  async getFacilities(filters?: SearchFilters, page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    params.set('limit', limit.toString());

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => params.append(key, item.toString()));
          } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects if necessary, though not in current SearchFilters
          } else {
            params.set(key, value.toString());
          }
        }
      }
    }

    return this.request<PaginatedResponse<Facility>>(`/facilities/?${params.toString()}`);
  }

  /**
   * Fetches a single facility by its ID.
   */
  async getFacilityById(facilityId: string): Promise<ApiResponse<Facility>> {
    return this.request<Facility>(`/facilities/${facilityId}/`);
  }

  /**
   * Creates a new facility (Owner only).
   */
  async createFacility(facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    return this.request<Facility>('/facilities/', {
      method: 'POST',
      body: JSON.stringify(facilityData),
    });
  }

  /**
   * Updates an existing facility (Owner only).
   */
  async updateFacility(facilityId: string, facilityData: Partial<Facility>): Promise<ApiResponse<Facility>> {
    return this.request<Facility>(`/facilities/${facilityId}/`, {
      method: 'PUT',
      body: JSON.stringify(facilityData),
    });
  }

  /**
   * Retrieves a list of facilities awaiting admin approval.
   */
  async getPendingFacilities(): Promise<ApiResponse<PaginatedResponse<Facility>>> {
    const response = await this.request<PaginatedResponse<Facility>>('/facilities/pending/');
    return response;
  }

  // -------------------------------------------------------------------------
  // Admin & Owner Management
  // -------------------------------------------------------------------------
  
  async getAllUsers(page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response = await this.request<PaginatedResponse<User>>(`/admin/users/?page=${page}&limit=${limit}`);
    return response;
  }

  async getOwnerAnalytics(period = '30d'): Promise<ApiResponse<any>> {
    // This functionality is not directly implemented in the backend code provided.
    // It would require a dedicated endpoint, e.g., `/owner/analytics/`.
    // We will simulate a response for now.
    return {
      success: true,
      data: {
        totalRevenue: 245600,
        totalBookings: 156,
        occupancyRate: 78,
        monthlyGrowth: 15.2
      }
    };
  }

  async getAdminAnalytics(period = '30d'): Promise<ApiResponse<any>> {
    // This is also a non-implemented feature in the provided backend.
    return {
      success: true,
      data: {
        totalUsers: 2847,
        totalVenues: 247,
        totalRevenue: 8945670,
        platformRating: 4.7
      }
    };
  }
  
  async approveFacility(facilityId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/facilities/${facilityId}/approve/`, {
      method: 'PATCH',
    });
  }

  async rejectFacility(facilityId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/facilities/${facilityId}/reject/`, {
      method: 'PATCH',
    });
  }
  
  async banUser(userId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}/ban/`, {
      method: 'PATCH',
    });
  }

  async unbanUser(userId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/admin/users/${userId}/unban/`, {
      method: 'PATCH',
    });
  }

  async getAdminActions(): Promise<ApiResponse<PaginatedResponse<AdminAction>>> {
    const response = await this.request<PaginatedResponse<AdminAction>>('/admin/actions/');
    return response;
  }

  async createReport(reportData: Partial<Report>): Promise<ApiResponse<Report>> {
    return this.request<Report>('/reports/', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getReports(): Promise<ApiResponse<PaginatedResponse<Report>>> {
    const response = await this.request<PaginatedResponse<Report>>('/admin/reports/');
    return response;
  }

  async resolveReport(reportId: number): Promise<ApiResponse<Report>> {
    return this.request<Report>(`/admin/reports/${reportId}/resolve/`, {
      method: 'PATCH',
    });
  }

  // -------------------------------------------------------------------------
  // Court & Schedule APIs
  // -------------------------------------------------------------------------

  /**
   * Retrieves courts for a specific facility.
   */
  async getCourtsByFacility(facilityId: number): Promise<ApiResponse<Court[]>> {
    const response = await this.request<Court[]>(`/facilities/${facilityId}/courts/`);
    // The backend returns a list, not a paginated response, so we return the raw data.
    return response;
  }

  async createCourt(courtData: Partial<Court>): Promise<ApiResponse<Court>> {
    return this.request<Court>('/courts/', {
      method: 'POST',
      body: JSON.stringify(courtData),
    });
  }

  async getAvailableSlots(courtId: number, date: string, bucket = 30): Promise<ApiResponse<Schedule[]>> {
    return this.request<Schedule[]>(`/bookings/availability/?court=${courtId}&date=${date}&bucket=${bucket}`);
  }

  // -------------------------------------------------------------------------
  // Booking APIs
  // -------------------------------------------------------------------------

  async createBooking(bookingData: Partial<Booking>): Promise<ApiResponse<Booking>> {
    return this.request<Booking>('/bookings/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings(status?: string): Promise<ApiResponse<Booking[]>> {
    const params = status ? new URLSearchParams({ status }) : new URLSearchParams();
    return this.request<Booking[]>(`/bookings/?${params.toString()}`);
  }

  async cancelBooking(bookingId: number): Promise<ApiResponse<any>> {
    return this.request<any>(`/bookings/${bookingId}/cancel/`, {
      method: 'PATCH',
    });
  }

  // -------------------------------------------------------------------------
  // Review APIs
  // -------------------------------------------------------------------------

  async getFacilityReviews(facilityId: number): Promise<ApiResponse<Review[]>> {
    const response = await this.request<Review[]>(`/facilities/${facilityId}/reviews/`);
    // The backend returns a list of reviews for this endpoint.
    return response;
  }

  async createReview(reviewData: Partial<Review>): Promise<ApiResponse<Review>> {
    // The backend expects the facilityId in the URL path for creation
    return this.request<Review>(`/facilities/${reviewData.facility}/reviews/`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(reviewId: number, reviewData: Partial<Review>): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/reviews/${reviewId}/`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/reviews/${reviewId}/`, {
      method: 'DELETE',
    });
  }

  // -------------------------------------------------------------------------
  // Homepage/Discovery APIs
  // -------------------------------------------------------------------------

  async getFeaturedFacilities(): Promise<ApiResponse<Facility[]>> {
    const response = await this.request<Facility[]>('/facilities/?ordering=-avg_rating');
    return response;
  }

  async getTrendingFacilities(): Promise<ApiResponse<Facility[]>> {
    const response = await this.request<Facility[]>('/facilities/?ordering=-created_at');
    return response;
  }

  async getPopularSports(): Promise<ApiResponse<{ name: string; count: number }[]>> {
    // The backend does not have a dedicated endpoint for this.
    // This would require a custom view that aggregates sport counts.
    // For now, returning mock data as the backend cannot provide this information.
    return {
      success: true,
      data: [
        { name: 'Badminton', count: 120 },
        { name: 'Football', count: 95 },
        { name: 'Tennis', count: 88 },
        { name: 'Swimming', count: 72 },
        { name: 'Cricket', count: 65 },
      ]
    };
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
