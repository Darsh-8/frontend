import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOwnerFacilities, useOwnerBookings, useApiCall } from '../hooks/useApi';
import { apiService } from '../services/api';
import { 
  Building2,
  Calendar,
  TrendingUp,
  Users,
  IndianRupee,
  Star,
  MapPin,
  Clock,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Bell,
  X,
  Zap,
  Target,
  Award,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Phone,
  Mail,
  MessageCircle,
  DollarSign,
  Percent,
  ArrowUp,
  ArrowDown,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Home,
  CreditCard,
  FileText,
  Globe,
  Camera,
  Bookmark,
  Heart,
  Share2,
  Search
} from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const MyVenuesPage = ({ venues }: { venues: typeof venuesData }) => (
  <div className="space-y-8">
    {/* Search and Filters */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">My venues</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search venues..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 w-full sm:w-64"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500">
            <option>All locations</option>
            <option>Satellite</option>
            <option>Bopal</option>
            <option>Makarba</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500">
            <option>All types</option>
            <option>Multi-sport</option>
            <option>Tennis</option>
            <option>Swimming</option>
          </select>
        </div>
      </div>
    </div>

    {/* Venues Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <div key={venue.id} className="group cursor-pointer bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div className="relative">
            <img
              src={venue.image}
              alt={venue.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-3 right-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                venue.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {venue.status}
              </span>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex space-x-2">
                <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                  <BarChart3 className="w-4 h-4 text-gray-700" />
                </button>
                <button className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors">
                  <Calendar className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{venue.name}</h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{venue.rating}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-1">{venue.type}</p>
            <p className="text-gray-500 text-sm mb-4">{venue.location}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-gray-900">₹{(venue.monthlyEarnings / 1000).toFixed(0)}K</span>
                <span className="text-gray-600 text-sm"> this month</span>
              </div>
              <div className="text-sm text-gray-600">
                {venue.occupancyRate}% occupied
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BookingsPage = () => (
  <div className="space-y-8">
    {/* Booking Tabs */}
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="flex space-x-8 px-6 border-b border-gray-200">
        {[
          { id: 'all', label: 'All bookings', count: 156 },
          { id: 'upcoming', label: 'Upcoming', count: 23 },
          { id: 'today', label: 'Today', count: 5 },
          { id: 'past', label: 'Past', count: 128 },
          { id: 'cancelled', label: 'Cancelled', count: 8 }
        ].map((tab) => (
          <button
            key={tab.id}
            className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
          >
            <span>{tab.label}</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>

    {/* Booking Cards */}
    <div className="space-y-4">
      {[
        {
          id: 1,
          customerName: 'Rajesh Kumar',
          venue: 'Elite Sports Arena',
          court: 'Badminton Court 1',
          date: 'Jan 25, 2025',
          time: '6:00 PM - 7:00 PM',
          amount: '₹1,200',
          status: 'confirmed',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: 2,
          customerName: 'Priya Sharma',
          venue: 'Champions Club',
          court: 'Tennis Court 2',
          date: 'Jan 26, 2025',
          time: '7:00 AM - 8:00 AM',
          amount: '₹1,500',
          status: 'pending',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ].map((booking) => (
        <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={booking.avatar}
                alt={booking.customerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{booking.customerName}</h3>
                <p className="text-gray-600 text-sm">{booking.venue} • {booking.court}</p>
                <p className="text-gray-500 text-sm">{booking.date} • {booking.time}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900">{booking.amount}</div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AddVenuePage = () => (
  <div className="space-y-8">
    {/* Add venue form would integrate with createFacility API */}
    {/* Progress Steps */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Add new venue</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Step 1 of 5</span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div className="bg-rose-500 h-2 rounded-full" style={{ width: '20%' }}></div>
      </div>
    </div>

    {/* Venue Type Selection */}
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">What type of sports facility do you want to list?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            type: 'Multi-sport Complex',
            description: 'Multiple courts and sports facilities',
            icon: <Building2 className="w-8 h-8" />
          },
          {
            type: 'Tennis Court',
            description: 'Dedicated tennis facility',
            icon: <Target className="w-8 h-8" />
          },
          {
            type: 'Badminton Court',
            description: 'Indoor badminton facility',
            icon: <Zap className="w-8 h-8" />
          },
          {
            type: 'Swimming Pool',
            description: 'Swimming and aquatic sports',
            icon: <Waves className="w-8 h-8" />
          },
          {
            type: 'Fitness Center',
            description: 'Gym and fitness facilities',
            icon: <Dumbbell className="w-8 h-8" />
          },
          {
            type: 'Football Ground',
            description: 'Outdoor football facility',
            icon: <Award className="w-8 h-8" />
          }
        ].map((facility, index) => (
          <button
            key={index}
            className="p-6 border-2 border-gray-200 rounded-2xl hover:border-rose-500 hover:bg-rose-50 transition-all duration-200 text-left group"
            onClick={async () => {
              // TODO: Handle facility type selection and creation
              try {
                // const response = await apiService.createFacility({
                //   name: 'New Facility',
                //   description: facility.description,
                //   location: 'Location',
                //   // ... other fields
                // });
                // if (response.success) {
                //   refetchFacilities();
                //   setActiveTab('venues');
                // }
              } catch (error) {
                console.error('Failed to create facility:', error);
              }
            }}
          >
            <div className="text-rose-500 mb-4 group-hover:scale-110 transition-transform">
              {facility.icon}
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{facility.type}</h4>
            <p className="text-gray-600 text-sm">{facility.description}</p>
          </button>
        ))}
      </div>
      
      <div className="flex justify-between mt-8">
        <button className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors">
          Back
        </button>
        <button 
          onClick={() => {
            // TODO: Handle form submission
            console.log('Continue to next step');
          }}
          className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // TODO: Replace with actual API calls
  const { data: ownerFacilities, loading: facilitiesLoading, refetch: refetchFacilities } = useOwnerFacilities();
  const { data: ownerBookings, loading: bookingsLoading } = useOwnerBookings();
  const { data: analytics, loading: analyticsLoading } = useApiCall(
    () => apiService.getOwnerAnalytics(),
    []
  );
  
  const handleLogout = () => {
    logout();
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: <Sunrise className="w-5 h-5" /> };
    if (hour < 17) return { greeting: 'Good afternoon', icon: <Sun className="w-5 h-5" /> };
    if (hour < 21) return { greeting: 'Good evening', icon: <Sunset className="w-5 h-5" /> };
    return { greeting: 'Good night', icon: <Moon className="w-5 h-5" /> };
  };

  const handleTabChange = (tabId: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsLoading(false);
    }, 300);
  };

  const handleQuickAction = (action: string) => {
    setIsLoading(true);
    setTimeout(() => {
      switch (action) {
        case 'add-venue':
          setActiveTab('add-venue');
          break;
        case 'manage-bookings':
          setActiveTab('bookings');
          break;
        case 'view-messages':
          setActiveTab('messages');
          break;
        case 'update-calendar':
          setActiveTab('calendar');
          break;
        case 'manage-venues':
          setActiveTab('venues');
          break;
        default:
          break;
      }
      setIsLoading(false);
    }, 300);
  };

  // Mock owner data with Airbnb-style metrics
  const ownerData = {
    name: user?.name || 'Owner',
    totalVenues: ownerFacilities?.data?.length || 0,
    monthlyEarnings: analytics?.data?.monthlyEarnings || 245600,
    totalBookings: ownerBookings?.data?.length || 0,
    overallRating: analytics?.data?.averageRating || 4.8,
    responseRate: analytics?.data?.responseRate || 95,
    occupancyRate: analytics?.data?.occupancyRate || 78,
    nextPayout: analytics?.data?.nextPayout || 89400,
    payoutDate: analytics?.data?.payoutDate || '2025-01-30'
  };

  // Convert API data to display format
  const venuesData = ownerFacilities?.data?.map(facility => ({
    id: facility.facility_id,
    name: facility.name,
    location: facility.location,
    image: facility.images?.[0] || 'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=400',
    rating: facility.rating || 4.5,
    monthlyEarnings: 67500, // TODO: Calculate from bookings
    occupancyRate: 85, // TODO: Calculate from schedules
    status: facility.status === 'approved' ? 'active' : facility.status,
    bookingsThisMonth: 45, // TODO: Calculate from bookings
    type: facility.courts?.[0]?.sport_type || 'Multi-sport facility'
  })) || [];

  const venues = venuesData;


  const DashboardOverview = () => {
    const { greeting, icon } = getTimeBasedGreeting();
    
    return (
      <div className="space-y-8">
        {/* Airbnb-style Header */}
        <div className="bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {icon}
              <h1 className="text-3xl font-semibold text-gray-900">
                {greeting}, {ownerData.name}!
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MessageCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-lg">Here's what's happening with your venues today.</p>
        </div>

        {/* Airbnb-style Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+12%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{(ownerData.monthlyEarnings / 1000).toFixed(0)}K
            </div>
            <div className="text-gray-600 text-sm">Total earnings this month</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1 text-blue-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+8%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{ownerData.totalBookings}</div>
            <div className="text-gray-600 text-sm">Bookings this week</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-yellow-600 text-sm">Excellent</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{ownerData.overallRating}</div>
            <div className="text-gray-600 text-sm">Overall rating</div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-purple-600 text-sm">Great</div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{ownerData.responseRate}%</div>
            <div className="text-gray-600 text-sm">Response rate</div>
          </div>
        </div>

        {/* Quick Actions - Airbnb Style */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => handleQuickAction('add-venue')}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-rose-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Add new venue</div>
                <div className="text-sm text-gray-600">List a new sports facility</div>
              </div>
            </button>

            <button 
              onClick={() => handleQuickAction('manage-bookings')}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Manage bookings</div>
                <div className="text-sm text-gray-600">View and update reservations</div>
              </div>
            </button>

            <button 
              onClick={() => handleQuickAction('view-messages')}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">View messages</div>
                <div className="text-sm text-gray-600">Chat with customers</div>
              </div>
            </button>

            <button 
              onClick={() => handleQuickAction('update-calendar')}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Update calendar</div>
                <div className="text-sm text-gray-600">Manage availability</div>
              </div>
            </button>
          </div>
        </div>

        {/* Your Venues - Airbnb Listings Style */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your venues</h2>
            <button 
              onClick={() => setActiveTab('venues')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              View all
            </button>
          </div>
          {facilitiesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : venues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {venues.map((venue) => (
              <div key={venue.id} className="group cursor-pointer">
                <div className="relative mb-4">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-48 object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venue.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {venue.status}
                    </span>
                  </div>
                  <button className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{venue.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm">{venue.type}</p>
                  <p className="text-gray-500 text-sm">{venue.location}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="font-semibold text-gray-900">₹{(venue.monthlyEarnings / 1000).toFixed(0)}K</span>
                      <span className="text-gray-600 text-sm"> this month</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {venue.occupancyRate}% occupied
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
            <div className="text-center py-8">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No venues yet</h3>
              <p className="text-gray-600 mb-4">Add your first venue to get started</p>
              <button 
                onClick={() => setActiveTab('add-venue')}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Venue
              </button>
            </div>
          )}
        </div>


        {/* Next Payout - Airbnb Style */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Next payout</h3>
              <p className="text-gray-600 mb-4">Your earnings will be sent on {ownerData.payoutDate}</p>
              <div className="text-3xl font-bold text-green-600">₹{(ownerData.nextPayout / 1000).toFixed(0)}K</div>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const BookingsPage = () => (
    <div className="space-y-8">
      {bookingsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
      <>
      {/* Booking Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="flex space-x-8 px-6 border-b border-gray-200">
          {[
            { id: 'all', label: 'All bookings', count: 156 },
            { id: 'upcoming', label: 'Upcoming', count: 23 },
            { id: 'today', label: 'Today', count: 5 },
            { id: 'past', label: 'Past', count: 128 },
            { id: 'cancelled', label: 'Cancelled', count: 8 }
          ].map((tab) => (
            <button
              key={tab.id}
              className="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm"
            >
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Booking Cards */}
      <div className="space-y-4">
        {[
          {
            id: 1,
            customerName: 'Rajesh Kumar',
            venue: 'Elite Sports Arena',
            court: 'Badminton Court 1',
            date: 'Jan 25, 2025',
            time: '6:00 PM - 7:00 PM',
            amount: '₹1,200',
            status: 'confirmed',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'
          },
          {
            id: 2,
            customerName: 'Priya Sharma',
            venue: 'Champions Club',
            court: 'Tennis Court 2',
            date: 'Jan 26, 2025',
            time: '7:00 AM - 8:00 AM',
            amount: '₹1,500',
            status: 'pending',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100'
          }
        ].map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={booking.avatar}
                  alt={booking.customerName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{booking.customerName}</h3>
                  <p className="text-gray-600 text-sm">{booking.venue} • {booking.court}</p>
                  <p className="text-gray-500 text-sm">{booking.date} • {booking.time}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{booking.amount}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </>
      )}
    </div>
  );

  const EarningsPage = () => (
    <div className="space-y-8">
      {analyticsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
      <>
      {/* Earnings Overview */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Earnings overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{(ownerData.monthlyEarnings / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Gross earnings</div>
            <div className="text-green-600 text-sm mt-1">+15% from last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{((ownerData.monthlyEarnings * 0.1) / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Platform fees</div>
            <div className="text-gray-500 text-sm mt-1">10% service fee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{((ownerData.monthlyEarnings * 0.9) / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Net earnings</div>
            <div className="text-green-600 text-sm mt-1">After fees</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">₹{(ownerData.nextPayout / 1000).toFixed(0)}K</div>
            <div className="text-gray-600">Next payout</div>
            <div className="text-blue-600 text-sm mt-1">{ownerData.payoutDate}</div>
          </div>
        </div>
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Earnings trend</h3>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Last 30 days</button>
            <button className="px-4 py-2 text-gray-600 rounded-lg text-sm hover:bg-gray-100">Last 3 months</button>
            <button className="px-4 py-2 text-gray-600 rounded-lg text-sm hover:bg-gray-100">Year to date</button>
          </div>
        </div>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Earnings chart will be displayed here</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );

  const AnalyticsPage = () => (
    <div className="space-y-8">
      {analyticsLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
      <>
      {/* Analytics Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Performance insights</h2>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">Last 30 days</button>
          <button className="px-4 py-2 text-gray-600 rounded-lg text-sm hover:bg-gray-100">Last 3 months</button>
          <button className="px-4 py-2 text-gray-600 rounded-lg text-sm hover:bg-gray-100">Year to date</button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Occupancy rate</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{ownerData.occupancyRate}%</div>
          <div className="text-green-600 text-sm">+5% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Average booking value</h3>
            <IndianRupee className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">₹1,580</div>
          <div className="text-blue-600 text-sm">+8% from last month</div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Customer satisfaction</h3>
            <Star className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">4.8</div>
          <div className="text-yellow-600 text-sm">Excellent rating</div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking trends</h3>
        <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Analytics charts will be displayed here</p>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );

  const ProfileSettings = () => (
    <div className="bg-white rounded-2xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">Account settings</h2>
        <p className="text-gray-600 mt-1">Manage your business profile and preferences</p>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                defaultValue={user?.name || "Sports Venue Management"}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                defaultValue={user?.email || "owner@quickcourt.com"}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                defaultValue="+91 98765 43210"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
              <input
                type="text"
                defaultValue="Ahmedabad, Gujarat"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Save changes
            </button>
          </div>
          
          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Airbnb-style Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 mb-8 overflow-hidden">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Dashboard', icon: Home },
              { id: 'venues', label: 'My Venues', icon: Building2 },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'analytics', label: 'Insights', icon: BarChart3 },
              { id: 'earnings', label: 'Earnings', icon: CreditCard },
              { id: 'settings', label: 'Account', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 text-gray-900'
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
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'overview' && <DashboardOverview />}
            {activeTab === 'venues' && <MyVenuesPage venues={venues} />}
            {activeTab === 'bookings' && <BookingsPage />}
            {activeTab === 'add-venue' && <AddVenuePage />}
            {activeTab === 'analytics' && <AnalyticsPage />}
            {activeTab === 'earnings' && <EarningsPage />}
            {activeTab === 'settings' && <ProfileSettings />}
          </>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;