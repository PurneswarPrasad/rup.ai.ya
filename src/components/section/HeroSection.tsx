import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Logo from '@/components/ui/Logo'

const HeroSection = () => {
  const navigate = useNavigate()

  const handleGoogleAuth = () => {
    // For development, you can temporarily navigate directly to dashboard
    // navigate('/dashboard')
    
    // For production, use actual Google OAuth
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/auth/callback`
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&response_type=code&access_type=offline`
    
    window.location.href = googleAuthUrl
  }

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
          onClick={handleGoogleAuth}
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
