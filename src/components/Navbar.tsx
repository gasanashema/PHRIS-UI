import { useState, useEffect } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer"
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })
          }
        >
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-text-primary leading-none tracking-tight">
              AI Vital
            </span>
            <span className="text-[11px] font-medium text-primary leading-none mt-1">
              Rwanda
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: 'smooth'
              });
            }}
            className="text-[15px] font-medium text-text-primary hover:text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="#indicators"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            AI Indicators
          </a>
          <a
            href="#how"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            How It Works
          </a>
          <a
            href="#alerts"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Alert Levels
          </a>
          <a
            href="#cta"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Contact
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-[14px] font-medium text-text-primary hover:text-primary transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-[14px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-xs"
          >
            Request Access
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-text-primary hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-border shadow-md animate-in slide-in-from-top-2">
          <div className="flex flex-col p-6 gap-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
                closeMenu();
              }}
              className="text-[15px] font-medium text-text-primary hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#indicators"
              onClick={closeMenu}
              className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
            >
              AI Indicators
            </a>
            <a
              href="#how"
              onClick={closeMenu}
              className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
            >
              How It Works
            </a>
            <a
              href="#alerts"
              onClick={closeMenu}
              className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Alert Levels
            </a>
            <a
              href="#cta"
              onClick={closeMenu}
              className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors"
            >
              Contact
            </a>

            <div className="h-px bg-border my-1" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 text-[15px] font-medium text-text-primary border border-border rounded-lg hover:bg-slate-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="w-full text-center px-4 py-2 text-[15px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-xs"
            >
              Request Access
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}