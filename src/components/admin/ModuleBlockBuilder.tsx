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
} from 'lucide-react';
import { ModuleItem } from '@/lib/admin-store';

export type BlockType = 'text' | 'image' | 'video' | 'attachment' | 'steps' | 'callout';
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
  // Section Text block data (Title + Content + Highlight)
  sectionTitle?: string;
  textValue?: string;
  calloutText?: string;
  alignment?: 'left' | 'center' | 'right';

  // Media block data
  mediaUrl?: string;
  imageCaption?: string;

  // Attachment block data (SUPPORTS MULTIPLE FILES)
  attachments?: AttachedFileItem[];

  // Step by step block data
  steps?: { title: string; desc: string }[];
}

interface ModuleBlockBuilderProps {
  initialModule?: ModuleItem | null;
  subjectName: string;
  onClose: () => void;
  onSave: (moduleData: Partial<ModuleItem>, blocks: CanvasBlock[]) => void;
}

// Auto-resizing Textarea Component with zero scrollbars & Smart List Formatting (Bullets & Numbering)
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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorIndex = textarea.selectionStart;
      const textBeforeCursor = value.substring(0, cursorIndex);
      const textAfterCursor = value.substring(cursorIndex);

      const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
      const currentLine = textBeforeCursor.substring(lastNewlineIndex + 1);

      const bulletMatch = currentLine.match(/^([•\-\*])\s*(.*)/);
      const numberMatch = currentLine.match(/^(\d+)\.\s*(.*)/);

      if (bulletMatch) {
        e.preventDefault();
        const bulletSymbol = bulletMatch[1] === '*' || bulletMatch[1] === '-' ? '•' : bulletMatch[1];
        const lineContent = bulletMatch[2].trim();

        if (lineContent.length === 0) {
          const lineStartIndex = lastNewlineIndex + 1;
          const newValue = value.substring(0, lineStartIndex) + textAfterCursor;
          onChange(newValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = lineStartIndex;
            }
          }, 0);
        } else {
          const insertion = `\n${bulletSymbol} `;
          const newValue = textBeforeCursor + insertion + textAfterCursor;
          onChange(newValue);
          const newCursorPos = cursorIndex + insertion.length;
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
            }
          }, 0);
        }
        return;
      }

      if (numberMatch) {
        e.preventDefault();
        const currentNum = parseInt(numberMatch[1], 10);
        const lineContent = numberMatch[2].trim();

        if (lineContent.length === 0) {
          const lineStartIndex = lastNewlineIndex + 1;
          const newValue = value.substring(0, lineStartIndex) + textAfterCursor;
          onChange(newValue);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = lineStartIndex;
            }
          }, 0);
        } else {
          const nextNum = currentNum + 1;
          const insertion = `\n${nextNum}. `;
          const newValue = textBeforeCursor + insertion + textAfterCursor;
          onChange(newValue);
          const newCursorPos = cursorIndex + insertion.length;
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPos;
            }
          }, 0);
        }
        return;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(val);
      return;
    }

    const cursorIndex = textarea.selectionStart;
    const textBeforeCursor = val.substring(0, cursorIndex);

    const lastNewlineIndex = textBeforeCursor.lastIndexOf('\n');
    const currentLine = textBeforeCursor.substring(lastNewlineIndex + 1);

    if (currentLine === '- ' || currentLine === '* ') {
      const lineStartIndex = lastNewlineIndex + 1;
      const newVal = val.substring(0, lineStartIndex) + '• ' + val.substring(cursorIndex);
      onChange(newVal);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = lineStartIndex + 2;
        }
      }, 0);
      return;
    }

    onChange(val);
  };

  return (
    <textarea
      ref={textareaRef}
      rows={rows}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`resize-none overflow-hidden ${className || ''}`}
      style={style}
    />
  );
}

export function ModuleBlockBuilder({
  initialModule,
  subjectName,
  onClose,
  onSave,
}: ModuleBlockBuilderProps) {
  // Title & Level state
  const [moduleTitle, setModuleTitle] = useState(
    initialModule?.title || 'Give me a name'
  );
  const [moduleLevel, setModuleLevel] = useState<'Pemula' | 'Menengah' | 'Mahir'>(
    initialModule?.level || 'Pemula'
  );
  const [moduleDuration, setModuleDuration] = useState(
    initialModule?.duration || '25 Menit'
  );

  // Dynamic Topics / Tags state (Dribbble Style Tag Input)
  const [moduleTopics, setModuleTopics] = useState<string[]>(
    initialModule?.topics || []
  );
  const [tagInputText, setTagInputText] = useState('');
  const tagInputRef = useRef<HTMLInputElement | null>(null);

  // Publish / Draft Confirmation Modal state & Success Modal state
  const isAlreadyPublished = initialModule?.isPublished === true;
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [showFinalPublishConfirmModal, setShowFinalPublishConfirmModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

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

  // Lock global body scroll when canvas builder is active
  useEffect(() => {
    document.documentElement.classList.add("modal-open");
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.classList.remove("modal-open");
      document.body.style.overflow = '';
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
  const evalQrInputRef = useRef<HTMLInputElement | null>(null);
  const levelDropdownRef = useRef<HTMLDivElement | null>(null);
  const quizDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (levelDropdownRef.current && !levelDropdownRef.current.contains(event.target as Node)) {
        setIsLevelDropdownOpen(false);
      }
      if (quizDropdownRef.current && !quizDropdownRef.current.contains(event.target as Node)) {
        setIsQuizDropdownOpen(false);
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
    const actualIndex = targetIndex !== undefined ? targetIndex : insertTargetIndex;

    const newBlock: CanvasBlock = {
      id: `blk-${Date.now()}`,
      type,
    };

    if (type === 'text') {
      newBlock.sectionTitle = 'Heading';
      newBlock.textValue = 'Tuliskan isi paragraf materi di sini....';
      newBlock.alignment = 'left';
    } else if (type === 'image') {
      newBlock.mediaUrl = '';
    } else if (type === 'video') {
      newBlock.mediaUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    } else if (type === 'attachment') {
      newBlock.attachments = [];
    } else if (type === 'steps') {
      newBlock.steps = [
        { title: 'Langkah 1', desc: 'Penjelasan instruksi langkah pertama praktikum...' },
      ];
    } else if (type === 'callout') {
      newBlock.textValue = 'Prinsip Utama: Deklarasikan variabel dengan nama yang deskriptif dan mencerminkan isi datanya agar kode mudah dibaca oleh tim pengembangan.';
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

  // Update block content by ID
  const updateBlockById = (id: string, partial: Partial<CanvasBlock>) => {
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

  // Native Image File Picker Handler
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingImageId) {
      const objectUrl = URL.createObjectURL(file);
      updateBlockById(editingImageId, { mediaUrl: objectUrl });
      setEditingImageId(null);
    }
  };

  // Native Attachment File Picker Handler
  const handleAttachmentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedBlockId) {
      const objectUrl = URL.createObjectURL(file);
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      const block = blocks.find((b) => b.id === selectedBlockId);
      if (block) {
        const currentAttachments = block.attachments || [];

        if (changingAttachmentFileId) {
          const updated = currentAttachments.map((item) =>
            item.id === changingAttachmentFileId
              ? {
                  ...item,
                  fileName: file.name,
                  fileSize: formattedSize,
                  fileUrl: objectUrl,
                }
              : item
          );
          updateBlockById(selectedBlockId, { attachments: updated });
          setChangingAttachmentFileId(null);
        } else {
          const newFileItem: AttachedFileItem = {
            id: `att-${Date.now()}`,
            fileName: file.name,
            fileSize: formattedSize,
            fileUrl: objectUrl,
          };
          updateBlockById(selectedBlockId, {
            attachments: [...currentAttachments, newFileItem],
          });
        }
      }
    }
  };

  // Trigger Add / Change Attachment
  const triggerAddAttachmentFileFromComputer = (blockId: string, fileItemId?: string) => {
    setSelectedBlockId(blockId);
    setChangingAttachmentFileId(fileItemId || null);
    attachmentFileInputRef.current?.click();
  };

  // Delete individual attached file from list
  const handleDeleteAttachmentFile = (blockId: string, fileItemId: string) => {
    const block = blocks.find((b) => b.id === blockId);
    if (!block || !block.attachments) return;
    const updated = block.attachments.filter((item) => item.id !== fileItemId);
    updateBlockById(blockId, { attachments: updated });
  };

  // Image Upload Modal trigger
  const handlePromptChangeImage = (id: string, currentUrl?: string) => {
    setEditingImageId(id);
    setImageUploadMode('computer');
    setTempImageUrl(currentUrl || '');
  };

  const handleSaveImageModal = () => {
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

  // Tag Add / Remove handlers (Dribbble Style)
  const handleAddTopicTag = () => {
    const trimmed = tagInputText.trim();
    if (trimmed && !moduleTopics.includes(trimmed)) {
      setModuleTopics([...moduleTopics, trimmed]);
      setTagInputText('');
    }
  };

  const handleRemoveTopicTag = (tagToRemove: string) => {
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

        onSave(
          {
            title: moduleTitle,
            subject: subjectName,
            level: moduleLevel,
            duration: moduleDuration,
            topics: moduleTopics,
            description: autoDescription,
            isPublished: true,
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

      onSave(
        {
          title: moduleTitle,
          subject: subjectName,
          level: moduleLevel,
          duration: moduleDuration,
          topics: moduleTopics,
          description: autoDescription,
          isPublished: false,
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
        }}
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
              if (isDirty || blocks.length > 0) {
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
            className="inline-flex items-center gap-2 min-w-0 shrink-0"
          >
            <div className="inline-grid items-center font-bold text-lg sm:text-xl text-[#2E2D2D] border-b-2 border-dotted border-slate-300 focus-within:border-[#2563EB] hover:border-slate-400 transition-colors pb-0.5 max-w-md">
              <span className="col-start-1 row-start-1 invisible whitespace-pre font-bold text-lg sm:text-xl px-0 pointer-events-none select-none">
                {moduleTitle || 'Give me a name'}
              </span>
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) => {
                  setModuleTitle(e.target.value);
                  setIsDirty(true);
                }}
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
          {!isAlreadyPublished && (
            <button
              onClick={() => handleSaveModuleConfirm(false)}
              className="px-4 py-2 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#2E2D2D] cursor-pointer transition-colors"
            >
              Save as draft
            </button>
          )}
          <button
            onClick={handleOpenPublishModal}
            className="px-5 py-2 rounded-[8px] bg-[#2563EB] hover:bg-blue-700 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
          >
            {isAlreadyPublished ? 'Publish Ulang' : 'Continue'}
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
              <div className="py-16 text-center space-y-4 border-2 border-dashed border-slate-200 rounded-[12px] p-12 bg-white mt-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
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
                        {block.type === 'text' && (
                          <div className="space-y-3">
                            {/* Heading Section Title (Clean Title) */}
                            <input
                              type="text"
                              value={block.sectionTitle || ''}
                              onChange={(e) => updateBlockById(block.id, { sectionTitle: e.target.value })}
                              placeholder="Heading Judul Section..."
                              className="w-full text-2xl font-bold text-[#2E2D2D] placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent"
                              style={{ textAlign: block.alignment || 'left' }}
                            />

                            {/* Paragraf Isi Section */}
                            <AutoResizeTextarea
                              value={block.textValue || ''}
                              onChange={(val) => updateBlockById(block.id, { textValue: val })}
                              placeholder="Tuliskan isi paragraf materi di sini...."
                              className="w-full text-sm text-[#2E2D2D] leading-relaxed placeholder:text-[#AAAAAA] border-none focus:ring-0 outline-none bg-transparent whitespace-pre-line"
                              style={{ textAlign: block.alignment || 'left' }}
                            />

                            {/* Integrated Highlight / Callout Box (Blue sleek card editor - Fit Content) */}
                            {block.calloutText !== undefined && (
                              <div className="py-2 px-3.5 rounded-[10px] bg-[#F6F5FF] border border-[#E8E7FF] text-[#2563EB] text-xs flex items-start gap-2.5 relative group/callout shadow-2xs w-full h-fit">
                                <div className="w-1 self-stretch bg-[#2563EB] rounded-full shrink-0 my-0.5" />
                                <div className="flex-1 min-w-0">
                                  <AutoResizeTextarea
                                    value={block.calloutText}
                                    onChange={(val) => updateBlockById(block.id, { calloutText: val })}
                                    placeholder="Tuliskan teks kalimat sorotan / highlight di sini..."
                                    className="w-full text-xs font-medium text-[#3A3985] bg-transparent border-none focus:ring-0 outline-none p-0 leading-relaxed resize-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateBlockById(block.id, { calloutText: undefined });
                                  }}
                                  title="Hapus Highlight"
                                  className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover/callout:opacity-100 transition-opacity cursor-pointer shrink-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* Integrated Section Image */}
                            {block.mediaUrl && (
                              <div className="space-y-1.5 relative group/secImg pt-1">
                                <div className="relative overflow-hidden rounded-[10px] border border-[#ECECEC] bg-gray-50">
                                  {/* eslint-disable-next-next/no-img-element */}
                                  <img
                                    src={block.mediaUrl}
                                    alt="Section illustration"
                                    className="w-full max-h-[360px] object-cover rounded-[10px]"
                                  />
                                  <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover/secImg:opacity-100 transition-opacity">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handlePromptChangeImage(block.id, block.mediaUrl);
                                      }}
                                      className="px-2.5 py-1 rounded-[6px] bg-white/95 text-[#2E2D2D] text-xs font-semibold shadow-xs hover:bg-white flex items-center gap-1 cursor-pointer"
                                    >
                                      <Pencil className="w-3 h-3" />
                                      <span>Ganti</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateBlockById(block.id, { mediaUrl: undefined, imageCaption: undefined });
                                      }}
                                      className="p-1.5 rounded-[6px] bg-white/95 text-rose-600 hover:bg-white shadow-xs cursor-pointer"
                                      title="Hapus Gambar Section"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  value={block.imageCaption || ''}
                                  onChange={(e) => updateBlockById(block.id, { imageCaption: e.target.value })}
                                  placeholder="Caption gambar (opsional)..."
                                  className="w-full text-[11px] text-[#737373] italic border-none focus:ring-0 outline-none bg-transparent p-0"
                                />
                              </div>
                            )}

                            {/* Section Quick Action Buttons (No '+' prefix) */}
                            <div className="flex items-center gap-2 pt-1">
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
                              {!block.mediaUrl && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePromptChangeImage(block.id, '');
                                  }}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-slate-100 hover:bg-slate-200 text-[#4A4A4A] text-xs font-semibold transition-colors cursor-pointer"
                                >
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Tambah Gambar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}

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
                                <div className="relative overflow-hidden rounded-[12px] border border-[#ECECEC]">
                                  {/* eslint-disable-next-next/no-img-element */}
                                  <img
                                    src={block.mediaUrl}
                                    alt="Uploaded content"
                                    className="w-full max-h-[480px] object-cover rounded-[12px]"
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
                                {block.attachments.map((fileItem) => (
                                  <div
                                    key={fileItem.id}
                                    className="p-3 rounded-[10px] bg-white border border-[#ECECEC] flex items-center justify-between hover:border-[#2563EB] transition-colors shadow-2xs"
                                  >
                                    <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                                      <div className="w-9 h-9 rounded-[8px] bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                                        <File className="w-4 h-4" />
                                      </div>
                                      <div className="truncate min-w-0">
                                        <p className="text-xs font-bold text-[#2E2D2D] truncate">{fileItem.fileName}</p>
                                        <p className="text-[11px] text-[#737373] mt-0.5">{fileItem.fileSize}</p>
                                      </div>
                                    </div>

                                    <span className="text-xs font-bold text-[#2563EB] px-3 py-1 rounded-[6px] bg-blue-50 border border-blue-100 flex items-center gap-1 shrink-0">
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
                              <span className="leading-none flex items-center">Tambah Langkah {(block.steps || []).length + 1}</span>
                            </button>
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
                      selectedBlock.attachments.map((fileItem) => (
                        <div
                          key={fileItem.id}
                          className="p-2.5 rounded-[8px] bg-white border border-[#ECECEC] flex items-center justify-between text-xs space-x-2"
                        >
                          <div className="flex items-center gap-2 truncate min-w-0">
                            <File className="w-4 h-4 text-[#2563EB] shrink-0" />
                            <div className="truncate min-w-0">
                              <p className="font-semibold text-[#2E2D2D] truncate text-xs">{fileItem.fileName}</p>
                              <p className="text-[11px] text-[#737373] mt-0.5">{fileItem.fileSize}</p>
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
                              onClick={() => handleDeleteAttachmentFile(selectedBlock.id, fileItem.id)}
                              title="Hapus File"
                              className="p-1.5 rounded-[6px] hover:bg-white text-slate-400 hover:text-rose-600 border border-transparent hover:border-[#ECECEC] cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
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
              <h2 className="text-lg sm:text-xl font-bold text-[#2E2D2D]">Konfirmasi & Publikasi Materi</h2>
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

              {/* 2. ROW: LEVEL & DURASI (CUSTOM POPOVER DROPDOWNS MATCHING PROFILE STYLE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* 3. TOPIK BAHASAN (DRIBBBLE-STYLE INLINE TAG INPUT) */}
              <div className="space-y-1.5">
                <label className="font-bold text-xs text-[#2E2D2D] block">Topik Bahasan</label>
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
                    placeholder={moduleTopics.length === 0 ? "Ketik topik bahasan lalu tekan Enter..." : "Ketik topik..."}
                    className="flex-1 min-w-[140px] text-xs text-[#2E2D2D] outline-none border-none bg-transparent p-1 placeholder:text-[#AAAAAA]"
                  />
                </div>
              </div>

              {/* 4. BAHAN EVALUASI & KUIS ATTACHMENT (FULL WHITE CARD FRAME & SINGLE PLUS ICON) */}
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
                        onClick={() => handleSwitchEvaluationType(null)}
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

            </div>

            {/* Modal Footer (Action Buttons, No Top Border Line) */}
            <div className="p-4 sm:p-5 pt-2 bg-white flex items-center justify-end gap-3 shrink-0">
              {!isAlreadyPublished && (
                <button
                  type="button"
                  onClick={() => {
                    handleSaveModuleConfirm(false);
                  }}
                  className="px-4 py-2.5 rounded-[8px] bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-[#2E2D2D] transition-colors cursor-pointer"
                >
                  Save as draft
                </button>
              )}
              {(() => {
                const isPublishEnabled = hasValidTextContent && moduleTopics.length > 0 && !isPublishing;
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
                        <span>{isAlreadyPublished ? 'Menerbitkan Ulang...' : 'Menerbitkan Materi...'}</span>
                      </>
                    ) : (
                      <span>{isAlreadyPublished ? 'Publish Ulang' : 'Publish Materi'}</span>
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
              <h3 className="font-bold text-lg text-[#2E2D2D]">Materi Berhasil Dipublikasikan!</h3>
              <p className="text-xs text-[#737373] leading-relaxed max-w-xs mx-auto">
                Materi pembelajaran ini sekarang telah aktif dan dapat diakses oleh seluruh siswa di platform Sitemsa.
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
    </div>
  );
}

export default ModuleBlockBuilder;
