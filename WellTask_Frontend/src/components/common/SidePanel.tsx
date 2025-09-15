import { Button } from "../ui/Button";

interface SidePanelProps {
  title: string;
  subtitle: string;
  showAppButtons?: boolean;
  position?: "left" | "right";
}

export function SidePanel({
  title,
  subtitle,
  showAppButtons = false,
  position = "left",
}: SidePanelProps) {
  return (
    <div
      className={`relative hidden md:flex w-1/2 text-white p-12 flex-col overflow-hidden 
        ${position === "right" ? "order-last" : "order-first"}`}
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          position === "right" ? "scale-x-[-1]" : ""
        }`}
        style={{ backgroundImage: "url('/image.png')" }}
      />

      {/* Content */}
      <div className="relative z-10 flex-grow flex flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-12">
            {title}
          </h1>
          <p className="font-semibold mb-4">{subtitle}</p>

          {showAppButtons && (
            <div className="flex gap-4">
              <Button variant="secondary">Download on Apple</Button>
              <Button variant="secondary">Download on Android</Button>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 text-sm opacity-80">
        <p>Copyright {new Date().getFullYear()} | All Rights Reserved</p>
      </div>
    </div>
  );
}
