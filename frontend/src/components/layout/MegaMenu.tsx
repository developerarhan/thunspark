'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/site.config';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function MegaMenu({ isOpen, onClose, triggerRef }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-full left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-b border-[#252525] z-40 py-10"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-8">
              {siteConfig.serviceGroups.map((group) => (
                <div key={group.id} className="space-y-4">
                  {/* Category Header Link */}
                  <Link
                    href={`/services#${group.id}`}
                    onClick={onClose}
                    className="group block"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[#FFD21F] font-bold">
                        {group.number}
                      </span>
                      <span className="font-display font-bold text-base text-[#F5F5F0] group-hover:text-[#FFD21F] transition-colors">
                        {group.name}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A8A85] line-clamp-1">
                      {group.role}
                    </p>
                  </Link>

                  {/* Sub-Services List */}
                  <ul className="space-y-2.5 pt-2 border-t border-[#252525]">
                    {group.services.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={`/services/${service.slug}`}
                          onClick={onClose}
                          data-cursor="EXPLORE"
                          className="text-xs text-[#A6A6A0] hover:text-[#FFD21F] hover:translate-x-1 transition-all duration-150 block py-0.5"
                        >
                          {service.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Overview Bar */}
            <div className="mt-8 pt-6 border-t border-[#252525] flex items-center justify-between text-xs text-[#8A8A85]">
              <span>Four connected growth disciplines built around your business.</span>
              <Link
                href="/services"
                onClick={onClose}
                className="text-[#FFD21F] hover:text-[#FFE75A] font-semibold flex items-center gap-1 group"
              >
                <span>View all services overview</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
