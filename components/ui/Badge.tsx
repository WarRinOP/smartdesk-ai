import * as React from "react";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "neutral" | "accent";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  children,
  className = "",
}: BadgeProps) {
  const variants = {
    success: "bg-[#3fb950]/15 text-[#3fb950] border-[#3fb950]/30",
    warning: "bg-[#d29922]/15 text-[#d29922] border-[#d29922]/30",
    danger:  "bg-[#f85149]/15 text-[#f85149] border-[#f85149]/30",
    neutral: "bg-[#21262d] text-[#8b949e] border-[#30363d]",
    accent:  "bg-[#2f81f7]/15 text-[#2f81f7] border-[#2f81f7]/30",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
