import React from "react";
import { Button } from "../Button";

interface NavButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  badge?: boolean;
  className?: string;
}

export function NavButton({
  icon,
  label,
  onClick,
  badge,
  className,
}: NavButtonProps) {
  return (
    <Button
      type="custom"
      onClick={onClick}
      className={`relative flex items-center rounded-lg text-sm ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
      {badge && (
        <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
      )}
    </Button>
  );
}
