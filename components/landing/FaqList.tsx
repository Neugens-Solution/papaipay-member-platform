"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

type FaqListProps = {
  items: Array<{ question: string; answer: string }>;
};

export function FaqList({ items }: FaqListProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="border-t border-[#172235]/25">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.question} className="border-b border-[#172235]/20 py-5 sm:py-6">
            <button
              type="button"
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-start justify-between gap-6 text-left text-base font-semibold leading-7 text-[#172235] transition-colors hover:text-[#a47c48] sm:text-lg"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.question}</span>
              <Plus
                aria-hidden="true"
                size={20}
                strokeWidth={1.5}
                className={`mt-1 flex-none text-[#a47c48] transition-transform ${isOpen ? "rotate-45" : ""}`}
              />
            </button>
            {isOpen ? <p className="max-w-3xl pt-4 text-sm leading-7 text-[#626a75] sm:text-base sm:leading-8">{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
