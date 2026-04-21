import React from 'react';
import { FaRecycle, FaTruck, FaUsers, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

// Updated services data with more relevant information
const servicesData = [
  {
    imgSrc: '/service1.jpg',
    imgAlt: 'Waste Collection Service',
    icon: FaTruck,
    title: 'Scheduled Pickups',
    description: 'Convenient waste collection at your doorstep. Schedule pickups at times that work for you with our flexible service.',
    gradient: 'from-emerald-500 to-green-600'
  },
  {
    imgSrc: '/service2.jpg',
    imgAlt: 'Recycling Program',
    icon: FaRecycle,
    title: 'Recycling Programs',
    description: 'Comprehensive recycling solutions for all waste types. We ensure proper sorting and processing of recyclable materials.',
    gradient: 'from-green-500 to-teal-600'
  },
  {
    imgSrc: '/service3.jpg',
    imgAlt: 'Community Engagement',
    icon: FaUsers,
    title: 'Community Events',
    description: 'Join local cleanup drives and educational workshops. Connect with volunteers and make a real impact in your community.',
    gradient: 'from-teal-500 to-cyan-600'
  },
];

const Services = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <section id="services" className={`text-white py-20 md:py-28 relative overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
        : 'bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <span className="text-emerald-300 text-sm font-semibold tracking-wide uppercase">What We Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6">
            Our <span className="bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
            Comprehensive waste management solutions tailored for a sustainable future
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {servicesData.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.imgSrc}
                    alt={service.imgAlt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-4 right-4 w-12 h-12 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="text-white text-xl" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-emerald-100/90 text-base leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Learn More Link */}
                  <button className="inline-flex items-center gap-2 text-emerald-300 font-semibold group-hover:gap-3 transition-all duration-300">
                    Learn More
                    <FaArrowRight className="text-sm" />
                  </button>
                </div>

                {/* Decorative Element */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Call-to-Action Button */}
        <div className="text-center">
          <button className="group inline-flex items-center gap-3 bg-white text-emerald-900 font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            View All Services
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;
