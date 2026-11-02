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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'h-20 bg-[#050505]/80 backdrop-blur-md border-b border-[#252525]'
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
                className="text-[#FFD21F] group-hover:scale-110 transition-transform"
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
              <span className="font-display font-extrabold text-xl tracking-tight text-[#F5F5F0]">
                THUN<span className="text-[#FFD21F]">SPARK</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {/* Services with MegaMenu */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  ref={servicesBtnRef}
                  type="button"
                  onClick={() => setServicesOpen((prev) => !prev)}
                  aria-expanded={servicesOpen}
                  className={`text-sm font-medium transition-colors hover:text-[#F5F5F0] flex items-center gap-1.5 py-2 cursor-pointer ${
                    pathname.startsWith('/services') || servicesOpen
                      ? 'text-[#FFD21F]'
                      : 'text-[#A6A6A0]'
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
                className={`text-sm font-medium transition-colors hover:text-[#F5F5F0] ${
                  pathname === '/about' ? 'text-[#FFD21F]' : 'text-[#A6A6A0]'
                }`}
              >
                About
              </Link>
              <Link
                href="/projects"
                className={`text-sm font-medium transition-colors hover:text-[#F5F5F0] ${
                  pathname.startsWith('/projects') ? 'text-[#FFD21F]' : 'text-[#A6A6A0]'
                }`}
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className={`text-sm font-medium transition-colors hover:text-[#F5F5F0] ${
                  pathname.startsWith('/blog') ? 'text-[#FFD21F]' : 'text-[#A6A6A0]'
                }`}
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-[#F5F5F0] ${
                  pathname === '/contact' ? 'text-[#FFD21F]' : 'text-[#A6A6A0]'
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
                className="md:hidden p-2 text-[#F5F5F0] hover:text-[#FFD21F] focus:outline-none cursor-pointer"
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
          onClose={() => setServicesOpen(false)}
          triggerRef={servicesBtnRef}
        />
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#050505] pt-24 px-6 flex flex-col md:hidden overflow-y-auto">
          <nav className="space-y-6 text-lg font-display">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F5F5F0] hover:text-[#FFD21F]"
            >
              Home
            </Link>
            <div className="space-y-3">
              <span className="font-mono text-xs text-[#8A8A85] uppercase tracking-wider block">
                Services
              </span>
              <div className="pl-3 space-y-2.5 border-l border-[#252525]">
                {siteConfig.serviceGroups.map((g) => (
                  <Link
                    key={g.id}
                    href={`/services#${g.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-[#A6A6A0] hover:text-[#FFD21F]"
                  >
                    {g.number} · {g.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F5F5F0] hover:text-[#FFD21F]"
            >
              About
            </Link>
            <Link
              href="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F5F5F0] hover:text-[#FFD21F]"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F5F5F0] hover:text-[#FFD21F]"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#F5F5F0] hover:text-[#FFD21F]"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto py-8 border-t border-[#252525] space-y-4">
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get a growth audit
            </Button>
            <div className="text-xs text-[#8A8A85] text-center">
              {siteConfig.contact.email}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
