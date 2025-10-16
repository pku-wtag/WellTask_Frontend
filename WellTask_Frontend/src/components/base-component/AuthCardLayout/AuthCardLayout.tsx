import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../Button";

interface AuthCardLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  url?: { label: string; path: string };
  alert?: { title?: string; message: string };
}

export function AuthCardLayout({
  title,
  description,
  children,
  url: url,
  alert,
}: AuthCardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {url && (
        <div className="absolute top-6 right-6">
          <Link to={url.path}>
            <Button type="outline">{url.label}</Button>
          </Link>
        </div>
      )}

      <div className="w-full max-w-lg text-center z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mb-8">{description}</p>
        )}

        {children}

        {alert && (
          <div className="mt-6 p-4 rounded-lg bg-yellow-100 border border-yellow-200 flex items-center gap-1 text-sm text-yellow-700">
            {alert.title && <span className="font-medium">{alert.title}</span>}
            {alert.message}
          </div>
        )}
      </div>

      <img
        src="/bg.png"
        alt="Background"
        className="absolute bottom-0 left-0 w-full object-cover pointer-events-none select-none"
      />
    </div>
  );
}
