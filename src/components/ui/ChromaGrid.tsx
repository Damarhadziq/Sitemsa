import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './ChromaGrid.css';

export interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor?: string;
  gradient?: string;
  url?: string;
  location?: string;
}

interface ChromaGridProps {
  items: ChromaItem[];
  className?: string;
  radius?: number;
  columns?: number;
  rows?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
}

export const ChromaGrid = ({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out'
}: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((value: number | string) => void) | null>(null);
  const setY = useRef<((value: number | string) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  const data = items;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px') as (value: number | string) => void;
    setY.current = gsap.quickSetter(el, '--y', 'px') as (value: number | string) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current?.(pos.current.x);
    setY.current?.(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!rootRef.current) return;
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: fadeOut,
      overwrite: true
    });
  };

  const handleCardClick = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        '--r': `${radius}px`,
        '--cols': columns,
        '--rows': rows
      } as React.CSSProperties}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {/* SVG Definitions for Abstract Organic Morphing Blob Mask */}
      <svg className="chroma-svg-defs" aria-hidden="true">
        <defs>
          <filter id="chroma-blob-feather" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="35" />
          </filter>

          {/* Reveal Mask (White background with Black organic morphing blob in center) */}
          <mask id="chroma-reveal-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="white" />
            <g className="chroma-blob-group">
              <path className="chroma-organic-blob" fill="black" filter="url(#chroma-blob-feather)">
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M 0 -220 C 140 -250, 250 -130, 220 0 C 190 140, 130 240, 0 210 C -140 190, -240 120, -210 0 C -190 -140, -130 -210, 0 -220 Z;
                    M 25 -200 C 175 -230, 230 -75, 255 35 C 215 175, 105 255, -25 235 C -165 215, -255 95, -215 -35 C -225 -165, -95 -225, 25 -200 Z;
                    M -30 -240 C 105 -215, 265 -145, 215 -25 C 235 145, 145 215, -35 235 C -135 255, -225 165, -245 -25 C -255 -125, -145 -215, -30 -240 Z;
                    M 15 -210 C 155 -265, 235 -95, 215 20 C 225 140, 155 225, 15 210 C -135 200, -215 150, -225 -20 C -235 -140, -115 -210, 15 -210 Z;
                    M 0 -220 C 140 -250, 250 -130, 220 0 C 190 140, 130 240, 0 210 C -140 190, -240 120, -210 0 C -190 -140, -130 -210, 0 -220 Z
                  "
                />
              </path>
            </g>
          </mask>

          {/* Fade Mask (Black background with White organic morphing blob in center) */}
          <mask id="chroma-fade-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="black" />
            <g className="chroma-blob-group">
              <path className="chroma-organic-blob" fill="white" filter="url(#chroma-blob-feather)">
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M 0 -220 C 140 -250, 250 -130, 220 0 C 190 140, 130 240, 0 210 C -140 190, -240 120, -210 0 C -190 -140, -130 -210, 0 -220 Z;
                    M 25 -200 C 175 -230, 230 -75, 255 35 C 215 175, 105 255, -25 235 C -165 215, -255 95, -215 -35 C -225 -165, -95 -225, 25 -200 Z;
                    M -30 -240 C 105 -215, 265 -145, 215 -25 C 235 145, 145 215, -35 235 C -135 255, -225 165, -245 -25 C -255 -125, -145 -215, -30 -240 Z;
                    M 15 -210 C 155 -265, 235 -95, 215 20 C 225 140, 155 225, 15 210 C -135 200, -215 150, -225 -20 C -235 -140, -115 -210, 15 -210 Z;
                    M 0 -220 C 140 -250, 250 -130, 220 0 C 190 140, 130 240, 0 210 C -140 190, -240 120, -210 0 C -190 -140, -130 -210, 0 -220 Z
                  "
                />
              </path>
            </g>
          </mask>
        </defs>
      </svg>

      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c.url)}
          style={{
            '--card-border': c.borderColor || '#ECECEC',
            '--card-bg': '#ffffff',
            cursor: c.url ? 'pointer' : 'default'
          } as React.CSSProperties}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      <div className="chroma-overlay" />
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  );
};

export default ChromaGrid;
