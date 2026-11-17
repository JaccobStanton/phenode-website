/**
 * Compact specification table — mono values, hairline rules. Pass `rows`, or `groups` ([{ title, rows }]) for one
 * table split by sensor, each group under its own header row (so the same measurement can appear under two sensors).
 */
export default function SpecTable({ title, rows, groups, className = '' }) {
  const sets = groups || [{ title: null, rows }]
  return (
    <div className={className}>
      {title && <p className="eyebrow mb-3">{title}</p>}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b hairline font-mono text-[10.5px] tracking-[0.14em] uppercase opacity-60"><th className="py-2 pr-4 font-normal">Measurement</th><th className="py-2 pr-4 font-normal">Range</th><th className="py-2 font-normal">Accuracy</th></tr>
        </thead>
        {sets.map((g) => (
          <tbody key={g.title || 'rows'}>
            {g.title && <tr className="border-b hairline"><th colSpan={3} scope="rowgroup" className="pb-2 pt-7 font-mono text-[11px] font-normal tracking-[0.14em] uppercase">{g.title}</th></tr>}
            {g.rows.map((r) => (
              <tr key={r.name} className="border-b hairline align-top">
                <td className="py-3 pr-4 text-[14.5px] font-medium">{r.name}</td>
                <td className="py-3 pr-4 font-mono text-[12.5px] opacity-80">{r.range}</td>
                <td className="py-3 font-mono text-[12.5px] opacity-80">{r.accuracy}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  )
}
