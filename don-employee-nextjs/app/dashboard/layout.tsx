import Header from '@/components/ui/Header';
import Sidebar from '@/components/ui/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header />
        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}