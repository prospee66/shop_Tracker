const cardGradient = {
  blue:   'from-blue-500 to-blue-700',
  green:  'from-green-500 to-emerald-600',
  amber:  'from-amber-400 to-orange-500',
  purple: 'from-violet-500 to-purple-700',
  red:    'from-red-500 to-red-700',
}

const shadowColor = {
  blue:   'shadow-blue-200',
  green:  'shadow-green-200',
  amber:  'shadow-orange-200',
  purple: 'shadow-violet-200',
  red:    'shadow-red-200',
}

export default function StatCard({ label, value, sub, icon: Icon, color = 'green', trend }) {
  return (
    <div className={`bg-gradient-to-br ${cardGradient[color]} rounded-xl shadow-md ${shadowColor[color]} p-4 flex gap-3 items-start`}>
      {/* Icon circle — frosted white */}
      <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
        <Icon size={20} className="text-white" />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-white/70 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-extrabold text-white mt-1 leading-none">{value}</p>
        <p className="text-xs text-white/60 mt-1.5">{sub}</p>
        {trend && (
          <p className="text-xs font-semibold mt-1.5 flex items-center gap-1 text-white/80">
            {trend.dir === 'up' ? '↑' : trend.dir === 'down' ? '↓' : '—'}
            {trend.pct !== null ? `${trend.pct}% vs yesterday` : 'No data'}
          </p>
        )}
      </div>
    </div>
  )
}
