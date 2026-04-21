import React from "react";
import Icon from "../constants/Icons";
import { opportunitiesData } from "../constants/DummyData"; // Assuming DummyData is available
import { CalendarIcon, LocationEditIcon, UsersIcon } from "lucide-react";

// Reusable OpportunityCard component to display individual opportunities
const OpportunityCard = ({ opportunity }) => {
  const { title, description, status, category, location, date, participants, capacity } = opportunity;
  const isFull = status === 'Full';
  const progress = (participants / capacity) * 100;

  // Updated with dark mode classes
  const statusClasses = {
    Active: 'bg-[#c3f7dc] text-[#09a66b] dark:bg-green-900/50 dark:text-green-400',
    Full: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-shadow duration-300">
      {/* Card Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
            <img src="./leaf.png" alt="leaf" className="w-10 h-10 rounded-xl" />
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusClasses[status]}`}>
            {status}
          </span>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{category}</span>
      </div>

      {/* Card Body */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
      </div>

      {/* Card Details */}
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <LocationEditIcon />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-3">
          <CalendarIcon />
          <span>{date}</span>
        </div>
      </div>
        
      {/* Card Footer / Progress */}
        <div className="flex justify-between items-center gap-4 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <UsersIcon />
              <span>{participants}/{capacity}</span>
          </div>
          <div className="w-[100px] bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`rounded-full h-2 ${isFull ? 'bg-orange-400' : 'bg-gradient-to-r from-[#4E7952] to-[#A2B489]'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
            <button className="mt-6 w-full py-2 px-4 bg-[#009966] text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">Apply Now</button>
    </div>
  );
};


// --- Main App Component ---
// This is the main component that renders the entire page.
export default function App() {
  return (
    <div className="bg-white dark:bg-gray-900 font-sans rounded-xl">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
           <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">Suggested Opportunities</h3>
           <p className="text-sm text-gray-500 dark:text-gray-400">Find new ways to make an impact.</p>
          </div>
        </header>

        {/* Opportunities Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {opportunitiesData.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </main>
      </div>
    </div>
  );
}