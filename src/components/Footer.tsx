import { Activity, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="bg-[#111827] border-t-2 border-primary pt-20 pb-10">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-none">
                  AI Vital
                </span>
                <span className="text-xs font-medium text-primary leading-none mt-1">
                  Rwanda
                </span>
              </div>
            </div>
            <p className="text-[#9CA3AF] text-[15px] leading-relaxed mb-6">
              Protecting Rwanda's population through intelligent health
              surveillance.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#9CA3AF] hover:text-white transition-colors">
                
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-[#9CA3AF] hover:text-white transition-colors">
                
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#features"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#roles"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  
                  User Roles
                </a>
              </li>
              <li>
                <a
                  href="#alerts"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  
                  Alert System
                </a>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  
                  Request Access
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Security & Trust</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/legal#data-protection"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link
                  to="/legal#privacy"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/legal#terms"
                  className="text-[#9CA3AF] hover:text-white transition-colors text-[15px]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact</h4>
            <p className="text-[#9CA3AF] text-[15px] mb-4">
              Built with support for Rwanda's health system.
            </p>
            <a
              href="mailto:contact@aivital.rw"
              className="text-primary hover:text-primary-hover transition-colors text-[15px] block mb-8">
              
              contact@aivital.rw
            </a>
            <p className="text-[#9CA3AF] text-[13px]">
              © 2026 AI Vital Rwanda. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>);

}