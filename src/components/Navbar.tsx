import React, { useState } from 'react';
import { Activity, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMenu = () => setIsMobileMenuOpen(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
          }>
          
          <div className="w-10 h-10 rounded-lg bg-section flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-primary-dark leading-none">
              AI Vital
            </span>
            <span className="text-xs font-medium text-primary leading-none mt-1">
              Rwanda
            </span>
          </div>
        </div>

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
            className="text-[15px] font-medium text-text-primary hover:text-primary transition-colors">
            
            Home
          </a>
          <a
            href="#features"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">
            
            Features
          </a>
          <a
            href="#how"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">
            
            How It Works
          </a>
          <a
            href="#roles"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">
            
            For Institutions
          </a>
          <a
            href="#cta"
            className="text-[15px] font-medium text-text-secondary hover:text-primary transition-colors">
            
            Contact
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 text-[15px] font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
            
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-[15px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            
            Request Access
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-text-primary hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          
          {isMobileMenuOpen ?
          <X className="w-6 h-6" /> :

          <Menu className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen &&
      <div className="lg:hidden absolute top-20 left-0 right-0 bg-white border-b border-border shadow-lg animate-in slide-in-from-top-2">
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
            className="text-[16px] font-medium text-text-primary hover:text-primary transition-colors">
            
              Home
            </a>
            <a
            href="#features"
            onClick={closeMenu}
            className="text-[16px] font-medium text-text-secondary hover:text-primary transition-colors">
            
              Features
            </a>
            <a
            href="#how"
            onClick={closeMenu}
            className="text-[16px] font-medium text-text-secondary hover:text-primary transition-colors">
            
              How It Works
            </a>
            <a
            href="#roles"
            onClick={closeMenu}
            className="text-[16px] font-medium text-text-secondary hover:text-primary transition-colors">
            
              For Institutions
            </a>
            <a
            href="#cta"
            onClick={closeMenu}
            className="text-[16px] font-medium text-text-secondary hover:text-primary transition-colors">
            
              Contact
            </a>

            <div className="h-px bg-border my-2" />

            <Link
            to="/login"
            onClick={closeMenu}
            className="w-full text-center px-5 py-3 text-[16px] font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
            
              Login
            </Link>
            <Link
            to="/register"
            onClick={closeMenu}
            className="w-full text-center px-5 py-3 text-[16px] font-medium text-white bg-primary rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            
              Request Access
            </Link>
          </div>
        </div>
      }
    </nav>);

}