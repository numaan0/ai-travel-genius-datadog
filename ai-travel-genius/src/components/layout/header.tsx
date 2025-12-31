// src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
  GlobeAltIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="sticky top-4 z-50 mx-auto max-w-7xl px-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="glass-strong rounded-2xl shadow-xl">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="flex items-center space-x-3 text-xl font-semibold text-white"
              >
                <div className="glass-subtle w-10 h-10 rounded-xl flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-amber-400/80" />
                </div>
                <span className="hidden sm:block">AI Travel Genius</span>
              </Link>
            </motion.div>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link
                href="/discover"
                className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:glass-subtle rounded-lg transition-all duration-200"
              >
                <MapPinIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Discover</span>
              </Link>
              <Link
                href="/destinations"
                className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:glass-subtle rounded-lg transition-all duration-200"
              >
                <GlobeAltIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Destinations</span>
              </Link>
            <Link
              href="/plan-trip"
              className="bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white px-6 py-2 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Plan Your Trip
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white hover:glass-subtle rounded-lg transition-all duration-200"
            >
              <span className="text-sm font-medium">About</span>
            </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="md:hidden p-2 text-white/70 hover:text-white hover:glass-subtle rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden glass border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/discover"
                  className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:glass-subtle rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MapPinIcon className="w-5 h-5" />
                  <span>Discover</span>
                </Link>
                <Link
                  href="/destinations"
                  className="flex items-center space-x-3 px-4 py-3 text-white/80 hover:text-white hover:glass-subtle rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  <span>Destinations</span>
                </Link>
                <Link
                  href="/plan-trip"
                  className="flex items-center justify-center space-x-3 px-4 py-3 bg-gradient-to-r from-amber-500/90 via-rose-500/90 to-teal-500/90 text-white rounded-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>Plan Your Trip</span>
                </Link>
              </div>

              {/* Quick Links */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="px-4 text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                  Quick Links
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/travel-guides"
                    className="block px-4 py-2 text-white/70 hover:text-white hover:glass-subtle rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Travel Guides
                  </Link>
                  <Link
                    href="/best-time-to-visit"
                    className="block px-4 py-2 text-white/70 hover:text-white hover:glass-subtle rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Best Time to Visit
                  </Link>
                  <Link
                    href="/budget-planner"
                    className="block px-4 py-2 text-white/70 hover:text-white hover:glass-subtle rounded-lg transition-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Budget Planner
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;