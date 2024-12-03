import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sprout, Cloud, Database, LogOut, History } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuthStore();

  const menuItems = [
    { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/weather', icon: <Cloud size={20} />, label: 'Weather' },
    { path: '/soil', icon: <Database size={20} />, label: 'Soil Data' },
    { path: '/history', icon: <History size={20} />, label: 'History' }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Sprout className="h-6 w-6" />
                <span className="text-lg font-bold">Smart Farmer</span>
              </div>
              <nav className="hidden md:flex space-x-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-green-800 text-white'
                        : 'text-green-100 hover:bg-green-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 text-sm text-green-100 hover:text-white"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-mint">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;