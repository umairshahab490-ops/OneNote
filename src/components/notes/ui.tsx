import { cn } from "@/lib/cn";
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

export function Mark({ className }: { className?: string }) {
  return (
    <span className={cn("mark", className)} aria-hidden="true">
      N
    </span>
  );
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return (
    <button type="button" aria-label={label} title={label} className={cn("icon-btn press", className)} {...props}>
      {children}
    </button>
  );
}

export function RenameField({
  initial,
  label,
  className,
  onCommit,
  onCancel,
}: {
  initial: string;
  label: string;
  className?: string;
  onCommit: (value: string) => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const cancelRef = useRef(false);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  return (
    <input
      ref={ref}
      aria-label={label}
      value={value}
      maxLength={80}
      className={cn("rename-field", className)}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => {
        if (cancelRef.current) return;
        onCommit(value);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          onCommit(value);
        }
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          cancelRef.current = true;
          onCancel();
        }
      }}
    />
  );
}
