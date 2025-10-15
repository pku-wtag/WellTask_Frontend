import classNames from "classnames";
import { Button } from "./Button";

interface SidePanelProps {
  title: string;
  subtitle: string;
  showAppButtons?: boolean;
  position?: "left" | "right";
  isVisible?: boolean;
}

export function SidePanel({
  title,
  subtitle,
  showAppButtons = false,
  position = "left",
  isVisible = false,
}: SidePanelProps) {
  if (!isVisible) return null;

  const containerClass = classNames(
    "relative hidden md:flex w-1/2 text-white p-12 flex-col overflow-hidden",
    {
      "order-last": position === "right",
      "order-first": position === "left",
    }
  );

  const bgClass = classNames("absolute inset-0 bg-cover bg-center", {
    "scale-x-[-1]": position === "right",
  });

  return (
    <div className={containerClass}>
      <div
        className={bgClass}
        style={{ backgroundImage: "url('/image.png')" }}
      />

      <div className="relative z-10 flex-grow flex flex-col justify-center">
        <div className="max-w-md">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-12">
            {title}
          </h1>
          <p className="font-semibold mb-4">{subtitle}</p>

          {showAppButtons && (
            <div className="flex gap-4">
              <Button type="secondary">Download on Apple</Button>
              <Button type="secondary">Download on Android</Button>
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
