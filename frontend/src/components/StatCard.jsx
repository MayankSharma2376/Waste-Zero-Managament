import React from 'react';
import Icon from '../constants/Icons';

// Reusable StatCard component to display individual statistics
const StatCard = ({ stat }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700 flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.period}</p>
        </div>
        <div className='p-4 bg-[#c3f7dc] dark:bg-green-900/50 rounded-lg'>
            <Icon name={stat.icon} className="h-8 w-8 text-[#09a66b] dark:text-green-400" />
        </div>
    </div>
);

export default StatCard;