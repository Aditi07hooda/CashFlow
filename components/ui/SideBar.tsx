
import React, { useState } from 'react';
import {
  Home, TrendingUp, BarChart3, User, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, Plus, Camera, Bell, 
  Calendar, DollarSign, PieChart, TrendingDown, Eye, EyeOff
} from 'lucide-react';

const Sidebar: React.FC<{ activePage: string; setActivePage: (page: string) => void }> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="hidden lg:flex flex-col h-full border-r border-gray-200 bg-white px-4 py-6">
      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex flex-col items-center gap-2 px-4 py-4 rounded-xl transition-all ${
                activePage === item.id
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={28} strokeWidth={2} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;