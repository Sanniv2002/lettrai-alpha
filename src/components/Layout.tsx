import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sparkles as FileSparkles, Briefcase, Database, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileSparkles, label: 'Generate', path: '/generate' },
  { icon: Briefcase, label: 'My Jobs', path: '/jobs' },
  { icon: Database, label: 'Knowledge Base', path: '/knowledge-base' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 right-4 z-50 p-2 rounded-lg glass-container md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 glass-container transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Lettrai
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-400 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={cn(
        "min-h-screen transition-all duration-200 ease-in-out",
        "md:ml-64 p-6"
      )}>
        {/* Top bar */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-400">{user.email}</span>
            </div>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}