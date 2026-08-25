'use client';

import React from 'react';

const AVATAR_BG_COLORS = [
  'bg-blue-600',
  'bg-indigo-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-teal-600',
  'bg-rose-600',
  'bg-amber-600',
  'bg-cyan-700',
  'bg-purple-600',
  'bg-pink-600',
];

export function getInitials(name: string): string {
  if (!name || typeof name !== 'string') return 'S';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'S';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarBgColor(name: string): string {
  if (!name) return AVATAR_BG_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
  return AVATAR_BG_COLORS[index];
}

interface InitialsAvatarProps {
  name: string;
  avatar?: string | null;
  sizeClass?: string; // e.g. "w-9 h-9"
  textSizeClass?: string; // e.g. "text-xs"
  className?: string;
}

export function InitialsAvatar({
  name,
  avatar,
  sizeClass = 'w-9 h-9',
  textSizeClass = 'text-xs',
  className = '',
}: InitialsAvatarProps) {
  const isCustomImage = Boolean(
    avatar &&
    !avatar.includes('pravatar.cc') &&
    !avatar.includes('dummy') &&
    (avatar.startsWith('http') || avatar.startsWith('/') || avatar.startsWith('data:'))
  );

  if (isCustomImage && avatar) {
    return (
      <div className={`relative rounded-full overflow-hidden shrink-0 ${sizeClass} ${className}`}>
        {/* eslint-disable-next-next/no-img-element */}
        <img
          src={avatar}
          alt={name || 'Avatar'}
          className="object-cover w-full h-full rounded-full"
        />
      </div>
    );
  }

  const initials = getInitials(name || 'Siswa');
  const bgClass = getAvatarBgColor(name || 'Siswa');

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none shadow-xs ${bgClass} ${sizeClass} ${textSizeClass} ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
}
