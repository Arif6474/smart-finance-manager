'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, LayoutDashboard, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


function Header() {
      const { user } = useAuth();
  return (
       <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-4 sm:px-6 transition-colors duration-500"
        style={{ background: 'hsl(var(--card) / 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid hsl(var(--border) / 0.6)' }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group">
            <Image
              src="/logo.png"
              alt="TakaHisab Logo"
              width={32}
              height={32}
              className="w-8 h-8 rounded-xl object-contain shadow-md shadow-primary/20 group-hover:shadow-primary/40 transition-shadow flex-shrink-0"
            />
            <span className="text-sm sm:text-base font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent truncate max-w-[100px] sm:max-w-none">
              TakaHisab
            </span>
          </Link>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground font-medium">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            <Link
              href="/docs"
              className="flex gap-2 items-center p-1.5 md:p-2.5 hover:bg-muted rounded-xl transition-all duration-300 border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground group"
              title="Help & Documentation"
            >
              <HelpCircle size={18} className="transition-transform group-hover:scale-110" />
              <span className="hidden md:block text-sm font-bold">
                Help & Docs
              </span>
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="btn-primary px-3 sm:px-5 py-2 text-xs sm:text-sm flex items-center gap-2"
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
  )
}

export default Header