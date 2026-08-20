import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 pb-24 md:pb-8">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
