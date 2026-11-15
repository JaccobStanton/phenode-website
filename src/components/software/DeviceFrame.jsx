/**
 * CSS device frames — restrained, original (no vendor mockups). `kind`: monitor | laptop | tablet | phone.
 * Children render inside the screen area. `aspect` overrides the monitor or phone screen ratio (e.g. real screenshots).
 */
export default function DeviceFrame({ kind = 'monitor', children, className = '', style, aspect }) {
  if (kind === 'monitor') {
    return (
      <div className={`flex flex-col items-center ${className}`} style={style}>
        <div className="relative w-full rounded-[10px] border border-[#2b2f33] bg-[#111316] p-[10px] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-[4px] bg-black" style={aspect ? { aspectRatio: aspect } : undefined}>{children}</div>
        </div>
        <div className="h-10 w-[10%] bg-gradient-to-b from-[#2a2e32] to-[#15181b]" />
        <div className="h-2 w-[32%] rounded-full bg-[#1c1f22]" />
      </div>
    )
  }
  if (kind === 'laptop') {
    return (
      <div className={`flex flex-col items-center ${className}`} style={style}>
        <div className="relative w-[86%] rounded-t-[12px] border border-[#2b2f33] bg-[#111316] p-[8px] pb-0 shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-[3px] bg-black">{children}</div>
        </div>
        <div className="relative h-3 w-full rounded-b-[8px] bg-gradient-to-b from-[#3a3f44] to-[#1c1f22]"><div className="absolute left-1/2 top-0 h-1 w-[12%] -translate-x-1/2 rounded-b bg-[#0f1113]" /></div>
      </div>
    )
  }
  if (kind === 'tablet') {
    return (
      <div className={`relative rounded-[18px] border border-[#2b2f33] bg-[#111316] p-[12px] shadow-[0_30px_60px_rgba(0,0,0,0.45)] ${className}`} style={style}>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-black">{children}</div>
      </div>
    )
  }
  return (
    <div className={`relative rounded-[28px] border border-[#2b2f33] bg-[#111316] p-[8px] shadow-[0_30px_60px_rgba(0,0,0,0.45)] ${className}`} style={style}>
      <div className="absolute left-1/2 top-[14px] z-10 h-[6px] w-[36%] -translate-x-1/2 rounded-full bg-[#0b0d0f]" />
      <div className="aspect-[9/19] w-full overflow-hidden rounded-[20px] bg-black" style={aspect ? { aspectRatio: aspect } : undefined}>{children}</div>
    </div>
  )
}
