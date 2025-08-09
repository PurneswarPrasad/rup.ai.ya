import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/Logo'
import {startGoogleLogin} from '@/lib/utils'

const HeroSection = () => {

  return (
    <section className="relative py-20 px-6">
      {/* Header with Login Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-6 right-6"
      >
        <Button 
          onClick={startGoogleLogin}
          variant="outline"
          className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300"
        >
          Sign Up / Login
        </Button>
      </motion.div>

      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Logo />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
        >
          <span className="relative">
            Rup
            <span className="relative inline-block mx-1">
              <span className="relative z-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent font-extrabold animate-pulse">
                .ai
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 blur-lg rounded-lg transform scale-110"></span>
            </span>
            .ya
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide"
        >
          Simplicity in Spending
        </motion.p>
      </div>
    </section>
  )
}

export default HeroSection
