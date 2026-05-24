"use client";
import Button from "@/components/ui/Button";
import Card from '@/components/ui/Card';
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Lock, Mail, Wallet } from "lucide-react";
import { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { login, isLoggingIn } = useAuth({ enabled: false });

  const handleLogin = () => {
    console.log("logging user - " + email + password);
    login({
      email,
      password,
    });
  };

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    handleLogin();
  };

  return (
    <div className="h-screen flex items-center justify-center content-center">
      <Card className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Wallet className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CashFlow</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your finances</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <Button type="submit" disabled={isLoggingIn} className="w-full">
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account? <a href="/auth/register" className="text-blue-600 hover:underline">Sign Up</a>
        </p>
      </Card>
    </div>
  );
};

export default Login;