'use client';

import React, { useEffect } from 'react'
import { useState, useMemo } from 'react';
import UserFormModal from '@/components/UserFormModal';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
  gender: string;
  role: string;
};

export default function UserPage() {
  const loggedUser = Cookies.get('loggedUser');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [UserList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const checkUser = () => {
      if (JSON.parse(loggedUser!)?.role !== 'Super Admin') redirect('/dashboard')
    }

    fetch('http://localhost:3001/users', {
      headers: { 'Content-Type': 'application/json'}
    })
      .then((res) => res.json())
      .then((data) => {
        setUserList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal ambil data:', err);
        setLoading(false);
      });
      checkUser()
  }, []);

  const handleSaveUser = async (data: User) => {
    try {
    if (selectedUser) {
      const res = await fetch(`http://localhost:3001/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const updated = await res.json();

      setUserList((prev) =>
        prev.map((usr) => (usr.id === updated.id ? updated : usr))
      );
    } else {
      const res = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
      const newusr = await res.json();
      setUserList((prev) => [...prev, newusr]);
    }

    setModalOpen(false);
    setSelectedUser(null);
  } catch (err) {
    console.error('Gagal menyimpan user:', err);
  }
  };

  const handleDeleteUser = async (id: number) => {
  const confirm = window.confirm('Yakin ingin menghapus user ini?');
  if (!confirm) return;

  try {
    await fetch(`http://localhost:3001/users/${id}`, {
      headers: { 'Content-Type': 'application/json'},
      method: 'DELETE',
    });

    // Hapus dari state
    setUserList((prev) => prev.filter((usr) => usr.id !== id));
  } catch (err) {
    console.error('Gagal menghapus user:', err);
  }
};

  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return UserList.filter((usr) => {
      const query = search.toLowerCase();
      return (
        usr.firstName.toLowerCase().includes(query) ||
        usr.lastName.toLowerCase().includes(query) ||
        usr.email.toLowerCase().includes(query) ||
        usr.birthDate.toLowerCase().includes(query) ||
        usr.gender.toLowerCase().includes(query) ||
        usr.role.toLowerCase().includes(query)
      );
    });
  }, [search, UserList]);

  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
  const sorted = [...filteredData];

  if (sortField) {
    sorted.sort((a, b) => {
      const valueA = a[sortField] || '';
      const valueB = b[sortField] || '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }

  return sorted;
}, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Daftar Pengguna</h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <label className="text-sm mr-2">Show</label>
          <select
            className="border rounded p-1"
            value={entriesPerPage}
            onChange={handleEntriesChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
          <span className="ml-2 text-sm">entries</span>
        </div>

        <div>
          <input
            type="text"
            placeholder="Cari nama, email, no HP..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border p-2 rounded w-full sm:w-64"
          />
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary"
        >
          + Tambah Pengguna
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3 w-12">No</th>
              {[
                { key: 'firstName', label: 'Nama Depan' },
                { key: 'lastName', label: 'Nama Belakang' },
                { key: 'email', label: 'Email' },
                { key: 'gender', label: 'Jenis Kelamin' },
                { key: 'birthDat', label: 'Tanggal Lahir' },
                { key: 'role', label: 'Role' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left p-3 cursor-pointer select-none"
                  onClick={() => handleSort(col.key as keyof User)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortField === col.key && (
                      <span className='text-gray-900'>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="text-left p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((usr, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  {(currentPage - 1) * entriesPerPage + i + 1}
                </td>
                <td className="p-3">{usr.firstName}</td>
                <td className="p-3">{usr.lastName}</td>
                <td className="p-3">{usr.email}</td>
                <td className="p-3">{usr.gender}</td>
                <td className="p-3">{usr.birthDate}</td>
                <td className="p-3">{usr.role}</td>
                <td className="p-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setSelectedUser(usr);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDeleteUser(usr.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Menampilkan {(currentPage - 1) * entriesPerPage + 1} -{' '}
          {Math.min(currentPage * entriesPerPage, filteredData.length)} dari{' '}
          {filteredData.length} entri
        </div>

        <div className="space-x-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === idx + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <UserFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleSaveUser}
        defaultValues={selectedUser}
      />
    </div>
  )

}
