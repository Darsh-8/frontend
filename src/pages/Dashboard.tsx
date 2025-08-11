import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Calendar,
  MapPin,
  Star,
  Clock,
  Users,
  TrendingUp,
  Heart,
  Award,
  Zap,
  ChevronRight,
  ChevronLeft,
  QrCode,
  Navigation,
  UserPlus,
  RefreshCw,
  X,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  Eye,
  Filter,
  Search,
  Download,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  Settings,
  Bell,
  CreditCard,
  Shield,
  LogOut,
  Edit,
  Camera,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Gift,
  Target,
  Trophy,
  Activity
} from 'lucide-react';
import { apiService } from '../api';
import { User, Booking, Facility } from '../types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [bookingFilter, setBookingFilter] = useState('all');
  const [profileSection, setProfileSection] = useState('personal');
  const upcomingRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);
  
  // State for fetched data
  const [user, setUser] = useState<User | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [featuredFacilities, setFeaturedFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const userRole = localStorage.getItem('userRole') || 'user';
  
  const handleLogout = async () => {
    await apiService.logout();
    navigate('/login');
  };

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const userResp = await apiService.getCurrentUser();
        if (userResp.success && userResp.data) {
          setUser(userResp.data);
        }

        const upcomingResp = await apiService.getUserBookings('confirmed');
        if (upcomingResp.success && upcomingResp.data) {
          setUpcomingBookings(upcomingResp.data);
        }

        const pastResp = await apiService.getUserBookings('completed');
        if (pastResp.success && pastResp.data) {
          setPastBookings(pastResp.data);
        }
        
        const featuredResp = await apiService.getFeaturedFacilities();
        if (featuredResp.success && featuredResp.data) {
            setFeaturedFacilities(featuredResp.data);
        }

      } catch (err) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Mock weather data - can be replaced by a weather API call if implemented
  const weather = {
    temperature: 28,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12
  };
  
  // AI Recommendations - currently mock data as API is not implemented
  const recommendations = [
    {
      id: 1,
      venue: 'Premium Sports Center',
      sport: 'Badminton',
      image: 'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      price: 1400,
      distance: '2.1 km',
      reason: 'Based on your badminton history'
    },
    {
      id: 2,
      venue: 'Royal Tennis Academy',
      sport: 'Tennis',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      price: 1600,
      distance: '3.5 km',
      reason: 'Popular in your area'
    },
    {
      id: 3,
      venue: 'Fitness First Pool',
      sport: 'Swimming',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      price: 700,
      distance: '1.8 km',
      reason: 'Great for morning workouts'
    }
  ];

  // Mock favorite venues - can be replaced with an API call
  const favoriteVenues = [
    {
      id: 1,
      name: 'Elite Sports Arena',
      image: 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      visits: 12,
      lastVisit: '2025-01-20',
      sports: ['Badminton', 'Tennis'],
      priceRange: '₹800-1500'
    },
    {
      id: 2,
      name: 'Champions Club',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      visits: 8,
      lastVisit: '2025-01-15',
      sports: ['Tennis', 'Swimming'],
      priceRange: '₹1200-2000'
    }
  ];

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-blue-500" />;
      default:
        return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const scrollHorizontal = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const DashboardOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.username}! 👋</h1>
            <p className="text-rose-100 mb-4">Ready to book your next sports session?</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{'Your location'}</span>
              </div>
              <div className="flex items-center space-x-1">
                {getWeatherIcon(weather.condition)}
                <span>{weather.temperature}°C</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">1250</div> {/* Mocked Loyalty Points */}
            <div className="text-rose-100 text-sm">Loyalty Points</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{upcomingBookings.length + pastBookings.length}</div>
              <div className="text-sm text-gray-600">My Bookings Made</div>
              <div className="text-xs text-green-600 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>+12% this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">₹28,500</div>
              <div className="text-sm text-gray-600">Total Spent on Bookings</div>
              <div className="text-xs text-green-600">
                Saved ₹2,400 with offers
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Saved Favorite Venues</div>
              <div className="text-xs text-gray-500">
                Across 5 different sports
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">My Average Rating Given</div>
              <div className="text-xs text-gray-500">From {pastBookings.length} completed bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              My Upcoming Bookings
            </h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => scrollHorizontal(upcomingRef, 'left')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollHorizontal(upcomingRef, 'right')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div 
            ref={upcomingRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex-shrink-0 w-80 bg-gray-50 rounded-xl p-4">
                <div className="relative mb-4">
                  <img
                    src="https://placehold.co/400x200" // Placeholder as booking doesn't have image
                    alt={booking.court.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-white text-xs">
                    {booking.court.sport_type}
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{booking.court.facility.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(booking.date).toLocaleDateString()} at {booking.start_time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.court.facility.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Number of players (mock)</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                        setShowQRCode(true);
                        setSelectedBooking(booking);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </button>
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Navigation className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              <p className="text-sm text-gray-600">AI-powered suggestions based on your preferences</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => scrollHorizontal(recommendationsRef, 'left')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scrollHorizontal(recommendationsRef, 'right')}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div 
            ref={recommendationsRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {recommendations.map((rec) => (
              <div key={rec.id} className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                <img
                  src={rec.image}
                  alt={rec.venue}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-gray-900 mb-2">{rec.venue}</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{rec.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">{rec.distance}</div>
                </div>
                <div className="text-sm text-gray-600 mb-3">{rec.reason}</div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">₹{rec.price}/hr</span>
                  <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/search" className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-rose-200 transition-colors">
              <Search className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Book Sports Venues</h3>
            <p className="text-sm text-gray-600">Find and book courts near you</p>
          </Link>
        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Find Playing Partners
          </h3>
          <p className="text-sm text-gray-600">
            Connect with other players
          </p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
            <RefreshCw className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Quick Rebook
          </h3>
          <p className="text-sm text-gray-600">
            Repeat favorite bookings
          </p>
        </button>

        <button className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow group text-left">
          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors">
            <Gift className="w-6 h-6 text-pink-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            Refer & Earn
          </h3>
          <p className="text-sm text-gray-600">
            Earn rewards for referrals
          </p>
        </button>
      </div>
    </div>
  );

  const MyBookings = () => {
    const [bookingTab, setBookingTab] = useState('upcoming');
    const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);

    const allBookings = [...upcomingBookings, ...pastBookings];
    const filteredBookings = allBookings.filter(booking => {
      if (bookingTab === 'upcoming') return ['confirmed', 'pending'].includes(booking.status);
      if (bookingTab === 'past') return booking.status === 'completed';
      if (bookingTab === 'cancelled') return booking.status === 'cancelled';
      return true;
    });

    return (
      <div className="space-y-6">
        {/* Booking Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
                { id: 'past', label: 'Past', count: pastBookings.length },
                { id: 'cancelled', label: 'Cancelled', count: 0 },
                { id: 'requests', label: 'Requests', count: 1 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBookingTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    bookingTab === tab.id
                      ? 'border-rose-500 text-rose-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                <option>All Sports</option>
                <option>Badminton</option>
                <option>Tennis</option>
                <option>Football</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                <option>All Venues</option>
                <option>Elite Sports Arena</option>
                <option>Champions Club</option>
              </select>
              <input
                type="date"
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Booking List */}
          <div className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src="https://placehold.co/400x200"
                    alt={booking.court.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{booking.court.facility.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{booking.start_time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.court.facility.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-900">₹{booking.total_price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {booking.status === 'completed' && (
                      <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                        Rate & Review
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <>
                        <button 
                          onClick={() => {
                            setShowQRCode(true);
                            setSelectedBooking(booking);
                          }}
                          className="px-3 py-1 text-sm bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors"
                        >
                          QR Code
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          Reschedule
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setSelectedBookingDetail(booking)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Favorites = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Favorite Venues</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Search favorites..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {featuredFacilities.map((venue) => (
            <div key={venue.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex space-x-4">
                <img
                  src="https://placehold.co/400x200" // Placeholder
                  alt={venue.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                    <button className="text-rose-500 hover:text-rose-600">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>{venue.avg_rating} rating</span>
                    </div>
                    <div>{venue.location}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 bg-rose-500 text-white rounded-lg text-sm font-medium transition-colors">
                      Book
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || "https://placehold.co/100x100"}
                alt={user?.username}
                className="w-20 h-20 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white hover:bg-rose-600 transition-colors">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">Member since {user?.date_joined ? new Date(user.date_joined).getFullYear() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'personal', label: 'Personal Info' },
              { id: 'preferences', label: 'Preferences' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'security', label: 'Security' },
              { id: 'billing', label: 'Billing' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProfileSection(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  profileSection === tab.id
                    ? 'border-rose-500 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {profileSection === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.first_name}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.last_name}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    defaultValue={user?.location}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-50"
                  />
                </div>
              </div>
              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button className="px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition-colors">
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
          )}

          {profileSection === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password & Security</h3>
                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Change Password</div>
                        <div className="text-sm text-gray-600">Last changed 3 months ago</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-600">Add an extra layer of security</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-600">Disabled</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  };

  // ... (rest of the component logic)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'bookings', label: userRole === 'owner' ? 'Customer Bookings' : userRole === 'admin' ? 'All Platform Bookings' : 'My Bookings', icon: Calendar },
              { id: 'favorites', label: userRole === 'owner' ? 'My Venues' : userRole === 'admin' ? 'All Platform Venues' : 'Favorite Venues', icon: Heart },
              { id: 'personal', label: 'Personal Info', icon: Settings },
              { id: 'payments', label: 'Payment Methods', icon: CreditCard },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
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
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'bookings' && <MyBookings />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'personal' && <Profile />}

        {/* QR Code Modal */}
        {showQRCode && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Booking QR Code</h3>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{selectedBooking.court.facility.name}</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Show this QR code at the venue for check-in
                </p>
                <div className="text-xs text-gray-500 mb-6">
                  Check-in time: {selectedBooking.start_time}
                </div>
                <button className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg transition-colors">
                  Save to Photos
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
