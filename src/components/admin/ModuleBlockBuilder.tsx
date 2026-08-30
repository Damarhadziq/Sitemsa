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
  ChevronDown,
  CheckCircle2,
  RefreshCw,
  Pencil,
  File,
  FileText,
  Upload,
  ExternalLink,
  QrCode,
  Download,
  Highlighter,
  AlertCircle,
  Hash,
  Code,
  Check,
  Loader2,
} from 'lucide-react';
import { ModuleItem } from '@/lib/admin-store';
import { getMaterialBlocksForModule, getMaterialDetailForModule } from '@/app/materi/[id]/page';
import { Tooltip } from '@/components/ui/tooltip';
import { StorageService } from '@/services/storage.service';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export type BlockType = 'text' | 'image' | 'video' | 'attachment' | 'steps' | 'callout' | 'code';
export type TestType = 'link_eksternal' | 'qr_code' | 'kuis_sitemsa';

export interface AttachedFileItem {
  id: string;
  fileName: string;
  fileSize: string;
  fileUrl: string;
}

export interface SectionElement {
  id: string;
  type: 'paragraph' | 'image';
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
}

export interface CanvasBlock {
  id: string;
  type: BlockType;
  // Section Text block data (Title + Elements + Highlight)
  sectionTitle?: string;
  textValue?: string;
  calloutText?: string;
  alignment?: 'left' | 'center' | 'right';
  elements?: SectionElement[];

  // Code block data (Informatika)
  codeSnippet?: {
    language: string;
    code: string;
  };

  // Media block data
  mediaUrl?: string;
  imageCaption?: string;

  // Attachment block data (SUPPORTS MULTIPLE FILES)
  attachments?: AttachedFileItem[];

  // Step by step block data
  stepSectionTitle?: string;
  stepSectionSubtitle?: string;
  steps?: { title: string; desc: string }[];
}

interface ModuleBlockBuilderProps {
  initialModule?: ModuleItem | null;
  subjectName: string;
  onClose: () => void;
  onSave: (moduleData: Partial<ModuleItem>, blocks: CanvasBlock[]) => void;
}

// Professional Tiptap Rich Text Editor with Perfect Word-Style Lists
function TiptapTextEditor({
  value,
  onChange,
  placeholder,
  className,
  style,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  rows?: number;
}) {
  const formatContentForTiptap = (val: string) => {
    if (!val) return '';
    // Strip bold/strong tags and inline font-weight to prevent pasted bold format
    val = val.replace(/<\/?(strong|b)\b[^>]*>/gi, '').replace(/font-weight\s*:\s*[^;"]+;?/gi, '');
    const stripped = val.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (!stripped) return '';
    if (val.trim().startsWith('<') && val.trim().endsWith('>')) {
      return val;
    }
    const lines = val.split('\n');
    let html = '';
    let inOrderedList = false;
    let inBulletList = false;

    lines.forEach((line) => {
      const trimmed = line.trim();
      const numMatch = trimmed.match(/^(\d+)[\.\)]\s+(.*)$/);
      const bulletMatch = trimmed.match(/^[•\-\*]\s+(.*)$/);

      if (numMatch) {
        if (inBulletList) {
          html += '</ul>';
          inBulletList = false;
        }
        if (!inOrderedList) {
          html += '<ol>';
          inOrderedList = true;
        }
        html += `<li><p>${numMatch[2]}</p></li>`;
      } else if (bulletMatch) {
        if (inOrderedList) {
          html += '</ol>';
          inOrderedList = false;
        }
        if (!inBulletList) {
          html += '<ul>';
          inBulletList = true;
        }
        html += `<li><p>${bulletMatch[1]}</p></li>`;
      } else {
        if (inOrderedList) {
          html += '</ol>';
          inOrderedList = false;
        }
        if (inBulletList) {
          html += '</ul>';
          inBulletList = false;
        }
        if (trimmed) {
          html += `<p>${trimmed}</p>`;
        }
      }
    });

    if (inOrderedList) html += '</ol>';
    if (inBulletList) html += '</ul>';
    return html || `<p>${val}</p>`;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-1 space-y-1',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-1 space-y-1',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'pl-1 leading-relaxed text-justify',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'leading-relaxed text-justify mb-2',
          },
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Tuliskan teks paragraf di sini...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: formatContentForTiptap(value || ''),
    editorProps: {
      attributes: {
        class: `outline-none min-h-[1.5rem] break-words text-justify ${className || ''}`,
      },
      transformPastedHTML(html) {
        return html
          .replace(/<\/?(strong|b)\b[^>]*>/gi, '')
          .replace(/font-weight\s*:\s*[^;"]+;?/gi, '');
      },
      transformPastedText(text) {
        return text;
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const isEmpty = editor.isEmpty || !editor.getText().trim();
      const html = isEmpty ? '' : editor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      if (editor.isFocused) return;
      const currentHtml = editor.getHTML();
      const newFormatted = formatContentForTiptap(value);
      if (currentHtml !== newFormatted) {
        editor.commands.setContent(newFormatted, { emitUpdate: false });
      }
    }
  }, [value, editor]);

  return (
    <div
      className="tiptap-editor-container w-full cursor-text"
      style={style}
      onClick={() => editor?.commands.focus()}
    >
      <style jsx global>{`
        .tiptap-editor-container .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #AAAAAA;
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap-editor-container .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .tiptap-editor-container .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
        }
        .tiptap-editor-container .ProseMirror li {
          padding-left: 0.25rem;
          margin-bottom: 0.25rem;
          text-align: justify;
        }
        .tiptap-editor-container .ProseMirror li p {
          margin-bottom: 0;
          display: inline;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}

const AutoResizeTextarea = TiptapTextEditor;

export function ModuleBlockBuilder({
  initialModule,
  subjectName,
  onClose,
  onSave,
}: ModuleBlockBuilderProps) {
  const dbDetail = initialModule ? getMaterialDetailForModule(initialModule.id || initialModule.title) : undefined;

  // Title & Level state
  const [moduleTitle, setModuleTitle] = useState(
    initialModule?.title || dbDetail?.title || 'Give me a name'
  );
  const [moduleLevel, setModuleLevel] = useState<'Pemula' | 'Menengah' | 'Mahir'>(
    initialModule?.level || (dbDetail?.level as any) || 'Pemula'
  );
  const [moduleDuration, setModuleDuration] = useState(
    initialModule?.duration || dbDetail?.duration || '25 Menit'
  );

  // Dynamic Topics / Tags state (Dribbble Style Tag Input)
  const [moduleTopics, setModuleTopics] = useState<string[]>(
    (initialModule?.topics && initialModule.topics.length > 0)
      ? initialModule.topics
      : (dbDetail?.topics || [])
  );
  const [tagInputText, setTagInputText] = useState('');
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  // 16:9 Cover / Thumbnail state
  const [moduleThumbnail, setModuleThumbnail] = useState<string>(() => {
    if (initialModule?.thumbnail) return initialModule.thumbnail;
    return '';
  });
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const thumbnailFileInputRef = useRef<HTMLInputElement | null>(null);

  const handleThumbnailSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingThumbnail(true);
      setThumbnailUploadProgress(25);

      setTimeout(() => setThumbnailUploadProgress(60), 200);
      setTimeout(() => setThumbnailUploadProgress(85), 450);

      try {
        const uploadedUrl = await StorageService.uploadImage(file, 'covers');
        setThumbnailUploadProgress(100);
        setTimeout(() => {
          setModuleThumbnail(uploadedUrl);
          setIsUploadingThumbnail(false);
          setIsDirty(true);
        }, 200);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          const rawBase64 = event.target?.result as string;
          setThumbnailUploadProgress(100);
          setTimeout(() => {
            setModuleThumbnail(rawBase64);
            setIsUploadingThumbnail(false);
            setIsDirty(true);
          }, 200);
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = '';
  };

  // Publish / Draft Confirmation Modal state & Success Modal state
  const isAlreadyPublished = initialModule?.isPublished === true;
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [showFinalPublishConfirmModal, setShowFinalPublishConfirmModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // General Delete Action Confirmation Modal State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'block' | 'element' | 'step' | 'attachment' | 'highlight' | 'evaluasi';
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // Header toolbar mini-modal states (only for editing published modules)
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);
  const [showTopicsModal, setShowTopicsModal] = useState(false);
  const [showEvaluasiModal, setShowEvaluasiModal] = useState(false);
  const [isHeaderLevelDropdownOpen, setIsHeaderLevelDropdownOpen] = useState(false);

  // Evaluation / Quiz attached during Publish modal
  const [evaluationType, setEvaluationType] = useState<TestType | null>(
    initialModule?.quizSource ? initialModule.quizSource.type : null
  );
  const [evalTitle, setEvalTitle] = useState(initialModule?.quizSource?.title || '');
  const [evalUrl, setEvalUrl] = useState(initialModule?.quizSource?.externalUrl || '');
  const [evalQrUrl, setEvalQrUrl] = useState(initialModule?.quizSource?.qrImageUrl || '');
  const [expandedImagePreviewUrl, setExpandedImagePreviewUrl] = useState<string | null>(null);

  const handleSwitchEvaluationType = (newType: TestType | null) => {
    setEvaluationType(newType);
    setEvalTitle('');
    setEvalUrl('');
    setEvalQrUrl('');
  };

  // Custom Dropdowns popover open state
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [isQuizDropdownOpen, setIsQuizDropdownOpen] = useState(false);

  // Blocks state: Populated with full database blocks if editing, or empty canvas for new material
  const [blocks, setBlocks] = useState<CanvasBlock[]>(() => {
    if (!initialModule) return [];
    if (initialModule.blocks && initialModule.blocks.length > 0) {
      return initialModule.blocks;
    }
    const fromDb = getMaterialBlocksForModule(initialModule.id || initialModule.title);
    if (fromDb && fromDb.length > 0) {
      return fromDb;
    }
    return [
      {
        id: 'blk-1',
        type: 'text',
        sectionTitle: initialModule.title,
        textValue: initialModule.description,
        alignment: 'left',
      },
    ];
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Clean up legacy draft storage keys on mount if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('sintesa_module_draft_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (err) {
        // ignore
      }
    }
  }, []);

  // Lock global body scroll when canvas builder is active
  useEffect(() => {
    document.documentElement.classList.add("modal-open");
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = '';
    };
  }, []);
  
  // State for Right Sidebar Visibility & Target Insert Position
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | undefined>(undefined);

  // Modals & Native File Upload state
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [editingSectionImage, setEditingSectionImage] = useState<{ blockId: string; elIndex: number } | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<'computer' | 'url'>('computer');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [tempVideoUrl, setTempVideoUrl] = useState('');
  const [activeQrModalUrl, setActiveQrModalUrl] = useState<string | null>(null);

  // Attachment file upload state
  const [changingAttachmentFileId, setChangingAttachmentFileId] = useState<string | null>(null);
  const [copiedBlockId, setCopiedBlockId] = useState<string | null>(null);
  const targetAttachmentBlockIdRef = useRef<string | null>(null);
  const targetAttachmentItemIdRef = useRef<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const attachmentFileInputRef = useRef<HTMLInputElement | null>(null);
  const evalQrInputRef = useRef<HTMLInputElement | null>(null);
  const levelDropdownRef = useRef<HTMLDivElement | null>(null);
  const quizDropdownRef = useRef<HTMLDivElement | null>(null);
  const headerLevelDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setIsLevelDropdownOpen(false);
      }
      if (quizDropdownRef.current && !quizDropdownRef.current.contains(event.target as Node)) {
        setIsQuizDropdownOpen(false);
      }
      if (headerLevelDropdownRef.current && !headerLevelDropdownRef.current.contains(event.target as Node)) {
        setIsHeaderLevelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper to extract clean YouTube Embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();

    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regExp);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    if (trimmed.includes('youtube.com/embed/')) {
      return trimmed;
    }

    return trimmed;
  };

  // Add block
  const handleAddBlock = (type: BlockType, targetIndex?: number) => {
    setIsDirty(true);
    const actualIndex = targetIndex !== undefined ? targetIndex : insertTargetIndex;

    const newBlock: CanvasBlock = {
      id: `blk-${Date.now()}`,
      type,
    };

    if (type === 'text') {
      newBlock.sectionTitle = 'Heading';
      newBlock.textValue = 'Tuliskan isi paragraf materi di sini....';
      newBlock.alignment = 'left';
      newBlock.elements = [
        {
          id: `el-${newBlock.id}-1`,
          type: 'paragraph',
          text: 'Tuliskan isi paragraf materi di sini....',
        },
      ];
    } else if (type === 'image') {
      newBlock.mediaUrl = '';
    } else if (type === 'video') {
      newBlock.mediaUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    } else if (type === 'attachment') {
      newBlock.attachments = [];
    } else if (type === 'steps') {
      newBlock.stepSectionTitle = 'Panduan Langkah Praktik';
      newBlock.stepSectionSubtitle = 'Tuliskan deskripsi pengantar atau petunjuk instruksi di sini...';
      newBlock.steps = [
        { title: 'Langkah 1', desc: 'Penjelasan instruksi langkah pertama praktikum...' },
      ];
    } else if (type === 'callout') {
      newBlock.textValue = 'Prinsip Utama: Deklarasikan variabel dengan nama yang deskriptif dan mencerminkan isi datanya agar kode mudah dibaca oleh tim pengembangan.';
    } else if (type === 'code') {
      newBlock.codeSnippet = {
        language: 'JavaScript / TypeScript',
        code: '// Deklarasi Variabel & Tipe Data Dasar\nlet namaSiswa = "Budi Pratama"; // String\nlet nilaiUjian = 95;           // Integer\nlet ipk = 3.85;                // Float\nlet isLulus = true;            // Boolean\n\nconsole.log(`Siswa ${namaSiswa} memperoleh nilai ${nilaiUjian}`);',
      };
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

  const [animatingBlockId, setAnimatingBlockId] = useState<string | null>(null);
  const [animatingDir, setAnimatingDir] = useState<'up' | 'down' | null>(null);

  // Move block up
  const handleMoveUp = (index: number) => {
    if (index === 0 || animatingBlockId) return;
    setIsDirty(true);
    const currentId = blocks[index].id;
    setAnimatingBlockId(currentId);
    setAnimatingDir('up');

    setTimeout(() => {
      const updated = [...blocks];
      const temp = updated[index - 1];
      updated[index - 1] = updated[index];
      updated[index] = temp;
      setBlocks(updated);

      setTimeout(() => {
        setAnimatingBlockId(null);
        setAnimatingDir(null);
      }, 250);
    }, 120);
  };

  // Move block down
  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1 || animatingBlockId) return;
    setIsDirty(true);
    const currentId = blocks[index].id;
    setAnimatingBlockId(currentId);
    setAnimatingDir('down');

    setTimeout(() => {
      const updated = [...blocks];
      const temp = updated[index + 1];
      updated[index + 1] = updated[index];
      updated[index] = temp;
      setBlocks(updated);

      setTimeout(() => {
        setAnimatingBlockId(null);
        setAnimatingDir(null);
      }, 250);
    }, 120);
  };

  // Duplicate block
  const handleDuplicateBlock = (block: CanvasBlock, index: number) => {
    setIsDirty(true);
    const duplicated: CanvasBlock = JSON.parse(JSON.stringify(block));
    duplicated.id = `blk-${Date.now()}`;
    const updated = [...blocks];
    updated.splice(index + 1, 0, duplicated);
    setBlocks(updated);
    setSelectedBlockId(duplicated.id);
  };

  // Delete block
  const handleDeleteBlock = (id: string) => {
    setIsDirty(true);
    const updated = blocks.filter((b) => b.id !== id);
    setBlocks(updated);
    if (selectedBlockId === id) {
      setSelectedBlockId(updated[0]?.id || null);
    }
  };

  // Update block content by ID
  const updateBlockById = (id: string, partial: Partial<CanvasBlock>) => {
    setIsDirty(true);
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...partial } : b))
    );
  };

  // Step item helpers
  const handleAddStepItem = (blockId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    const currentSteps = block.steps || [];
    const nextNum = currentSteps.length + 1;
    const newSteps = [
      ...currentSteps,
      { title: `Langkah ${nextNum}`, desc: '' },
    ];
    updateBlockById(blockId, { steps: newSteps });
  };

  const handleUpdateStepItem = (
    blockId: string,
    stepIndex: number,
    field: 'title' | 'desc',
    value: string
  ) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.steps) return;
    const updatedSteps = [...block.steps];
    updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], [field]: value };
    updateBlockById(blockId, { steps: updatedSteps });
  };

  const handleDeleteStepItem = (blockId: string, stepIndex: number) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.steps) return;
    const updatedSteps = block.steps.filter((_, idx) => idx !== stepIndex);
    updateBlockById(blockId, { steps: updatedSteps });
  };

  // Section Multi-Element Handlers (Paragraphs & Images in Sequence)
  const handleAddSectionElement = (
    blockId: string,
    type: 'paragraph' | 'image',
    afterIndex?: number
  ) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;

    const currentElements: SectionElement[] =
      block.elements && block.elements.length > 0
        ? [...block.elements]
        : [{ id: `el-1`, type: 'paragraph', text: block.textValue || '' }];

    const newElement: SectionElement = {
      id: `el-${Date.now()}`,
      type,
      text: type === 'paragraph' ? '' : undefined,
      imageUrl: type === 'image' ? '' : undefined,
    };

    if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < currentElements.length) {
      currentElements.splice(afterIndex + 1, 0, newElement);
    } else {
      currentElements.push(newElement);
    }

    updateBlockById(blockId, { elements: currentElements });
  };

  const handleUpdateSectionElement = (
    blockId: string,
    elIndex: number,
    partial: Partial<SectionElement>
  ) => {
    setIsDirty(true);
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const currentElements: SectionElement[] =
          b.elements && b.elements.length > 0
            ? [...b.elements]
            : [{ id: `el-${b.id}-1`, type: 'paragraph', text: b.textValue || '' }];

        if (!currentElements[elIndex]) return b;
        currentElements[elIndex] = { ...currentElements[elIndex], ...partial };
        return {
          ...b,
          elements: currentElements,
          textValue: currentElements.find((e) => e.type === 'paragraph')?.text || b.textValue,
        };
      })
    );
  };

  const handleDeleteSectionElement = (blockId: string, elIndex: number) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.elements) return;

    const updated = block.elements.filter((_, idx) => idx !== elIndex);
    updateBlockById(blockId, { elements: updated });
  };

  const handleMoveSectionElement = (
    blockId: string,
    elIndex: number,
    direction: 'up' | 'down'
  ) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.elements) return;

    const updated = [...block.elements];
    const targetIdx = direction === 'up' ? elIndex - 1 : elIndex + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[elIndex];
    updated[elIndex] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateBlockById(blockId, { elements: updated });
  };

  const handlePromptChangeSectionImage = (blockId: string, elIndex: number, currentUrl?: string) => {
    setEditingSectionImage({ blockId, elIndex });
    setEditingImageId(blockId);
    setImageUploadMode('computer');
    setTempImageUrl(currentUrl || '');
  };

  // Native Image File Picker Handler
  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await StorageService.uploadImage(file, 'images');

      if (editingSectionImage) {
        handleUpdateSectionElement(
          editingSectionImage.blockId,
          editingSectionImage.elIndex,
          { imageUrl: uploadedUrl }
        );
        setEditingSectionImage(null);
        setEditingImageId(null);
        return;
      }

      if (editingImageId) {
        updateBlockById(editingImageId, { mediaUrl: uploadedUrl });
        setEditingImageId(null);
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);

      if (editingSectionImage) {
        handleUpdateSectionElement(
          editingSectionImage.blockId,
          editingSectionImage.elIndex,
          { imageUrl: objectUrl }
        );
        setEditingSectionImage(null);
        setEditingImageId(null);
        return;
      }

      if (editingImageId) {
        updateBlockById(editingImageId, { mediaUrl: objectUrl });
        setEditingImageId(null);
      }
    }
  };

  // Native Attachment File Picker Handler
  const handleAttachmentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const targetBlockId = targetAttachmentBlockIdRef.current || selectedBlockId;
    const targetItemId = targetAttachmentItemIdRef.current || changingAttachmentFileId;

    if (file && targetBlockId) {
      const objectUrl = URL.createObjectURL(file);
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      const block = blocks.find((b) => b.id === targetBlockId);
      if (block) {
        const currentAttachments = block.attachments || [];

        if (targetItemId) {
          const updated = currentAttachments.map((item) =>
            item.id === targetItemId
              ? {
                  ...item,
                  fileName: file.name,
                  fileSize: formattedSize,
                  fileUrl: objectUrl,
                }
              : item
          );
          updateBlockById(targetBlockId, { attachments: updated });
        } else {
          const newFileItem: AttachedFileItem = {
            id: `att-${Date.now()}`,
            fileName: file.name,
            fileSize: formattedSize,
            fileUrl: objectUrl,
          };
          updateBlockById(targetBlockId, {
            attachments: [...currentAttachments, newFileItem],
          });
        }
        setIsDirty(true);
      }
    }
    setChangingAttachmentFileId(null);
    targetAttachmentBlockIdRef.current = null;
    targetAttachmentItemIdRef.current = null;
    e.target.value = '';
  };

  // Trigger Add / Change Attachment
  const triggerAddAttachmentFileFromComputer = (blockId: string, fileItemId?: string) => {
    targetAttachmentBlockIdRef.current = blockId;
    targetAttachmentItemIdRef.current = fileItemId || null;
    setSelectedBlockId(blockId);
    setChangingAttachmentFileId(fileItemId || null);
    if (attachmentFileInputRef.current) {
      attachmentFileInputRef.current.value = '';
      attachmentFileInputRef.current.click();
    }
  };

  // Delete individual attached file from list
  const handleDeleteAttachmentFile = (blockId: string, fileItemId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.attachments) return;
    const updated = block.attachments.filter((item) => item.id !== fileItemId);
    updateBlockById(blockId, { attachments: updated });
    setIsDirty(true);
  };

  // Image Upload Modal trigger
  const handlePromptChangeImage = (id: string, currentUrl?: string) => {
    setEditingSectionImage(null);
    setEditingImageId(id);
    setImageUploadMode('computer');
    setTempImageUrl(currentUrl || '');
  };

  const handleSaveImageModal = () => {
    if (editingSectionImage) {
      handleUpdateSectionElement(
        editingSectionImage.blockId,
        editingSectionImage.elIndex,
        { imageUrl: tempImageUrl }
      );
      setEditingSectionImage(null);
      setEditingImageId(null);
      return;
    }

    if (editingImageId) {
      updateBlockById(editingImageId, { mediaUrl: tempImageUrl });
    }
    setEditingImageId(null);
  };

  // Video URL Modal trigger
  const handlePromptChangeVideo = (id: string, currentUrl?: string) => {
    setEditingVideoId(id);
    setTempVideoUrl(currentUrl || '');
  };

  const handleSaveVideoModal = () => {
    if (editingVideoId) {
      const embedUrl = getYouTubeEmbedUrl(tempVideoUrl);
      updateBlockById(editingVideoId, { mediaUrl: embedUrl });
    }
    setEditingVideoId(null);
  };

  // Tag Add / Remove handlers (Dribbble Style - Limited to Max 4 Topics)
  const handleAddTopicTag = () => {
    const trimmed = tagInputText.trim();
    if (trimmed && !moduleTopics.includes(trimmed)) {
      if (moduleTopics.length >= 4) return;
      setIsDirty(true);
      setModuleTopics([...moduleTopics, trimmed]);
      setTagInputText('');
    }
  };

  const handleRemoveTopicTag = (tagToRemove: string) => {
    setIsDirty(true);
    setModuleTopics(moduleTopics.filter((t) => t !== tagToRemove));
  };

  // Check if canvas has valid non-empty text content
  const hasValidTextContent = blocks.some(
    (b) => b.type === 'text' && b.textValue && b.textValue.trim().length > 0
  );

  const [isPublishing, setIsPublishing] = useState(false);
  const [isLottieLoaded, setIsLottieLoaded] = useState(false);

  useEffect(() => {
    // Load dotlottie-player script for Lottie animation
    if (typeof window !== 'undefined' && !document.querySelector('script[src*="dotlottie"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
      script.type = 'module';
      script.onload = () => setIsLottieLoaded(true);
      document.head.appendChild(script);
    } else {
      setIsLottieLoaded(true);
    }
  }, []);

  // Open Publish Modal trigger
  const handleOpenPublishModal = () => {
    if (!moduleTitle.trim()) {
      alert('Judul materi tidak boleh kosong.');
      return;
    }
    setShowPublishModal(true);
  };

  // Confirm Publish / Save Draft handler
  const handleSaveModuleConfirm = (isPublish: boolean) => {
    if (!moduleTitle.trim()) {
      alert('Judul materi tidak boleh kosong.');
      return;
    }

    if (isPublish) {
      setIsPublishing(true);

      // Preload lottie asset while button displays loading spinner
      const preloadAsset = async () => {
        try {
          await fetch('https://lottie.host/embed/878825de-212a-443e-89a9-c5573cfe890b/3v8OMNEl30.lottie', { mode: 'cors' });
        } catch (err) {
          console.warn('Lottie preload fallback', err);
        }
      };

      Promise.all([
        preloadAsset(),
        new Promise((resolve) => setTimeout(resolve, 1400)),
      ]).then(() => {
        const firstTextBlock = blocks.find(
          (b) => b.type === 'text' && b.textValue && b.textValue.trim().length > 0
        );
        const textVal = firstTextBlock?.textValue?.trim() || '';
        const autoDescription = textVal
          ? textVal.slice(0, 140) + (textVal.length > 140 ? '...' : '')
          : 'Materi pembelajaran interaktif Sitemsa.';

        const finalTopics = moduleTopics && moduleTopics.length > 0 ? moduleTopics : ['Materi Pembelajaran', 'Praktikum'];

        onSave(
          {
            title: moduleTitle,
            subject: subjectName,
            level: moduleLevel,
            duration: moduleDuration,
            topics: finalTopics,
            description: autoDescription,
            isPublished: true,
            thumbnail: moduleThumbnail,
            quizSource: evaluationType
              ? {
                  type: evaluationType,
                  title: evalTitle || 'Kuis Evaluasi Materi',
                  externalUrl: evalUrl,
                  qrImageUrl: evalQrUrl,
                }
              : undefined,
          },
          blocks
        );

        setIsPublishing(false);
        setShowPublishModal(false);
        setShowSuccessModal(true);
      });
    } else {
      const firstTextBlock = blocks.find(
        (b) => b.type === 'text' && b.textValue && b.textValue.trim().length > 0
      );
      const textVal = firstTextBlock?.textValue?.trim() || '';
      const autoDescription = textVal
        ? textVal.slice(0, 140) + (textVal.length > 140 ? '...' : '')
        : 'Materi pembelajaran interaktif Sitemsa.';

      const finalTopics = moduleTopics && moduleTopics.length > 0 ? moduleTopics : ['Materi Pembelajaran', 'Praktikum'];

      onSave(
        {
          title: moduleTitle,
          subject: subjectName,
          level: moduleLevel,
          duration: moduleDuration,
          topics: finalTopics,
          description: autoDescription,
          isPublished: false,
          thumbnail: moduleThumbnail,
          quizSource: evaluationType
            ? {
                type: evaluationType,
                title: evalTitle || 'Kuis Evaluasi Materi',
                externalUrl: evalUrl,
                qrImageUrl: evalQrUrl,
              }
            : undefined,
        },
        blocks
      );
      setShowPublishModal(false);
      onClose();
    }
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div
      onClick={() => setSelectedBlockId(null)}
      className="fixed inset-0 z-50 bg-white flex flex-col font-sans text-[#2E2D2D] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={attachmentFileInputRef}
        onChange={handleAttachmentFileSelect}
        accept="*/*"
        className="hidden"
      />
      <input
        type="file"
        ref={evalQrInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setEvalQrUrl(URL.createObjectURL(file));
          }
          e.target.value = '';
        }}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={thumbnailFileInputRef}
        onChange={handleThumbnailSelect}
        accept="image/*"
        className="hidden"
      />
      
      {/* 1. FIXED TOP HEADER BAR */}
      <header className="h-16 bg-white border-b border-[#ECECEC] px-6 flex items-center justify-between shrink-0 z-30 shadow-2xs">
        
        {/* Left Section: Cancel Button + Title Input */}
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isDirty) {
                setShowExitConfirmModal(true);
              } else {
                onClose();
              }
            }}
            title="Cancel / Batal"
            className="w-9 h-9 rounded-full bg-white border border-[#ECECEC] text-[#737373] hover:text-[#2E2D2D] hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors shrink-0 shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 min-w-0 max-w-[200px] sm:max-w-[260px] md:max-w-[340px] lg:max-w-[420px] shrink"
          >
            <div className="w-full font-bold text-base sm:text-lg text-[#2E2D2D] border-b-2 border-dotted border-slate-300 focus-within:border-[#2563EB] hover:border-slate-400 transition-colors pb-0.5 truncate">
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) => {
                  setModuleTitle(e.target.value);
                  setIsDirty(true);
                }}
                title={moduleTitle}
                placeholder="Give me a name"
                className="w-full font-bold text-base sm:text-lg text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent p-0 m-0 truncate"
              />
            </div>
            <Pencil className="w-3.5 h-3.5 text-[#737373] shrink-0" />
          </div>

          {/* HEADER TOOLBAR (only when editing published module) */}
          {initialModule && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2.5 ml-1 pl-3 border-l border-[#ECECEC]"
            >
              {/* Thumbnail Button */}
              <Tooltip content="Atur Thumbnail / Cover" side="bottom">
                <button
                  type="button"
                  onClick={() => setShowThumbnailModal(true)}
                  className={`h-8 px-2.5 rounded-[6px] flex items-center gap-1.5 cursor-pointer transition-all ${
                    moduleThumbnail
                      ? 'bg-[#E8E7FF] text-[#2563EB] border border-[#2563EB]/25 font-bold shadow-2xs'
                      : 'border border-[#ECECEC] bg-white text-[#737373] hover:text-[#2563EB] hover:bg-slate-50 hover:border-blue-300 font-semibold group/thumb'
                  }`}
                >
                  {moduleThumbnail ? (
                    <div className="w-5 h-3.5 rounded-[3px] overflow-hidden border border-[#2563EB]/30 shrink-0">
                      <img src={moduleThumbnail} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-[#737373] group-hover/thumb:text-[#2563EB]" />
                  )}
                  <span className={`text-[11px] hidden sm:inline ${moduleThumbnail ? 'font-bold text-[#2563EB]' : 'font-semibold text-[#737373] group-hover/thumb:text-[#2563EB]'}`}>
                    Cover
                  </span>
                </button>
              </Tooltip>

              {/* Level Dropdown Chip */}
              <div ref={headerLevelDropdownRef} className="relative">
                <Tooltip content="Tingkat Kesulitan" side="bottom">
                  <button
                    type="button"
                    onClick={() => setIsHeaderLevelDropdownOpen(!isHeaderLevelDropdownOpen)}
                    className="h-8 px-2.5 rounded-[6px] border border-[#ECECEC] bg-white hover:bg-slate-50 hover:border-blue-300 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span className="text-[11px] font-bold text-[#2E2D2D]">{moduleLevel}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#737373] transition-transform duration-200 ${isHeaderLevelDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </Tooltip>

                {isHeaderLevelDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-36 bg-white border border-[#ECECEC] rounded-[10px] shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 font-sans">
                    {(['Pemula', 'Menengah', 'Mahir'] as const).map((lvl) => {
                      const isSelected = moduleLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => {
                            setModuleLevel(lvl);
                            setIsHeaderLevelDropdownOpen(false);
                            setIsDirty(true);
                          }}
                          className={`w-full px-3 py-2 rounded-[6px] text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                            isSelected
                              ? 'text-[#2563EB] font-bold'
                              : 'text-[#2E2D2D] hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span>{lvl}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Topics Button */}
              <Tooltip content="Atur Topik Bahasan" side="bottom">
                <button
                  type="button"
                  onClick={() => setShowTopicsModal(true)}
                  className={`h-8 px-2.5 rounded-[6px] flex items-center gap-1.5 cursor-pointer transition-all ${
                    moduleTopics.length > 0
                      ? 'bg-[#E8E7FF] text-[#2563EB] border border-[#2563EB]/25 font-bold shadow-2xs'
                      : 'border border-[#ECECEC] bg-white text-[#737373] hover:text-[#2563EB] hover:bg-slate-50 hover:border-blue-300 font-semibold group/topics'
                  }`}
                >
                  <Hash className={`w-3.5 h-3.5 ${moduleTopics.length > 0 ? 'text-[#2563EB]' : 'text-[#737373] group-hover/topics:text-[#2563EB]'}`} />
                  <span className={`text-[11px] hidden sm:inline ${moduleTopics.length > 0 ? 'font-bold text-[#2563EB]' : 'font-semibold text-[#737373] group-hover/topics:text-[#2563EB]'}`}>
                    {moduleTopics.length > 0 ? `${moduleTopics.length} Topik` : 'Topik'}
                  </span>
                </button>
              </Tooltip>

              {/* Evaluasi Button (Consistent Filled / Empty State Without Checklist Symbol) */}
              <Tooltip content={evaluationType ? 'Pengaturan Evaluasi / Kuis' : 'Tambahkan Evaluasi / Kuis'} side="bottom">
                <button
                  type="button"
                  onClick={() => setShowEvaluasiModal(true)}
                  className={`h-8 px-2.5 rounded-[6px] flex items-center gap-1.5 cursor-pointer transition-all ${
                    evaluationType
                      ? 'bg-[#E8E7FF] text-[#2563EB] border border-[#2563EB]/25 font-bold shadow-2xs'
                      : 'border border-[#ECECEC] bg-white text-[#737373] hover:text-[#2563EB] hover:bg-slate-50 hover:border-blue-300 font-semibold group/eval'
                  }`}
                >
                  <FileText className={`w-3.5 h-3.5 ${evaluationType ? 'text-[#2563EB]' : 'text-[#737373] group-hover/eval:text-[#2563EB]'}`} />
                  <span className={`text-[11px] hidden sm:inline ${evaluationType ? 'font-bold text-[#2563EB]' : 'font-semibold text-[#737373] group-hover/eval:text-[#2563EB]'}`}>
                    {evaluationType ? 'Evaluasi' : 'Tambah Evaluasi'}
                  </span>
                </button>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Right Section: Action Buttons */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 shrink-0"
        >
          {!isAlreadyPublished && (
            <button
              disabled={!isDirty || !moduleTitle.trim() || isUploadingThumbnail}
              onClick={() => handleSaveModuleConfirm(false)}
              className={`px-4 py-2 rounded-[8px] text-xs font-semibold transition-colors ${
                isDirty && moduleTitle.trim() && !isUploadingThumbnail
                  ? 'bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] cursor-pointer'
                  : 'bg-slate-100 text-[#AAAAAA] cursor-not-allowed opacity-50'
              }`}
            >
              Save as draft
            </button>
          )}
          <button
            disabled={!moduleTitle.trim() || isUploadingThumbnail}
            onClick={handleOpenPublishModal}
            className={`px-5 py-2 rounded-[8px] text-xs font-semibold transition-colors flex items-center gap-2 ${
              moduleTitle.trim() && !isUploadingThumbnail
                ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-98'
                : 'bg-slate-100 text-[#AAAAAA] cursor-not-allowed opacity-50 shadow-none'
            }`}
          >
            {isUploadingThumbnail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>
              {isUploadingThumbnail
                ? 'Memuat Cover...'
                : initialModule
                ? 'Update Materi'
                : 'Continue'}
            </span>
          </button>
        </div>

      </header>

      {/* 2. MAIN BUILDER BODY */}
      <div className="flex-1 flex overflow-hidden relative bg-white">
        
        {/* CENTER CANVAS AREA */}
        <main
          onClick={() => {
            setSelectedBlockId(null);
            setInsertTargetIndex(undefined);
            setShowRightSidebar(false);
          }}
          className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 flex justify-center bg-[#FFFFFF] cursor-default"
        >
          <div className="w-full max-w-3xl space-y-2 pb-32">

            {/* EMPTY STATE CANVAS */}
            {blocks.length === 0 && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                  setInsertTargetIndex(undefined);
                  setShowRightSidebar(true);
                }}
                className="py-16 text-center space-y-4 border-2 border-dashed border-slate-200 hover:border-blue-300 rounded-[12px] p-12 bg-white mt-4 cursor-pointer transition-colors"
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBlockId(null);
                    setInsertTargetIndex(undefined);
                    setShowRightSidebar(true);
                  }}
                  className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2E2D2D]">Kanvas Materi Masih Kosong</h3>
                  <p className="text-xs text-[#737373] mt-1 max-w-sm mx-auto">
                    Mulai susun materi dengan memilih jenis elemen dari menu sebelah kanan (Text, Gambar, Video, Lampiran File).
                  </p>
                </div>
              </div>
            )}

            {/* DYNAMIC CANVAS BLOCKS LIST WITH SMOOTH ANIMATION */}
            <div className="space-y-4">
              {blocks.map((block, index) => {
                const isSelected = selectedBlockId === block.id;
                const isAnimatingThis = animatingBlockId === block.id;

                const isSwappingOther =
                  animatingBlockId !== null &&
                  !isAnimatingThis &&
                  ((animatingDir === 'up' && index === blocks.findIndex((b) => b.id === animatingBlockId) - 1) ||
                    (animatingDir === 'down' && index === blocks.findIndex((b) => b.id === animatingBlockId) + 1));

                return (
                  <div key={block.id} className="relative">
                    
                    <div
                      className={`transition-all duration-300 ease-out ${
                        isAnimatingThis && animatingDir === 'up'
                          ? '-translate-y-6 opacity-80'
                          : isAnimatingThis && animatingDir === 'down'
                          ? 'translate-y-6 opacity-80'
                          : isSwappingOther && animatingDir === 'up'
                          ? 'translate-y-6 opacity-80'
                          : isSwappingOther && animatingDir === 'down'
                          ? '-translate-y-6 opacity-80'
                          : 'translate-y-0 scale-100 opacity-100'
                      }`}
                    >
                      
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
                            className="p-1.5 hover:bg-slate-100 rounded-[4px] text-[#2E2D2D] hover:text-[#2563EB] disabled:opacity-30 cursor-pointer"
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
                            className="p-1.5 hover:bg-slate-100 rounded-[4px] text-[#2E2D2D] hover:text-[#2563EB] disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateBlock(block, index);
                            }}
                            title="Duplikat Blok"
                            className="p-1.5 hover:bg-slate-100 rounded-[4px] text-[#2E2D2D] hover:text-[#2563EB] cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const blockName = block.sectionTitle || (block.type === 'video' ? 'Video Pembelajaran' : block.type === 'steps' ? 'Langkah-langkah Praktik' : block.type === 'attachment' ? 'Lampiran File' : block.type === 'code' ? 'Blok Kode' : 'Bagian Teks');
                              setDeleteConfirmTarget({
                                type: 'block',
                                title: 'Konfirmasi Hapus Blok',
                                description: `Apakah Anda yakin ingin menghapus blok "${blockName}"? Tindakan ini akan menghapus seluruh isi di dalam blok ini.`,
                                onConfirm: () => handleDeleteBlock(block.id),
                              });
                            }}
                            title="Hapus Blok"
                            className="p-1.5 hover:bg-rose-50 rounded-[4px] text-[#2E2D2D] hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* BLOCK CONTAINER WITH OUTSIDE OUTLINE STROKE */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlockId(block.id);
                            setInsertTargetIndex(undefined);
                            if (block.type === 'attachment') {
                              setShowRightSidebar(true);
                            }
                          }}
                          className={`rounded-[12px] p-2 transition-all duration-200 cursor-text relative h-auto ${
                            isSelected
                              ? 'outline outline-2 outline-[#2563EB] outline-offset-2 bg-white shadow-2xs'
                              : 'outline outline-2 outline-transparent outline-offset-2 bg-transparent hover:outline-slate-300'
                          }`}
                        >
                        
                        {/* 1. TEXT SECTION BLOCK */}
                        {block.type === 'text' && (() => {
                          const elements =
                            block.elements && block.elements.length > 0
                              ? block.elements
                              : [{ id: `el-${block.id}-1`, type: 'paragraph' as const, text: block.textValue || '' }];

                          return (
                            <div className="space-y-4">
                              {/* Heading Section Title (Clean Title) */}
                              <input
                                type="text"
                                value={block.sectionTitle || ''}
                                onChange={(e) => updateBlockById(block.id, { sectionTitle: e.target.value })}
                                placeholder="Heading Judul Section..."
                                className="w-full text-2xl font-bold text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent"
                                style={{ textAlign: block.alignment || 'left' }}
                              />

                              {/* Multi-Element Content Stream (Paragraphs & Images with reorder) */}
                              <div className="space-y-3">
                                {elements.map((el, elIdx) => (
                                  <div key={el.id || elIdx} className="group/el relative space-y-2">
                                    {el.type === 'paragraph' ? (
                                      <div className="relative group/pContainer">
                                        <AutoResizeTextarea
                                          value={el.text || ''}
                                          onChange={(val) => handleUpdateSectionElement(block.id, elIdx, { text: val })}
                                          placeholder="Tuliskan isi paragraf materi di sini...."
                                          className="w-full text-sm font-medium text-[#4A4A4A] leading-relaxed placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent whitespace-pre-line pr-16 text-justify"
                                          style={{ textAlign: block.alignment || 'justify' }}
                                        />

                                        {/* Element Controls (Move Up/Down, Delete) */}
                                        <div className="absolute right-0 top-0 opacity-0 group-hover/pContainer:opacity-100 transition-opacity flex items-center gap-1 bg-white p-1 rounded-[6px] border border-[#ECECEC] shadow-2xs text-[#2E2D2D]">
                                          {elIdx > 0 && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleMoveSectionElement(block.id, elIdx, 'up');
                                              }}
                                              title="Pindah ke Atas"
                                              className="p-1 hover:bg-slate-100 rounded text-[#2E2D2D] hover:text-[#2563EB] cursor-pointer"
                                            >
                                              <ArrowUp className="w-3 h-3" />
                                            </button>
                                          )}
                                          {elIdx < elements.length - 1 && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleMoveSectionElement(block.id, elIdx, 'down');
                                              }}
                                              title="Pindah ke Bawah"
                                              className="p-1 hover:bg-slate-100 rounded text-[#2E2D2D] hover:text-[#2563EB] cursor-pointer"
                                            >
                                              <ArrowDown className="w-3 h-3" />
                                            </button>
                                          )}
                                          {elements.length > 1 && (
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirmTarget({
                                                  type: 'element',
                                                  title: 'Konfirmasi Hapus Paragraf',
                                                  description: 'Apakah Anda yakin ingin menghapus paragraf ini dari bagian materi?',
                                                  onConfirm: () => handleDeleteSectionElement(block.id, elIdx),
                                                });
                                              }}
                                              title="Hapus Paragraf"
                                              className="p-1 hover:bg-rose-50 rounded text-[#2E2D2D] hover:text-rose-600 cursor-pointer"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    ) : (
                                      /* Image Element */
                                      <div className="relative group/elImg my-2 flex justify-center w-full">
                                        {!el.imageUrl ? (
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handlePromptChangeSectionImage(block.id, elIdx, '');
                                            }}
                                            className="rounded-[12px] border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-slate-50/50 p-6 text-center transition-all cursor-pointer group/card w-full"
                                          >
                                            <div className="w-10 h-10 rounded-full bg-white border border-[#ECECEC] text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
                                              <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <p className="text-xs font-bold text-[#2E2D2D] mt-2 group-hover/card:text-[#2563EB]">
                                              Klik untuk Menambahkan Gambar
                                            </p>
                                          </div>
                                        ) : (
                                          <div className="relative overflow-hidden rounded-[12px] border border-[#ECECEC] bg-slate-50 w-full aspect-video">
                                            {/* eslint-disable-next-next/no-img-element */}
                                            <img
                                              src={el.imageUrl}
                                              alt="Section illustration"
                                              className="w-full h-full object-cover rounded-[12px]"
                                            />
                                            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/elImg:opacity-100 transition-opacity bg-white/95 p-1 rounded-[6px] shadow-xs text-[#2E2D2D]">
                                              {elIdx > 0 && (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveSectionElement(block.id, elIdx, 'up');
                                                  }}
                                                  title="Pindah ke Atas"
                                                  className="p-1 hover:bg-slate-100 rounded text-[#2E2D2D] hover:text-[#2563EB] cursor-pointer"
                                                >
                                                  <ArrowUp className="w-3 h-3" />
                                                </button>
                                              )}
                                              {elIdx < elements.length - 1 && (
                                                <button
                                                  type="button"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMoveSectionElement(block.id, elIdx, 'down');
                                                  }}
                                                  title="Pindah ke Bawah"
                                                  className="p-1 hover:bg-slate-100 rounded text-[#2E2D2D] hover:text-[#2563EB] cursor-pointer"
                                                >
                                                  <ArrowDown className="w-3 h-3" />
                                                </button>
                                              )}
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handlePromptChangeSectionImage(block.id, elIdx, el.imageUrl);
                                                }}
                                                className="px-2 py-0.5 rounded text-[#2E2D2D] hover:text-[#2563EB] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                              >
                                                <Pencil className="w-3 h-3" />
                                                <span>Ganti</span>
                                              </button>
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeleteConfirmTarget({
                                                    type: 'element',
                                                    title: 'Konfirmasi Hapus Gambar',
                                                    description: 'Apakah Anda yakin ingin menghapus gambar ini dari bagian materi?',
                                                    onConfirm: () => handleDeleteSectionElement(block.id, elIdx),
                                                  });
                                                }}
                                                className="p-1 rounded text-[#2E2D2D] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                                title="Hapus Gambar"
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Helper buttons beneath each element (Only visible when block is active/selected) */}
                                    {isSelected && (
                                      <div className="opacity-0 group-hover/el:opacity-100 focus-within:opacity-100 transition-opacity flex items-center gap-1.5 pt-0.5 pb-1">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddSectionElement(block.id, 'paragraph', elIdx);
                                          }}
                                          className="text-[11px] font-semibold text-[#2563EB] hover:bg-blue-50 px-2 py-0.5 rounded-[4px] cursor-pointer transition-colors"
                                        >
                                          + Teks
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddSectionElement(block.id, 'image', elIdx);
                                          }}
                                          className="text-[11px] font-semibold text-[#2563EB] hover:bg-blue-50 px-2 py-0.5 rounded-[4px] cursor-pointer transition-colors"
                                        >
                                          + Gambar
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>

                              {/* Integrated Highlight / Callout Box (Only once at the end of section) */}
                              {block.calloutText !== undefined && (
                                <div className="py-2.5 px-3.5 rounded-[10px] bg-[#F6F5FF] border border-[#E8E7FF] text-[#2563EB] text-xs flex items-start gap-2.5 relative group/callout shadow-2xs w-full h-fit mt-3">
                                  <div className="w-1 self-stretch bg-[#2563EB] rounded-full shrink-0 my-0.5" />
                                  <div className="flex-1 min-w-0">
                                    <AutoResizeTextarea
                                      value={block.calloutText}
                                      onChange={(val) => updateBlockById(block.id, { calloutText: val })}
                                      placeholder="Tuliskan teks kalimat sorotan / highlight di sini..."
                                      className="w-full text-xs font-medium text-[#3A3985] bg-transparent border-none focus:ring-0 outline-none p-0 leading-relaxed resize-none text-justify"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmTarget({
                                        type: 'highlight',
                                        title: 'Konfirmasi Hapus Highlight',
                                        description: 'Apakah Anda yakin ingin menghapus kotak sorotan (highlight) teks ini?',
                                        onConfirm: () => updateBlockById(block.id, { calloutText: undefined }),
                                      });
                                    }}
                                    title="Hapus Highlight"
                                    className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover/callout:opacity-100 transition-opacity cursor-pointer shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Section Bottom Action Buttons with smooth height & opacity transition (No divider line) */}
                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                  isSelected
                                    ? 'max-h-20 opacity-100 pt-1.5'
                                    : 'max-h-0 opacity-0 pt-0 pointer-events-none'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddSectionElement(block.id, 'paragraph');
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-[#4A4A4A] text-xs font-semibold transition-colors cursor-pointer"
                                  >
                                    <Type className="w-3.5 h-3.5" />
                                    <span>Tambah Teks</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddSectionElement(block.id, 'image');
                                    }}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-[#4A4A4A] text-xs font-semibold transition-colors cursor-pointer"
                                  >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Tambah Gambar</span>
                                  </button>
                                  {block.calloutText === undefined && (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateBlockById(block.id, { calloutText: '' });
                                      }}
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-blue-50/70 hover:bg-blue-50 text-[#2563EB] border border-blue-200/60 text-xs font-semibold transition-colors cursor-pointer"
                                    >
                                      <Highlighter className="w-3.5 h-3.5" />
                                      <span>Highlight Text</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* 2. IMAGE BLOCK */}
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
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs font-bold text-[#2E2D2D] group-hover/imgCard:text-[#2563EB] transition-colors">
                                    Klik untuk Menambahkan Gambar
                                  </p>
                                  <p className="text-[11px] text-[#737373]">
                                    Upload file dari komputer atau tempelkan URL gambar web
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 group/mediaContainer relative">
                                <div className="relative overflow-hidden rounded-[12px] border border-[#ECECEC] w-full aspect-video bg-slate-50">
                                  {/* eslint-disable-next-next/no-img-element */}
                                  <img
                                    src={block.mediaUrl}
                                    alt="Uploaded content"
                                    className="w-full h-full object-cover rounded-[12px]"
                                  />

                                  {/* OVERLAY CHANGE BUTTON ON HOVER */}
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/mediaContainer:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePromptChangeImage(block.id, block.mediaUrl);
                                      }}
                                      className="px-4 py-2 rounded-[8px] bg-white text-[#2E2D2D] text-xs font-bold shadow-md hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 transition-colors"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                      <span>Ganti Gambar</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 3. VIDEO BLOCK */}
                        {block.type === 'video' && (
                          <div>
                            {!block.mediaUrl ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePromptChangeVideo(block.id, '');
                                }}
                                className="rounded-[12px] border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-slate-50/50 p-12 text-center transition-all cursor-pointer group/vidCard"
                              >
                                <div className="w-12 h-12 rounded-full bg-white border border-[#ECECEC] text-[#2563EB] flex items-center justify-center mx-auto shadow-xs">
                                  <VideoIcon className="w-6 h-6" />
                                </div>
                                <div className="mt-3 space-y-1">
                                  <p className="text-xs font-bold text-[#2E2D2D] group-hover/vidCard:text-[#2563EB] transition-colors">
                                    Klik untuk Menambahkan Video YouTube
                                  </p>
                                  <p className="text-[11px] text-[#737373]">
                                    Tempelkan tautan video YouTube / Shorts
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2 group/videoContainer relative">
                                <div className="aspect-video w-full rounded-[12px] overflow-hidden border border-[#ECECEC] relative bg-black">
                                  <iframe
                                    src={getYouTubeEmbedUrl(block.mediaUrl)}
                                    title="YouTube Video Embed"
                                    className="w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                <div className="flex items-center justify-between text-xs text-[#737373]">
                                  <span className="truncate max-w-md">{block.mediaUrl}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handlePromptChangeVideo(block.id, block.mediaUrl);
                                    }}
                                    className="text-[#2563EB] hover:underline font-semibold cursor-pointer shrink-0 ml-2"
                                  >
                                    Ganti URL Video
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 4. ATTACHMENT BLOCK */}
                        {block.type === 'attachment' && (
                          <div className="p-4 rounded-[12px] bg-slate-50/80 border border-[#ECECEC] space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-[#737373] flex items-center gap-1.5">
                                <Paperclip className="w-4 h-4 text-[#2563EB]" /> Lampiran File Pembelajaran
                              </h4>
                            </div>

                            {(!block.attachments || block.attachments.length === 0) ? (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerAddAttachmentFileFromComputer(block.id);
                                }}
                                className="border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-white rounded-[10px] p-6 text-center cursor-pointer transition-all space-y-1.5 group/attCard"
                              >
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                                  <Upload className="w-5 h-5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-[#2E2D2D] group-hover/attCard:text-[#2563EB] transition-colors">
                                    Klik untuk Tambahkan File dari Komputer
                                  </p>
                                  <p className="text-[11px] text-[#737373]">Mendukung file PDF, ZIP, DOCX, PPTX, dll.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {block.attachments.map((fileItem) => {
                                  const fileName = fileItem.fileName || (fileItem as any).name || 'Dokumen Terlampir';
                                  const fileSize = fileItem.fileSize || (fileItem as any).size || 'File';
                                  return (
                                    <div
                                      key={fileItem.id}
                                      className="p-3 rounded-[10px] bg-white border border-[#ECECEC] flex items-center justify-between hover:border-[#2563EB] transition-colors shadow-2xs"
                                    >
                                      <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                                        <div className="w-9 h-9 rounded-[8px] bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                                          <File className="w-4 h-4" />
                                        </div>
                                        <div className="truncate min-w-0">
                                          <p className="text-xs font-bold text-[#2E2D2D] truncate">{fileName}</p>
                                          <p className="text-[11px] text-[#737373] mt-0.5">{fileSize}</p>
                                        </div>
                                      </div>

                                      <span className="text-xs font-bold text-[#2563EB] px-3 py-1 rounded-[6px] bg-blue-50 border border-blue-100 flex items-center gap-1 shrink-0">
                                        <Download className="w-3.5 h-3.5" /> Download
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 5. STEP BY STEP BLOCK */}
                        {block.type === 'steps' && (
                          <div className="space-y-4">
                            {/* Section Header: Title & Subtitle (Tanpa garis pembatas) */}
                            <div className="space-y-1.5">
                              {/* Judul Section Input */}
                              <div>
                                <AutoResizeTextarea
                                  value={block.stepSectionTitle ?? 'Panduan Langkah Praktik'}
                                  onChange={(val) => updateBlockById(block.id, { stepSectionTitle: val })}
                                  placeholder="Tuliskan Judul Section (misal: Panduan Langkah Praktik Eksplorasi Gerak)..."
                                  className="w-full text-base md:text-lg font-bold text-[#2E2D2D] leading-snug border-none focus:ring-0 outline-none bg-transparent placeholder:text-[#AAAAAA] p-0"
                                />
                              </div>

                              {/* Subtitle / Deskripsi Pengantar Input */}
                              <div>
                                <AutoResizeTextarea
                                  value={block.stepSectionSubtitle ?? ''}
                                  onChange={(val) => updateBlockById(block.id, { stepSectionSubtitle: val })}
                                  placeholder="Tuliskan subtitle atau deskripsi pengantar (misal: Berdasarkan contoh tema 'Kehidupan di Lingkungan Sekolah')..."
                                  className="w-full text-xs md:text-sm font-medium text-[#737373] leading-relaxed border-none focus:ring-0 outline-none bg-transparent placeholder:text-[#AAAAAA] p-0"
                                />
                              </div>
                            </div>

                            {/* Step Cards List */}
                            <div className="space-y-3">
                              {(block.steps || []).map((step, sIdx) => (
                                <div key={sIdx} className="p-4 rounded-[10px] bg-slate-50/80 border border-[#ECECEC] space-y-2 relative group/step hover:border-blue-200 transition-colors">
                                  <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-2xs">
                                      {String(sIdx + 1).padStart(2, '0')}
                                    </span>
                                    <input
                                      type="text"
                                      value={step.title}
                                      onChange={(e) => handleUpdateStepItem(block.id, sIdx, 'title', e.target.value)}
                                      placeholder={`Judul Langkah ${sIdx + 1} (misal: Eksplorasi Berdasarkan Unsur Waktu)`}
                                      className="flex-1 font-bold text-xs md:text-sm text-[#2E2D2D] border-b border-dashed border-slate-300 focus:border-[#2563EB] outline-none bg-transparent pb-0.5"
                                    />
                                    {(block.steps || []).length > 1 && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteConfirmTarget({
                                            type: 'step',
                                            title: 'Konfirmasi Hapus Langkah Praktik',
                                            description: `Apakah Anda yakin ingin menghapus "${step.title || 'Langkah ini'}" dari daftar langkah praktik?`,
                                            onConfirm: () => handleDeleteStepItem(block.id, sIdx),
                                          });
                                        }}
                                        title="Hapus Langkah Ini"
                                        className="text-slate-400 hover:text-rose-600 p-1 rounded-[4px] cursor-pointer transition-colors"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>

                                  <AutoResizeTextarea
                                    value={step.desc}
                                    onChange={(val) => handleUpdateStepItem(block.id, sIdx, 'desc', val)}
                                    placeholder="Tuliskan penjelasan detail dan instruksi untuk langkah ini..."
                                    className="w-full text-xs font-medium text-[#737373] leading-relaxed border-none focus:ring-0 outline-none bg-transparent pl-10"
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
                              <span className="inline-block leading-none">Tambah Langkah {(block.steps || []).length + 1}</span>
                            </button>
                          </div>
                        )}

                        {/* 6. CODE SNIPPET BLOCK (Informatika) */}
                        {block.type === 'code' && (
                          <div className="space-y-3 font-sans">
                            <div className="bg-[#1E1E2E] rounded-[12px] p-4 text-white overflow-hidden shadow-xs space-y-3 border border-[#313244]">
                              {/* Code Block Header Bar */}
                              <div className="flex items-center justify-between text-xs text-[#A6ADC8] border-b border-[#313244] pb-2.5">
                                <div className="flex items-center gap-2 relative">
                                  <Code className="w-4 h-4 text-[#89B4FA]" />
                                  <div className="relative">
                                    <select
                                      value={block.codeSnippet?.language || 'JavaScript / TypeScript'}
                                      onChange={(e) => {
                                        setIsDirty(true);
                                        updateBlockById(block.id, {
                                          codeSnippet: {
                                            language: e.target.value,
                                            code: block.codeSnippet?.code || '',
                                          },
                                        });
                                      }}
                                      className="bg-[#313244] hover:bg-[#45475A] text-[#CDD6F4] text-xs font-mono font-semibold px-3 py-1.5 rounded-[8px] outline-none border border-[#45475A] cursor-pointer transition-colors appearance-none pr-7"
                                    >
                                      <option value="JavaScript / TypeScript" className="bg-[#1E1E2E] text-[#CDD6F4]">JavaScript / TypeScript</option>
                                      <option value="Python" className="bg-[#1E1E2E] text-[#CDD6F4]">Python</option>
                                      <option value="C++" className="bg-[#1E1E2E] text-[#CDD6F4]">C++</option>
                                      <option value="Java" className="bg-[#1E1E2E] text-[#CDD6F4]">Java</option>
                                      <option value="PHP" className="bg-[#1E1E2E] text-[#CDD6F4]">PHP</option>
                                      <option value="HTML / CSS" className="bg-[#1E1E2E] text-[#CDD6F4]">HTML / CSS</option>
                                      <option value="SQL" className="bg-[#1E1E2E] text-[#CDD6F4]">SQL</option>
                                      <option value="C#" className="bg-[#1E1E2E] text-[#CDD6F4]">C#</option>
                                      <option value="Go" className="bg-[#1E1E2E] text-[#CDD6F4]">Go</option>
                                    </select>
                                    <ChevronDown className="w-3.5 h-3.5 text-[#A6ADC8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (block.codeSnippet?.code) {
                                      navigator.clipboard.writeText(block.codeSnippet.code);
                                      setCopiedBlockId(block.id);
                                      setTimeout(() => setCopiedBlockId(null), 1500);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 bg-[#313244] hover:bg-[#45475A] text-white px-2.5 py-1 rounded-[6px] transition-colors text-[11px] font-medium cursor-pointer"
                                >
                                  {copiedBlockId === block.id ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-emerald-400 font-semibold">Tersalin!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Salin Kode</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Monospace Code Textarea Input */}
                              <textarea
                                value={block.codeSnippet?.code ?? ''}
                                onChange={(e) => {
                                  setIsDirty(true);
                                  updateBlockById(block.id, {
                                    codeSnippet: {
                                      language: block.codeSnippet?.language || 'JavaScript / TypeScript',
                                      code: e.target.value,
                                    },
                                  });
                                }}
                                placeholder="// Ketik atau tempelkan kode program di sini..."
                                rows={Math.max(4, (block.codeSnippet?.code?.split('\n').length || 1) + 1)}
                                className="w-full bg-transparent font-mono text-xs text-[#CDD6F4] leading-relaxed outline-none border-none resize-y p-0 placeholder:text-[#585B70]"
                                spellCheck={false}
                              />
                            </div>
                          </div>
                        )}

                      </div>
                      </div>

                      {/* BETWEEN-BLOCKS "INSERT BLOCK" DIVIDER LINE */}
                      {(() => {
                        const isInsertActive = insertTargetIndex === index && showRightSidebar;
                        return (
                          <div
                            className={`relative flex items-center justify-center z-20 transition-all duration-200 group/insertArea ${
                              isInsertActive
                                ? 'opacity-100 py-3.5 my-1'
                                : 'opacity-0 hover:opacity-100 py-1 my-0.5 hover:py-3.5 hover:my-1'
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
                              <span className="leading-none flex items-center">Insert block</span>
                            </button>
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </main>

        {/* RIGHT SIDEBAR BUILDER TOOLBAR (SMOOTH IN-OUT SLIDE ANIMATION) */}
        <aside
          onClick={(e) => e.stopPropagation()}
          className={`w-80 bg-white border-l border-[#ECECEC] flex flex-col shrink-0 z-20 shadow-xs transition-all duration-300 ease-in-out ${
            showRightSidebar
              ? 'translate-x-0 opacity-100 mr-0'
              : 'translate-x-full opacity-0 pointer-events-none -mr-80'
          }`}
        >
          <div className="p-4 pb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#2E2D2D]">
              {selectedBlock?.type === 'attachment'
                ? 'Kelola Lampiran File'
                : selectedBlock?.type === 'code'
                ? 'Pengaturan Blok Kode'
                : 'Insert block'}
            </h3>
            <button
              onClick={() => {
                setShowRightSidebar(false);
                setInsertTargetIndex(undefined);
              }}
              className="text-[#737373] hover:text-[#2E2D2D] p-1 rounded-[4px] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

              {/* IF SELECTED BLOCK IS ATTACHMENT */}
              {selectedBlock?.type === 'attachment' ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-[8px] bg-blue-50/60 border border-blue-100 space-y-1">
                    <p className="text-xs font-bold text-[#2563EB]">Lampiran Pembelajaran Multi-File</p>
                    <p className="text-[11px] text-[#737373] leading-relaxed">
                      Tambahkan berkas pendukung (PDF, DOCX, ZIP) untuk dapat diunduh siswa.
                    </p>
                  </div>

                  {/* FILE LIST IN SIDEBAR */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#737373]">Daftar Berkas Terlampir ({selectedBlock.attachments?.length || 0}):</label>
                    {(!selectedBlock.attachments || selectedBlock.attachments.length === 0) ? (
                      <p className="text-xs text-slate-400 italic py-2">Belum ada file terlampir.</p>
                    ) : (
                      selectedBlock.attachments.map((fileItem) => {
                        const fileName = fileItem.fileName || (fileItem as any).name || 'Dokumen Terlampir';
                        const fileSize = fileItem.fileSize || (fileItem as any).size || 'File';
                        return (
                          <div
                            key={fileItem.id}
                            className="p-2.5 rounded-[8px] bg-white border border-[#ECECEC] flex items-center justify-between text-xs space-x-2"
                          >
                            <div className="flex items-center gap-2 truncate min-w-0">
                              <File className="w-4 h-4 text-[#2563EB] shrink-0" />
                              <div className="truncate min-w-0">
                                <p className="font-semibold text-[#2E2D2D] truncate text-xs">{fileName}</p>
                                <p className="text-[11px] text-[#737373] mt-0.5">{fileSize}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => triggerAddAttachmentFileFromComputer(selectedBlock.id, fileItem.id)}
                                title="Ganti File dari Komputer"
                                className="p-1.5 rounded-[6px] hover:bg-white text-slate-500 hover:text-[#2563EB] border border-transparent hover:border-[#ECECEC] cursor-pointer transition-colors"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  setDeleteConfirmTarget({
                                    type: 'attachment',
                                    title: 'Konfirmasi Hapus File Lampiran',
                                    description: `Apakah Anda yakin ingin menghapus berkas lampiran "${fileItem.fileName}"?`,
                                    onConfirm: () => handleDeleteAttachmentFile(selectedBlock.id, fileItem.id),
                                  });
                                }}
                                title="Hapus File"
                                className="p-1.5 rounded-[6px] hover:bg-white text-slate-400 hover:text-rose-600 border border-transparent hover:border-[#ECECEC] cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={() => triggerAddAttachmentFileFromComputer(selectedBlock.id)}
                    className="w-full py-2.5 rounded-[8px] border border-dashed border-blue-300 hover:border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 shrink-0 text-[#2563EB]" strokeWidth={2.5} />
                    <span className="inline-block leading-none">Tambah File Baru</span>
                  </button>

                </div>
              ) : selectedBlock?.type === 'code' ? (
                /* IF SELECTED BLOCK IS CODE */
                <div className="space-y-4 font-sans">
                  <div className="p-3 rounded-[8px] bg-slate-900 text-white space-y-1">
                    <p className="text-xs font-bold text-[#89B4FA] flex items-center gap-1.5">
                      <Code className="w-4 h-4" /> Blok Kode Pemrograman
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Tambahkan sintaksis atau potongan kode program yang rapi dan dapat disalin langsung oleh siswa.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#737373]">Bahasa Pemrograman:</label>
                    <select
                      value={selectedBlock.codeSnippet?.language || 'JavaScript / TypeScript'}
                      onChange={(e) => {
                        setIsDirty(true);
                        updateBlockById(selectedBlock.id, {
                          codeSnippet: {
                            language: e.target.value,
                            code: selectedBlock.codeSnippet?.code || '',
                          },
                        });
                      }}
                      className="w-full h-9 px-3 rounded-[8px] border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none focus:border-[#2563EB] bg-white cursor-pointer"
                    >
                      <option value="JavaScript / TypeScript">JavaScript / TypeScript</option>
                      <option value="Python">Python</option>
                      <option value="C++">C++</option>
                      <option value="Java">Java</option>
                      <option value="PHP">PHP</option>
                      <option value="HTML / CSS">HTML / CSS</option>
                      <option value="SQL">SQL</option>
                      <option value="C#">C#</option>
                      <option value="Go">Go</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#737373]">Isi Kode Program:</label>
                    <textarea
                      value={selectedBlock.codeSnippet?.code || ''}
                      onChange={(e) => {
                        setIsDirty(true);
                        updateBlockById(selectedBlock.id, {
                          codeSnippet: {
                            language: selectedBlock.codeSnippet?.language || 'JavaScript / TypeScript',
                            code: e.target.value,
                          },
                        });
                      }}
                      placeholder="// Ketik kode di sini..."
                      rows={12}
                      className="w-full p-3 rounded-[8px] border border-[#313244] bg-[#1E1E2E] text-[#CDD6F4] font-mono text-xs outline-none focus:border-[#2563EB] leading-relaxed resize-y"
                      spellCheck={false}
                    />
                  </div>
                </div>
              ) : (
                /* DEFAULT INSERT BLOCK MENU (ORIGINAL UNTOUCHED STYLE) */
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
                      {/* Code Block for Informatika */}
                      {(subjectName === 'Informatika' || initialModule?.subject === 'Informatika' || !subjectName) && (
                        <button
                          onClick={() => handleAddBlock('code')}
                          className="w-full p-3 rounded-[8px] bg-white border border-[#ECECEC] hover:border-[#2563EB] hover:bg-blue-50/50 text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <Code className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                            <span className="text-[#2E2D2D] group-hover:text-[#2563EB] transition-colors">Blok Kode</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#737373] group-hover:text-[#2563EB] transition-colors" />
                        </button>
                      )}

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
                    </div>
                  </div>
                </>
              )}

            </div>
          </aside>

      </div>

      {/* IMAGE EDIT MODAL */}
      {editingImageId && (
        <div
          onClick={() => setEditingImageId(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-[#2E2D2D] rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative"
          >
            <button
              type="button"
              onClick={() => setEditingImageId(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-base text-[#2E2D2D]">Pengaturan Gambar</h3>
            </div>

            <div className="flex gap-2 p-1 bg-slate-100 rounded-[8px]">
              <button
                onClick={() => setImageUploadMode('computer')}
                className={`flex-1 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                  imageUploadMode === 'computer'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#737373] hover:text-[#2E2D2D]'
                }`}
              >
                Upload Komputer
              </button>
              <button
                onClick={() => setImageUploadMode('url')}
                className={`flex-1 py-1.5 rounded-[6px] text-xs font-bold transition-all cursor-pointer ${
                  imageUploadMode === 'url'
                    ? 'bg-white text-[#2563EB] shadow-2xs'
                    : 'text-[#737373] hover:text-[#2E2D2D]'
                }`}
              >
                URL Gambar Web
              </button>
            </div>

            {imageUploadMode === 'computer' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#2563EB] bg-slate-50 p-8 rounded-[10px] text-center cursor-pointer space-y-2 transition-all"
              >
                <Upload className="w-6 h-6 text-[#2563EB] mx-auto" />
                <p className="text-xs font-bold text-[#2E2D2D]">Pilih File dari Komputer Anda</p>
                <p className="text-[11px] text-[#737373]">PNG, JPG, WEBP, GIF (Maks. 10MB)</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2E2D2D] block">Tautan / URL Gambar</label>
                <input
                  type="text"
                  value={tempImageUrl}
                  onChange={(e) => setTempImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingImageId(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#2E2D2D] cursor-pointer"
              >
                Batal
              </button>

              {imageUploadMode === 'url' && (
                <button
                  onClick={handleSaveImageModal}
                  className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-xs font-bold text-white shadow-2xs cursor-pointer"
                >
                  Simpan Gambar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIDEO URL EDIT MODAL */}
      {editingVideoId && (
        <div
          onClick={() => setEditingVideoId(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-[#2E2D2D] rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-4 shadow-2xl animate-in zoom-in-95 duration-200 relative"
          >
            <button
              type="button"
              onClick={() => setEditingVideoId(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-base text-[#2E2D2D]">Pengaturan Tautan Video YouTube</h3>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2E2D2D] block">URL Video YouTube / Shorts / Embed</label>
              <input
                type="text"
                value={tempVideoUrl}
                onChange={(e) => setTempVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
              />
              <p className="text-[11px] text-[#737373]">
                Format yang didukung: YouTube Watch link (`watch?v=`), Shorts, Embed, atau `youtu.be/`
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingVideoId(null)}
                className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#2E2D2D] cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleSaveVideoModal}
                className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-xs font-bold text-white shadow-2xs cursor-pointer"
              >
                Simpan Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH / DRAFT CONFIRMATION MODAL WITH REFINED STYLE */}
      {showPublishModal && (
        <div
          onClick={() => setShowPublishModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-xl rounded-[16px] border border-[#ECECEC] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] relative"
          >
            <button
              type="button"
              onClick={() => setShowPublishModal(false)}
              className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header (Title Only, No Border Line, No Subtitle) */}
            <div className="p-6 pb-0 bg-white shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-[#2E2D2D]">
                {initialModule ? 'Konfirmasi Pembaruan Materi' : 'Konfirmasi & Publikasi Materi'}
              </h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 pt-5 overflow-y-auto space-y-5 flex-1 text-xs">

              {/* WARNING BANNER IF NO TEXT SECTION WITH CONTENT IS PRESENT */}
              {!hasValidTextContent && (
                <div className="p-3.5 rounded-[10px] bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2.5 shadow-2xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-amber-900">Materi belum memenuhi syarat publikasi</p>
                    <p className="text-[11px] text-amber-700 leading-relaxed">
                      Minimal harus terdapat 1 Section Teks yang terisi materi pembelajaran untuk dapat mempublikasikannya. Anda hanya dapat menyimpan sebagai draft.
                    </p>
                  </div>
                </div>
              )}

              {/* 0. COVER / THUMBNAIL MATERI (RASIO 16:9) - Only for new modules */}
              {!initialModule && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#2E2D2D] block">
                    Cover / Thumbnail Materi (16:9)
                  </label>
                  {moduleThumbnail && (
                    <button
                      type="button"
                      onClick={() => thumbnailFileInputRef.current?.click()}
                      className="text-[11px] font-bold text-[#2563EB] hover:underline cursor-pointer"
                    >
                      Ganti Thumbnail
                    </button>
                  )}
                </div>

                {isUploadingThumbnail ? (
                  <div className="relative w-full aspect-video rounded-[10px] overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 p-4 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    <div className="relative z-10 flex flex-col items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center animate-pulse shadow-md">
                        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-white tracking-wide">
                          Memproses & Mengunggah Cover...
                        </p>
                        <p className="text-[11px] text-blue-300 font-semibold">
                          {thumbnailUploadProgress}% Selesai
                        </p>
                      </div>
                      <div className="w-48 max-w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-200"
                          style={{ width: `${thumbnailUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : moduleThumbnail ? (
                  <div className="relative w-full aspect-video rounded-[10px] overflow-hidden border border-[#ECECEC] bg-slate-50 group/cover animate-in fade-in duration-300">
                    {/* eslint-disable-next-next/no-img-element */}
                    <img
                      src={moduleThumbnail}
                      alt="Thumbnail Materi"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => thumbnailFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-[6px] bg-white text-[#2E2D2D] text-xs font-bold shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                      >
                        Ganti Gambar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModuleThumbnail('');
                          setIsDirty(true);
                        }}
                        className="px-3 py-1.5 rounded-[6px] bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => thumbnailFileInputRef.current?.click()}
                    className="w-full aspect-video rounded-[10px] border border-dashed border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-[#2563EB]" />
                    </div>
                    <span>Upload Cover / Thumbnail Materi (16:9)</span>
                    <span className="text-[10px] text-[#737373] font-normal">Format: PNG, JPG, JPEG (Maks. 5MB)</span>
                  </button>
                )}
              </div>
              )}

              {/* 1. JUDUL MATERI (READ-ONLY) */}
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-[#2E2D2D] block">Judul Materi</label>
                <input
                  type="text"
                  value={moduleTitle}
                  readOnly
                  className="w-full h-9 px-3.5 rounded-[8px] bg-slate-50 border border-[#ECECEC] text-xs font-semibold text-[#737373] outline-none cursor-not-allowed select-none"
                />
              </div>

              {/* 2. ROW: LEVEL & DURASI */}
              <div className={initialModule ? '' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
                {/* Level dropdown - only in modal for new modules */}
                {!initialModule && (
                <div ref={levelDropdownRef} className="space-y-1.5 relative">
                  <label className="font-bold text-xs text-[#2E2D2D] block">Tingkat Kesulitan / Level</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
                      className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none hover:border-[#2563EB] focus:border-[#2563EB] flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span>{moduleLevel}</span>
                      <ChevronDown className={`w-4 h-4 text-[#2E2D2D] transition-transform duration-200 ${isLevelDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isLevelDropdownOpen && (
                      <div
                        className="absolute left-0 top-full mt-1.5 w-full bg-white/95 backdrop-blur-md border border-[#ECECEC] rounded-[12px] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
                      >
                        {(['Pemula', 'Menengah', 'Mahir'] as const).map((lvl) => {
                          const isSelected = moduleLevel === lvl;
                          return (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => {
                                setModuleLevel(lvl);
                                setIsLevelDropdownOpen(false);
                              }}
                              className={`w-full px-3 py-2.5 rounded-[8px] text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-50/80 text-[#2563EB] font-bold'
                                  : 'text-[#2E2D2D] hover:bg-slate-50'
                              }`}
                            >
                              <span>{lvl}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-bold text-xs text-[#2E2D2D] block">Estimasi Durasi Pengerjaan</label>
                  <input
                    type="text"
                    value={moduleDuration}
                    onChange={(e) => setModuleDuration(e.target.value)}
                    placeholder="Contoh: 25 Menit"
                    className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
              </div>

              {/* 3. TOPIK BAHASAN - Only for new modules */}
              {!initialModule && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-xs text-[#2E2D2D] block">Topik Bahasan</label>
                  <span className={`text-[11px] font-semibold ${moduleTopics.length >= 4 ? 'text-amber-600' : 'text-[#737373]'}`}>
                    {moduleTopics.length}/4 Topik
                  </span>
                </div>
                <div
                  className="min-h-[44px] p-2 rounded-[8px] bg-white border border-[#ECECEC] focus-within:border-[#2563EB] flex flex-wrap items-center gap-2 transition-colors cursor-text"
                  onClick={() => tagInputRef.current?.focus()}
                >
                  {moduleTopics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-blue-50 text-[#2563EB] font-bold text-xs border border-blue-100/80 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <span>{topic}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTopicTag(topic);
                        }}
                        className="text-blue-400 hover:text-blue-700 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}

                  {moduleTopics.length < 4 && (
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={tagInputText}
                      onChange={(e) => setTagInputText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTopicTag();
                        } else if (e.key === 'Backspace' && !tagInputText && moduleTopics.length > 0) {
                          handleRemoveTopicTag(moduleTopics[moduleTopics.length - 1]);
                        }
                      }}
                      placeholder={moduleTopics.length === 0 ? "Ketik topik bahasan lalu tekan Enter..." : "Tambah topik..."}
                      className="flex-1 min-w-[140px] text-xs text-[#2E2D2D] outline-none border-none bg-transparent p-1 placeholder:text-[#AAAAAA]"
                    />
                  )}
                </div>
              </div>
              )}

              {/* 4. BAHAN EVALUASI - Only for new modules */}
              {!initialModule && (
              <div className="space-y-2 pt-1">
                <label className="font-bold text-xs text-[#2E2D2D] block">Bahan Evaluasi / Kuis (Opsional)</label>

                {!evaluationType ? (
                  <button
                    type="button"
                    onClick={() => handleSwitchEvaluationType('kuis_sitemsa')}
                    className="w-full py-3 rounded-[8px] border-2 border-dashed border-blue-300 hover:border-[#2563EB] bg-white hover:bg-blue-50/40 text-xs font-bold text-[#2563EB] inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Bahan Evaluasi / Kuis</span>
                  </button>
                ) : (
                  <div className="p-4 rounded-[12px] bg-white border border-[#ECECEC] space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-bold text-[#2E2D2D] text-xs flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-[#2563EB]" /> Pengaturan Bahan Evaluasi
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteConfirmTarget({
                            type: 'evaluasi',
                            title: 'Konfirmasi Hapus Evaluasi',
                            description: 'Apakah Anda yakin ingin menghapus pengaturan evaluasi/kuis yang terhubung dengan materi ini?',
                            onConfirm: () => handleSwitchEvaluationType(null),
                          });
                        }}
                        className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Hapus Evaluasi
                      </button>
                    </div>

                    {/* Evaluation Type Select Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSwitchEvaluationType('kuis_sitemsa')}
                        className={`p-2.5 rounded-[8px] border text-center text-xs font-bold transition-all cursor-pointer ${
                          evaluationType === 'kuis_sitemsa'
                            ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                            : 'bg-white border-[#ECECEC] text-[#737373] hover:bg-slate-50'
                        }`}
                      >
                        Kuis Sitemsa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchEvaluationType('link_eksternal')}
                        className={`p-2.5 rounded-[8px] border text-center text-xs font-bold transition-all cursor-pointer ${
                          evaluationType === 'link_eksternal'
                            ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                            : 'bg-white border-[#ECECEC] text-[#737373] hover:bg-slate-50'
                        }`}
                      >
                        Link Eksternal
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSwitchEvaluationType('qr_code')}
                        className={`p-2.5 rounded-[8px] border text-center text-xs font-bold transition-all cursor-pointer ${
                          evaluationType === 'qr_code'
                            ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                            : 'bg-white border-[#ECECEC] text-[#737373] hover:bg-slate-50'
                        }`}
                      >
                        Barcode / QR Code
                      </button>
                    </div>

                    {/* 1. KUIS SITEMSA INPUT WITH CUSTOM POPOVER DROPDOWN */}
                    {evaluationType === 'kuis_sitemsa' && (
                      <div ref={quizDropdownRef} className="space-y-1.5 pt-1 relative">
                        <label className="font-bold text-xs text-[#2E2D2D] block">Pilih Kuis Sitemsa</label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsQuizDropdownOpen(!isQuizDropdownOpen)}
                            className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none hover:border-[#2563EB] focus:border-[#2563EB] flex items-center justify-between cursor-pointer transition-colors"
                          >
                            <span className={evalTitle ? 'text-[#2E2D2D] font-bold' : 'text-[#737373]'}>
                              {evalTitle || 'Pilih Kuis Sitemsa'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[#2E2D2D] transition-transform duration-200 ${isQuizDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isQuizDropdownOpen && (
                            <div
                              className="absolute left-0 bottom-full mb-1.5 w-full bg-white/95 backdrop-blur-md border border-[#ECECEC] rounded-[12px] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
                            >
                              {[
                                'Kuis 1: Daspro & Variabel Python (3 Soal)',
                                'Kuis 2: Rangkaian Listrik Seri & Paralel (5 Soal)',
                                'Kuis 3: Logika & Algoritma Lanjutan (4 Soal)',
                              ].map((quizName) => {
                                const isSelected = evalTitle === quizName;
                                return (
                                  <button
                                    key={quizName}
                                    type="button"
                                    onClick={() => {
                                      setEvalTitle(quizName);
                                      setIsQuizDropdownOpen(false);
                                    }}
                                    className={`w-full px-3 py-2.5 rounded-[8px] text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-blue-50/80 text-[#2563EB] font-bold'
                                        : 'text-[#2E2D2D] hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{quizName}</span>
                                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 2. LINK EKSTERNAL INPUT */}
                    {evaluationType === 'link_eksternal' && (
                      <div className="space-y-3 pt-1">
                        <div className="space-y-1.5">
                          <label className="font-bold text-xs text-[#2E2D2D] block">Judul Kuis Eksternal</label>
                          <input
                            type="text"
                            value={evalTitle}
                            onChange={(e) => setEvalTitle(e.target.value)}
                            placeholder="Contoh: Kuis Quizizz Lab Elektronika..."
                            className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-xs text-[#2E2D2D] block">Link / URL Kuis</label>
                          <input
                            type="text"
                            value={evalUrl}
                            onChange={(e) => setEvalUrl(e.target.value)}
                            placeholder="Contoh: https://quizizz.com/join?gc=123456"
                            className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* 3. BARCODE / QR CODE MODAL INPUT WITH CUSTOM BUTTON & UPLOAD PREVIEW */}
                    {evaluationType === 'qr_code' && (
                      <div className="space-y-3 pt-1">
                        <div className="space-y-1.5">
                          <label className="font-bold text-xs text-[#2E2D2D] block">Judul Kuis Barcode</label>
                          <input
                            type="text"
                            value={evalTitle}
                            onChange={(e) => setEvalTitle(e.target.value)}
                            placeholder="Contoh: Kuis Pindai Barcode (Quizizz Lab)"
                            className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-xs text-[#2E2D2D] block">Gambar Barcode / QR Code</label>
                          {!evalQrUrl ? (
                            <button
                              type="button"
                              onClick={() => evalQrInputRef.current?.click()}
                              className="w-full py-2.5 px-4 rounded-[8px] border border-dashed border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                            >
                              <Upload className="w-4 h-4 text-[#2563EB]" />
                              <span>Upload Gambar Barcode / QR Code</span>
                            </button>
                          ) : (
                            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-[8px] border border-[#ECECEC]">
                              <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                                <div
                                  onClick={() => setExpandedImagePreviewUrl(evalQrUrl)}
                                  className="w-10 h-10 rounded-[6px] bg-white p-1 border border-[#ECECEC] shrink-0 flex items-center justify-center cursor-pointer hover:border-[#2563EB] hover:scale-105 transition-all group/qrThumb"
                                  title="Klik untuk memperbesar gambar barcode"
                                >
                                  {/* eslint-disable-next-next/no-img-element */}
                                  <img src={evalQrUrl} alt="QR Code" className="w-full h-full object-contain" />
                                </div>
                                <span
                                  onClick={() => setExpandedImagePreviewUrl(evalQrUrl)}
                                  className="text-xs font-semibold text-[#2E2D2D] hover:text-[#2563EB] truncate cursor-pointer transition-colors"
                                  title="Klik untuk memperbesar gambar barcode"
                                >
                                  Gambar Barcode Terpasang (Klik perbesar)
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => evalQrInputRef.current?.click()}
                                  className="px-3 py-1.5 rounded-[6px] bg-white border border-[#ECECEC] hover:bg-slate-100 text-xs font-semibold text-[#2E2D2D] cursor-pointer transition-colors"
                                >
                                  Ganti Gambar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEvalQrUrl('')}
                                  className="px-3 py-1.5 rounded-[6px] bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-600 cursor-pointer transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              )}

            </div>

            {/* Modal Footer (Action Buttons, No Top Border Line) */}
            <div className="p-4 sm:p-5 pt-2 bg-white flex items-center justify-end gap-3 shrink-0">
              {!isAlreadyPublished && (
                <button
                  type="button"
                  disabled={isPublishing || isUploadingThumbnail}
                  onClick={() => {
                    handleSaveModuleConfirm(false);
                  }}
                  className={`px-4 py-2.5 rounded-[8px] text-xs font-semibold transition-colors ${
                    isPublishing || isUploadingThumbnail
                      ? 'bg-slate-100 text-[#AAAAAA] cursor-not-allowed opacity-50'
                      : 'bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] cursor-pointer'
                  }`}
                >
                  Save as draft
                </button>
              )}
              {(() => {
                const isPublishEnabled = hasValidTextContent && moduleTopics.length > 0 && !isPublishing && !isUploadingThumbnail;
                return (
                  <button
                    type="button"
                    disabled={!isPublishEnabled}
                    onClick={() => {
                      if (!isPublishEnabled) return;
                      handleSaveModuleConfirm(true);
                    }}
                    className={`px-6 py-2.5 rounded-[8px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPublishEnabled
                        ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs cursor-pointer'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                    title={
                      !hasValidTextContent
                        ? 'Lengkapi minimal 1 section teks materi untuk mempublikasikannya'
                        : moduleTopics.length === 0
                        ? 'Wajib mengisi minimal 1 topik bahasan untuk mempublikasikan'
                        : undefined
                    }
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white shrink-0" />
                        <span>{initialModule ? 'Memperbarui Materi...' : 'Menerbitkan Materi...'}</span>
                      </>
                    ) : (
                      <span>{initialModule ? 'Update Materi' : 'Publish Materi'}</span>
                    )}
                  </button>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* PUBLISH SUCCESS MODAL WITH LOTTIE ANIMATION */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-[16px] border border-[#ECECEC] p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="w-48 h-48 mx-auto relative flex items-center justify-center overflow-hidden">
              <iframe
                src="https://lottie.host/embed/878825de-212a-443e-89a9-c5573cfe890b/3v8OMNEl30.lottie"
                className="w-full h-full border-0 pointer-events-none"
                title="Publish Success Lottie Animation"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[#2E2D2D]">
                {initialModule ? 'Materi Berhasil Diperbarui!' : 'Materi Berhasil Dipublikasikan!'}
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed max-w-xs mx-auto">
                {initialModule
                  ? 'Perubahan materi pembelajaran telah berhasil disimpan dan langsung diperbarui di platform Sitemsa.'
                  : 'Materi pembelajaran ini sekarang telah aktif dan dapat diakses oleh seluruh siswa di platform Sitemsa.'}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Selesai & Kembali ke Pelajaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR MODAL PREVIEW OVERLAY */}
      {activeQrModalUrl && (
        <div
          onClick={() => setActiveQrModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-[#2E2D2D] rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-sm text-center space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
          >
            <button
              onClick={() => setActiveQrModalUrl(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold text-base text-[#2E2D2D] pt-2">Pindai Barcode Kuis</h3>

            <div className="w-56 h-56 mx-auto bg-white p-3 rounded-[12px] border border-[#ECECEC] shadow-xs flex items-center justify-center">
              {/* eslint-disable-next-next/no-img-element */}
              <img
                src={activeQrModalUrl}
                alt="QR Code Kuis"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-[#737373] leading-relaxed">
              Pindai Barcode / QR Code di atas menggunakan kamera ponsel Anda untuk masuk ke kuis pengajar.
            </p>

            <button
              onClick={() => setActiveQrModalUrl(null)}
              className="w-full py-2.5 rounded-[8px] bg-[#2563EB] text-[#FFFFFF] text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer"
            >
              Atau Buka Tautan Langsung &rarr;
            </button>
          </div>
        </div>
      )}

      {showExitConfirmModal && (
        <div
          onClick={() => setShowExitConfirmModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans text-left"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Header Title & Aligned Close Button (NO ICON, ALIGNED INLINE) */}
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-bold text-base text-[#2E2D2D]">Simpan Perubahan Sebelum Keluar?</h3>
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-8 h-8 rounded-full bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC]">
              Anda telah membuat perubahan pada materi ini. Apakah Anda ingin menyimpannya sebagai draft terlebih dahulu atau keluar tanpa menyimpan?
            </p>

            {/* Action Buttons: Keluar (slate button style) + Simpan Sebagai Draft */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  onClose();
                }}
                className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] text-xs font-semibold cursor-pointer transition-colors"
              >
                Keluar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowExitConfirmModal(false);
                  handleSaveModuleConfirm(false);
                  onClose();
                }}
                className="px-4 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Simpan Sebagai Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPANDED BARCODE / QR IMAGE PREVIEW LIGHTBOX MODAL */}
      {expandedImagePreviewUrl && (
        <div
          onClick={() => setExpandedImagePreviewUrl(null)}
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-[16px] p-4 border border-[#ECECEC] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={() => setExpandedImagePreviewUrl(null)}
              className="absolute right-3 top-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer z-10"
              title="Tutup Pratinjau"
            >
              <X className="w-4 h-4" />
            </button>

            <h4 className="text-sm font-bold text-[#2E2D2D] pt-1">Pratinjau Gambar Barcode / QR Code</h4>

            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-[10px] bg-slate-50 p-2 border border-slate-100">
              <img
                src={expandedImagePreviewUrl}
                alt="Barcode / QR Code Preview"
                className="max-h-[65vh] w-auto object-contain rounded-[6px]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ==================== HEADER TOOLBAR MINI-MODALS (EDITING PUBLISHED) ==================== */}

      {/* THUMBNAIL UPLOAD MODAL */}
      {showThumbnailModal && (
        <div
          onClick={() => setShowThumbnailModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-[16px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
          >
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">Cover Materi</h3>
              <button
                type="button"
                onClick={() => setShowThumbnailModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-5 space-y-3">
              {isUploadingThumbnail ? (
                <div className="relative w-full aspect-video rounded-[10px] overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center gap-3 p-4 shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                  <div className="relative z-10 flex flex-col items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/50 flex items-center justify-center animate-pulse shadow-md">
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-xs font-bold text-white tracking-wide">
                        Memproses & Mengunggah Cover...
                      </p>
                      <p className="text-[11px] text-blue-300 font-semibold">
                        {thumbnailUploadProgress}% Selesai
                      </p>
                    </div>
                    <div className="w-48 max-w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-200"
                        style={{ width: `${thumbnailUploadProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : moduleThumbnail ? (
                <div className="relative w-full aspect-video rounded-[10px] overflow-hidden border border-[#ECECEC] bg-slate-50 group/cover animate-in fade-in duration-300">
                  <img
                    src={moduleThumbnail}
                    alt="Thumbnail Materi"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => thumbnailFileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-[6px] bg-white text-[#2E2D2D] text-xs font-bold shadow-md hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Ganti Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmTarget({
                          type: 'element',
                          title: 'Konfirmasi Hapus Cover',
                          description: 'Apakah Anda yakin ingin menghapus gambar cover materi ini?',
                          onConfirm: () => {
                            setModuleThumbnail('');
                            setIsDirty(true);
                          },
                        });
                      }}
                      className="px-3 py-1.5 rounded-[6px] bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => thumbnailFileInputRef.current?.click()}
                  className="w-full aspect-video rounded-[10px] border border-dashed border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <span>Upload Cover / Thumbnail Materi (16:9)</span>
                  <span className="text-[10px] text-[#737373] font-normal">Format: PNG, JPG, JPEG (Maks. 5MB)</span>
                </button>
              )}
            </div>
            <div className="px-5 pb-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={isUploadingThumbnail}
                onClick={() => setShowThumbnailModal(false)}
                className={`px-5 py-2 rounded-[8px] text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isUploadingThumbnail
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-98'
                }`}
              >
                {isUploadingThumbnail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isUploadingThumbnail ? 'Memuat...' : 'Simpan'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOPICS EDIT MODAL */}
      {showTopicsModal && (
        <div
          onClick={() => {
            if (moduleTopics.length >= 1) {
              setShowTopicsModal(false);
            }
          }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white rounded-[16px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
          >
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">Topik Bahasan</h3>
              <button
                type="button"
                onClick={() => {
                  if (moduleTopics.length >= 1) {
                    setShowTopicsModal(false);
                  }
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold ${moduleTopics.length === 0 ? 'text-rose-600 font-bold' : moduleTopics.length >= 4 ? 'text-amber-600' : 'text-[#737373]'}`}>
                  {moduleTopics.length}/4 Topik {moduleTopics.length === 0 && '(Wajib minimal 1)'}
                </span>
              </div>
              <div
                className={`min-h-[44px] p-2 rounded-[8px] bg-white border ${
                  moduleTopics.length === 0 ? 'border-rose-300 focus-within:border-rose-500' : 'border-[#ECECEC] focus-within:border-[#2563EB]'
                } flex flex-wrap items-center gap-2 transition-colors cursor-text`}
                onClick={() => tagInputRef.current?.focus()}
              >
                {moduleTopics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-blue-50 text-[#2563EB] font-bold text-xs border border-blue-100/80 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <span>{topic}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTopicTag(topic);
                        setIsDirty(true);
                      }}
                      className="text-blue-400 hover:text-blue-700 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}

                {moduleTopics.length < 4 && (
                  <input
                    ref={tagInputRef}
                    type="text"
                    value={tagInputText}
                    onChange={(e) => setTagInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTopicTag();
                        setIsDirty(true);
                      } else if (e.key === 'Backspace' && !tagInputText && moduleTopics.length > 0) {
                        handleRemoveTopicTag(moduleTopics[moduleTopics.length - 1]);
                        setIsDirty(true);
                      }
                    }}
                    placeholder={moduleTopics.length === 0 ? "Ketik topik lalu tekan Enter..." : "Tambah topik..."}
                    className="flex-1 min-w-[140px] text-xs text-[#2E2D2D] outline-none border-none bg-transparent p-1 placeholder:text-[#AAAAAA]"
                  />
                )}
              </div>

              {moduleTopics.length === 0 && (
                <p className="text-[11px] text-rose-500 font-medium animate-in fade-in duration-150">
                  ⚠️ Minimal 1 topik bahasan harus ditambahkan sebelum menyimpan.
                </p>
              )}
            </div>
            <div className="px-5 pb-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={moduleTopics.length === 0 && !tagInputText.trim()}
                onClick={() => {
                  if (tagInputText.trim()) {
                    handleAddTopicTag();
                    setIsDirty(true);
                  }
                  if (moduleTopics.length > 0 || tagInputText.trim()) {
                    setShowTopicsModal(false);
                  }
                }}
                className={`px-5 py-2 rounded-[8px] text-xs font-semibold transition-colors ${
                  moduleTopics.length === 0 && !tagInputText.trim()
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-xs cursor-pointer active:scale-98'
                }`}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EVALUASI EDIT MODAL */}
      {showEvaluasiModal && (
        <div
          onClick={() => setShowEvaluasiModal(false)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 font-sans"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-white rounded-[16px] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
          >
            <div className="p-5 pb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#2E2D2D]">Bahan Evaluasi / Kuis</h3>
              <button
                type="button"
                onClick={() => setShowEvaluasiModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 pb-5">
              {!evaluationType ? (
                <button
                  type="button"
                  onClick={() => { handleSwitchEvaluationType('kuis_sitemsa'); setIsDirty(true); }}
                  className="w-full py-3 rounded-[8px] border-2 border-dashed border-blue-300 hover:border-[#2563EB] bg-white hover:bg-blue-50/40 text-xs font-bold text-[#2563EB] inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Bahan Evaluasi / Kuis</span>
                </button>
              ) : (
                <div className="p-4 rounded-[12px] bg-white border border-[#ECECEC] space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold text-[#2E2D2D] text-xs flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#2563EB]" /> Pengaturan Bahan Evaluasi
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteConfirmTarget({
                          type: 'element',
                          title: 'Konfirmasi Hapus Evaluasi',
                          description: 'Apakah Anda yakin ingin menghapus bahan evaluasi dari materi ini?',
                          onConfirm: () => {
                            handleSwitchEvaluationType(null);
                            setIsDirty(true);
                          },
                        });
                      }}
                      className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus Evaluasi
                    </button>
                  </div>

                  {/* Evaluation Type Select Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { handleSwitchEvaluationType('kuis_sitemsa'); setIsDirty(true); }}
                      className={`p-2.5 rounded-[8px] border text-center text-xs font-bold transition-all cursor-pointer ${
                        evaluationType === 'kuis_sitemsa'
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-[#ECECEC] text-[#737373] hover:bg-slate-50'
                      }`}
                    >
                      Kuis Sitemsa
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleSwitchEvaluationType('link_eksternal'); setIsDirty(true); }}
                      className={`p-2.5 rounded-[8px] border text-center text-xs font-bold transition-all cursor-pointer ${
                        evaluationType === 'link_eksternal'
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-[#ECECEC] text-[#737373] hover:bg-slate-50'
                      }`}
                    >
                      Link Eksternal
                    </button>
                    <button
                      type="button"
                      onClick={() => { handleSwitchEvaluationType('qr_code'); setIsDirty(true); }}
                      className={`p-2.5 rounded-[8px] border text-center text-xs font-bold transition-all cursor-pointer ${
                        evaluationType === 'qr_code'
                          ? 'bg-blue-50 border-[#2563EB] text-[#2563EB]'
                          : 'bg-white border-[#ECECEC] text-[#737373] hover:bg-slate-50'
                      }`}
                    >
                      Barcode / QR Code
                    </button>
                  </div>

                  {/* Kuis Sitemsa */}
                  {evaluationType === 'kuis_sitemsa' && (
                    <div ref={quizDropdownRef} className="space-y-1.5 pt-1 relative">
                      <label className="font-bold text-xs text-[#2E2D2D] block">Pilih Kuis Sitemsa</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setIsQuizDropdownOpen(!isQuizDropdownOpen)}
                          className="w-full h-9 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs font-semibold text-[#2E2D2D] outline-none hover:border-[#2563EB] focus:border-[#2563EB] flex items-center justify-between cursor-pointer transition-colors"
                        >
                          <span className={evalTitle ? 'text-[#2E2D2D] font-bold' : 'text-[#737373]'}>
                            {evalTitle || 'Pilih Kuis Sitemsa'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-[#2E2D2D] transition-transform duration-200 ${isQuizDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isQuizDropdownOpen && (
                          <div className="absolute left-0 bottom-full mb-1.5 w-full bg-white border border-[#ECECEC] rounded-[12px] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-0.5 font-sans">
                            {[
                              'Kuis 1: Daspro & Variabel Python (3 Soal)',
                              'Kuis 2: Rangkaian Listrik Seri & Paralel (5 Soal)',
                              'Kuis 3: Logika & Algoritma Lanjutan (4 Soal)',
                            ].map((quizName) => {
                              const isSelected = evalTitle === quizName;
                              return (
                                <button
                                  key={quizName}
                                  type="button"
                                  onClick={() => {
                                    setEvalTitle(quizName);
                                    setIsQuizDropdownOpen(false);
                                    setIsDirty(true);
                                  }}
                                  className={`w-full px-3 py-2.5 rounded-[8px] text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                                    isSelected
                                      ? 'text-[#2563EB] font-bold'
                                      : 'text-[#2E2D2D] hover:bg-slate-50 font-medium'
                                  }`}
                                >
                                  <span>{quizName}</span>
                                  {isSelected && <Check className="w-4 h-4 text-[#2563EB]" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Link Eksternal */}
                  {evaluationType === 'link_eksternal' && (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="font-bold text-xs text-[#2E2D2D] block">Judul Kuis Eksternal</label>
                        <input
                          type="text"
                          value={evalTitle}
                          onChange={(e) => { setEvalTitle(e.target.value); setIsDirty(true); }}
                          placeholder="Contoh: Kuis Quizizz Lab Elektronika..."
                          className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-xs text-[#2E2D2D] block">Link / URL Kuis</label>
                        <input
                          type="text"
                          value={evalUrl}
                          onChange={(e) => { setEvalUrl(e.target.value); setIsDirty(true); }}
                          placeholder="Contoh: https://quizizz.com/join?gc=123456"
                          className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {/* QR Code */}
                  {evaluationType === 'qr_code' && (
                    <div className="space-y-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="font-bold text-xs text-[#2E2D2D] block">Judul Kuis Barcode</label>
                        <input
                          type="text"
                          value={evalTitle}
                          onChange={(e) => { setEvalTitle(e.target.value); setIsDirty(true); }}
                          placeholder="Contoh: Kuis Pindai Barcode (Quizizz Lab)"
                          className="w-full h-10 px-3.5 rounded-[8px] bg-white border border-[#ECECEC] text-xs text-[#2E2D2D] outline-none focus:border-[#2563EB] transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-xs text-[#2E2D2D] block">Gambar Barcode / QR Code</label>
                        {!evalQrUrl ? (
                          <button
                            type="button"
                            onClick={() => evalQrInputRef.current?.click()}
                            className="w-full py-2.5 px-4 rounded-[8px] border border-dashed border-[#2563EB] bg-blue-50/50 hover:bg-blue-50 text-xs font-bold text-[#2563EB] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                          >
                            <Upload className="w-4 h-4 text-[#2563EB]" />
                            <span>Upload Gambar Barcode / QR Code</span>
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-[8px] border border-[#ECECEC]">
                            <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                              <div
                                onClick={() => setExpandedImagePreviewUrl(evalQrUrl)}
                                className="w-10 h-10 rounded-[6px] bg-white p-1 border border-[#ECECEC] shrink-0 flex items-center justify-center cursor-pointer hover:border-[#2563EB] hover:scale-105 transition-all"
                                title="Klik untuk memperbesar"
                              >
                                <img src={evalQrUrl} alt="QR Code" className="w-full h-full object-contain" />
                              </div>
                              <span className="text-xs font-semibold text-[#2E2D2D] truncate">
                                Barcode Terpasang
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => evalQrInputRef.current?.click()}
                                className="px-3 py-1.5 rounded-[6px] bg-white border border-[#ECECEC] hover:bg-slate-100 text-xs font-semibold text-[#2E2D2D] cursor-pointer transition-colors"
                              >
                                Ganti
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirmTarget({
                                    type: 'element',
                                    title: 'Konfirmasi Hapus Barcode',
                                    description: 'Apakah Anda yakin ingin menghapus gambar Barcode / QR Code ini?',
                                    onConfirm: () => {
                                      setEvalQrUrl('');
                                      setIsDirty(true);
                                    },
                                  });
                                }}
                                className="px-3 py-1.5 rounded-[6px] bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-600 cursor-pointer transition-colors"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="px-5 pb-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEvaluasiModal(false)}
                className="px-5 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer active:scale-98"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL WITH MATCHING STYLE */}
      {deleteConfirmTarget && (
        <div
          onClick={() => setDeleteConfirmTarget(null)}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[16px] border border-[#ECECEC] p-6 w-full max-w-md text-left space-y-4 animate-in fade-in zoom-in-95 duration-200 relative shadow-xl"
          >
            {/* Top-Right X Button */}
            <button
              type="button"
              onClick={() => setDeleteConfirmTarget(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#737373] hover:text-[#2E2D2D] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Danger Icon Badge */}
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>

            {/* Modal Title & Description */}
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[#2E2D2D]">
                {deleteConfirmTarget.title}
              </h3>
              <p className="text-xs text-[#737373] leading-relaxed bg-slate-50 p-3 rounded-[8px] border border-[#ECECEC] mt-2">
                {deleteConfirmTarget.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-[8px] text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#2E2D2D] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteConfirmTarget.onConfirm();
                  setDeleteConfirmTarget(null);
                }}
                className="px-4 py-2 rounded-[8px] text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ModuleBlockBuilder;
