'use client';
import { useEffect, useState } from 'react';

export default function LeavePage() {
  const [leaveList, setLeaveList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ reason: '', startDate: '', endDate: '' });

  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(5);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('startDate');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    fetch('http://localhost:3001/leaves')
      .then((res) => res.json())
      .then((data) => {
        setLeaveList(data);
        setFilteredList(data);
      });

    fetch('http://localhost:3001/employees')
      .then((res) => res.json())
      .then(setEmployees);
  }, []);

  useEffect(() => {
    let filtered = leaveList.filter((l) =>
      l.firstName.toLowerCase().includes(search.toLowerCase()) ||
      l.lastName.toLowerCase().includes(search.toLowerCase()) ||
      l.reason.toLowerCase().includes(search.toLowerCase())
    );
    filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });
    setFilteredList(filtered);
    setPage(1);
  }, [search, sortBy, sortDir, leaveList]);

  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:3001/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, employeeId: Number(employeeId) }),
      });
      if (!res.ok) throw await res.json();
      const data = await res.json();
      alert('Cuti berhasil ditambahkan');
      setLeaveList((prev) => [...prev, data]);
    } catch (err: any) {
      alert(err.message || 'Gagal menambahkan cuti');
    }
  };

  const paginated = filteredList.slice((page - 1) * entries, page * entries);
  const totalPages = Math.ceil(filteredList.length / entries);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Data Cuti Karyawan</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          className="input input-bordered"
        >
          <option value="">-- Pilih Karyawan --</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.firstName} {e.lastName}
            </option>
          ))}
        </select>
        <input
          className="input input-bordered"
          placeholder="Alasan Cuti"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />
        <input
          className="input input-bordered"
          type="date"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <input
          className="input input-bordered"
          type="date"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        <button onClick={handleSubmit} className="btn btn-primary col-span-2">
          Simpan Cuti
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <label>Show</label>
          <select
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
            className="input input-bordered w-20"
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <label>entries</label>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">No</th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('employee.firstName')}>Nama Karyawan</th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('reason')}>Alasan</th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('startDate')}>Mulai</th>
            <th className="p-2 cursor-pointer" onClick={() => toggleSort('endDate')}>Selesai</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((l, i) => (
            <tr key={l.id}>
              <td className="p-2">{(page - 1) * entries + i + 1}</td>
              <td className="p-2">{l?.firstName} {l?.lastName}</td>
              <td className="p-2">{l.reason}</td>
              <td className="p-2">{l.startDate}</td>
              <td className="p-2">{l.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end items-center gap-2 mt-4">
        <button disabled={page === 1} className="btn" onClick={() => setPage(page - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} className="btn" onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );

  function toggleSort(column: string) {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  }
}
