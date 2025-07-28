import { motion } from 'framer-motion'

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-24 h-24 mx-auto"
    >
      <div className="w-24 h-24 relative">
        {/* Rupee Symbol with your custom image */}
        <div className="w-full h-full relative rounded-full bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-green-500/20 backdrop-blur-sm border border-blue-400/30 overflow-hidden">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/7616/7616935.png"
            alt="Rup.ai.ya Logo"
            className="w-full h-full object-contain p-2 filter drop-shadow-lg"
            style={{ 
              filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))' 
            }}
          />
        </div>
        
        {/* Animated glow effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-green-500/30 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Outer ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400/50"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>
    </motion.div>
  )
}

export default Logo
