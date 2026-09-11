'use client';

import React, { useState } from 'react';
import { RouteType, CurrencyCode } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  Lock,
  Check,
  Globe,
  Layers,
  Cpu,
  Cloud,
  Sparkles,
  Search
} from 'lucide-react';
import { ThemeToggle } from './ui/theme-toggle';
import { GlowEffect } from '@/components/core/glow-effect';

interface NavbarProps {
  currentRoute: RouteType;
  onNavigate: (route: RouteType) => void;
  isLoggedIn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, isLoggedIn = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const { currency, setCurrency, currencyConfig } = useCurrency();

  const handleNav = (route: RouteType) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    setCurrencyDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Work', route: 'work' as RouteType },
    { label: 'Process', route: 'process' as RouteType },
    { label: 'Pricing', route: 'pricing' as RouteType },
    { label: 'About', route: 'about' as RouteType },
    { label: 'Contact', route: 'contact' as RouteType },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full apple-frosted-nav transition-all">
      {/* 44px Apple Global Nav Bar */}
      <nav 
        id="global-nav" 
        className="max-w-7xl mx-auto h-[44px] px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[12px] font-normal tracking-[-0.01em]"
        aria-label="Global Navigation"
      >
        {/* Apple-style Brand Mark */}
        <button 
          id="nav-logo-btn"
          onClick={() => handleNav('home')}
          className="flex items-center gap-2 group focus:outline-none py-1"
        >
          {/* Brand logo — transparent PNG so it blends into the dark frosted nav */}
          <img
            src="/assets/bitnexel-logo.png"
            alt="Bitnexel"
            className="h-7 w-7 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="font-semibold text-foreground tracking-tight text-[14px]">
            Bitnexel
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-foreground-soft">
          {/* Capabilities Dropdown */}
          <div 
            className="relative py-2"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              id="nav-services-dropdown-btn"
              onClick={() => handleNav('services')}
              className={`flex items-center gap-1 transition-colors hover:text-foreground ${
                currentRoute.startsWith('services') ? 'text-foreground font-medium' : ''
              }`}
            >
              <span>Capabilities</span>
              <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-150 ${servicesDropdownOpen ? 'rotate-180 text-foreground' : ''}`} />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 p-2 rounded-[18px] bg-muted/95 backdrop-blur-2xl border border-border shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => handleNav('services/website')}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-surface transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0071e3]/10 border border-[#0071e3]/20 flex items-center justify-center text-[#2997ff] mt-0.5 group-hover:scale-105 transition-transform">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-foreground group-hover:text-[#2997ff] transition-colors">
                      Digital Flagships
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      Sub-second 3D & interactive brand experiences
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('services/software')}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-surface transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-text mt-0.5 group-hover:scale-105 transition-transform">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-foreground group-hover:text-emerald-text transition-colors">
                      Custom Software & ERPs
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      Proprietary operational engines & automation
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleNav('services/web-app')}
                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-surface transition-colors text-left group"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-accent-text mt-0.5 group-hover:scale-105 transition-transform">
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-foreground group-hover:text-accent-text transition-colors">
                      Cloud Web Apps & SaaS
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      Multi-tenant platforms with real-time sync
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {navItems.map((item) => (
            <button
              key={item.route}
              id={`nav-link-${item.route}`}
              onClick={() => handleNav(item.route)}
              className={`transition-colors hover:text-foreground ${
                currentRoute === item.route ? 'text-foreground font-medium' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-3">
          {/* Theme toggle — desktop/tablet only (also available in the mobile drawer) */}
          <ThemeToggle className="hidden sm:flex" />

          {/* Currency Pill */}
          <div className="relative">
            <button
              id="nav-currency-toggle"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface hover:bg-surface text-foreground border border-border transition-all"
            >
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>

            {currencyDropdownOpen && (
              <div 
                className="absolute right-0 top-full mt-1.5 w-36 rounded-xl bg-muted/95 backdrop-blur-2xl border border-border shadow-xl p-1 z-50 animate-in fade-in"
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
              >
                <div className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-mono text-muted-foreground border-b border-border mb-1">
                  Currency
                </div>

                {(['USD', 'AED', 'INR'] as CurrencyCode[]).map((code) => {
                  const cfg = currencyConfig[code];
                  const isSelected = currency === code;

                  return (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                        isSelected 
                          ? 'bg-[#0071e3] text-white font-medium' 
                          : 'text-foreground-soft hover:text-foreground hover:bg-surface'
                      }`}
                    >
                      <span>{cfg.code} ({cfg.symbol.trim()})</span>
                      {isSelected && <Check className="w-3 h-3 text-foreground" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Client Portal Link */}
          <button
            id="nav-client-portal-btn"
            onClick={() => handleNav(isLoggedIn ? 'portal' : 'login')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] transition-all ${
              currentRoute === 'portal' || currentRoute === 'login'
                ? 'bg-surface text-foreground border border-border'
                : 'text-foreground-soft hover:text-foreground'
            }`}
          >
            <Lock className="w-3 h-3 text-emerald-text" />
            <span>{isLoggedIn ? 'Client Portal' : 'Login'}</span>
          </button>

          {/* Primary Apple Pill CTA */}
          <div className="relative">
            <GlowEffect
              colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
              mode="colorShift"
              blur="soft"
              duration={3}
              scale={0.9}
            />
            <button
              id="nav-start-project-btn"
              onClick={() => handleNav('start')}
              className="relative apple-btn-primary text-sm py-2 px-5 font-medium"
            >
              <span>Start Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-white ml-0.5" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            id="nav-mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg text-foreground-soft hover:text-foreground focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer - Apple Style Curtain */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[44px] bottom-0 bg-background/98 backdrop-blur-2xl p-6 overflow-y-auto z-50 flex flex-col justify-between animate-in fade-in duration-200">
          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Capabilities
              </div>
              <button
                onClick={() => handleNav('services/website')}
                className="w-full text-left text-xl font-display font-semibold text-foreground py-1 flex items-center justify-between"
              >
                <span>Digital Flagships</span>
                <span className="text-xs text-[#2997ff] font-mono">3D / Web</span>
              </button>
              <button
                onClick={() => handleNav('services/software')}
                className="w-full text-left text-xl font-display font-semibold text-foreground py-1 flex items-center justify-between"
              >
                <span>Custom Software & ERPs</span>
                <span className="text-xs text-emerald-text font-mono">Backend</span>
              </button>
              <button
                onClick={() => handleNav('services/web-app')}
                className="w-full text-left text-xl font-display font-semibold text-foreground py-1 flex items-center justify-between"
              >
                <span>Cloud Web Applications</span>
                <span className="text-xs text-accent-text font-mono">SaaS</span>
              </button>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Navigation
              </div>
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className="w-full text-left text-xl font-display font-semibold text-foreground py-1 flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-border space-y-3 pb-8">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-foreground">Appearance</span>
              <ThemeToggle />
            </div>
            <button
              onClick={() => handleNav(isLoggedIn ? 'portal' : 'login')}
              className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 bg-surface text-foreground hover:bg-surface transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-text" />
              <span>{isLoggedIn ? 'Access Client Portal' : 'Client Login'}</span>
            </button>

            <div className="relative">
              <GlowEffect
                colors={['#FF5733', '#33FF57', '#3357FF', '#F1C40F']}
                mode="colorShift"
                blur="soft"
                duration={3}
                scale={0.9}
              />
              <button
                onClick={() => handleNav('start')}
                className="relative apple-btn-primary w-full py-3 text-sm font-normal justify-center"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
