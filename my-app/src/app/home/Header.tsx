// src/app/home/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center text-2xl font-bold">
              <div className="w-8 h-8 mr-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400 dark:from-purple-400 dark:to-purple-200">
                AvatarAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300">
              Features
            </Link>
            <Link href="#showcase" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300">
              Showcase
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300">
              Pricing
            </Link>
            <button
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <Moon size={20} className="text-gray-700" /> : 
                <Sun size={20} className="text-yellow-300" />
              }
            </button>
            <Link 
              href="#signup"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              className="p-2 mr-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? 
                <Moon size={20} className="text-gray-700" /> : 
                <Sun size={20} className="text-yellow-300" />
              }
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              {mobileMenuOpen ? 
                <X size={24} className="text-gray-700 dark:text-gray-200" /> : 
                <Menu size={24} className="text-gray-700 dark:text-gray-200" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="md:hidden px-4 pt-2 pb-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col space-y-4">
            <Link href="#features" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>
              Features
            </Link>
            <Link href="#showcase" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>
              Showcase
            </Link>
            <Link href="#testimonials" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>
              Testimonials
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-purple-600 dark:text-gray-200 dark:hover:text-purple-400 transition-colors duration-300" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link 
              href="#signup" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md text-center transition-colors duration-300"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;