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
  FileText,
  HelpCircle,
  Users,
} from 'lucide-react';
import {
  useAdminStore,
  WebArticle,
  SubjectItem,
  DocArticleItem,
  FaqItem,
  TeamMemberItem,
} from '@/lib/admin-store';
import { ArticleService } from '@/services/article.service';
import { supabase } from '@/lib/supabase';

export default function SuperadminKontenPage() {
  const {
    heroContent,
    updateHeroContent,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    subjects,
    addSubject,
    updateSubject,
    docs,
    addDoc,
    updateDoc,
    deleteDoc,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<'hero' | 'articles' | 'subjects' | 'docs' | 'faqs' | 'team'>('hero');

  // Live fetch articles on mount from Supabase
  React.useEffect(() => {
    ArticleService.fetchFromSupabase().then((data) => {
      if (data && data.length > 0) {
        useAdminStore.setState({ articles: data });
      }
    });
  }, []);

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
  const [deleteTargetArticle, setDeleteTargetArticle] = useState<WebArticle | null>(null);

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

  // Documentation Form Modal state
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocArticleItem | null>(null);
  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Modul & Pembelajaran' as DocArticleItem['category'],
    summary: '',
    screenshotUrl: '',
    contentParagraphs: '',
  });
  const [deleteTargetDoc, setDeleteTargetDoc] = useState<DocArticleItem | null>(null);

  // FAQ Form Modal state
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [faqForm, setFaqForm] = useState({
    question: '',
    answer: '',
  });
  const [deleteTargetFaq, setDeleteTargetFaq] = useState<FaqItem | null>(null);

  // Team Member Form Modal state
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMemberItem | null>(null);
  const [teamForm, setTeamForm] = useState({
    title: '',
    subtitle: 'Instructional Designer',
    handle: '',
    division: 'Pend. Informatika',
    image: 'https://i.pravatar.cc/300?img=11',
    borderColor: '#4F46E5',
  });
  const [deleteTargetTeam, setDeleteTargetTeam] = useState<TeamMemberItem | null>(null);

  const categoryOptions = ['Tips Belajar', 'Teknologi', 'Strategi Belajar', 'Berita Vokasi'];
  const docCategoryOptions: DocArticleItem['category'][] = ['Modul & Pembelajaran', 'Kuis & Barcode', 'Profil & Nilai'];
  const divisionOptions = [
    'Pend. Informatika',
    'BK',
    'Pend. Otomotif',
    'Pend. Elektronika',
    'Pend. Olahraga',
    'Pend. Seni Tari',
  ];

  const isAnyModalOpen =
    showArticleModal ||
    showSubjectModal ||
    showDocModal ||
    showFaqModal ||
    showTeamModal ||
    !!deleteTargetArticle ||
    !!deleteTargetDoc ||
    !!deleteTargetFaq ||
    !!deleteTargetTeam;

  React.useEffect(() => {
    if (isAnyModalOpen) {
      document.documentElement.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
      document.body.style.overflow = '';
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

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm.title.trim()) return;

    if (editingArticle) {
      updateArticle(editingArticle.id, articleForm);
      await ArticleService.updateArticle(editingArticle.id, articleForm);
    } else {
      const fixedId = `art-${Date.now()}`;
      const newArt = {
        id: fixedId,
        ...articleForm,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      addArticle(newArt);
      await ArticleService.createArticle(newArt);
    }
    setShowArticleModal(false);
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

  // Documentation Handlers
  const handleOpenAddDoc = () => {
    setEditingDoc(null);
    setDocForm({
      title: '',
      category: 'Modul & Pembelajaran',
      summary: '',
      screenshotUrl: '/images/docs/nav_tutorial.jpg',
      contentParagraphs: 'Pilih Materi dari Katalog Pembelajaran\nBuka halaman Materi melalui menu utama navigasi, lalu pilih materi vokasi yang diinginkan.\n\nGunakan Daftar Isi Pembahasan di Sidebar\nDi sebelah kanan layar desktop atau bagian atas mobile, gunakan widget daftar isi untuk melompat ke sub-materi.',
    });
    setShowDocModal(true);
  };

  const handleOpenEditDoc = (doc: DocArticleItem) => {
    setEditingDoc(doc);
    const sectionsText = (doc.sections || [])
      .map((s) => `${s.title}\n${s.description}`)
      .join('\n\n');

    setDocForm({
      title: doc.title,
      category: doc.category,
      summary: doc.summary,
      screenshotUrl: doc.screenshotUrl || '',
      contentParagraphs: sectionsText,
    });
    setShowDocModal(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.title.trim()) return;

    // Parse sections from paragraphs
    const sectionChunks = docForm.contentParagraphs.split('\n\n').filter(Boolean);
    const sections = sectionChunks.map((chunk, idx) => {
      const lines = chunk.split('\n').filter(Boolean);
      return {
        title: lines[0] || `Langkah ${idx + 1}`,
        description: lines.slice(1).join('\n') || lines[0] || '',
      };
    });

    const docPayload = {
      title: docForm.title,
      category: docForm.category,
      summary: docForm.summary,
      screenshotUrl: docForm.screenshotUrl || undefined,
      sections: sections.length > 0 ? sections : [{ title: 'Petunjuk Umum', description: docForm.summary }],
    };

    if (editingDoc) {
      updateDoc(editingDoc.id, docPayload);
    } else {
      addDoc(docPayload);
    }
    setShowDocModal(false);
  };

  // FAQ Handlers
  const handleOpenAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({ question: '', answer: '' });
    setShowFaqModal(true);
  };

  const handleOpenEditFaq = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setShowFaqModal(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question.trim()) return;

    if (editingFaq) {
      updateFaq(editingFaq.id, faqForm);
    } else {
      addFaq(faqForm);
    }
    setShowFaqModal(false);
  };

  // Team Member Handlers
  const handleOpenAddTeam = () => {
    setEditingTeamMember(null);
    setTeamForm({
      title: '',
      subtitle: 'Instructional Designer',
      handle: '@username',
      division: 'Pend. Informatika',
      image: 'https://i.pravatar.cc/300?img=15',
      borderColor: '#2563EB',
    });
    setShowTeamModal(true);
  };

  const handleOpenEditTeam = (tm: TeamMemberItem) => {
    setEditingTeamMember(tm);
    setTeamForm({
      title: tm.title,
      subtitle: tm.subtitle,
      handle: tm.handle,
      division: tm.division,
      image: tm.image,
      borderColor: tm.borderColor || '#2563EB',
    });
    setShowTeamModal(true);
  };

  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.title.trim()) return;

    if (editingTeamMember) {
      updateTeamMember(editingTeamMember.id, teamForm);
    } else {
      addTeamMember(teamForm);
    }
    setShowTeamModal(false);
  };

  return (
    <div className="space-y-6 font-sans text-[#2E2D2D] bg-white">
      {/* Big Page Title in Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#2E2D2D]">
            Konten Utama Website
          </h1>
          <p className="text-xs text-[#737373] mt-1">
            Pusat kendali CRUD materi publik, artikel tips belajar, dokumentasi panduan, FAQ, dan tim pengembang.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] border border-[#ECECEC] text-xs font-semibold text-[#2563EB] hover:bg-blue-50/50 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat Website Publik</span>
        </a>
      </div>

      {/* Tabs Switcher (Scrollable horizontally on mobile) */}
      <div className="flex items-center gap-2 border-b border-[#ECECEC] overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('hero')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'hero'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <Layout className="w-4 h-4" />
          <span>Hero Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'articles'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tips Belajar ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subjects')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'subjects'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Katalog Bidang ({subjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'docs'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dokumentasi ({docs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'faqs'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ Bantuan ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('team')}
          className={`pb-3.5 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'team'
              ? 'border-[#2563EB] text-[#2563EB]'
              : 'border-transparent text-[#737373] hover:text-[#2E2D2D]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tim Pengembang ({teamMembers.length})</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah artikel baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-5 flex flex-col justify-between space-y-4 hover:border-blue-200 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-[4px]">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-[#737373]">{art.readTime}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2E2D2D] leading-snug line-clamp-2">{art.title}</h3>
                  <p className="text-xs text-[#737373] line-clamp-3 leading-relaxed">{art.excerpt || art.content}</p>
                </div>

                <div className="pt-2 border-t border-[#ECECEC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#737373] truncate max-w-[140px]">{art.author}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditArticle(art)}
                      className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#2E2D2D] cursor-pointer"
                      title="Edit artikel"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetArticle(art)}
                      className="p-1.5 rounded-[6px] hover:bg-rose-50 text-rose-600 cursor-pointer"
                      title="Hapus artikel"
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
            <h2 className="text-base font-bold text-[#2E2D2D]">Katalog bidang kejuruan</h2>
            <button
              onClick={handleOpenAddSubject}
              className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah bidang baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-5 flex flex-col justify-between space-y-4 hover:border-blue-200 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-[4px]">
                      {subj.code}
                    </span>
                    <span className="text-[11px] text-[#2563EB] font-semibold">{subj.category}</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2E2D2D] leading-snug">{subj.name}</h3>
                  <p className="text-xs text-[#737373] line-clamp-3 leading-relaxed">{subj.description}</p>
                </div>

                <div className="pt-2 border-t border-[#ECECEC] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#737373]">{subj.totalModules || 0} Modul Materi</span>
                  <button
                    onClick={() => handleOpenEditSubject(subj)}
                    className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#2E2D2D] cursor-pointer"
                    title="Edit bidang"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Documentation & Guides List & CRUD */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2E2D2D]">Daftar artikel panduan & dokumentasi</h2>
            <button
              onClick={handleOpenAddDoc}
              className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah panduan baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-5 flex flex-col justify-between space-y-4 hover:border-blue-200 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#2563EB] bg-[#E8E7FF] px-2.5 py-0.5 rounded-[4px]">
                      {doc.category}
                    </span>
                    <span className="text-[11px] text-[#737373]">{(doc.sections || []).length} Langkah</span>
                  </div>

                  <h3 className="font-bold text-sm text-[#2E2D2D] leading-snug line-clamp-2">{doc.title}</h3>
                  <p className="text-xs text-[#737373] line-clamp-3 leading-relaxed">{doc.summary}</p>
                </div>

                <div className="pt-2 border-t border-[#ECECEC] flex items-center justify-between text-xs">
                  <a
                    href={`/dokumentasi`}
                    target="_blank"
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                  >
                    Pratinjau
                  </a>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditDoc(doc)}
                      className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#2E2D2D] cursor-pointer"
                      title="Edit panduan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetDoc(doc)}
                      className="p-1.5 rounded-[6px] hover:bg-rose-50 text-rose-600 cursor-pointer"
                      title="Hapus panduan"
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

      {/* Tab 5: FAQ List & CRUD */}
      {activeTab === 'faqs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2E2D2D]">Daftar tanya jawab umum (FAQ)</h2>
            <button
              onClick={handleOpenAddFaq}
              className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah FAQ baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-4 flex items-start justify-between gap-4 hover:border-blue-200 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-[#2E2D2D]">{faq.question}</h3>
                  </div>
                  <p className="text-xs text-[#737373] pl-7 leading-relaxed">{faq.answer}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEditFaq(faq)}
                    className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#2E2D2D] cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetFaq(faq)}
                    className="p-1.5 rounded-[6px] hover:bg-rose-50 text-rose-600 cursor-pointer"
                    title="Hapus FAQ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Team Members List & CRUD */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#2E2D2D]">Daftar anggota tim pengembang</h2>
              <p className="text-xs text-[#737373] mt-0.5">Kelola 24 nama anggota tim, peran, foto profil, dan bidang asal.</p>
            </div>
            <button
              onClick={handleOpenAddTeam}
              className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah anggota</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {teamMembers.map((tm) => (
              <div
                key={tm.id}
                className="bg-white rounded-[10px] border border-[#ECECEC] p-4 flex flex-col justify-between space-y-3 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    className="w-12 h-12 rounded-full p-0.5 border-2 shrink-0 overflow-hidden"
                    style={{ borderColor: tm.borderColor || '#2563EB' }}
                  >
                    {/* eslint-disable-next-next/no-img-element */}
                    <img src={tm.image} alt={tm.title} className="w-full h-full rounded-full object-cover" />
                  </div>
                  <span className="text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 shrink-0">
                    {tm.division}
                  </span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-[#2E2D2D] truncate">{tm.title}</h4>
                  <p className="text-xs font-semibold text-[#2563EB] truncate">{tm.subtitle}</p>
                  <p className="text-[11px] text-[#737373] truncate">{tm.handle}</p>
                </div>

                <div className="pt-2 border-t border-[#ECECEC] flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleOpenEditTeam(tm)}
                    className="p-1.5 rounded-[6px] hover:bg-slate-100 text-[#2E2D2D] cursor-pointer"
                    title="Edit data anggota"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTargetTeam(tm)}
                    className="p-1.5 rounded-[6px] hover:bg-rose-50 text-rose-600 cursor-pointer"
                    title="Hapus anggota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ARTICLE MODAL */}
      {showArticleModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans max-h-[90vh] flex flex-col">
            <div className="p-6 pb-4 bg-white flex items-center justify-between border-b border-[#ECECEC]">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingArticle ? 'Edit artikel tips belajar' : 'Tambah artikel baru'}
              </h3>
              <button
                onClick={() => setShowArticleModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Judul artikel</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Contoh: 5 Strategi Efektif Menguasai Logika Pemrograman"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Penulis / Author</label>
                <input
                  type="text"
                  value={articleForm.author}
                  onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                  placeholder="Tim Informatika Sitemsa"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Ringkasan / Excerpt</label>
                <textarea
                  rows={2}
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                  placeholder="Teks singkat pengantar artikel..."
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Isi Pembahasan Artikel</label>
                <textarea
                  rows={5}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Tuliskan paragraf pembahasan (pisahkan antar poin pembahasan dengan baris kosong)..."
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ECECEC]">
                <button
                  type="button"
                  onClick={() => setShowArticleModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Simpan artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENTATION MODAL */}
      {showDocModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans max-h-[90vh] flex flex-col">
            <div className="p-6 pb-4 bg-white flex items-center justify-between border-b border-[#ECECEC]">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingDoc ? 'Edit panduan dokumentasi' : 'Tambah panduan baru'}
              </h3>
              <button
                onClick={() => setShowDocModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Judul panduan</label>
                <input
                  type="text"
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="Contoh: Alur Pembelajaran & Navigasi Modul"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Kategori panduan</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm({ ...docForm, category: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none focus:border-[#2563EB]"
                >
                  {docCategoryOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Ringkasan panduan</label>
                <textarea
                  rows={2}
                  value={docForm.summary}
                  onChange={(e) => setDocForm({ ...docForm, summary: e.target.value })}
                  placeholder="Penjelasan ringkas isi tutorial..."
                  required
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">
                  Langkah-langkah Panduan (Format: Baris 1 = Judul Langkah, Baris 2 = Penjelasan, Pisahkan tiap langkah dengan baris kosong)
                </label>
                <textarea
                  rows={6}
                  value={docForm.contentParagraphs}
                  onChange={(e) => setDocForm({ ...docForm, contentParagraphs: e.target.value })}
                  placeholder="Langkah 1: Buka Katalog Materi&#10;Klik menu Materi pada navigasi...&#10;&#10;Langkah 2: Ikuti Video Tutorial&#10;Simak video simulasi yang disediakan..."
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-mono text-[#2E2D2D] focus:border-[#2563EB] outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ECECEC]">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Simpan panduan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ MODAL */}
      {showFaqModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 pb-4 bg-white flex items-center justify-between border-b border-[#ECECEC]">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingFaq ? 'Edit tanya jawab FAQ' : 'Tambah FAQ baru'}
              </h3>
              <button
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Pertanyaan (Question)</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  placeholder="Contoh: Mengapa Barcode QR Code kuis tidak dapat dipindai?"
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Jawaban & Solusi (Answer)</label>
                <textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  placeholder="Tuliskan penjelasan dan solusi jelas untuk siswa..."
                  required
                  className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ECECEC]">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAM MEMBER MODAL */}
      {showTeamModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 pb-4 bg-white flex items-center justify-between border-b border-[#ECECEC]">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingTeamMember ? 'Edit data anggota tim' : 'Tambah anggota tim baru'}
              </h3>
              <button
                onClick={() => setShowTeamModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  value={teamForm.title}
                  onChange={(e) => setTeamForm({ ...teamForm, title: e.target.value })}
                  placeholder="Contoh: Damar Hadziq H."
                  required
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Peran / Jabatan</label>
                  <input
                    type="text"
                    value={teamForm.subtitle}
                    onChange={(e) => setTeamForm({ ...teamForm, subtitle: e.target.value })}
                    placeholder="Developer / Instructional Designer"
                    required
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Handle Sosial</label>
                  <input
                    type="text"
                    value={teamForm.handle}
                    onChange={(e) => setTeamForm({ ...teamForm, handle: e.target.value })}
                    placeholder="@damarhadziq"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Bidang / Prodi</label>
                  <select
                    value={teamForm.division}
                    onChange={(e) => setTeamForm({ ...teamForm, division: e.target.value })}
                    className="w-full h-10 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none focus:border-[#2563EB]"
                  >
                    {divisionOptions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2E2D2D] mb-1">Warna Border Aksen</label>
                  <input
                    type="text"
                    value={teamForm.borderColor}
                    onChange={(e) => setTeamForm({ ...teamForm, borderColor: e.target.value })}
                    placeholder="#4F46E5"
                    className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-mono text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2E2D2D] mb-1">URL Foto Profil / Avatar</label>
                <input
                  type="text"
                  value={teamForm.image}
                  onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })}
                  placeholder="https://i.pravatar.cc/300?img=11 atau /images/nama.jpg"
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] focus:border-[#2563EB] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ECECEC]">
                <button
                  type="button"
                  onClick={() => setShowTeamModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Simpan data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBJECT MODAL */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-[10px] border border-[#ECECEC] overflow-hidden font-sans">
            <div className="p-6 pb-4 bg-white flex items-center justify-between border-b border-[#ECECEC]">
              <h3 className="text-base font-bold text-[#2E2D2D]">
                {editingSubject ? 'Edit bidang utama' : 'Tambah bidang baru'}
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSubject} className="p-6 space-y-4">
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
                    placeholder="OTM"
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

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#ECECEC]">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2.5 rounded-[8px] bg-white border border-[#ECECEC] text-[#2E2D2D] font-semibold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs cursor-pointer shadow-xs"
                >
                  Simpan bidang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODALS */}
      {/* 1. Article Delete Modal */}
      {deleteTargetArticle && (
        <div
          onClick={() => setDeleteTargetArticle(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setDeleteTargetArticle(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>

            <h3 className="font-bold text-base text-[#2E2D2D]">Hapus Artikel Website</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus artikel <strong className="text-[#2E2D2D]">{deleteTargetArticle.title}</strong>? Artikel ini akan terhapus dari halaman publik.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTargetArticle(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const target = deleteTargetArticle;
                  deleteArticle(target.id);
                  await ArticleService.deleteArticle(target.id, target.title);
                  setDeleteTargetArticle(null);
                }}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all"
              >
                Hapus Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Doc Delete Modal */}
      {deleteTargetDoc && (
        <div
          onClick={() => setDeleteTargetDoc(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setDeleteTargetDoc(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>

            <h3 className="font-bold text-base text-[#2E2D2D]">Hapus Panduan Dokumentasi</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus panduan <strong className="text-[#2E2D2D]">{deleteTargetDoc.title}</strong>? Panduan ini akan terhapus dari halaman bantuan.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTargetDoc(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteDoc(deleteTargetDoc.id);
                  setDeleteTargetDoc(null);
                }}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all"
              >
                Hapus Panduan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. FAQ Delete Modal */}
      {deleteTargetFaq && (
        <div
          onClick={() => setDeleteTargetFaq(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setDeleteTargetFaq(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>

            <h3 className="font-bold text-base text-[#2E2D2D]">Hapus Tanya Jawab FAQ</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus pertanyaan <strong className="text-[#2E2D2D]">{deleteTargetFaq.question}</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTargetFaq(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteFaq(deleteTargetFaq.id);
                  setDeleteTargetFaq(null);
                }}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all"
              >
                Hapus FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Team Member Delete Modal */}
      {deleteTargetTeam && (
        <div
          onClick={() => setDeleteTargetTeam(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setDeleteTargetTeam(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <Trash2 className="w-5 h-5 text-rose-600" />
            </div>

            <h3 className="font-bold text-base text-[#2E2D2D]">Hapus Anggota Tim</h3>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Apakah Anda yakin ingin menghapus data anggota <strong className="text-[#2E2D2D]">{deleteTargetTeam.title}</strong> ({deleteTargetTeam.division})?
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setDeleteTargetTeam(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-[#2E2D2D] text-xs font-semibold hover:bg-slate-200 cursor-pointer transition-all"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  deleteTeamMember(deleteTargetTeam.id);
                  setDeleteTargetTeam(null);
                }}
                className="px-4 py-2 rounded-[8px] bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer shadow-xs transition-all"
              >
                Hapus Anggota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
