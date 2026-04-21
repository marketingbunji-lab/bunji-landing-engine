"use client";

import { useState } from "react";

type Item = {
  title: string;
  content: string;
};

export default function Accordion({ items }: { items: Item[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden"
          >
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-gray-900"
            >
              {item.title}

              <span className="text-xl">
                {isOpen ? "−" : "+"}
              </span>
            </button>

            <div
              className={`px-5 pb-4 text-gray-600 transition-all duration-300 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}