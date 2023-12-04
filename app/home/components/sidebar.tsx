"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const SidebarNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {[
        {
          href: "/home",
          title: "Organizations",
        },
        {
          href: "/home/users",
          title: "Users",
        },
        {
          href: "/home/addresses",
          title: "Addresses",
        },
        ,
        {
          href: "/home/incidents",
          title: "Incidents",
        },
      ].map((item) => (
        item ? (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            {item.title}
          </Link>
        ) : null
      ))}
    </nav>
  );
};
