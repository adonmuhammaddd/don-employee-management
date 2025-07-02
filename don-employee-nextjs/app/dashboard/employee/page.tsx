'use client';

import { useState, useMemo, useEffect } from 'react';
import EmployeeFormModal from '@/components/EmployeeFormModal';

type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
};

export default function EmployeePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/employees')
      .then((res) => res.json())
      .then((data) => {
        setEmployeeList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Gagal ambil data:', err);
        setLoading(false);
      });
  }, []);

  const handleSaveEmployee = async (data: Employee) => {
    try {
    if (selectedEmployee) {
      const res = await fetch(`http://localhost:3001/employees/${selectedEmployee.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const updated = await res.json();

      setEmployeeList((prev) =>
        prev.map((emp) => (emp.id === updated.id ? updated : emp))
      );
    } else {
      const res = await fetch('http://localhost:3001/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const newEmp = await res.json();
      setEmployeeList((prev) => [...prev, newEmp]);
    }

    setModalOpen(false);
    setSelectedEmployee(null);
  } catch (err) {
    console.error('Gagal menyimpan karyawan:', err);
  }
  };

  const [search, setSearch] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    return employeeList.filter((emp) => {
      const query = search.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(query) ||
        emp.lastName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.phone.includes(query)
      );
    });
  }, [search, employeeList]);

  const [sortField, setSortField] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      // Toggle direction
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
    setCurrentPage(1); // reset ke page pertama
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Daftar Karyawan</h2>

      {/* Search & Entries */}
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
          + Tambah Karyawan
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-3 w-12">No</th>
              {[
                { key: 'firstName', label: 'Nama Depan' },
                { key: 'lastName', label: 'Nama Belakang' },
                { key: 'email', label: 'Email' },
                { key: 'phone', label: 'No HP' },
                { key: 'address', label: 'Alamat' },
                { key: 'gender', label: 'Jenis Kelamin' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="text-left p-3 cursor-pointer select-none"
                  onClick={() => handleSort(col.key as keyof Employee)}
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
            {paginatedData.map((emp, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">
                  {(currentPage - 1) * entriesPerPage + i + 1}
                </td>
                <td className="p-3">{emp.firstName}</td>
                <td className="p-3">{emp.lastName}</td>
                <td className="p-3">{emp.email}</td>
                <td className="p-3">{emp.phone}</td>
                <td className="p-3">{emp.address}</td>
                <td className="p-3">{emp.gender}</td>
                <td className="p-3">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setSelectedEmployee(emp);
                      setModalOpen(true);
                    }}
                  >
                    Edit
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

      {/* Pagination */}
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

      <EmployeeFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSubmit={handleSaveEmployee}
        defaultValues={selectedEmployee}
      />
    </div>
  );
}