import { motion } from 'framer-motion'

const DonutChart = () => {
  const radius = 60
  const strokeWidth = 12
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  
  // 96% for needs (blue), 4% for wants (red)
  const needsPercentage = 96
  const wantsPercentage = 4
  
  const needsStrokeDasharray = `${(needsPercentage / 100) * circumference} ${circumference}`
  const wantsStrokeDasharray = `${(wantsPercentage / 100) * circumference} ${circumference}`
  const wantsStrokeDashoffset = -((needsPercentage / 100) * circumference)

  return (
    <div className="relative w-32 h-32">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="#374151"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Needs arc (blue) */}
        <motion.circle
          stroke="#3B82F6"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={needsStrokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: needsStrokeDasharray }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Wants arc (red) */}
        <motion.circle
          stroke="#EF4444"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={wantsStrokeDasharray}
          strokeDashoffset={wantsStrokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: wantsStrokeDasharray }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        />
      </svg>
      
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">0%</span>
        <span className="text-sm text-gray-400">Needs</span>
      </div>
    </div>
  )
}

export default DonutChart
