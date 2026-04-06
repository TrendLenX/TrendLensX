import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
  BarChart3,
  FileText,
  Users,
  Settings,
  LogOut,
  Home,
  PenTool,
  Mail,
  DollarSign,
} from 'lucide-react';

interface DashboardLayoutProps {
  author: {
    name ? : string;
    image ? : string | null;
    role ? : string | null;
  };
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: Home, roles: ['USER', 'AUTHOR', 'ADMIN'] },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3, roles: ['AUTHOR', 'ADMIN'] },
  { name: 'Posts', href: '/dashboard/posts', icon: FileText, roles: ['AUTHOR', 'ADMIN'] },
  { name: 'Audience', href: '/dashboard/audience', icon: Users, roles: ['AUTHOR', 'ADMIN'] },
  { name: 'Write', href: '/dashboard/write', icon: PenTool, roles: ['AUTHOR'] },
  { name: 'Newsletter', href: '/dashboard/newsletter', icon: Mail, roles: ['AUTHOR', 'ADMIN'] },
  { name: 'Monetization', href: '/dashboard/monetization', icon: DollarSign, roles: ['AUTHOR', 'ADMIN'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['USER', 'AUTHOR', 'ADMIN'] },
];

export default function DashboardLayout({ author, children }: DashboardLayoutProps) {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              TrendLensX
            </Link>
          </div>

          {/* Author Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={author.image || '/images/authors/default.jpg'}
                alt={author.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-900">{author.name}</p>
                <p className="text-sm text-gray-500">{author.role || 'Author'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation
              .filter(item => item.roles.includes((author.role || 'AUTHOR').toUpperCase()) || author.role === 'ADMIN')
              .map(item => {
                const isActive = router.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
          </nav>

          {/* Sign Out */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}