"use client";

import { useEffect } from "react";

type Props = {
  programName: string;
};

export default function ClientifyProgramSelector({ programName }: Props) {
  useEffect(() => {
    if (!programName) return;

    const TARGET_TEXT = programName;

    const findSelectByOptionText = (doc: Document, text: string) => {
      for (const sel of Array.from(doc.querySelectorAll("select"))) {
        const match = Array.from(sel.options).find(
          (o) => o.text.trim() === text
        );
        if (match) {
          return {
            select: sel as HTMLSelectElement,
            option: match as HTMLOptionElement,
          };
        }
      }
      return null;
    };

    const applySelection = () => {
      const docs: Document[] = [document];

      for (const iframe of Array.from(document.querySelectorAll("iframe"))) {
        try {
          const idoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (idoc) docs.push(idoc);
        } catch {
          // ignore cross-origin iframes
        }
      }

      let chosen: {
        select: HTMLSelectElement;
        option: HTMLOptionElement;
      } | null = null;

      for (const d of docs) {
        const result = findSelectByOptionText(d, TARGET_TEXT);
        if (result) {
          chosen = result;
          break;
        }
      }

      if (!chosen) return false;

      const { select, option } = chosen;

      select.value = option.value;
      option.selected = true;

      select.dispatchEvent(new Event("input", { bubbles: true }));
      select.dispatchEvent(new Event("change", { bubbles: true }));

      select.style.display = "none";
      select.setAttribute("aria-hidden", "true");

      return true;
    };

    let tries = 0;
    const maxTries = 15;

    const interval = window.setInterval(() => {
      tries += 1;
      const success = applySelection();

      if (success || tries >= maxTries) {
        window.clearInterval(interval);
      }
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [programName]);

  return null;
}