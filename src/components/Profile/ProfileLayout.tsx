import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import {
  User,
  Bookmark,
  Clock,
  Heart,
  Settings,
  LogOut,
  Home,
  TrendingUp,
  Users,
  Target,
  Trophy,
} from 'lucide-react';
import { User as UserType } from '@/types';

interface ProfileLayoutProps {
  user: UserType;
  children: React.ReactNode;
}

const navigation = [
  { name: 'Overview', href: '/profile', icon: Home },
  { name: 'Saved Articles', href: '/profile/saved', icon: Bookmark },
  { name: 'Reading History', href: '/profile/history', icon: Clock },
  { name: 'My Activity', href: '/profile/activity', icon: Heart },
  { name: 'Following', href: '/profile/following', icon: Users },
  { name: 'Reading Goals', href: '/profile/goals', icon: Target },
  { name: 'Achievements', href: '/profile/achievements', icon: Trophy },
  { name: 'Reading Stats', href: '/profile/stats', icon: TrendingUp },
  { name: 'Settings', href: '/profile/settings', icon: Settings },
];

export default function ProfileLayout({ user, children }: ProfileLayoutProps) {
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

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img
                src={user.image || '/images/authors/default.jpg'}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
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
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}