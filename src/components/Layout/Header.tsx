import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { SITE_CONFIG, NAVIGATION } from '@/lib/constants';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Only (Text Removed) */}
          <Link href="/" className="flex items-center">
            <Image
              src={SITE_CONFIG.logo}
              alt={SITE_CONFIG.name}
              width={1800}
              height={540}
              className="h-42 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAVIGATION.main.map((item) => (
              <div key={item.name} className="relative">
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                      {item.name}
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/search"
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {status === 'loading' ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">{session.user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                    {session.user?.role === 'admin' && (
                      <Link
                        href="/admin/users"
                        className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-primary-600"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/signin" className="text-gray-600 hover:text-primary-600 transition-colors text-sm">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {NAVIGATION.main.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <span className="block px-4 py-2 text-gray-900 font-medium">
                      {item.name}
                    </span>
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="block px-8 py-2 text-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* Mobile Auth Links */}
            <div className="border-t pt-4 mt-4">
              {status === 'loading' ? (
                <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
              ) : session ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-gray-900">
                    {session.user?.name}
                  </div>
                  {session.user?.role === 'admin' && (
                    <Link
                      href="/admin/users"
                      className="block px-4 py-2 text-gray-600 hover:text-primary-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-600 hover:text-primary-600"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="block px-4 py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 text-gray-600 hover:text-primary-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
          }
