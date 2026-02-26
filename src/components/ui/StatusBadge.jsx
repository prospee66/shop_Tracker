const styles = {
  'In Stock':    'bg-green-100  text-green-700',
  'Low':         'bg-amber-100  text-amber-700',
  'Out of Stock':'bg-red-100    text-red-700',
  'momo':        'bg-amber-100  text-amber-700',
  'cash':        'bg-green-100  text-green-700',
  'admin':       'bg-purple-100 text-purple-700',
  'staff':       'bg-blue-100   text-blue-700',
}

export default function StatusBadge({ value, labelMap }) {
  const label = labelMap?.[value] ?? value
  const cls   = styles[value] ?? 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {label}
    </span>
  )
}
