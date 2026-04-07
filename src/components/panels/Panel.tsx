import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import { getStatsData } from "../../domain/stats";

interface PanelProps {
  title: string;
  isOpen: boolean;
  close: () => void;
  children?: React.ReactNode;
}

export function Panel({ title, isOpen, close, children }: PanelProps) {
  const [debug, setDebug] = useState(0);
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    setDebug(0);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={close}
      className="flex h-full justify-center p-2 md:p-4"
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 100,
          backgroundColor: isDark
            ? "rgba(2, 6, 23, 0.82)"
            : "rgba(226, 232, 240, 0.78)",
          backdropFilter: "blur(10px)",
        },
        content: {
          background: "transparent",
          border: "none",
          padding: 0,
          inset: 0,
          position: "relative",
        },
      }}
    >
      <div className="w-full max-w-lg overflow-auto rounded-2xl border border-slate-200/80 bg-white/95 px-3 text-sm text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <header className="mb-3 flex border-b-2 border-slate-200/80 dark:border-slate-700/80">
          <h2
            className="text-2xl font-bold uppercase tracking-wide text-center my-1 flex-auto"
            onClick={() => setDebug((prev) => prev + 1)}
          >
            {title}
          </h2>
          <button
            className="text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            type="button"
            onClick={close}
          >
            ✖️
          </button>
        </header>
        {children}
        {debug >= 5 && <div>!!!{JSON.stringify(getStatsData())}</div>}
      </div>
    </Modal>
  );
}
