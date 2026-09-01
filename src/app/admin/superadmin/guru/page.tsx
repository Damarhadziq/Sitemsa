'use client';

import React, { useState } from 'react';
import {
  Plus,
  Search,
  ShieldCheck,
  Edit2,
  Trash2,
  X,
  Check,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useAdminStore, TeacherAccount } from '@/lib/admin-store';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingTimeoutBoundary } from '@/components/ui/LoadingTimeoutBoundary';

export default function SuperadminGuruPage() {
  const { teachers, subjects, addTeacher, updateTeacher, deleteTeacher } =
    useAdminStore();

  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherAccount | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [deleteTeacherTarget, setDeleteTeacherTarget] = useState<TeacherAccount | null>(null);

  const isAnyModalOpen = showAddModal || !!deleteTeacherTarget;

  React.useEffect(() => {
    if (isAnyModalOpen) {
      document.documentElement.classList.add("modal-open");
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [isAnyModalOpen]);

  const [formData, setFormData] = useState({
    name: '',
    nip: '',
    email: '',
    phone: '',
    status: 'Aktif' as 'Aktif' | 'Nonaktif',
    assignedSubjects: [] as string[],
  });

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nip.includes(searchTerm)
  );

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      nip: '',
      email: '',
      phone: '0812' + Math.floor(10000000 + Math.random() * 90000000),
      status: 'Aktif',
      assignedSubjects: [subjects[0]?.name || 'Informatika'],
    });
    setEditingTeacher(null);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (teacher: TeacherAccount) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      nip: teacher.nip,
      email: teacher.email,
      phone: teacher.phone,
      status: teacher.status,
      assignedSubjects: [...teacher.assignedSubjects],
    });
    setShowAddModal(true);
  };

  const handleSubjectCheckboxToggle = (subjectName: string) => {
    setFormData((prev) => {
      const exists = prev.assignedSubjects.includes(subjectName);
      if (exists) {
        return {
          ...prev,
          assignedSubjects: prev.assignedSubjects.filter((s) => s !== subjectName),
        };
      } else {
        return {
          ...prev,
          assignedSubjects: [...prev.assignedSubjects, subjectName],
        };
      }
    });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    if (editingTeacher) {
      updateTeacher(editingTeacher.id, {
        name: formData.name,
        nip: formData.nip,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        assignedSubjects: formData.assignedSubjects,
      });
    } else {
      addTeacher({
        name: formData.name,
        nip: formData.nip || '1995' + Math.floor(1000000000 + Math.random() * 9000000000),
        email: formData.email,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
        phone: formData.phone,
        assignedSubjects: formData.assignedSubjects,
        status: formData.status,
      });
    }

    setShowAddModal(false);
  };

  const [deleteTargetTeacher, setDeleteTargetTeacher] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = (id: string, name: string) => {
    setDeleteTargetTeacher({ id, name });
  };

  const confirmDeleteTeacher = () => {
    if (deleteTargetTeacher) {
      deleteTeacher(deleteTargetTeacher.id);
      setDeleteTargetTeacher(null);
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content (Aligned with main web Hero H1) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#2E2D2D] tracking-tight">
          Manajemen Guru & Hak Akses
        </h1>
      </div>

      {/* Action Row & Clean Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama guru, Nip, atau email..."
            className="w-full h-10 pl-9 pr-4 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] placeholder:text-[#AAAAAA] focus:border-[#2563EB] transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-[#737373] font-semibold hidden md:inline-block">
            Total: <strong className="text-[#2E2D2D] font-bold">{filteredTeachers.length}</strong> guru
          </span>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah akun guru baru</span>
          </button>
        </div>
      </div>

      {/* Teachers Table with LoadingTimeoutBoundary */}
      <LoadingTimeoutBoundary
        isLoading={isLoading}
        timeoutMs={10000}
        onRetry={() => {
          setIsLoading(true);
          setTimeout(() => setIsLoading(false), 200);
        }}
        skeleton={
          <div className="bg-slate-100/60 rounded-[12px] p-6 space-y-4 animate-pulse">
            <div className="flex justify-between items-center pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-36 rounded-[4px]" />
                      <Skeleton className="h-3 w-28 rounded-[4px]" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-28 rounded-[4px]" />
                  <Skeleton className="h-6 w-32 rounded-[4px]" />
                  <Skeleton className="h-4 w-16 rounded-[4px]" />
                  <Skeleton className="h-6 w-20 rounded-[6px]" />
                </div>
              ))}
            </div>
          </div>
        }
      >
        <div className="bg-white rounded-[10px] border border-[#ECECEC] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#ECECEC] text-xs font-semibold text-[#737373]">
                  <th className="py-4 px-6">Profil guru</th>
                  <th className="py-4 px-6">Nip & kontak</th>
                  <th className="py-4 px-6">Hak akses mapel (Penugasan)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Aksi Superadmin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECECEC]">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-next/no-img-element */}
                        <img
                          src={teacher.avatar}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#ECECEC]"
                        />
                        <div>
                          <p className="font-semibold text-[#2E2D2D] text-sm">{teacher.name}</p>
                          <p className="text-xs text-[#737373] leading-normal">{teacher.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* NIP & Phone */}
                    <td className="py-4 px-6">
                      <p className="font-mono text-xs font-semibold text-[#2E2D2D]">{teacher.nip}</p>
                      <p className="text-xs text-[#737373] leading-normal">{teacher.phone}</p>
                    </td>

                    {/* Assigned Subjects */}
                    <td className="py-4 px-6">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {teacher.assignedSubjects.length > 0 ? (
                          teacher.assignedSubjects.map((subj) => (
                            <span
                              key={subj}
                              className="inline-flex items-center gap-1 text-[11px] bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-0.5 rounded-[4px]"
                            >
                              <BookOpen className="w-3 h-3 text-[#2563EB]" />
                              <span>{subj}</span>
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-[4px] font-semibold">
                            Belum ditugaskan mapel
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Bullet */}
                    <td className="py-4 px-6">
                      {teacher.status === 'Aktif' ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                          <span className="w-2 h-2 rounded-full bg-slate-300" /> Nonaktif
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          className="font-semibold text-[#2563EB] hover:underline text-xs cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit akses</span>
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id, teacher.name)}
                          className="text-[#737373] hover:text-rose-600 transition-colors cursor-pointer p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTeachers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#737373] text-xs">
                      Tidak ada guru yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </LoadingTimeoutBoundary>

      {/* Modal Add / Edit Teacher */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-[#2E2D2D]">
                  {editingTeacher ? 'Edit akun & hak akses mapel' : 'Tambah akun guru baru'}
                </h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2E2D2D] mb-1">Nama lengkap guru</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Mochammad Rizal D. D."
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1">Nip</label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="19850412 201001 1 003"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2E2D2D] mb-1">Email guru</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="budi.guru@sintesa.id"
                    required
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              {/* Subject Permission Checkboxes */}
              <div className="p-4 rounded-[8px] bg-blue-50/50">
                <label className="block text-xs font-semibold text-blue-900 mb-1">
                  Penugasan hak akses pelajaran (Ditetapkan Superadmin)
                </label>
                <p className="text-xs text-blue-700 mb-3 leading-relaxed">
                  Centang bidang yang boleh dikelola oleh guru ini. Guru hanya memiliki akses pada bidang yang diizinkan!
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {subjects.map((subj) => {
                    const isChecked = formData.assignedSubjects.includes(subj.name);
                    return (
                      <button
                        key={subj.id}
                        type="button"
                        onClick={() => handleSubjectCheckboxToggle(subj.name)}
                        className={`p-3 rounded-[8px] border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#2563EB] text-white border-[#2563EB] font-semibold'
                            : 'bg-white text-[#2E2D2D] border-[#ECECEC] hover:border-blue-300'
                        }`}
                      >
                        <span>{subj.name}</span>
                        {isChecked && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Status Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-[#2E2D2D] mb-1">Status akun</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] font-medium flex items-center justify-between cursor-pointer"
                  >
                    <span>{formData.status}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
                  </button>

                  {showStatusDropdown && (
                    <div className="absolute left-0 mt-1 w-full bg-white rounded-[8px] border border-[#ECECEC] p-1 z-50 shadow-xs">
                      {(['Aktif', 'Nonaktif'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, status: st });
                            setShowStatusDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-[6px] text-xs flex items-center justify-between cursor-pointer ${
                            formData.status === st ? 'text-[#2563EB] font-bold' : 'text-[#2E2D2D] hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>{st}</span>
                          {formData.status === st && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!formData.name.trim() || !formData.email.trim() || formData.assignedSubjects.length === 0}
                  className={`px-5 py-2.5 rounded-[8px] font-semibold text-xs transition-all ${
                    formData.name.trim() && formData.email.trim() && formData.assignedSubjects.length > 0
                      ? 'bg-[#2563EB] hover:bg-blue-700 text-white cursor-pointer active:scale-98'
                      : 'bg-slate-100 text-[#AAAAAA] cursor-not-allowed opacity-50'
                  }`}
                >
                  Simpan hak akses guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteTargetTeacher && (
        <div
          onClick={() => setDeleteTargetTeacher(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 animate-in fade-in zoom-in-95 duration-200 relative"
          >
            {/* Top-Right X Button */}
            <button
              type="button"
              onClick={() => setDeleteTargetTeacher(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Icon above header */}
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
            </div>

            {/* Header Title */}
            <h3 className="font-bold text-base text-[#2E2D2D]">Hapus Akun Pengajar</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus akun guru <strong className="text-[#2E2D2D]">{deleteTargetTeacher.name}</strong>? Pengajar ini tidak akan bisa mengakses portal admin lagi.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTargetTeacher(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteTeacher}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
