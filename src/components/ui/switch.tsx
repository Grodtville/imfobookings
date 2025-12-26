"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function Switch({
  className,
  checked,
  defaultChecked,
  onChange,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("inline-flex items-center cursor-pointer", className)}>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        {...props}
      />
      <span className="relative inline-block w-11 h-6 bg-gray-200 rounded-full transition-colors">
        <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform will-change-transform" />
      </span>
    </label>
  );
}

export { Switch };
