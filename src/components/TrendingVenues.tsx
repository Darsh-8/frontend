import React, { useRef } from 'react';
import { useTrendingFacilities } from '../hooks/useApi';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VenueCard from './VenueCard';

const TrendingVenues = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // TODO: API Integration - This will fetch real data when backend is ready
  const { data: trendingFacilities, loading, error } = useTrendingFacilities();

  // Convert API data to VenueCard format
  const venues = trendingFacilities?.data?.map(facility => ({
    image: facility.images?.[0] || "https://images.pexels.com/photos/1552617/pexels-photo-1552617.jpeg?auto=compress&cs=tinysrgb&w=800",
    name: facility.name,
    location: facility.location,
    rating: facility.rating || 4.5,
    reviewCount: facility.review_count || 0,
    amenities: facility.amenities?.map(a => a.name) || []
  })) || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 680; // Scroll 2-3 cards at once
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">Trending Venues</h2>
          <a 
            href="#" 
            className="text-rose-500 hover:text-rose-600 font-medium hover:underline transition-all flex items-center space-x-1"
          >
            <span>See all trending</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* Desktop Layout with Side Navigation */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Failed to load trending venues</p>
          </div>
        ) : (
          <div className="hidden md:block relative">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center border border-gray-100 hover:scale-105"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center border border-gray-100 hover:scale-105"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 group-hover:text-gray-900" />
          </button>

          {/* Venue Grid */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 items-stretch"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {venues.map((venue, index) => (
              <div key={index} style={{ scrollSnapAlign: 'start' }}>
                <VenueCard {...venue} />
              </div>
            ))}
          </div>
        </div>
        )}

        {/* Mobile Carousel */}
       {!loading && !error && (
         <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-1 items-stretch" style={{ scrollSnapType: 'x mandatory' }}>
            {venues.map((venue, index) => (
              <div key={index} style={{ scrollSnapAlign: 'start' }}>
                <VenueCard {...venue} />
              </div>
            ))}
          </div>
          
          {/* Mobile Scroll Indicators */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: Math.ceil(venues.length / 1.3) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 transition-colors hover:bg-rose-500"
              />
            ))}
          </div>
        </div>
       )}

      </div>
    </section>
  );
};

export default TrendingVenues;