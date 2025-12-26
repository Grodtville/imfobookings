import * as React from "react";

import { cn } from "@/lib/utils";

function Table({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("w-full rounded-md border", className)} {...props} />
  );
}

function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <div className={cn("border-b px-4 py-3 bg-gray-50", className)} {...props}>
      {children}
    </div>
  );
}

function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-4 py-3", className)} {...props}>
      {children}
    </div>
  );
}

function TableRow({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 border-b last:border-b-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TableHead({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("w-1/4 font-medium text-sm text-gray-700", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function TableCell({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("w-1/4 text-sm text-gray-600", className)} {...props}>
      {children}
    </div>
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
