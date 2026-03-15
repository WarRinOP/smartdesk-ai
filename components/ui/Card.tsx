import * as React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className = "",
  header,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden ${className}`}
    >
      {header && (
        <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between">
          {header}
        </div>
      )}
      <div className={paddings[padding]}>{children}</div>
    </div>
  );
}
