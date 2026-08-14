// Ported from a provided SMIL SVG animation (radiating rays + pulsing glow
// + a central cross), converted to valid JSX and re-colored to match the
// site's actual brand-navy token (#0D3B66) instead of the original's
// off-brand #1e5aa8. Kept as pure SMIL <animate>/<animateTransform> rather
// than rewriting as CSS keyframes — it's supported in every modern browser
// and this is a faithful, minimal port, not a rebuild.
export function CrossSpinner({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="cross-spinner-glow" cx="50%" cy="50%" fx="50%" fy="50%" r="50%">
          <stop offset="0%" stopColor="#0D3B66" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0D3B66" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Pulsing halo/glow */}
      <circle cx="50" cy="50" r="35" fill="url(#cross-spinner-glow)">
        <animate attributeName="r" values="30;40;30" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Radiating light rays, slowly rotating as a group */}
      <g transform="translate(50 50)">
        <g className="stroke-brand-navy">
          <line x1="0" y1="-25" x2="0" y2="-45" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="0s" repeatCount="indefinite" />
          </line>
          <line x1="17.7" y1="-17.7" x2="31.8" y2="-31.8" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="0.25s" repeatCount="indefinite" />
          </line>
          <line x1="25" y1="0" x2="45" y2="0" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </line>
          <line x1="17.7" y1="17.7" x2="31.8" y2="31.8" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="0.75s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="25" x2="0" y2="45" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="1s" repeatCount="indefinite" />
          </line>
          <line x1="-17.7" y1="17.7" x2="-31.8" y2="31.8" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="1.25s" repeatCount="indefinite" />
          </line>
          <line x1="-25" y1="0" x2="-45" y2="0" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="1.5s" repeatCount="indefinite" />
          </line>
          <line x1="-17.7" y1="-17.7" x2="-31.8" y2="-31.8" opacity="0.3" strokeWidth="2" strokeLinecap="round">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="2s" begin="1.75s" repeatCount="indefinite" />
          </line>
        </g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 0 0"
          to="360 0 0"
          dur="12s"
          repeatCount="indefinite"
          additive="sum"
        />
      </g>

      {/* Central cross */}
      <g className="stroke-brand-navy" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="35" x2="50" y2="65">
          <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="40" y1="45" x2="60" y2="45">
          <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </line>
      </g>
    </svg>
  )
}
