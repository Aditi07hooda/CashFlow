"use client";
import React, { useState } from 'react';
import {
  Home, TrendingUp, BarChart3, User, Search, Bell, 
  Menu, X, Wallet, ChevronDown, Settings, LogOut, HelpCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// ==================== NAVBAR ====================
const Navbar: React.FC = () => {
  const navigate = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<string>('Dashboard');

  const navItems = [
    { name: 'Dashboard', icon: Home, linkTo: "/" },
    { name: 'Transactions', icon: TrendingUp, linkTo: "/transactions" },
    { name: 'Reports', icon: BarChart3, linkTo: "/reports" },
    { name: 'Budget', icon: User, linkTo: "/budget" },
    { name: 'Category', icon: User, linkTo: "/category" }
  ];

  const notifications = [
    { id: 1, message: 'Budget limit reached for Shopping', time: '5m ago', unread: true },
    { id: 2, message: 'New transaction: ₹2,500', time: '1h ago', unread: true },
    { id: 3, message: 'Monthly report is ready', time: '2h ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT - Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-shadow">
                <Wallet className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:block">
                CashFlow
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => { setActiveNav(item.name); navigate.push(item.linkTo); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      activeNav === item.name
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT - Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
              <Search size={18} />
              <span className="hidden lg:inline text-sm">Search...</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell size={22} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {unreadCount} new
                    </span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notif.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm text-gray-900">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  DU
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">Demo User</p>
                    <p className="text-sm text-gray-500">demo@cashflow.com</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <HelpCircle size={18} />
                      <span>Help & Support</span>
                    </button>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveNav(item.name);
                    navigate.push(item.linkTo);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeNav === item.name
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-gray-200 px-4 py-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <User size={20} />
              <span>Profile Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;