import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFacility, useFacilityReviews } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { 
  ArrowLeft,
  MapPin, 
  Star, 
  Heart, 
  Share,
  ChevronLeft,
  ChevronRight,
  X,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Waves,
  Users,
  Clock,
  IndianRupee,
  Calendar,
  Phone,
  MessageCircle,
  Mail,
  Shield,
  CheckCircle,
  Grid3X3
} from 'lucide-react';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // TODO: API Integration - These will fetch real data when backend is ready
  const { data: venue, loading: venueLoading, error: venueError } = useFacility(parseInt(id || '0'));
  const { data: reviews, loading: reviewsLoading } = useFacilityReviews(parseInt(id || '0'));
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [playerCount, setPlayerCount] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    
    // Proceed with booking if authenticated
    if (!selectedDate || !selectedTimeSlot || !selectedSport) {
      alert('Please select date, time, and sport before booking');
      return;
    }
    
    try {
      // TODO: API Integration - Replace with actual API call
      const [startH, startM] = selectedTimeSlot.split(':').map(Number);
      const endH = startH + 1; // 1 hour slot default
      const end_time = `${String(endH).padStart(2, '0')}:${String(startM).padStart(2, '0')}:00`;
      const bookingData = {
        court_id: parseInt(selectedSport, 10),
        date: selectedDate,
        start_time: `${selectedTimeSlot}:00`,
        end_time,
      } as any;
      
      const response = await apiService.createBooking(bookingData);
      if (response.success) {
        alert('Booking confirmed!');
        navigate('/profile/bookings');
      }
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  // Loading state
  if (venueLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (venueError || !venue?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h2>
          <button
            onClick={() => navigate('/search')}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const venueData = venue.data as any;
  
  // Convert API data to display format
  const displayVenue = {
    id: (venueData.id || venueData.facility_id).toString(),
    name: venueData.name,
    location: venueData.location,
    fullAddress: venueData.location, // TODO: Add full address field to API
    images: venueData.images || [
      'https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8007432/pexels-photo-8007432.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    rating: venueData.avg_rating || venueData.rating || 4.5,
    reviewCount: venueData.review_count || 0,
    price: venueData.courts?.[0]?.price_per_hour || 1200,
    sports: venueData.courts?.map((court: any) => ({
      name: court.sport_type,
      id: court.id,
      icon: '🏸',
      price: court.price_per_hour
    })) || [],
    amenities: venueData.amenities?.map(amenity => ({
      name: amenity.name,
      icon: <Car className="w-5 h-5" /> // TODO: Map amenity types to icons
    })) || [],
    description: venueData.description || 'Premium sports facility with world-class amenities.',
    rules: [
      'Sports shoes mandatory for all courts',
      'No outside food or drinks allowed',
      'Equipment rental available on-site',
      'Advance booking required for peak hours',
      'Cancellation allowed up to 2 hours before booking',
    ],
    timeSlots: [
      // TODO: Replace with actual schedule data from API
      { time: '6:00 AM', available: true, price: 800 },
      { time: '7:00 AM', available: true, price: 800 },
      { time: '8:00 AM', available: false, price: 1000 },
      // ... more slots
    ],
    reviews: reviews?.data || []
  };

  // Similar venues data
  const similarVenues = [
    {
      id: '2',
      name: 'Champions Club',
      location: 'Bopal, Ahmedabad',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      reviewCount: 95,
      price: 800,
      sports: ['Tennis', 'Swimming', 'Gym']
    },
    {
      id: '3',
      name: 'Metro Sports Complex',
      location: 'Makarba, Ahmedabad',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      reviewCount: 156,
      price: 600,
      sports: ['Football', 'Basketball', 'Badminton']
    },
    {
      id: '4',
      name: 'Victory Sports Hub',
      location: 'Ghatlodia, Ahmedabad',
      image: 'https://images.pexels.com/photos/6253559/pexels-photo-6253559.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      reviewCount: 78,
      price: 900,
      sports: ['Badminton', 'Table Tennis', 'Squash']
    }
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleSportSelect = (sport: string) => {
    setSelectedSport(sport);
  };

  const calculateTotal = () => {
    const selectedSlot = displayVenue.timeSlots.find(slot => slot.time === selectedTimeSlot);
    const basePrice = selectedSlot ? selectedSlot.price : displayVenue.price;
    return basePrice * playerCount;
  };

  const openGallery = (index: number = 0) => {
    setCurrentImageIndex(index);
    setShowGallery(true);
  };

  const closeGallery = () => {
    setShowGallery(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayVenue.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayVenue.images.length) % displayVenue.images.length);
  };

  const scrollReviews = (direction: 'left' | 'right') => {
    if (reviewsRef.current) {
      const scrollAmount = 320;
      reviewsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleBackToResults = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <button
          onClick={handleBackToResults}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to results</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{displayVenue.name}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-gray-600'}`} />
              <span className="text-gray-700 font-medium">Save</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-600 mb-6">
          <div className="flex items-center space-x-1">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold text-gray-900">{displayVenue.rating}</span>
            <span>({displayVenue.reviewCount} reviews)</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{displayVenue.location}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-96 md:h-[400px]">
          {/* Main large image */}
          <div 
            className="md:col-span-2 md:row-span-2 cursor-pointer group relative overflow-hidden"
            onClick={() => openGallery(0)}
          >
            <img
              src={displayVenue.images[0]}
              alt={displayVenue.name}
              className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
            />
          </div>
          
          {/* Four smaller images */}
          {displayVenue.images.slice(1, 5).map((image, index) => (
            <div 
              key={index}
              className="cursor-pointer group relative overflow-hidden"
              onClick={() => openGallery(index + 1)}
            >
              <img
                src={image}
                alt={`${displayVenue.name} ${index + 2}`}
                className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-300"
              />
              {/* Show all photos button on last image */}
              {index === 3 && displayVenue.images.length > 5 && (
                <div className="hidden md:block absolute bottom-4 right-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openGallery(0);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 hover:bg-white transition-colors shadow-sm"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    <span className="text-sm font-medium">Show all {displayVenue.images.length} photos</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Venue Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">About this venue</h2>
              <p className="text-gray-700 leading-relaxed">{displayVenue.description}</p>
            </div>

            {/* Sports & Facilities */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sports & Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {displayVenue.sports.map((sport, index) => (
                  <div key={index} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="text-2xl mb-2">{sport.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{sport.name}</span>
                    <span className="text-xs text-gray-600">₹{sport.price}/hr</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {displayVenue.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-600">{amenity.icon}</div>
                    <span className="text-sm font-medium text-gray-900">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Rules */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Venue Rules</h3>
              <div className="space-y-3">
                {displayVenue.rules.map((rule, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Reviews ({displayVenue.reviewCount})
                </h3>
                <div className="hidden md:flex space-x-2">
                  <button 
                    onClick={() => scrollReviews('left')}
                    className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => scrollReviews('right')}
                    className="p-2 rounded-full border border-gray-300 hover:border-gray-400 hover:shadow-md transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div 
                ref={reviewsRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayVenue.reviews.map((review) => (
                  <div key={review.review_id} className="flex-shrink-0 w-80 md:w-96 p-6 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={review.user?.avatar_url || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={review.user?.name || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              {/* Mobile scroll indicators */}
              <div className="flex justify-center mt-4 md:hidden">
                <div className="flex space-x-2">
                  {displayVenue.reviews.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-gray-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <IndianRupee className="w-5 h-5 text-gray-900" />
                  <span className="text-2xl font-bold text-gray-900">{displayVenue.price}</span>
                  <span className="text-gray-600">/ hour</span>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{displayVenue.rating}</span>
                  <span className="text-gray-500">({displayVenue.reviewCount} reviews)</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {/* Sport Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Select Sport
                  </label>
                  <select
                    value={selectedSport}
                    onChange={(e) => handleSportSelect(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  >
                    <option value="">Choose a sport</option>
                    {displayVenue.sports.map((sport: any, index: number) => (
                       <option key={index} value={String(sport.id)}>
                        {sport.name} - ₹{sport.price}/hr
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {displayVenue.timeSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                          selectedTimeSlot === slot.time
                            ? 'bg-rose-500 text-white border-rose-500'
                            : slot.available
                            ? 'bg-white text-gray-900 border-gray-300 hover:border-rose-500 hover:text-rose-500'
                            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                        }`}
                      >
                        <div>{slot.time}</div>
                        <div className="text-xs">₹{slot.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Player Count */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Number of Players
                  </label>
                  <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg">
                    <span className="text-gray-900">Players</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setPlayerCount(Math.max(1, playerCount - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        -
                      </button>
                      <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                        {playerCount}
                      </span>
                      <button
                        onClick={() => setPlayerCount(Math.min(20, playerCount + 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total and Book Button */}
              <div className="border-t pt-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="w-5 h-5 text-gray-900" />
                    <span className="text-xl font-bold text-gray-900">{calculateTotal()}</span>
                  </div>
                </div>
                <button
                  onClick={handleBookNow}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  {isAuthenticated ? 'Book Now' : 'Login to Book'}
                </button>
              </div>

              {/* Contact Options */}
              <div className="space-y-3 mb-6">
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">Call</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Message</span>
                  </button>
                </div>
                <button className="w-full flex items-center justify-center space-x-2 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm font-medium">Email Venue</span>
                </button>
              </div>

              {/* Trust Signals */}
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure booking guaranteed</span>
                </div>
                <p className="text-xs text-gray-500">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Venues */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Similar venues you might like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarVenues.map((similarVenue) => (
              <div key={similarVenue.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={similarVenue.image}
                    alt={similarVenue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-2">{similarVenue.name}</h3>
                  <div className="flex items-center space-x-1 mb-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 text-sm">{similarVenue.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{similarVenue.rating}</span>
                      <span className="text-sm text-gray-500">({similarVenue.reviewCount})</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IndianRupee className="w-4 h-4 text-gray-900" />
                      <span className="font-bold text-gray-900">{similarVenue.price}</span>
                      <span className="text-gray-600 text-sm">/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center animate-fade-in">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeGallery}
              className="absolute top-6 right-6 z-10 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-6 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-6 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Main Image */}
            <img
              src={displayVenue.images[currentImageIndex]}
              alt={`${displayVenue.name} ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <span className="text-white text-sm">
                {currentImageIndex + 1} / {displayVenue.images.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetail;