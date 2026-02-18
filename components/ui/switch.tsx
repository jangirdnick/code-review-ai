"use client";

import { MoonIcon, SunMediumIcon } from "lucide-react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "@/lib/utils";

// Your custom Switch (keep as-is or import from @/components/ui/switch if you moved it)
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
    icon?: React.ReactNode;
    thumbClassName?: string;
  }
>(({ className, icon, thumbClassName, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none flex h-4 w-4 items-center justify-center rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        thumbClassName
      )}
    >
      {icon ?? null}
    </SwitchPrimitive.Thumb>
  </SwitchPrimitive.Root>
));
Switch.displayName = "Switch";

export default function ThemeSwitch() {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  // On mount: read from localStorage or system preference
  React.useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem("theme") as "light" | "dark" | null;

    if (saved) {
      setTheme(saved);
    } else {
      // First visit → follow system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);

  // Apply theme to <html> and save to localStorage
  React.useEffect(() => {
    if (!mounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  // Toggle handler
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Prevent flash: don't render until mounted
  if (!mounted) {
    return (
      <Switch
        checked={false}
        className="h-7 w-12 opacity-0"
        disabled
      />
    ); // invisible placeholder to avoid layout shift
  }

  return (
<Switch
  checked={theme === "dark"}
  onCheckedChange={toggleTheme}
  className="h-7 w-full rounded-sm data-[state=checked]:bg-zinc-800 data-[state=unchecked]:bg-zinc-200"
  icon={
    theme === "dark" ? (
      <MoonIcon className="h-4 w-4 text-yellow-300" />
    ) : (
      <SunMediumIcon className="h-4 w-4 text-amber-500" />
    )
  }
  thumbClassName="
    h-6 w-6
    transition-all duration-300 ease-in-out
    bg-white dark:bg-zinc-900 shadow-md
  "
/>

  );
}