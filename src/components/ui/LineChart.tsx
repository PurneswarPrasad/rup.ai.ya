import { motion } from 'framer-motion'

const LineChart = () => {
  const data = [
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 5 },
    { month: 'Mar', value: 15 },
    { month: 'Apr', value: 45 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 75 },
    { month: 'Jul', value: 25 },
    { month: 'Aug', value: 10 },
    { month: 'Sep', value: 5 },
    { month: 'Oct', value: 0 },
    { month: 'Nov', value: 0 },
    { month: 'Dec', value: 0 }
  ]

  const maxValue = Math.max(...data.map(d => d.value))
  const width = 300
  const height = 120
  const padding = 20

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding
    const y = height - (point.value / maxValue) * (height - padding * 2) - padding
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  return (
    <div className="bg-slate-700/30 rounded-lg p-4">
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {[0, 20, 40, 60, 80].map((value) => (
          <line
            key={value}
            x1={padding}
            y1={height - (value / maxValue) * (height - padding * 2) - padding}
            x2={width - padding}
            y2={height - (value / maxValue) * (height - padding * 2) - padding}
            stroke="#374151"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
        
        {/* Area under curve */}
        <motion.path
          d={`${pathData} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathData}
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Month labels */}
      <div className="flex justify-between mt-2 px-2">
        {data.slice(0, 6).map((point) => (
          <span key={point.month} className="text-xs text-gray-400">
            {point.month}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LineChart
