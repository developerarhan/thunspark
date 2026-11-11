'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { MegaMenu } from './MegaMenu';
import { siteConfig } from '@/site.config';

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesBtnRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup hover-intent timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const handleOpenServices = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(true);
  };

  const handleCloseServices = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
    }, 200);
  };

  const handleImmediateCloseServices = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setServicesOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'h-20 bg-base/80 backdrop-blur-md border-b border-line'
            : 'h-20 bg-transparent'
        }`}
      >
        <Container className="h-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 sm:gap-4 h-full min-w-0">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink group focus:outline-none"
            >
              {/* Lightning Mark */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-[22px] sm:h-[22px] shrink-0 text-accent group-hover:scale-110 transition-transform"
              >
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  fill="#FFD21F"
                  stroke="#FFD21F"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-display font-extrabold text-sm sm:text-base md:text-xl tracking-tight text-ink truncate">
                THUN<span className="text-accent">SPARK</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {/* Services with MegaMenu */}
              <div
                className="relative"
                onMouseEnter={handleOpenServices}
                onMouseLeave={handleCloseServices}
              >
                <button
                  ref={servicesBtnRef}
                  type="button"
                  onClick={() => setServicesOpen((prev) => !prev)}
                  onFocus={handleOpenServices}
                  aria-expanded={servicesOpen}
                  className={`text-sm font-medium transition-colors hover:text-ink flex items-center gap-1.5 py-2 cursor-pointer ${
                    pathname.startsWith('/services') || servicesOpen
                      ? 'text-accent'
                      : 'text-soft'
                  }`}
                >
                  <span>Services</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      servicesOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  pathname === '/about' ? 'text-accent' : 'text-soft'
                }`}
              >
                About
              </Link>
              <Link
                href="/projects"
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  pathname.startsWith('/projects') ? 'text-accent' : 'text-soft'
                }`}
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  pathname.startsWith('/blog') ? 'text-accent' : 'text-soft'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-ink ${
                  pathname === '/contact' ? 'text-accent' : 'text-soft'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Action */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="inline-flex lg:hidden shrink-0">
                <Button
                  href="/contact"
                  variant="primary"
                  size="sm"
                  className="px-2.5! py-1.5! sm:px-3.5! sm:py-2! text-[11px]! sm:text-xs! whitespace-nowrap"
                  data-analytics-cta="header_growth_audit_mobile"
                >
                  Get Audit
                </Button>
              </div>

              <div className="hidden lg:inline-flex shrink-0">
                <Button
                  href="/contact"
                  variant="primary"
                  size="sm"
                  className="hidden lg:inline-flex whitespace-nowrap"
                  data-analytics-cta="header_growth_audit"
                >
                  Get a growth audit
                </Button>
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 -mr-2 text-ink hover:text-accent focus:outline-none cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </Container>

        {/* MegaMenu Dropdown */}
        <MegaMenu
          isOpen={servicesOpen}
          onClose={handleImmediateCloseServices}
          onMouseEnter={handleOpenServices}
          onMouseLeave={handleCloseServices}
          triggerRef={servicesBtnRef}
        />
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="fixed inset-0 z-30 bg-base pt-24 pb-8 px-4 sm:px-6 flex flex-col md:hidden overflow-y-auto"
        >
          <nav className="space-y-6 text-lg font-display">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-ink hover:text-accent"
            >
              Home
            </Link>
            <div className="space-y-3">
              <span className="font-mono text-xs text-meta uppercase tracking-wider block">
                Services
              </span>
              <div className="pl-3 space-y-2.5 border-l border-line">
                {siteConfig.serviceGroups.map((g) => (
                  <Link
                    key={g.id}
                    href={`/services#${g.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-soft hover:text-accent"
                  >
                    {g.number} · {g.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-ink hover:text-accent"
            >
              About
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-ink hover:text-accent"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-ink hover:text-accent"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-ink hover:text-accent"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto pt-6 pb-4 border-t border-line space-y-4">
            <div className="w-full [&>div]:block [&>div]:w-full">
              <Button
                href="/contact"
                variant="primary"
                size="md"
                className="w-full text-center"
                data-analytics-cta="mobile_drawer_growth_audit"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get a growth audit
              </Button>
            </div>
            <div className="text-xs text-meta text-center">
              {siteConfig.contact.email}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
