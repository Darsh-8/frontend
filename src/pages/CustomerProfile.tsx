import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserBookings, useApiCall } from '../hooks/useApi';
import { apiService } from '../services/api';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Heart,
  CreditCard,
  Bell,
  Shield,
  Settings,
  LogOut,
  Edit,
  Camera,
  Eye,
  ChevronRight,
  Clock,
  TrendingUp,
  Award,
  Gift,
  IndianRupee,
  Trash2,
  Plus
} from 'lucide-react';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  
  // TODO: API Integration - These will fetch real data when backend is ready
  const { data: upcomingBookings, loading: bookingsLoading } = useUserBookings('confirmed');
  const { data: favoriteVenues, loading: favoritesLoading } = useApiCall(
    () => apiService.getCurrentUser(), // This would be a separate favorites endpoint
    []
  );
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // User data from auth context
  const userData = {
    name: user?.name || 'User',
    email: user?.email || '',
    phone: '+91 98765 43210', // TODO: Add to user model
    location: 'Ahmedabad, Gujarat', // TODO: Add to user model
    avatar: user?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    memberSince: new Date(user?.created_at || '').getFullYear().toString(),
    totalBookings: 47, // TODO: Calculate from bookings
    totalSpent: 28500, // TODO: Calculate from bookings
    favoriteVenues: 12, // TODO: Calculate from favorites
    averageRating: 4.8, // TODO: Calculate from reviews
    loyaltyPoints: 1250 // TODO: Add loyalty system
  };

  // Convert API bookings to display format
  const displayBookings = upcomingBookings?.data?.map(booking => ({
    id: booking.booking_id,
    venue: booking.facility?.name || 'Unknown Venue',
    sport: booking.court?.sport_type || 'Unknown Sport',
    date: booking.date,
    time: booking.start_time,
    image: booking.facility?.images?.[0] || 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=400',
    location: booking.facility?.location || 'Unknown Location',
    price: booking.total_price
  })) || [];

  // TODO: Replace with actual favorites data
  const displayFavorites = [
    // Mock data until favorites API is ready
  ];

  const ProfileOverview = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
            />
            <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-gray-100 transition-colors">
              <Camera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-rose-100">{userData.email}</p>
            <p className="text-rose-200 text-sm">Member since {userData.memberSince}</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{userData.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">₹{userData.totalSpent.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{userData.favoriteVenues}</div>
              <div className="text-sm text-gray-600">Favorite Venues</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{userData.memberSince}</div>
              <div className="text-sm text-gray-600">Member Since</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Bookings</h2>
            <button 
              onClick={() => navigate('/profile/bookings')}
              className="text-rose-500 hover:text-rose-600 font-medium text-sm flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : displayBookings.length > 0 ? (
            <div className="space-y-4">
              {displayBookings.map((booking) => (
                <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={booking.image}
                    alt={booking.venue}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{booking.venue}</h3>
                    <div className="text-sm text-gray-600">
                      {booking.sport} • {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </div>
                    <div className="text-sm text-gray-500">{booking.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">₹{booking.price}</div>
                    <button className="text-sm text-rose-500 hover:text-rose-600">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Bookings</h3>
              <p className="text-gray-600 mb-4">Book your next sports session to get started!</p>
              <button 
                onClick={() => navigate('/search')}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Find Venues
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Venues */}
      {displayFavorites.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Favorite Venues</h2>
              <button className="text-rose-500 hover:text-rose-600 font-medium text-sm flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayFavorites.map((venue) => (
                <div key={venue.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{venue.rating}</span>
                      <span>•</span>
                      <span>{venue.visits} visits</span>
                    </div>
                    <div className="text-sm text-gray-500">{venue.sports.join(', ')}</div>
                  </div>
                  <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const PersonalInfo = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 text-rose-500 hover:text-rose-600 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'Cancel' : 'Edit'}</span>
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={userData.name}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={userData.email}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue={userData.phone}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              defaultValue={userData.location}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
            />
          </div>
        </div>
        {isEditing && (
          <div className="flex justify-end mt-6">
            <button 
              onClick={async () => {
                // TODO: Implement profile update API call
                try {
                  // const response = await apiService.updateProfile(updatedData);
                  // updateUser(response.data);
                  setIsEditing(false);
                } catch (error) {
                  console.error('Failed to update profile:', error);
                }
              }}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
        
        {/* Logout Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'bookings', label: 'My Bookings', icon: Calendar },
              { id: 'favorites', label: 'Favorite Venues', icon: Heart },
              { id: 'personal', label: 'Personal Info', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeSection === 'overview' && <ProfileOverview />}
        {activeSection === 'personal' && <PersonalInfo />}
        {activeSection === 'bookings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Bookings</h3>
            <p className="text-gray-600 mb-6">Manage all your venue bookings in one place</p>
            <button 
              onClick={() => navigate('/search')}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Book Your First Venue
            </button>
          </div>
        )}
        {(activeSection === 'favorites' || activeSection === 'payments' || activeSection === 'notifications') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;