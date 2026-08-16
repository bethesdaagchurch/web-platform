'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function HeroBackground({
  backgroundImage,
  backgroundVideo,
  backgroundVideoWebm,
}: {
  backgroundImage: string
  backgroundVideo?: string
  backgroundVideoWebm?: string
}) {
  // Defaults to false (image) for the server-rendered/first-paint state —
  // there's no window to check the media query yet, and defaulting to
  // "show video" would mean a flash of motion for reduced-motion users
  // before JS has a chance to correct it. A brief image-then-video swap
  // for everyone else is the safer trade-off.
  const [canPlayVideo, setCanPlayVideo] = useState(false)

  useEffect(() => {
    if (!backgroundVideo && !backgroundVideoWebm) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setCanPlayVideo(!query.matches)
  }, [backgroundVideo, backgroundVideoWebm])

  if ((backgroundVideo || backgroundVideoWebm) && canPlayVideo) {
    return (
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={backgroundImage}
        className="absolute inset-0 h-full w-full object-cover"
      >
        {/* WebM listed first — browsers use the first source they
            support, and WebM (VP9) is typically smaller than H.264 at
            equivalent quality. Every browser that doesn't support WebM
            falls through to the MP4 automatically. */}
        {backgroundVideoWebm && <source src={backgroundVideoWebm} type="video/webm" />}
        {backgroundVideo && <source src={backgroundVideo} type="video/mp4" />}
      </video>
    )
  }

  return <Image src={backgroundImage} alt="" fill priority className="object-cover" />
}
