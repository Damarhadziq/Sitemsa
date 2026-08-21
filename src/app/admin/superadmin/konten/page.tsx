'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  CheckCircle2,
  Save,
  X,
  Layout,
  ExternalLink,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useAdminStore, WebArticle, SubjectItem } from '@/lib/admin-store';

export default function SuperadminKontenPage() {
  const { heroContent, updateHeroContent, articles, addArticle, updateArticle, deleteArticle, subjects, addSubject, updateSubject } =
    useAdminStore();

  const [activeTab, setActiveTab] = useState<'hero' | 'articles' | 'subjects'>('hero');

  // Hero Form state
  const [heroForm, setHeroForm] = useState({ ...heroContent });
  const [heroSaveSuccess, setHeroSaveSuccess] = useState(false);

  // Article Form Modal state
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<WebArticle | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    category: 'Tips Belajar',
    readTime: '5 Menit',
    author: 'Tim Kurikulum Sitemsa',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    excerpt: '',
    content: '',
  });

  // Subject Form Modal state
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    category: 'Teknologi',
    description: '',
    iconName: 'ComputerIcon',
  });

  const categoryOptions = ['Tips Belajar', 'Teknologi', 'Strategi Belajar', 'Berita Vokasi'];
  const [deleteTargetArticle, setDeleteTargetArticle] = useState<WebArticle | null>(null);

  const isAnyModalOpen = showArticleModal || showSubjectModal || !!deleteTargetArticle;

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

  // Handle Save Hero
  const handleSaveHero = (e: React.FormEvent) => {
    e.preventDefault();
    updateHeroContent(heroForm);
    setHeroSaveSuccess(true);
    setTimeout(() => setHeroSaveSuccess(false), 3000);
  };

  // Article Handlers
  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: '',
      category: 'Tips Belajar',
      readTime: '5 Menit',
      author: 'Superadmin Sitemsa',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
      excerpt: '',
      content: '',
    });
    setShowArticleModal(true);
  };

  const handleOpenEditArticle = (art: WebArticle) => {
    setEditingArticle(art);
    setArticleForm({
      title: art.title,
      category: art.category,
      readTime: art.readTime,
      author: art.author,
      image: art.image,
      excerpt: art.excerpt,
      content: art.content,
    });
    setShowArticleModal(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) return;

    if (editingArticle) {
      updateArticle(editingArticle.id, articleForm);
    } else {
      addArticle(articleForm);
    }
    setShowArticleModal(false);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    setDeleteTargetArticle({ id, title } as WebArticle);
  };

  const confirmDeleteArticle = () => {
    if (deleteTargetArticle) {
      deleteArticle(deleteTargetArticle.id);
      setDeleteTargetArticle(null);
    }
  };

  // Subject Handlers
  const handleOpenAddSubject = () => {
    setEditingSubject(null);
    setSubjectForm({
      name: '',
      code: '',
      category: 'Teknologi & Kode',
      description: '',
      iconName: 'ComputerIcon',
    });
    setShowSubjectModal(true);
  };

  const handleOpenEditSubject = (subj: SubjectItem) => {
    setEditingSubject(subj);
    setSubjectForm({
      name: subj.name,
      code: subj.code,
      category: subj.category,
      description: subj.description,
      iconName: subj.iconName,
    });
    setShowSubjectModal(true);
  };

  const handleSaveSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, subjectForm);
    } else {
      addSubject(subjectForm);
    }
    setShowSubjectModal(false);
  };

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2E2D2D]">
          Konten Utama Website
        </h1>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#ECECEC]">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'hero'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Hero banner</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'articles'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Artikel & tips belajar ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'subjects'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Katalog bidang ({subjects.length})</span>
        </button>
      </div>

      {/* Tab 1: Hero Form */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-[10px] border border-[#ECECEC] p-6 sm:p-8 max-w-3xl">
          <form onSubmit={handleSaveHero} className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-base font-bold text-[#2E2D2D]">Pengaturan teks banner hero</h2>
              {heroSaveSuccess && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-[4px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Berhasil diperbarui!
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Judul utama hero</label>
              <input
                type="text"
                value={heroForm.title}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] focus:border-[#2563EB] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Subjudul / deskripsi singkat</label>
              <textarea
                rows={3}
                value={heroForm.subtitle}
                onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Badge promo text</label>
                <input
                  type="text"
                  value={heroForm.badgeText}
                  onChange={(e) => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Teks tombol aksi</label>
                <input
                  type="text"
                  value={heroForm.ctaText}
                  onChange={(e) => setHeroForm({ ...heroForm, ctaText: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <a
                href="/"
                target="_blank"
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Pratinjau halaman utama</span>
              </a>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan banner</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Articles List & CRUD */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2E2D2D]">Daftar artikel & tips belajar</h2>
            <button
              onClick={handleOpenAddArticle}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah artikel baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 relative">
                    {/* eslint-disable-next-next/no-img-element */}
                    <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-[4px]">
                      {art.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xs font-bold text-[#2E2D2D] line-clamp-2">{art.title}</h3>
                    <p className="text-[11px] text-[#737373] mt-1.5 line-clamp-2 leading-relaxed">{art.excerpt}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1 flex items-center justify-between text-[11px] text-[#737373]">
                  <span>{art.date}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditArticle(art)}
                      className="p-1.5 rounded-[6px] bg-slate-50 hover:bg-blue-50 text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id, art.title)}
                      className="p-1.5 rounded-[6px] bg-slate-50 hover:bg-rose-50 text-[#737373] hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Subjects List & CRUD */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2E2D2D]">Katalog bidang utama</h2>
            <button
              onClick={handleOpenAddSubject}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah bidang baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-6 flex items-start justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[8px] bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold text-sm">
                    {subj.code}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#2E2D2D]">{subj.name}</h3>
                    <span className="text-[10px] text-[#2563EB] font-semibold">{subj.category}</span>
                    <p className="text-[11px] text-[#737373] mt-1 max-w-sm leading-relaxed">{subj.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEditSubject(subj)}
                  className="p-2 rounded-[6px] bg-slate-50 hover:bg-blue-50 text-[#2E2D2D] hover:text-[#2563EB] transition-colors cursor-pointer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Article Modal */}
      {showArticleModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 bg-white flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingArticle ? 'Edit artikel tips belajar' : 'Tambah artikel baru'}
              </h3>
              <button onClick={() => setShowArticleModal(false)} className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer" aria-label="Tutup Modal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Judul artikel</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Contoh: 5 cara efektif belajar pemrograman"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Custom Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Kategori</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full h-10 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] font-medium flex items-center justify-between cursor-pointer"
                    >
                      <span>{articleForm.category}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
                    </button>

                    {showCategoryDropdown && (
                      <div className="absolute left-0 mt-1 w-full bg-white rounded-[8px] border border-[#ECECEC] p-1 z-50 shadow-xs">
                        {categoryOptions.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              setArticleForm({ ...articleForm, category: cat });
                              setShowCategoryDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-[6px] text-xs font-semibold flex items-center justify-between cursor-pointer ${
                              articleForm.category === cat ? 'bg-blue-50 text-[#2563EB]' : 'text-[#2E2D2D] hover:bg-slate-50'
                            }`}
                          >
                            <span>{cat}</span>
                            {articleForm.category === cat && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Waktu baca</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                    placeholder="5 Menit"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Ringkasan / excerpt</label>
                <textarea
                  rows={2}
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  placeholder="Teks singkat yang muncul pada kartu artikel..."
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">URL gambar banner</label>
                <input
                  type="text"
                  value={articleForm.image}
                  onChange={(e) => setArticleForm({ ...articleForm, image: e.target.value })}
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Simpan artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 bg-white flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingSubject ? 'Edit bidang utama' : 'Tambah bidang baru'}
              </h3>
              <button onClick={() => setShowSubjectModal(false)} className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer" aria-label="Tutup Modal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-6 pt-0 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Nama bidang</label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  placeholder="Contoh: Otomotif & kelistrikan"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Kode singkat</label>
                  <input
                    type="text"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    placeholder="Otm"
                    required
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-bold text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Kategori bidang</label>
                  <input
                    type="text"
                    value={subjectForm.category}
                    onChange={(e) => setSubjectForm({ ...subjectForm, category: e.target.value })}
                    placeholder="Teknik Mesin"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Deskripsi bidang</label>
                <textarea
                  rows={3}
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                  placeholder="Penjelasan cakupan materi..."
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs"
                >
                  Simpan bidang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetArticle && (
        <div
          onClick={() => setDeleteTargetArticle(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative"
          >
            {/* Top-Right X Button */}
            <button
              type="button"
              onClick={() => setDeleteTargetArticle(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Icon above header */}
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>

            {/* Header Title */}
            <h3 className="font-bold text-base text-[#2E2D2D]">Hapus Artikel Website</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus artikel <strong className="text-[#2E2D2D]">{deleteTargetArticle.title}</strong>? Artikel ini akan terhapus dari halaman publik.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTargetArticle(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteArticle}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Hapus Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
