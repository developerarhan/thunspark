'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { track } from '@/lib/analytics';

export interface AccordionItem {
  id?: string;
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
    const isOpening = !openIndices.includes(index);
    if (isOpening && items[index]) {
      const item = items[index];
      const questionId =
        item.id ||
        item.q
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '')
          .slice(0, 50) ||
        `faq_${index + 1}`;
      track('faq_open', { question_id: questionId });
    }

    if (singleOpen) {
      setOpenIndices((prev) => (prev.includes(index) ? [] : [index]));
    } else {
      setOpenIndices((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    }
  };

  return (
    <div className={`divide-y divide-line border-y border-line ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        return (
          <div key={idx} className="py-5">
            <button
              type="button"
              id={`accordion-header-${idx}`}
              onClick={() => toggleIndex(idx)}
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${idx}`}
              className="w-full flex items-center justify-between text-left group focus:outline-none focus-visible:outline-2 focus-visible:outline-accent rounded-lg py-1"
            >
              <span className="font-display font-medium text-lg md:text-xl text-ink group-hover:text-accent transition-colors pr-6">
                {item.q}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="shrink-0 text-meta group-hover:text-accent transition-colors"
              >
                <ChevronDown size={20} />
              </motion.div>
            </button>

            <motion.div
              id={`accordion-panel-${idx}`}
              role="region"
              aria-labelledby={`accordion-header-${idx}`}
              aria-hidden={!isOpen}
              initial={false}
              animate={{
                height: isOpen ? 'auto' : 0,
                opacity: isOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="pt-4 text-soft text-base leading-relaxed max-w-3xl">
                {item.a}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
