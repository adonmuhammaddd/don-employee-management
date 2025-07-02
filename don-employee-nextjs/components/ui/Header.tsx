'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    alert('Logout!');
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
  };

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold">Dashboard</h1>

      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setOpen(!open)}>
          <Image
            src="/images/swan.gif"
            alt="User Avatar"
            width={36}
            height={36}
            className="rounded-full object-cover"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
            <button
              onClick={handleProfile}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}