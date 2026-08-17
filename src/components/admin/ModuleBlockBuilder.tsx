'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Type,
  Image as ImageIcon,
  Video as VideoIcon,
  Paperclip,
  ListOrdered,
  HelpCircle,
  ChevronRight,
  CheckCircle2,
  FileText,
  RefreshCw,
  Pencil,
  Play,
  File,
  Upload,
  ExternalLink,
  QrCode,
  Download,
  Laptop,
  Link as LinkIcon,
} from 'lucide-react';
import { ModuleItem } from '@/lib/admin-store';

export type BlockType = 'text' | 'image' | 'video' | 'attachment' | 'steps' | 'test';
export type TestType = 'link_eksternal' | 'qr_code' | 'kuis_sitemsa';

export interface AttachedFileItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
}

export interface CanvasBlock {
  id: string;
  type: BlockType;
  // Section Text block data (Title + Content)
  sectionTitle?: string;
  textValue?: string;
  alignment?: 'left' | 'center' | 'right';

  // Media block data
  mediaUrl?: string;

  // Attachment block data (SUPPORTS MULTIPLE FILES)
  attachments?: AttachedFileItem[];

  // Step by step block data
  steps?: { title: string; desc: string }[];

  // Test block data (3 Types: link_eksternal, qr_code, kuis_sitemsa)
  testType?: TestType;
  testTitle?: string;
  testDescription?: string;
  testUrl?: string;
  qrImageUrl?: string;
  testQuestion?: string;
  testOptions?: string[];
  correctAnswer?: number | string;
  explanation?: string;
}

interface ModuleBlockBuilderProps {
  initialModule?: ModuleItem | null;
  subjectName: string;
  onClose: () => void;
  onSave: (moduleData: Partial<ModuleItem>, blocks: CanvasBlock[]) => void;
}

// Auto-resizing Textarea Component with zero scrollbars
function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
  style,
  rows = 1,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  rows?: number;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        resize();
      }}
      placeholder={placeholder}
      className={`overflow-hidden resize-none ${className || ''}`}
      style={{ ...style, height: 'auto' }}
    />
  );
}

export default function ModuleBlockBuilder({
  initialModule,
  subjectName,
  onClose,
  onSave,
}: ModuleBlockBuilderProps) {
  const [moduleTitle, setModuleTitle] = useState(initialModule?.title || 'Give me a name');
  const [moduleLevel, setModuleLevel] = useState<'Pemula' | 'Menengah' | 'Mahir'>(initialModule?.level || 'Pemula');
  const [moduleDuration, setModuleDuration] = useState(initialModule?.duration || '30 Menit');

  // Lock global body scroll when module builder modal is active
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Blocks state: EMPTY CANVAS FOR NEW MATERIAL
  const [blocks, setBlocks] = useState<CanvasBlock[]>(
    initialModule
      ? [
          {
            id: 'blk-1',
            type: 'text',
            sectionTitle: initialModule.title,
            textValue: initialModule.description,
            alignment: 'left',
          },
        ]
      : []
  );

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // State for Right Sidebar Visibility & Target Insert Position
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | undefined>(undefined);

  // Modals & Native File Upload state
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<'computer' | 'url'>('computer');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [tempVideoUrl, setTempVideoUrl] = useState('');
  const [activeQrModalUrl, setActiveQrModalUrl] = useState<string | null>(null);

  // Attachment file upload state
  const [changingAttachmentFileId, setChangingAttachmentFileId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentFileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  // Helper to extract YouTube embed URL
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(url);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  // Add block (Supports inserting at targetIndex or insertTargetIndex state)
  const handleAddBlock = (type: BlockType, targetIndex?: number) => {
    const actualIndex = targetIndex !== undefined ? targetIndex : insertTargetIndex;

    const newBlock: CanvasBlock = {
      id: `blk-${Date.now()}`,
      type,
    };

    if (type === 'text') {
      newBlock.sectionTitle = 'Heading';
      newBlock.textValue = 'Enter your text here....';
      newBlock.alignment = 'left';
    } else if (type === 'image') {
      newBlock.mediaUrl = '';
    } else if (type === 'video') {
      newBlock.mediaUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    } else if (type === 'attachment') {
      // EMPTY INITIAL ATTACHMENTS STATE (LIKE IMAGE BLOCK)
      newBlock.attachments = [];
    } else if (type === 'steps') {
      newBlock.steps = [
        { title: 'Langkah 1', desc: 'Penjelasan instruksi langkah pertama praktikum...' },
      ];
    } else if (type === 'test') {
      newBlock.testType = 'kuis_sitemsa';
      newBlock.testTitle = 'Kuis Evaluasi Praktikum';
      newBlock.testDescription = 'Uji pemahaman Anda mengenai rangkaian seri dan paralel resistor.';
      newBlock.testUrl = 'https://quizizz.com/join?gc=123456';
      newBlock.qrImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://quizizz.com/join?gc=123456';
      newBlock.testQuestion = 'Tuliskan pertanyaan kuis mini di sini...';
      newBlock.testOptions = ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'];
      newBlock.correctAnswer = 0;
    }

    if (actualIndex !== undefined) {
      const updated = [...blocks];
      updated.splice(actualIndex + 1, 0, newBlock);
      setBlocks(updated);
    } else {
      setBlocks([...blocks, newBlock]);
    }

    setSelectedBlockId(newBlock.id);
    setInsertTargetIndex(undefined);

    if (type === 'attachment') {
      setShowRightSidebar(true);
    }
  };

  // Move block up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...blocks];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setBlocks(updated);
  };

  // Move block down
  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setBlocks(updated);
  };

  // Duplicate block
  const handleDuplicateBlock = (block: CanvasBlock, index: number) => {
    const duplicated: CanvasBlock = JSON.parse(JSON.stringify(block));
    duplicated.id = `blk-${Date.now()}`;
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    setBlocks(updated);
    setSelectedBlockId(duplicated.id);
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    if (selectedBlockId === id) {
      setSelectedBlockId(updated[0]?.id || null);
    }
  };

  // Update block fields directly
  const updateBlockById = (id: string, fields: Partial<CanvasBlock>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...fields } : b))
    );
  };

  // File Attachments Multi-file Handlers (Direct Computer Upload)
  const triggerAddAttachmentFileFromComputer = (blockId: string, replaceFileId?: string) => {
    setSelectedBlockId(blockId);
    setChangingAttachmentFileId(replaceFileId || null);
    attachmentFileInputRef.current?.click();
  };

  const handleAttachmentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBlockId) return;

    const formattedSize = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    const targetBlock = blocks.find((b) => b.id === selectedBlockId);
    if (!targetBlock) return;

    const currentList = targetBlock.attachments || [];

    if (changingAttachmentFileId) {
      // REPLACE EXISTING FILE
      const updatedList = currentList.map((f) =>
        f.id === changingAttachmentFileId
          ? { ...f, fileName: file.name, fileSize: formattedSize, fileUrl: '#' }
          : f
      );
      updateBlockById(selectedBlockId, { attachments: updatedList });
      setChangingAttachmentFileId(null);
    } else {
      // ADD NEW FILE ITEM FROM COMPUTER
      const newFileItem: AttachedFileItem = {
        id: `file-${Date.now()}`,
        fileName: file.name,
        fileSize: formattedSize,
        fileUrl: '#',
      };
      updateBlockById(selectedBlockId, { attachments: [...currentList, newFileItem] });
    }

    // Reset input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleDeleteAttachmentFile = (blockId: string, fileId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.attachments) return;
    const updatedList = block.attachments.filter((f) => f.id !== fileId);
    updateBlockById(blockId, { attachments: updatedList });
  };

  // Step-by-Step inline handlers
  const handleAddStepItem = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    const currentSteps = block.steps || [];
    const nextStepNum = currentSteps.length + 1;
    const newSteps = [
      ...currentSteps,
      { title: `Langkah ${nextStepNum}`, desc: `Penjelasan instruksi langkah ${nextStepNum}...` },
    ];
    updateBlockById(blockId, { steps: newSteps });
  };

  const handleUpdateStepItem = (blockId: string, sIdx: number, field: 'title' | 'desc', val: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.steps) return;
    const updatedSteps = [...block.steps];
    updatedSteps[sIdx] = { ...updatedSteps[sIdx], [field]: val };
    updateBlockById(blockId, { steps: updatedSteps });
  };

  const handleDeleteStepItem = (blockId: string, sIdx: number) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.steps || block.steps.length <= 1) return;
    const updatedSteps = block.steps.filter((_, idx) => idx !== sIdx);
    updateBlockById(blockId, { steps: updatedSteps });
  };

  // Image replacement modal (Computer or URL option)
  const handlePromptChangeImage = (blockId: string, currentUrl?: string) => {
    setEditingImageId(blockId);
    setImageUploadMode('computer');
    setTempImageUrl(currentUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop');
  };

  const handleConfirmImageChange = () => {
    if (editingImageId && tempImageUrl.trim()) {
      updateBlockById(editingImageId, { mediaUrl: tempImageUrl });
    }
    setEditingImageId(null);
  };

  const handleComputerFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingImageId) {
      const localUrl = URL.createObjectURL(file);
      updateBlockById(editingImageId, { mediaUrl: localUrl });
      setEditingImageId(null);
    }
  };

  // Video YT modal
  const handlePromptChangeVideo = (blockId: string, currentUrl?: string) => {
    setEditingVideoId(blockId);
    setTempVideoUrl(currentUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  };

  const handleConfirmVideoChange = () => {
    if (editingVideoId && tempVideoUrl.trim()) {
      updateBlockById(editingVideoId, { mediaUrl: tempVideoUrl });
    }
    setEditingVideoId(null);
  };

  // Save handler
  const handleSaveModule = () => {
    if (!moduleTitle.trim()) {
      alert('Judul modul tidak boleh kosong.');
      return;
    }
    onSave(
      {
        title: moduleTitle,
        subject: subjectName,
        level: moduleLevel,
        duration: moduleDuration,
      },
      blocks
    );
    onClose();
  };

  return (
    <div
      onClick={() => setSelectedBlockId(null)}
      className="fixed inset-0 z-50 bg-white flex flex-col font-sans text-[#2E2D2D] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
    >
      
      {/* 1. FIXED TOP HEADER BAR */}
      <header className="h-16 bg-white border-b border-[#ECECEC] px-6 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        
        {/* Left Section: Cancel Button + Title Input */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            title="Cancel / Batal"
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 min-w-0 shrink-0"
          >
            <div className="inline-grid items-center font-bold text-lg sm:text-xl text-[#2E2D2D] border-b-2 border-dotted border-slate-300 focus-within:border-[#2563EB] hover:border-slate-400 transition-colors pb-0.5 max-w-md">
              <span className="col-start-1 row-start-1 invisible whitespace-pre font-bold text-lg sm:text-xl px-0 pointer-events-none select-none">
                {moduleTitle || 'Give me a name'}
              </span>
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) => setModuleTitle(e.target.value)}
                placeholder="Give me a name"
                className="col-start-1 row-start-1 w-full font-bold text-lg sm:text-xl text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent p-0 m-0"
              />
            </div>
            <Pencil className="w-4 h-4 text-[#737373] shrink-0" />
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 shrink-0"
        >
          <button
            onClick={handleSaveModule}
            className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#2E2D2D] cursor-pointer"
          >
            Save as draft
          </button>
          <button
            onClick={handleSaveModule}
            className="px-5 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-xs font-semibold text-white shadow-xs cursor-pointer"
          >
            Continue
          </button>
        </div>

      </header>

      {/* 2. MAIN BUILDER BODY */}
      <div className="flex-1 flex overflow-hidden relative bg-white">
        
        {/* CENTER CANVAS AREA */}
        <main
          onClick={() => setSelectedBlockId(null)}
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 flex justify-center bg-white cursor-default"
        >
          <div className="w-full max-w-3xl space-y-4 pb-32">

            {/* EMPTY STATE CANVAS */}
            {blocks.length === 0 && (
              <div className="py-16 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[12px] p-12 bg-white mt-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-base text-[#2E2D2D]">Kanvas Modul Masih Kosong</p>
                  <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
                    Klik tombol di bawah atau gunakan menu di sebelah kanan untuk memilih blok materi.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowRightSidebar(true);
                      handleAddBlock('text');
                    }}
                    className="px-6 py-3 rounded-[10px] bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 cursor-pointer shadow-xs inline-flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                    <span className="inline-block leading-none transform translate-y-[0.5px]">Tambah Section Teks</span>
                  </button>
                </div>
              </div>
            )}

            {/* BLOCKS RENDER LIST */}
            <div className="space-y-4 pt-2">
              {blocks.map((block, index) => {
                const isSelected = selectedBlockId === block.id;

                return (
                  <div key={block.id} className="relative">
                    
                    {/* BLOCK CONTENT WRAPPER WITH FLOATING TOOLBAR SCOPED TO BLOCK HOVER/FOCUS */}
                    <div className="relative group/blockContent">
                      
                      {/* FLOATING ACTION TOOLBAR ON HOVER/FOCUS OF ACTIVE BLOCK ONLY */}
                      <div className={`absolute -right-14 top-1/2 -translate-y-1/2 transition-opacity bg-white border border-[#ECECEC] rounded-[8px] p-1 shadow-md flex flex-col gap-1 z-30 ${
                        isSelected ? 'opacity-100' : 'opacity-0 group-hover/blockContent:opacity-100'
                      }`}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveUp(index);
                          }}
                          disabled={index === 0}
                          title="Pindah ke Atas"
                          className="p-1.5 hover:bg-slate-100 rounded-[4px] text-[#737373] hover:text-[#2E2D2D] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveDown(index);
                          }}
                          disabled={index === blocks.length - 1}
                          title="Pindah ke Bawah"
                          className="p-1.5 hover:bg-slate-100 rounded-[4px] text-[#737373] hover:text-[#2E2D2D] disabled:opacity-30 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateBlock(block, index);
                          }}
                          title="Duplikat Blok"
                          className="p-1.5 hover:bg-slate-100 rounded-[4px] text-[#737373] hover:text-[#2563EB] cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(block.id);
                          }}
                          title="Hapus Blok"
                          className="p-1.5 hover:bg-rose-50 rounded-[4px] text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* BLOCK CONTAINER WITH OUTSIDE OUTLINE STROKE (NO INSET BORDER, NO SCALE) */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBlockId(block.id);
                          setInsertTargetIndex(undefined);
                          if (block.type === 'attachment') {
                            setShowRightSidebar(true);
                          }
                        }}
                        className={`rounded-[12px] p-4 transition-all duration-200 cursor-text relative h-auto ${
                          isSelected
                            ? 'outline outline-2 outline-[#2563EB] outline-offset-2 bg-white shadow-2xs'
                            : 'outline outline-2 outline-transparent outline-offset-2 bg-transparent hover:outline-slate-300'
                        }`}
                      >
                      
                      {/* 1. TEXT SECTION BLOCK */}
                      {block.type === 'text' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={block.sectionTitle || ''}
                            onChange={(e) => updateBlockById(block.id, { sectionTitle: e.target.value })}
                            placeholder="Heading"
                            className="w-full text-2xl font-bold text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent"
                            style={{ textAlign: block.alignment || 'left' }}
                          />

                          <AutoResizeTextarea
                            value={block.textValue || ''}
                            onChange={(val) => updateBlockById(block.id, { textValue: val })}
                            placeholder="Enter your text here...."
                            className="w-full text-sm text-[#2E2D2D] leading-relaxed placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent"
                            style={{ textAlign: block.alignment || 'left' }}
                          />
                        </div>
                      )}

                      {/* 2. IMAGE BLOCK (NO CAPTION) */}
                      {block.type === 'image' && (
                        <div>
                          {!block.mediaUrl ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromptChangeImage(block.id, '');
                              }}
                              className="rounded-[12px] border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-slate-50/50 p-12 text-center transition-all cursor-pointer group/imgCard"
                            >
                              <div className="w-12 h-12 rounded-full bg-white border border-[#ECECEC] text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                              <p className="font-bold text-sm text-[#2E2D2D] mt-3">Klik untuk Upload Gambar</p>
                              <p className="text-xs text-[#737373] mt-1">Pilih File Komputer atau Tautan URL</p>
                            </div>
                          ) : (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePromptChangeImage(block.id, block.mediaUrl);
                              }}
                              className="relative rounded-[12px] overflow-hidden border border-[#ECECEC] bg-slate-50 max-h-[450px] flex items-center justify-center group/img cursor-pointer"
                            >
                              {/* eslint-disable-next-next/no-img-element */}
                              <img
                                src={block.mediaUrl}
                                alt="Gambar Materi"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="px-4 py-2 rounded-[8px] bg-white text-[#2E2D2D] text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer">
                                  <RefreshCw className="w-4 h-4 text-[#2563EB]" />
                                  <span>Klik untuk Ganti Gambar</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3. VIDEO YT BLOCK */}
                      {block.type === 'video' && (
                        <div className="space-y-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePromptChangeVideo(block.id, block.mediaUrl);
                            }}
                            className="relative rounded-[12px] overflow-hidden border border-[#ECECEC] bg-slate-900 aspect-video flex flex-col items-center justify-center text-white group/vid cursor-pointer"
                          >
                            {block.mediaUrl && block.mediaUrl.includes('youtube') ? (
                              <iframe
                                src={getYouTubeEmbedUrl(block.mediaUrl)}
                                title="YouTube Video Preview"
                                className="w-full h-full border-0 pointer-events-none"
                              />
                            ) : (
                              <div className="p-6 text-center">
                                <VideoIcon className="w-12 h-12 text-[#2563EB] mx-auto mb-2" />
                                <p className="font-bold text-sm">Media Video YouTube</p>
                                <p className="text-xs text-slate-400 mt-1">{block.mediaUrl || 'Klik untuk mengatur URL Video YouTube'}</p>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/vid:opacity-100 transition-opacity flex items-center justify-center">
                              <button className="px-4 py-2 rounded-[8px] bg-white text-[#2E2D2D] text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer">
                                <Play className="w-4 h-4 text-[#2563EB]" />
                                <span>Klik untuk Ganti URL Video YT</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. FILE ATTACHMENT BLOCK (EMPTY PLACEHOLDER WHEN NO FILES YET) */}
                      {block.type === 'attachment' && (
                        <div>
                          {(!block.attachments || block.attachments.length === 0) ? (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerAddAttachmentFileFromComputer(block.id);
                              }}
                              className="rounded-[12px] border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-slate-50/50 p-12 text-center transition-all cursor-pointer group/fileCard"
                            >
                              <div className="w-12 h-12 rounded-full bg-white border border-[#ECECEC] text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
                                <Paperclip className="w-6 h-6" />
                              </div>
                              <p className="font-bold text-sm text-[#2E2D2D] mt-3">Klik untuk Upload File Lampiran</p>
                              <p className="text-xs text-[#737373] mt-1">Pilih Dokumen PDF, DOCX, PPTX, atau ZIP dari Komputer</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {block.attachments.map((fileItem, fIdx) => (
                                <div
                                  key={fileItem.id || fIdx}
                                  className="p-3.5 rounded-[10px] bg-slate-50 border border-[#ECECEC] flex items-center justify-between shadow-2xs hover:bg-slate-100/60 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-[8px] bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                                      <File className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-xs text-[#2E2D2D]">{fileItem.fileName}</p>
                                      <p className="text-[11px] text-[#737373] mt-0.5">{fileItem.fileSize}</p>
                                    </div>
                                  </div>

                                  <span className="text-xs font-semibold text-[#2563EB] bg-white border border-[#ECECEC] px-3 py-1.5 rounded-[6px] flex items-center gap-1">
                                    <Download className="w-3.5 h-3.5" /> Download
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5. STEP BY STEP BLOCK */}
                      {block.type === 'steps' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-[#737373] flex items-center gap-1.5">
                              <ListOrdered className="w-4 h-4 text-[#2563EB]" /> Langkah Praktikum Berurutan
                            </h4>
                          </div>

                          <div className="space-y-3">
                            {(block.steps || []).map((step, sIdx) => (
                              <div key={sIdx} className="p-4 rounded-[10px] bg-slate-50/80 border border-[#ECECEC] space-y-2 relative group/step">
                                <div className="flex items-center gap-3">
                                  <span className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shrink-0">
                                    {sIdx + 1}
                                  </span>
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => handleUpdateStepItem(block.id, sIdx, 'title', e.target.value)}
                                    placeholder={`Langkah ${sIdx + 1}`}
                                    className="flex-1 font-bold text-xs text-[#2E2D2D] border-b border-dashed border-slate-300 focus:border-[#2563EB] outline-none bg-transparent pb-0.5"
                                  />
                                  {(block.steps || []).length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteStepItem(block.id, sIdx);
                                      }}
                                      title="Hapus Langkah Ini"
                                      className="text-slate-400 hover:text-rose-600 p-1 rounded-[4px]"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>

                                <AutoResizeTextarea
                                  value={step.desc}
                                  onChange={(val) => handleUpdateStepItem(block.id, sIdx, 'desc', val)}
                                  placeholder="Tuliskan penjelasan detail untuk langkah ini..."
                                  className="w-full text-xs text-[#737373] leading-relaxed border-none focus:ring-0 outline-none bg-transparent pl-10"
                                />
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddStepItem(block.id);
                            }}
                            className="w-full py-2.5 rounded-[8px] border border-dashed border-blue-300 hover:border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                          >
                            <Plus className="w-4 h-4 shrink-0 text-[#2563EB]" strokeWidth={2.5} />
                            <span className="inline-block leading-none transform translate-y-[0.5px]">Tambah Langkah {(block.steps || []).length + 1}</span>
                          </button>
                        </div>
                      )}

                      {/* 6. TEST BLOCK */}
                      {block.type === 'test' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-[6px] flex items-center gap-1">
                                <HelpCircle className="w-3.5 h-3.5" /> Modul Evaluasi & Kuis
                              </span>
                            </div>

                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-2"
                            >
                              <label className="text-xs font-semibold text-[#737373]">Jenis Test:</label>
                              <select
                                value={block.testType || 'kuis_sitemsa'}
                                onChange={(e) => updateBlockById(block.id, { testType: e.target.value as TestType })}
                                className="text-xs font-bold bg-white border border-[#ECECEC] rounded-[6px] px-2.5 py-1 text-[#2563EB] outline-none cursor-pointer focus:border-[#2563EB]"
                              >
                                <option value="link_eksternal">Link Eksternal (Quizizz / GForms)</option>
                                <option value="qr_code">Barcode / QR Code Modal</option>
                                <option value="kuis_sitemsa">Kuis Native Sitemsa</option>
                              </select>
                            </div>
                          </div>

                          {block.testType === 'link_eksternal' && (
                            <div className="p-5 rounded-[12px] bg-slate-50 border border-[#ECECEC] space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-blue-600 tracking-wide flex items-center gap-1">
                                  <ExternalLink className="w-3.5 h-3.5" /> Link Eksternal
                                </span>
                              </div>
                              <input
                                type="text"
                                value={block.testTitle || ''}
                                onChange={(e) => updateBlockById(block.id, { testTitle: e.target.value })}
                                placeholder="Judul Kuis (contoh: Kuis Quizizz Lab Elektronika)"
                                className="w-full font-bold text-sm text-[#2E2D2D] border-b border-dashed border-slate-300 focus:border-[#2563EB] outline-none bg-transparent pb-1"
                              />
                              <textarea
                                rows={2}
                                value={block.testDescription || ''}
                                onChange={(e) => updateBlockById(block.id, { testDescription: e.target.value })}
                                placeholder="Deskripsi atau petunjuk singkat kuis..."
                                className="w-full text-xs text-[#737373] border-none focus:ring-0 outline-none bg-transparent resize-none"
                              />
                              <div className="pt-2 flex items-center gap-3">
                                <input
                                  type="text"
                                  value={block.testUrl || ''}
                                  onChange={(e) => updateBlockById(block.id, { testUrl: e.target.value })}
                                  placeholder="URL Tautan Kuis (https://...)"
                                  className="flex-1 h-9 px-3 rounded-[6px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none"
                                />
                                <button className="px-4 py-2 rounded-[8px] bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                  <span>Mulai Uji Pemahaman</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {block.testType === 'qr_code' && (
                            <div className="p-5 rounded-[12px] bg-slate-50 border border-[#ECECEC] space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-purple-600 tracking-wide flex items-center gap-1">
                                  <QrCode className="w-3.5 h-3.5" /> Barcode / Qr Code
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-24 h-24 rounded-[10px] bg-white p-2 border border-[#ECECEC] shrink-0 flex items-center justify-center">
                                  {/* eslint-disable-next-next/no-img-element */}
                                  <img
                                    src={block.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://quizizz.com'}
                                    alt="QR Code Kuis"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="flex-1 space-y-2 w-full">
                                  <input
                                    type="text"
                                    value={block.testTitle || ''}
                                    onChange={(e) => updateBlockById(block.id, { testTitle: e.target.value })}
                                    placeholder="Judul Barcode Kuis"
                                    className="w-full font-bold text-sm text-[#2E2D2D] border-b border-dashed border-slate-300 focus:border-[#2563EB] outline-none bg-transparent pb-1"
                                  />
                                  <input
                                    type="text"
                                    value={block.qrImageUrl || ''}
                                    onChange={(e) => updateBlockById(block.id, { qrImageUrl: e.target.value })}
                                    placeholder="URL Gambar Barcode QR Code"
                                    className="w-full h-8 px-2.5 rounded-[6px] bg-white border border-[#ECECEC] text-xs text-[#737373] outline-none"
                                  />
                                  <button
                                    onClick={() => setActiveQrModalUrl(block.qrImageUrl || 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://quizizz.com')}
                                    className="px-4 py-2 rounded-[8px] bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                  >
                                    <QrCode className="w-3.5 h-3.5" />
                                    <span>Tampilkan Barcode Modal (Preview)</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {(block.testType === 'kuis_sitemsa' || !block.testType) && (
                            <div className="space-y-3">
                              <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-[#737373]">Pertanyaan Kuis Native Sitemsa:</label>
                                <input
                                  type="text"
                                  value={block.testQuestion || ''}
                                  onChange={(e) => updateBlockById(block.id, { testQuestion: e.target.value })}
                                  placeholder="Tuliskan pertanyaan kuis di sini..."
                                  className="w-full font-bold text-sm text-[#2E2D2D] border-b border-dashed border-slate-300 focus:border-[#2563EB] outline-none bg-transparent pb-1"
                                />
                              </div>

                              <div className="space-y-2 pt-1">
                                <label className="text-[11px] font-semibold text-[#737373]">Opsi Jawaban (Pilih radio button untuk kunci jawaban):</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {(block.testOptions || []).map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className={`p-2.5 rounded-[8px] border text-xs font-medium flex items-center gap-2 ${
                                        block.correctAnswer === oIdx
                                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                                          : 'bg-white border-[#ECECEC] text-[#2E2D2D]'
                                      }`}
                                    >
                                      <input
                                        type="radio"
                                        name={`correctOption_${block.id}`}
                                        checked={block.correctAnswer === oIdx}
                                        onChange={() => updateBlockById(block.id, { correctAnswer: oIdx })}
                                        className="accent-emerald-600 cursor-pointer"
                                      />
                                      <input
                                        type="text"
                                        value={opt}
                                        onChange={(e) => {
                                          const newOpts = [...(block.testOptions || [])];
                                          newOpts[oIdx] = e.target.value;
                                          updateBlockById(block.id, { testOptions: newOpts });
                                        }}
                                        className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-xs font-medium"
                                      />
                                      {block.correctAnswer === oIdx && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                        </div>
                      )}

                    </div>
                    </div>

                    {/* BETWEEN-BLOCKS "INSERT BLOCK" DIVIDER LINE — REMAINS VISIBLE WHEN RIGHT SIDEBAR IS OPEN FOR THIS INSERT INDEX */}
                    {(() => {
                      const isInsertActive = insertTargetIndex === index && showRightSidebar;
                      return (
                        <div
                          className={`relative py-5 flex items-center justify-center z-20 transition-opacity duration-200 group/insertArea ${
                            isInsertActive ? 'opacity-100' : 'opacity-0 hover:opacity-100'
                          }`}
                        >
                          <div className="absolute inset-0 flex items-center pointer-events-none">
                            <div className={`w-full border-t border-dashed ${isInsertActive ? 'border-[#2563EB] border-t-2' : 'border-[#2563EB]'}`} />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBlockId(null);
                              setInsertTargetIndex(index);
                              setShowRightSidebar(true);
                            }}
                            title="Insert block"
                            className={`relative z-10 px-4 py-2 rounded-full shadow-2xs inline-flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all ${
                              isInsertActive
                                ? 'bg-[#2563EB] text-white border border-[#2563EB] shadow-md scale-105'
                                : 'bg-white border border-[#2563EB] text-[#2563EB] hover:bg-blue-50'
                            }`}
                          >
                            <Plus className={`w-4 h-4 shrink-0 ${isInsertActive ? 'text-white' : 'text-[#2563EB]'}`} strokeWidth={2.5} />
                            <span className="inline-block leading-none transform translate-y-[0.5px]">Insert block</span>
                          </button>
                        </div>
                      );
                    })()}

                  </div>
                );
              })}
            </div>

          </div>
        </main>

        {/* RIGHT ACTION PANEL */}
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`bg-[#FFFFFF] border-l border-[#ECECEC] flex flex-col shrink-0 z-20 h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-in-out ${
            showRightSidebar
              ? 'w-80 opacity-100'
              : 'w-0 opacity-0 overflow-hidden border-l-0 pointer-events-none'
          }`}
        >
          
          {/* Panel Header */}
          <div className="p-4 flex items-center justify-between bg-white w-80 shrink-0">
            <span className="text-xs font-bold text-[#2E2D2D] tracking-tight">
              {selectedBlock?.type === 'attachment' ? 'Pengaturan File Lampiran' : 'Insert block'}
            </span>
            <button
              onClick={() => {
                setShowRightSidebar(false);
                setInsertTargetIndex(undefined);
              }}
              title="Tutup Menu Kanan"
              className="text-[#737373] hover:text-[#2E2D2D] p-1.5 rounded-[6px] hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* PANEL BODY CONTENT */}
          <div className="flex-1 p-5 pt-1 space-y-6 w-80">
            
            {/* IF FOCUSED BLOCK IS ATTACHMENT */}
            {selectedBlock?.type === 'attachment' ? (
              <div className="space-y-4 text-xs">
                
                {/* HORIZONTAL FILE LIST CARDS WITH CHANGE & DELETE ICONS */}
                <div className="space-y-2.5">
                  {(selectedBlock.attachments || []).map((fileItem, fIdx) => (
                    <div
                      key={fileItem.id || fIdx}
                      className="p-3 rounded-[10px] bg-slate-50 border border-[#ECECEC] flex items-center justify-between gap-2 shadow-2xs hover:bg-slate-100/60 transition-colors"
                    >
                      {/* Left: File Icon + File Name & Size */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-[8px] bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold shrink-0">
                          <File className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-[#2E2D2D] truncate">{fileItem.fileName}</p>
                          <p className="text-[11px] text-[#737373] mt-0.5">{fileItem.fileSize}</p>
                        </div>
                      </div>

                      {/* Right: Change & Delete Icon Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => triggerAddAttachmentFileFromComputer(selectedBlock.id, fileItem.id)}
                          title="Ganti File dari Komputer"
                          className="p-1.5 rounded-[6px] hover:bg-white text-slate-500 hover:text-[#2563EB] border border-transparent hover:border-[#ECECEC] cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteAttachmentFile(selectedBlock.id, fileItem.id)}
                          title="Hapus File"
                          className="p-1.5 rounded-[6px] hover:bg-white text-slate-400 hover:text-rose-600 border border-transparent hover:border-[#ECECEC] cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* + TAMBAH FILE BUTTON DIRECTLY OPENS COMPUTER FILE DIALOG */}
                <button
                  onClick={() => triggerAddAttachmentFileFromComputer(selectedBlock.id)}
                  className="w-full py-2.5 rounded-[8px] border border-dashed border-blue-300 hover:border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 shrink-0 text-[#2563EB]" strokeWidth={2.5} />
                  <span className="inline-block leading-none transform translate-y-[0.5px]">Tambah File Baru (Upload Komputer)</span>
                </button>

              </div>
            ) : (
              /* DEFAULT INSERT BLOCK MENU (ICON, TEXT, & CHEVRON TURN BLUE ON HOVER) */
              <>
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#737373] tracking-tight">Basic</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleAddBlock('text')}
                      className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Type className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Text Section</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                    </button>

                    <button
                      onClick={() => handleAddBlock('image')}
                      className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Image</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                    </button>

                    <button
                      onClick={() => handleAddBlock('video')}
                      className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <VideoIcon className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Video</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#737373] tracking-tight">Rich media</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleAddBlock('attachment')}
                      className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Lampiran File</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                    </button>

                    <button
                      onClick={() => handleAddBlock('steps')}
                      className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <ListOrdered className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Step by Step</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                    </button>

                    <button
                      onClick={() => handleAddBlock('test')}
                      className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Test / Mini Kuis</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </aside>

      </div>

      {/* HIDDEN COMPUTER FILE INPUT FOR IMAGE SELECTION */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleComputerFileSelect}
        className="hidden"
      />

      {/* HIDDEN COMPUTER FILE INPUT FOR ATTACHMENT SELECTION */}
      <input
        ref={attachmentFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.rar,image/*"
        onChange={handleAttachmentFileSelect}
        className="hidden"
      />

      {/* IMAGE SELECTION MODAL (CLEAN TEXT HEADLINE - NO ICON) */}
      {editingImageId && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2E2D2D]">
                Upload & Pengaturan Gambar
              </h3>
              <button onClick={() => setEditingImageId(null)} className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer" aria-label="Tutup Modal">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SELECTOR: COMPUTER OR URL */}
            <div className="flex bg-slate-100 p-1 rounded-[10px]">
              <button
                onClick={() => setImageUploadMode('computer')}
                className={`flex-1 py-2 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  imageUploadMode === 'computer'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-[#737373] hover:text-[#2E2D2D]'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Upload Komputer</span>
              </button>
              <button
                onClick={() => setImageUploadMode('url')}
                className={`flex-1 py-2 rounded-[8px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  imageUploadMode === 'url'
                    ? 'bg-white text-[#2563EB] shadow-xs'
                    : 'text-[#737373] hover:text-[#2E2D2D]'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Tautan URL</span>
              </button>
            </div>

            {/* TAB CONTENT: COMPUTER FILE UPLOAD */}
            {imageUploadMode === 'computer' && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-8 rounded-[12px] border-2 border-dashed border-blue-200 hover:border-[#2563EB] bg-blue-50/40 hover:bg-blue-50 text-center transition-all cursor-pointer space-y-2 group"
                >
                  <div className="w-12 h-12 rounded-full bg-white text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-xs text-[#2563EB]">Pilih Gambar dari Komputer</p>
                  <p className="text-[11px] text-[#737373]">Format PNG, JPG, JPEG, atau WEBP</p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: URL INPUT */}
            {imageUploadMode === 'url' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#2E2D2D]">URL Gambar</label>
                  <input
                    type="text"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full h-10 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingImageId(null)}
                    className="px-4 py-2 rounded-[8px] bg-slate-100 text-xs font-semibold text-[#2E2D2D] hover:bg-slate-200 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmImageChange}
                    className="px-4 py-2 rounded-[8px] bg-[#2563EB] text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-2xs transition-all duration-200 ease-in-out active:scale-[0.98]"
                  >
                    Gunakan URL
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* INLINE VIDEO YOUTUBE URL REPLACER MODAL (CLEAN TEXT HEADLINE - NO ICON) */}
      {editingVideoId && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-[12px] border border-[#ECECEC] p-6 w-full max-w-md space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#2E2D2D]">
                Pengaturan Media Video YouTube
              </h3>
              <button onClick={() => setEditingVideoId(null)} className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer" aria-label="Tutup Modal">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2E2D2D]">URL Video YouTube</label>
              <input
                type="text"
                value={tempVideoUrl}
                onChange={(e) => setTempVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full h-10 px-3 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB]"
              />
              <p className="text-[11px] text-[#737373]">Video akan otomatis di-embed secara langsung di atas kanvas.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingVideoId(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 text-xs font-semibold text-[#2E2D2D] hover:bg-slate-200 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmVideoChange}
                className="px-4 py-2 rounded-[8px] bg-[#2563EB] text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer transition-all duration-200 ease-in-out active:scale-[0.98]"
              >
                Simpan Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE POPUP MODAL PREVIEW FOR TEST BLOCK (CLEAN TEXT HEADLINE - NO ICON) */}
      {activeQrModalUrl && (
        <div
          onClick={() => setActiveQrModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#2E2D2D] text-[#ECECEC] rounded-[16px] p-6 w-full max-w-sm text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setActiveQrModalUrl(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-white pt-2">Pindai Barcode Kuis</h3>

            <div className="w-56 h-56 mx-auto bg-white p-3 rounded-[12px] border border-[#ECECEC] shadow-inner flex items-center justify-center">
              {/* eslint-disable-next-next/no-img-element */}
              <img
                src={activeQrModalUrl}
                alt="QR Code Kuis"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Pindai Barcode / QR Code di atas menggunakan kamera ponsel Anda untuk masuk ke kuis pengajar.
            </p>

            <button
              onClick={() => setActiveQrModalUrl(null)}
              className="w-full py-2.5 rounded-[8px] bg-[#2563EB] text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
            >
              Atau Buka Tautan Langsung &rarr;
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
