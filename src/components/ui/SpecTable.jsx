/** Compact specification table — mono values, hairline rules. */
export default function SpecTable({ title, rows, className = '' }) {
  return (
    <div className={className}>
      {title && <p className="eyebrow mb-3">{title}</p>}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b hairline font-mono text-[10.5px] tracking-[0.14em] uppercase opacity-60"><th className="py-2 pr-4 font-normal">Measurement</th><th className="py-2 pr-4 font-normal">Range</th><th className="py-2 font-normal">Accuracy</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b hairline align-top">
              <td className="py-3 pr-4 text-[14.5px] font-medium">{r.name}</td>
              <td className="py-3 pr-4 font-mono text-[12.5px] opacity-80">{r.range}</td>
              <td className="py-3 font-mono text-[12.5px] opacity-80">{r.accuracy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
