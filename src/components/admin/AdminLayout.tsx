import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  User,
  Briefcase,
  Code,
  FolderOpen,
  Mail,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/hero', icon: Home, label: 'Hero Section' },
    { path: '/admin/about', icon: User, label: 'About Me' },
    { path: '/admin/experiences', icon: Briefcase, label: 'Experiences' },
    { path: '/admin/skills', icon: Code, label: 'Skills' },
    { path: '/admin/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/admin/messages', icon: Mail, label: 'Messages' },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-100 shadow-lg lg:hidden">
          <div className="flex-none">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <div className="flex-none gap-2">
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </div>

      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <button onClick={toggleTheme} className="btn btn-ghost btn-circle hidden lg:flex">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="divider"></div>

          <ul className="space-y-2">
            <li>
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Home size={20} />
                View Portfolio
              </a>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-error">
                <LogOut size={20} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
