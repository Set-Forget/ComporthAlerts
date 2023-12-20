import { Separator } from "@/components/ui/separator";

import { Header, SidebarNav } from "./components";

export const metadata = {
  title: "Comporth Alerts",
  description: "Comporth Alerts",
};

export default async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="space-y-6 px-6 py-4 h-full flex flex-col">
      <Header />
      <Separator />
      <div className="flex flex-1 gap-3">
        <aside className="w-1/12">
          <SidebarNav />
        </aside>
        <Separator orientation="vertical" />

        <div className="px-3 flex-1">{children}</div>
      </div>
    </div>
  );
};
