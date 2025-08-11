import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Zap, Search, MapPin, User, LogOut } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use auth hook instead of localStorage
  const { user, isAuthenticated, logout } = useAuth();
  const userRole = user?.role || 'user';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', href: '/' },
        { name: 'Venues', href: '/search' },
        { name: 'Sports', href: '/#sports' },
        { name: 'About', href: '/#about' }
      ];
    }
    
    switch (userRole) {
      case 'customer':
      case 'user':
        return [
          { name: 'Home', href: '/' },
          { name: 'Search', href: '/search' },
          { name: 'My Bookings', href: '/profile/bookings' },
          { name: 'Profile', href: '/profile' }
        ];
      case 'owner':
        return [
          { name: 'Dashboard', href: '/owner-dashboard' },
          { name: 'My Venues', href: '/owner/venues' },
          { name: 'Bookings', href: '/owner/bookings' },
          { name: 'Analytics', href: '/owner/analytics' }
        ];
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin-dashboard' },
          { name: 'Users', href: '/admin/users' },
          { name: 'Venues', href: '/admin/venues' },
          { name: 'Analytics', href: '/admin/analytics' }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-200 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm border-b border-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <button 
              onClick={() => navigate(isAuthenticated && userRole !== 'customer' ? `/${userRole}-dashboard` : '/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <Zap className="w-6 h-6 text-rose-500" />
              <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                QUICKCOURT
              </h1>
            </button>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-rose-500 font-medium transition-colors relative nav-item"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Desktop Auth Buttons - Hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="text-gray-700 hover:text-rose-500 font-medium transition-colors"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  {userRole === 'customer' && (
                    <button 
                      onClick={() => navigate('/profile')}
                      className="flex items-center space-x-2 text-gray-700 hover:text-rose-500 font-medium transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button - Only visible on mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Menu */}
        <div className={`lg:hidden fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}>
          <div className="p-6 pt-20 space-y-6">
            {/* Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Navigation */}
            <nav className="space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            {/* Authentication */}
            <div className="border-t pt-6 space-y-4">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/register');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold py-3 rounded-lg transition-all duration-200 tracking-wide uppercase"
                  >
                    SIGN UP
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  {userRole !== 'customer' && (
                    <button 
                      onClick={() => {
                        navigate(`/${userRole}-dashboard`);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left text-lg font-medium text-gray-900 hover:text-rose-500 transition-colors py-2 tracking-wide uppercase"
                    >
                      DASHBOARD
                    </button>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left text-lg font-medium text-red-600 hover:text-red-700 transition-colors py-2 tracking-wide uppercase"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </nav>
    </>
  );
};

export default Header;