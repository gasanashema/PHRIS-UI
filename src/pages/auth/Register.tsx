import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/auth/Logo';
import { Check } from 'lucide-react';
export function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const getPasswordStrength = () => {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };
  const strength = getPasswordStrength();
  const strengthColors = [
  'bg-border',
  'bg-alert-red',
  'bg-alert-orange',
  'bg-alert-yellow',
  'bg-alert-green'];

  const strengthLabels = ['Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return (
    <div className="min-h-screen bg-page flex font-sans">
      {/* Left Panel - Info */}
      <div className="hidden lg:flex w-[45%] bg-primary-dark flex-col relative overflow-hidden">
        <div className="p-12 relative z-20">
          <Logo variant="light" className="mb-16" />

          <h1 className="text-[40px] font-bold text-white leading-tight mb-6">
            Request Access to AI Vital
          </h1>
          <p className="text-[16px] text-white/80 leading-relaxed mb-16 max-w-md">
            AI Vital is a restricted platform for authorized Rwanda public
            health professionals. Complete the form to request access. Your
            account will be reviewed and activated within 24 hours.
          </p>

          <div className="space-y-8">
            {[
            'Complete the registration form',
            'Account reviewed by administrator',
            'Receive activation email and login'].
            map((step, i) =>
            <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <span className="text-white font-medium">{step}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto relative z-20 p-12">
          <div className="flex flex-wrap items-center gap-6 opacity-60">
            <span className="text-white font-bold tracking-wide">RBC</span>
            <span className="text-white font-bold tracking-wide">MOH</span>
            <span className="text-white font-bold tracking-wide">
              District Health Offices
            </span>
            <span className="text-white font-bold tracking-wide">NISR</span>
          </div>
        </div>

        <div className="absolute inset-0 z-10 bg-primary-dark/80 mix-blend-multiply" />
        <img
          src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
          alt="Public health worker"
          className="absolute inset-0 w-full h-full object-cover" />
        
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] bg-white h-screen overflow-y-auto">
        <div className="p-8 lg:p-16 max-w-[720px] mx-auto">
          <div className="lg:hidden mb-12">
            <Logo />
            <h1 className="text-[30px] font-bold text-text-primary mt-8 mb-2">
              Request Access
            </h1>
            <p className="text-text-secondary">
              AI Vital is a restricted platform for authorized Rwanda public
              health professionals.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
            className="space-y-12">
            
            {/* Section A */}
            <section>
              <h2 className="text-[18px] font-bold text-text-primary mb-6 pb-2 border-b border-border">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    required />
                  
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    required />
                  
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@rbc.gov.rw"
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    required />
                  
                </div>
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Phone Number
                  </label>
                  <div className="flex">
                    <div className="h-12 px-4 bg-section border border-border border-r-0 rounded-l-lg flex items-center gap-2 text-text-primary font-medium">
                      🇷🇼 +250
                    </div>
                    <input
                      type="tel"
                      placeholder="78X XXX XXX"
                      className="flex-1 h-12 px-4 bg-page border border-border rounded-r-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                      required />
                    
                  </div>
                </div>
              </div>
            </section>

            {/* Section B */}
            <section>
              <h2 className="text-[18px] font-bold text-text-primary mb-6 pb-2 border-b border-border">
                Professional Details
              </h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Select Your Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none"
                    required>
                    
                    <option value="">Select a role...</option>
                    <option value="analyst">Public Health Analyst</option>
                    <option value="epidemiologist">Epidemiologist</option>
                    <option value="dho">District Health Officer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Organization / Institution
                  </label>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    required />
                  
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Institution Type
                  </label>
                  <select
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none"
                    required>
                    
                    <option value="">Select type...</option>
                    <option>Rwanda Biomedical Centre (RBC)</option>
                    <option>Ministry of Health</option>
                    <option>District Health Office</option>
                    <option>National Reference Laboratory</option>
                    <option>NISR</option>
                    <option>WHO Rwanda</option>
                    <option>UNICEF Rwanda</option>
                    <option>Research Institution</option>
                    <option>Other</option>
                  </select>
                </div>

                {role === 'dho' &&
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[14px] font-medium text-[#374151]">
                      District
                    </label>
                    <select
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none appearance-none"
                    required>
                    
                      <option value="">Select district...</option>
                      <option>Kigali City</option>
                      <option>Huye</option>
                      <option>Musanze</option>
                      <option>Rusizi</option>
                      <option>Kayonza</option>
                      <option>Ngoma</option>
                    </select>
                  </div>
                }

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[14px] font-medium text-[#374151]">
                      Professional License / ID Number
                    </label>
                    <span className="text-[12px] bg-section text-primary px-2 py-0.5 rounded font-medium">
                      Optional
                    </span>
                  </div>
                  <input
                    type="text"
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none" />
                  
                </div>
              </div>
            </section>

            {/* Section C */}
            <section>
              <h2 className="text-[18px] font-bold text-text-primary mb-6 pb-2 border-b border-border">
                Account Security
              </h2>
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    required />
                  

                  {/* Strength Meter */}
                  <div className="pt-2">
                    <div className="flex gap-1 h-1.5 mb-2">
                      {[1, 2, 3, 4].map((segment) =>
                      <div
                        key={segment}
                        className={`flex-1 rounded-full ${password.length > 0 && score >= segment ? strengthColors[score] : 'bg-border'}`} />

                      )}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[13px] font-medium text-text-secondary">
                        Password strength:
                      </span>
                      <span
                        className={`text-[13px] font-bold ${password.length > 0 ? strengthColors[score].replace('bg-', 'text-') : 'text-text-secondary'}`}>
                        
                        {password.length > 0 ? strengthLabels[score] : 'None'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className={`flex items-center gap-2 text-[13px] ${password.length >= 12 ? 'text-alert-green' : 'text-text-secondary'}`}>
                        
                        <Check className="w-4 h-4" /> At least 12 characters
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[13px] ${/[A-Z]/.test(password) ? 'text-alert-green' : 'text-text-secondary'}`}>
                        
                        <Check className="w-4 h-4" /> Uppercase letter
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[13px] ${/[0-9]/.test(password) ? 'text-alert-green' : 'text-text-secondary'}`}>
                        
                        <Check className="w-4 h-4" /> Number
                      </div>
                      <div
                        className={`flex items-center gap-2 text-[13px] ${/[^A-Za-z0-9]/.test(password) ? 'text-alert-green' : 'text-text-secondary'}`}>
                        
                        <Check className="w-4 h-4" /> Special character
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full h-12 px-4 bg-page border border-border rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    required />
                  
                </div>

                <div className="space-y-3">
                  <label className="text-[14px] font-medium text-[#374151]">
                    Preferred MFA Method
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mfa"
                        defaultChecked
                        className="w-4 h-4 text-primary focus:ring-primary border-border" />
                      
                      <span className="text-[14px] text-text-primary">
                        SMS to Phone
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mfa"
                        className="w-4 h-4 text-primary focus:ring-primary border-border" />
                      
                      <span className="text-[14px] text-text-primary">
                        Email Code
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mfa"
                        className="w-4 h-4 text-primary focus:ring-primary border-border" />
                      
                      <span className="text-[14px] text-text-primary">
                        Authenticator App
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* Section D */}
            <section className="space-y-6 pt-6 border-t border-border">
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary"
                    required />
                  
                  <span className="text-[14px] text-text-secondary leading-relaxed">
                    I agree to the AI Vital Terms of Use and Data Privacy Policy
                    (Rwanda Law No. 058/2021)
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded border-border text-primary focus:ring-primary"
                    required />
                  
                  <span className="text-[14px] text-text-secondary leading-relaxed">
                    I confirm that I am an authorized public health professional
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary-hover text-white text-[15px] font-semibold rounded-lg transition-colors">
                
                Submit Access Request
              </button>

              <div className="text-center pt-4">
                <span className="text-[15px] text-text-secondary">
                  Already have an account?{' '}
                </span>
                <Link
                  to="/login"
                  className="text-[15px] text-primary font-semibold hover:underline">
                  
                  Sign In
                </Link>
              </div>
            </section>
          </form>
        </div>
      </div>
    </div>);

}