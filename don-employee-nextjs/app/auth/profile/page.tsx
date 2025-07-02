'use client';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [passwordForm, setPasswordForm] = useState({
    id: null,
    oldPassword: '',
    newPassword: '',
  });
  const userLogged = Cookies.get('loggedUser');

  useEffect(() => {
    const decoded = decodeURIComponent(userLogged!);
    const json = JSON.parse(decoded);
    
    const id = json.id;
    fetch(`http://localhost:3001/users/me/${id}`, {
      method: 'GET'
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm(data);
      });
  }, []);

  const handleProfileSave = async () => {
    await fetch('http://localhost:3001/users/me', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });
    alert('Profil berhasil diperbarui');
  };

  const handlePasswordChange = async () => {
    
    const decoded = decodeURIComponent(userLogged!);
    console.log('decoded ===> ', decoded);
    const json = JSON.parse(decoded);
    console.log('json ===> ', json);
    
    const id = json.id;
    console.log('id ===> ', id);
    setPasswordForm({...passwordForm, id: id})
    const res = await fetch('http://localhost:3001/users/me/password', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordForm),
    });

    if (res.ok) {
      alert('Password berhasil diganti');
      setPasswordForm({ id: id, oldPassword: '', newPassword: '' });
    } else {
      const err = await res.json();
      alert(err.message || 'Gagal mengganti password');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          placeholder="Nama Depan"
          value={form.firstName || ''}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          className="input input-bordered w-full"
          placeholder="Nama Belakang"
          value={form.lastName || ''}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <input
          className="input input-bordered w-full"
          placeholder="Email"
          value={form.email || ''}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="input input-bordered w-full"
          placeholder="Tanggal Lahir"
          value={form.birthDate || ''}
          onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
        />
        <select
          className="input input-bordered w-full"
          value={form.gender || ''}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <option value="">-- Jenis Kelamin --</option>
          <option value="Laki-laki">Laki-laki</option>
          <option value="Perempuan">Perempuan</option>
        </select>
        <button className="btn btn-primary w-full" onClick={handleProfileSave}>
          Simpan Profil
        </button>
      </div>

      <h2 className="text-xl font-bold mt-10 mb-4">Ganti Password</h2>
      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="password"
          placeholder="Password Lama"
          value={passwordForm.oldPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
          }
        />
        <input
          className="input input-bordered w-full"
          type="password"
          placeholder="Password Baru"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({ ...passwordForm, newPassword: e.target.value })
          }
        />
        <button className="btn btn-warning w-full" onClick={handlePasswordChange}>
          Ganti Password
        </button>
      </div>
    </div>
  );
}