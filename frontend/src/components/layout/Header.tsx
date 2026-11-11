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
        <Container className="h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus:outline-none"
            >
              {/* Lightning Mark */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-accent group-hover:scale-110 transition-transform"
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
              <span className="font-display font-extrabold text-xl tracking-tight text-ink">
                THUN<span className="text-accent">SPARK</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
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
            <div className="flex items-center gap-4">
              <Button
                href="/contact"
                variant="primary"
                size="sm"
                className="hidden lg:inline-flex"
                data-analytics-cta="header_growth_audit"
              >
                Get a growth audit
              </Button>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden p-2 text-ink hover:text-accent focus:outline-none cursor-pointer"
                aria-label="Toggle navigation menu"
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
        <div className="fixed inset-0 z-30 bg-base pt-24 px-6 flex flex-col md:hidden overflow-y-auto">
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

          <div className="mt-auto py-8 border-t border-line space-y-4">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get a growth audit
            </Button>
            <div className="text-xs text-meta text-center">
              {siteConfig.contact.email}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
