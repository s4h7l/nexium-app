export function BookArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px] text-primary" aria-hidden="true">
      <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full" fill="none" stroke="currentColor">
        <g className="orbit-spin" opacity="0.35">
          <ellipse cx="160" cy="165" rx="140" ry="52" strokeWidth="1" transform="rotate(-14 160 165)" />
        </g>
        <ellipse cx="160" cy="165" rx="118" ry="118" strokeWidth="0.8" strokeDasharray="2 6" opacity="0.35" />
        <g className="float-slow">
          {/* book */}
          <path d="M160 128 C 130 112, 95 110, 70 118 L 70 208 C 95 200, 130 202, 160 218 Z" strokeWidth="1.4" fill="var(--color-card)" />
          <path d="M160 128 C 190 112, 225 110, 250 118 L 250 208 C 225 200, 190 202, 160 218 Z" strokeWidth="1.4" fill="var(--color-card)" />
          <path d="M160 128 L160 218" strokeWidth="1.2" />
          <path d="M66 124 L66 214 C 95 206, 130 208, 160 224 C 190 208, 225 206, 254 214 L254 124" strokeWidth="1" opacity="0.6" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i} strokeWidth="0.8" opacity="0.45">
              <path d={`M84 ${138 + i * 13} C 105 ${133 + i * 13}, 128 ${134 + i * 13}, 146 ${141 + i * 13}`} />
              <path d={`M174 ${141 + i * 13} C 192 ${134 + i * 13}, 215 ${133 + i * 13}, 236 ${138 + i * 13}`} />
            </g>
          ))}
          <circle cx="160" cy="96" r="3" fill="var(--color-sage)" stroke="none" />
          <path d="M160 82 L160 72 M150 88 L143 81 M170 88 L177 81" strokeWidth="1" opacity="0.6" />
        </g>
        <circle cx="38" cy="140" r="3" fill="var(--color-sage)" stroke="none" />
        <circle cx="285" cy="198" r="2.5" fill="var(--color-sage)" stroke="none" />
      </svg>
      {[
        { t: "π", c: "left-[6%] top-[18%]", d: "0s" },
        { t: "</>", c: "right-[4%] top-[26%]", d: "1.2s" },
        { t: "x²", c: "left-[12%] bottom-[16%]", d: "2.1s" },
        { t: "Σ", c: "right-[14%] bottom-[10%]", d: "0.6s" },
      ].map((tile) => (
        <span
          key={tile.t}
          className={`float-slow absolute ${tile.c} rounded-md border border-border bg-card px-2 py-1 font-mono text-xs text-primary shadow-sm`}
          style={{ animationDelay: tile.d }}
        >
          {tile.t}
        </span>
      ))}
    </div>
  );
}
