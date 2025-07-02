'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
          fixed sm:relative z-50 flex flex-col bg-gray-800 text-white transition-all duration-300
          ${isMobile
            ? isOpen ? 'w-64 left-0' : 'w-0 left-[-100%]'
            : isOpen ? 'w-64' : 'w-16'}
          h-screen
        `}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <span className="text-xl font-bold">
            {isOpen ? 'MyApp' : '🅰️'}
          </span>
        </div>

        <nav className="flex-1 space-y-2 mt-4 px-2">
          <Link href="/dashboard/employee" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <Menu size={20} />
            {isOpen && <span>Employees</span>}
          </Link>
          <Link href="/dashboard/user" className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded">
            <Settings size={20} />
            {isOpen && <span>Users</span>}
          </Link>
        </nav>

        <div className="mt-auto border-t border-gray-700 p-2">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center hover:bg-gray-700 p-2 rounded"
          >
            {isOpen
              ? <ChevronLeft size={20} />
              : <ChevronRight size={20} />
            }
          </button>
        </div>
      </aside>
    </>
  );
}