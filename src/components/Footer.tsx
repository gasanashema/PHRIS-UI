import { Activity, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-primary-dark border-t border-white/10 pt-16 pb-10 text-white/80">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-none">
                  AI Vital
                </span>
                <span className="text-[11px] font-medium text-emerald-300 leading-none mt-1">
                  Rwanda
                </span>
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed mb-5">
              Protecting Rwanda’s population through real-time algorithmic health intelligence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-white/60 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#indicators" className="hover:text-white transition-colors">
                  AI Indicators
                </a>
              </li>
              <li>
                <a href="#how" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#alerts" className="hover:text-white transition-colors">
                  Alert Levels
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Request Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Policies */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Governance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/legal#data-protection" className="hover:text-white transition-colors">
                  Data Protection
                </Link>
              </li>
              <li>
                <Link to="/legal#privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal#terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold mb-4 text-xs uppercase tracking-wider">
              Contact
            </h4>
            <p className="text-white/70 text-xs mb-3">
              Built with support for Rwanda's public health system.
            </p>
            <a
              href="mailto:contact@aivital.rw"
              className="text-emerald-300 hover:text-emerald-200 transition-colors text-xs block mb-4"
            >
              contact@aivital.rw
            </a>
            <p className="text-white/50 text-[11px]">
              © 2026 AI Vital Rwanda. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}