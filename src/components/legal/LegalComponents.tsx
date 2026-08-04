export function Section({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="flex items-baseline gap-2 text-lg font-extrabold text-ink-900">
        <span className="text-brand-600">{number}</span>
        {title}
      </h2>
      <div className="mt-2.5 space-y-3">{children}</div>
    </section>
  )
}

export function SubList({ items }: { items: string[] }) {
  return (
    <ul className="ml-1 list-disc space-y-1.5 pl-4 marker:text-brand-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}

export function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-900">
      {children}
    </div>
  )
}

export function PolicyTable({
  rows,
}: {
  rows: { tier: string; refund: string; note: string }[]
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-black/5">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-400">
            <th className="px-4 py-2.5">Notice before start date</th>
            <th className="px-4 py-2.5">Refund</th>
            <th className="px-4 py-2.5">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-black/5">
              <td className="px-4 py-2.5 font-semibold text-ink-900">{row.tier}</td>
              <td className="px-4 py-2.5 font-bold text-brand-600">{row.refund}</td>
              <td className="px-4 py-2.5 text-gray-500">{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
