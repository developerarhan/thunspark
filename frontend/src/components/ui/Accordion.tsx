'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  q: string;
  a: string;
}

export function Accordion({
  items,
  singleOpen = true,
  className = '',
}: {
  items: readonly AccordionItem[] | AccordionItem[];
  singleOpen?: boolean;
  className?: string;
}) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (singleOpen) {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    } else {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    }
  };

  return (
    <div className={`divide-y divide-[#252525] border-y border-[#252525] ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div key={idx} className="py-5">
            <button
              type="button"
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between text-left group focus:outline-none focus-visible:outline-2 focus-visible:outline-[#FFD21F] rounded-lg py-1"
            >
              <span className="font-display font-medium text-lg md:text-xl text-[#F5F5F0] group-hover:text-[#FFD21F] transition-colors pr-6">
                {item.q}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 text-[#8A8A85] group-hover:text-[#FFD21F] transition-colors"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pt-4 text-[#A6A6A0] text-base leading-relaxed max-w-2xl">
                    {item.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
