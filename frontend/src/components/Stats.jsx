import React from 'react';
import { FaTruck, FaRecycle, FaHandsHelping, FaAward } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

// Updated stats data with icons
const statsData = [
  { 
    value: '250+', 
    label: 'Total Pickups Completed',
    icon: FaTruck,
    color: 'from-emerald-500 to-green-600'
  },
  { 
    value: '631kg', 
    label: 'Waste Collected',
    icon: FaRecycle,
    color: 'from-green-500 to-teal-600'
  },
  { 
    value: '150+', 
    label: 'Active Volunteers',
    icon: FaHandsHelping,
    color: 'from-teal-500 to-cyan-600'
  },
  { 
    value: '8', 
    label: 'Opportunities Applied',
    icon: FaAward,
    color: 'from-cyan-500 to-blue-600'
  },
];

const imageData = [
  { src: 'img1.png', alt: 'People sorting recycling', zIndex: 'z-30' },
  { src: 'img2.png', alt: 'Bags of collected waste', zIndex: 'z-20' },
  { src: 'img3.png', alt: 'Community cleanup event', zIndex: 'z-10' },
];

const Stats = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <section className={`py-20 sm:py-28 transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/30'
    }`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Our Impact in <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Numbers</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Together, we're creating measurable change for our planet and communities
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
                    : 'bg-white border border-gray-100'
                }`}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl mb-4 shadow-lg`}>
                  <Icon className="text-white text-2xl" />
                </div>
                
                {/* Value */}
                <h3 className={`text-5xl font-extrabold mb-3 group-hover:scale-110 transition-transform duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.value}
                </h3>
                
                {/* Label */}
                <p className={`text-base font-medium leading-snug ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {stat.label}
                </p>

                {/* Decorative Element */}
                <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`}></div>
              </div>
            );
          })}
        </div>

        {/* Images Section with Modern Layout */}
        <div className="relative">
          <div className="text-center mb-12">
            <h3 className={`text-3xl font-bold mb-3 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              See Us in <span className="text-emerald-600">Action</span>
            </h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Real stories, real impact from our community
            </p>
          </div>

          {/* Images Grid */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4">
            {imageData.map((image, index) => (
              <div
                key={index}
                className={`group relative ${image.zIndex} transition-all duration-500 hover:scale-105`}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-72 h-56 md:w-80 md:h-60 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white font-semibold text-lg">{image.alt}</p>
                  </div>
                </div>

                {/* Decorative Border */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10 blur"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;