'use client';

import { useEffect, useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultValues?: any;
};

export default function UserFormModal({ isOpen, onClose, onSubmit, defaultValues }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [gender, setGender] = useState('');
  const [role, setRole] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  useEffect(() => {
    setGender(defaultValues?.gender || '');
    setRole(defaultValues?.role || '');
    setBirthDate(defaultValues?.birthDate || '');
  }, [defaultValues]);

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
      formRef.current?.reset();
      setGender('');
      setRole('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newUser = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      birthDate: birthDate?.toISOString().split("T")[0] || "",
      gender: gender,
      password: formData.get('password') as string,
      role: role,
    };

    onSubmit(newUser);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg p-6 shadow-lg w-[500px]">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-lg"
            >
              ❌
            </button>
            <form ref={formRef} onSubmit={handleSubmit} method="dialog" className="modal-box max-w-lg w-full">
              <h3 className="font-bold text-lg mb-4">
                {defaultValues ? 'Edit Karyawan' : 'Tambah Karyawan'}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="firstName"
                  defaultValue={defaultValues?.firstName || ''}
                  required
                  placeholder="Nama Depan"
                  className="input input-bordered"
                />
                <input
                  name="lastName"
                  defaultValue={defaultValues?.lastName || ''}
                  required
                  placeholder="Nama Belakang"
                  className="input input-bordered"
                />
                <input
                  name="email"
                  defaultValue={defaultValues?.email || ''}
                  required
                  type="email"
                  placeholder="Email"
                  className="input input-bordered col-span-2"
                />
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Tanggal Lahir</label>
                  <DatePicker
                    selected={birthDate}
                    onChange={(date) => setBirthDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="input input-bordered w-full"
                  />
                </div>
                <input
                  name="password"
                  type='password'
                  defaultValue={defaultValues?.password || ''}
                  placeholder="Alamat"
                  className="input input-bordered col-span-2"
                />
                <select
                  name="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="input input-bordered col-span-2"
                >
                  <option value="">-- Pilih Jenis Kelamin --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
                <select
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input input-bordered col-span-2"
                >
                  <option value="">-- Pilih Role --</option>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="modal-action mt-6">
                <button type="button" onClick={onClose} className="btn">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}