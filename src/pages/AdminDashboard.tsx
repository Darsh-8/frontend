import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePaginatedApi, useApiCall } from '../hooks/useApi';
import { apiService } from '../services/api';
import { 
  Shield,
  Users,
  Building2,
  TrendingUp,
  IndianRupee,
  Star,
  Globe,
  Activity,
  Settings,
  LogOut,
  BarChart3,
  PieChart,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Search,
  Plus,
  Clock,
  Zap,
  Database,
  Wifi,
  AlertCircle,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Calendar,
  MessageSquare,
  FileText,
  Bell,
  RefreshCw,
  Monitor,
  Cpu,
  HardDrive,
  Network,
  Lock,
  Unlock,
  Ban,
  Mail,
  Phone,
  MapPin,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Image,
  Video,
  Hash,
  Target,
  Percent,
  DollarSign,
  CreditCard,
  Briefcase,
  Award,
  Bookmark,
  Share2,
  ExternalLink,
  Copy,
  Archive,
  Trash,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Minus,
  Play,
  Pause,
  RotateCcw,
  UserPlus,
  UserMinus,
  UserX,
  Layers,
  Gauge,
  LineChart,
  Map,
  Headphones,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Laptop,
  Tablet,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Server
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('operational');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedUserFilter, setSelectedUserFilter] = useState('all');
  const [selectedVenueStatus, setSelectedVenueStatus] = useState('pending');
  const [onlineUsers, setOnlineUsers] = useState(1247);
  const [activeSessions, setActiveSessions] = useState(892);
  
  // TODO: Replace with actual API calls
  const { data: allUsers, loading: usersLoading, pagination: usersPagination, goToPage: goToUsersPage } = usePaginatedApi(
    (page, limit) => apiService.getAllUsers(page, limit),
    1,
    20
  );
  
  const { data: allBookings, loading: bookingsLoading } = usePaginatedApi(
    (page, limit) => apiService.getAllBookings(page, limit),
    1,
    20
  );
  
  const { data: adminAnalytics, loading: analyticsLoading } = useApiCall(
    () => apiService.getAdminAnalytics(),
    []
  );
  
  const handleLogout = () => {
    logout();
  };

  // Update time and simulate real-time data
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time data updates
      setOnlineUsers(prev => prev + Math.floor(Math.random() * 10) - 5);
      setActiveSessions(prev => prev + Math.floor(Math.random() * 8) - 4);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { greeting: 'Good morning', icon: <Sunrise className="w-5 h-5" /> };
    if (hour < 17) return { greeting: 'Good afternoon', icon: <Sun className="w-5 h-5" /> };
    if (hour < 21) return { greeting: 'Good evening', icon: <Sunset className="w-5 h-5" /> };
    return { greeting: 'Good night', icon: <Moon className="w-5 h-5" /> };
  };

  // Comprehensive admin data with real-time metrics
  const adminData = {
    name: user?.name || 'System Administrator',
    email: user?.email || 'admin@quickcourt.com',
    platformMetrics: {
      totalUsers: adminAnalytics?.data?.totalUsers || 28470,
      newUsersToday: adminAnalytics?.data?.newUsersToday || 156,
      monthlyRevenue: adminAnalytics?.data?.monthlyRevenue || 89456700,
      yearlyRevenue: adminAnalytics?.data?.yearlyRevenue || 1073480400,
      revenueGrowth: adminAnalytics?.data?.revenueGrowth || 28.5,
      activeVenues: adminAnalytics?.data?.activeVenues || 2470,
      newVenuesToday: adminAnalytics?.data?.newVenuesToday || 12,
      dailyBookings: adminAnalytics?.data?.dailyBookings || 1847,
      yesterdayBookings: adminAnalytics?.data?.yesterdayBookings || 1623,
      platformUptime: adminAnalytics?.data?.platformUptime || 99.97,
      uptimeStreak: adminAnalytics?.data?.uptimeStreak || 127,
      avgResponseTime: adminAnalytics?.data?.avgResponseTime || 145,
      systemHealth: adminAnalytics?.data?.systemHealth || 94
    },
    systemHealth: {
      serverStatus: 'healthy',
      responseTime: 145,
      cpuUsage: 67,
      memoryUsage: 72,
      storageUsage: 45,
      activeConnections: 1247,
      apiHealth: 98,
      databasePerformance: 95,
      networkLatency: 23
    },
    criticalAlerts: [
      {
        id: 1,
        type: 'security',
        title: 'Multiple failed login attempts detected',
        description: 'Unusual login activity from IP 192.168.1.100 - 15 failed attempts in 5 minutes',
        priority: 'high',
        timestamp: '5 minutes ago',
        status: 'active',
        affectedUsers: 1,
        location: 'Mumbai, India'
      },
      {
        id: 2,
        type: 'payment',
        title: 'Payment gateway latency spike',
        description: 'Stripe API response times increased by 200% - affecting checkout process',
        priority: 'medium',
        timestamp: '15 minutes ago',
        status: 'investigating',
        affectedTransactions: 23,
        impact: 'Medium'
      }
    ],
    recentActivity: [
      {
        id: 1,
        type: 'user_registration',
        title: 'New user registered',
        description: 'Rajesh Kumar from Ahmedabad joined the platform',
        timestamp: '2 minutes ago',
        user: 'Rajesh Kumar',
        location: 'Ahmedabad, Gujarat'
      },
      {
        id: 2,
        type: 'venue_booking',
        title: 'Venue booking completed',
        description: 'Elite Sports Arena - Badminton Court 1 booked for ₹1,200',
        timestamp: '5 minutes ago',
        venue: 'Elite Sports Arena',
        amount: 1200
      }
    ]
  };

  // Comprehensive user data with detailed profiles
  const userData = allUsers?.map(user => ({
    id: user.user_id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    joinDate: new Date(user.created_at).toLocaleDateString(),
    lastActive: '2 hours ago', // TODO: Add last_active to user model
    status: user.status,
    bookings: 12, // TODO: Calculate from bookings
    totalSpent: 15600, // TODO: Calculate from bookings
    location: 'Ahmedabad, Gujarat', // TODO: Add location to user model
    verified: true, // TODO: Add verification status
    engagementLevel: 'high', // TODO: Calculate engagement
    lifetimeValue: 25000, // TODO: Calculate LTV
    riskScore: 'low' // TODO: Calculate risk score
  })) || [];

  const DashboardOverview = () => {
    const { greeting, icon } = getTimeBasedGreeting();
    
    return (
      <div className="space-y-8">
        {analyticsLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
        {/* Platform Command Center Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {icon}
              <div>
                <h1 className="text-2xl font-bold">{greeting}, {adminData.name}!</h1>
                <p className="text-blue-100">Platform Command Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">System Healthy</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Online Users</div>
                <div className="text-xl font-bold">{onlineUsers.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span className="text-sm">Active Sessions</span>
              </div>
              <div className="text-2xl font-bold mt-1">{activeSessions}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Server className="w-5 h-5" />
                <span className="text-sm">Uptime</span>
              </div>
              <div className="text-2xl font-bold mt-1">{adminData.platformMetrics.platformUptime}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Response Time</span>
              </div>
              <div className="text-2xl font-bold mt-1">{adminData.systemHealth.responseTime}ms</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">System Health</span>
              </div>
              <div className="text-2xl font-bold mt-1">{adminData.platformMetrics.systemHealth}%</div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex items-center space-x-1 text-green-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+{adminData.platformMetrics.revenueGrowth}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{(adminData.platformMetrics.monthlyRevenue / 10000000).toFixed(1)}Cr
            </div>
            <div className="text-gray-600 text-sm">Monthly Revenue</div>
            <div className="text-xs text-gray-500 mt-1">
              ₹{(adminData.platformMetrics.yearlyRevenue / 10000000).toFixed(1)}Cr yearly
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1 text-blue-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+{adminData.platformMetrics.newUsersToday}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {adminData.platformMetrics.totalUsers.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Total Users</div>
            <div className="text-xs text-gray-500 mt-1">
              {adminData.platformMetrics.newUsersToday} new today
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex items-center space-x-1 text-purple-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+{adminData.platformMetrics.newVenuesToday}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {adminData.platformMetrics.activeVenues.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Active Venues</div>
            <div className="text-xs text-gray-500 mt-1">
              {adminData.platformMetrics.newVenuesToday} new today
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex items-center space-x-1 text-orange-600 text-sm">
                <ArrowUp className="w-4 h-4" />
                <span>+{adminData.platformMetrics.dailyBookings - adminData.platformMetrics.yesterdayBookings}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {adminData.platformMetrics.dailyBookings.toLocaleString()}
            </div>
            <div className="text-gray-600 text-sm">Daily Bookings</div>
            <div className="text-xs text-gray-500 mt-1">
              vs {adminData.platformMetrics.yesterdayBookings} yesterday
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Critical Alerts</h2>
              <div className="flex items-center space-x-2">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                  {adminData.criticalAlerts.filter(alert => alert.priority === 'high').length} High Priority
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {adminData.criticalAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    alert.priority === 'high' ? 'bg-red-100' : 
                    alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'security' && <Shield className={`w-5 h-5 ${
                      alert.priority === 'high' ? 'text-red-600' : 
                      alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />}
                    {alert.type === 'payment' && <CreditCard className={`w-5 h-5 ${
                      alert.priority === 'high' ? 'text-red-600' : 
                      alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          alert.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.priority.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {alert.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                        )}
                        {alert.affectedUsers && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{alert.affectedUsers} users affected</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-200 transition-colors">
                          Investigate
                        </button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Platform Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {adminData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'user_registration' ? 'bg-green-100' :
                    activity.type === 'venue_booking' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'user_registration' && <UserPlus className="w-5 h-5 text-green-600" />}
                    {activity.type === 'venue_booking' && <Calendar className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                    {activity.location && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{activity.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    );
  };

  const UserManagement = () => (
    <div className="space-y-8">
      {usersLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedUserFilter}
                onChange={(e) => setSelectedUserFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="customers">Customers</option>
                <option value="owners">Venue Owners</option>
                <option value="admins">Administrators</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add User</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {userData.map((user) => (
              <div key={user.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    {user.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'customer' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {user.email} • {user.location}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Joined {user.joinDate} • Last active {user.lastActive}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user.role === 'customer' ? `₹${user.totalSpent?.toLocaleString()}` : 
                     user.role === 'owner' ? `₹${user.monthlyEarnings?.toLocaleString()}/mo` : 'Admin'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {user.role === 'customer' ? `${user.bookings} bookings` :
                     user.role === 'owner' ? `${user.venues} venues` : 'System Access'}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );

  const VenueApprovals = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Venue Approvals</h2>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedVenueStatus}
                onChange={(e) => setSelectedVenueStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pending">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="changes">Needs Changes</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <CheckCircle className="w-4 h-4" />
                <span>Bulk Approve</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Venue Approval System</h3>
            <p className="text-gray-600">Comprehensive venue review and approval workflow will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ContentModeration = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Content Moderation</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Content Moderation System</h3>
            <p className="text-gray-600">AI-powered content review and moderation tools will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const PlatformAnalytics = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Platform Analytics</h2>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics Dashboard</h3>
            <p className="text-gray-600">Comprehensive business intelligence and analytics will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const SystemSettings = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">System Settings</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  defaultValue="QuickCourt"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@quickcourt.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
            
            {/* Logout Button */}
            <div className="pt-6 border-t border-gray-200">
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
              { id: 'overview', label: 'Platform Overview', icon: Activity },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'venues', label: 'Venue Approvals', icon: Building2 },
              { id: 'moderation', label: 'Content Moderation', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'venues' && <VenueApprovals />}
        {activeTab === 'moderation' && <ContentModeration />}
        {activeTab === 'analytics' && <PlatformAnalytics />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;