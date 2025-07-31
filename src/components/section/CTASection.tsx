import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const CTASection = () => {
  const navigate = useNavigate()

  const handleGoogleSignUp = () => {
    // For development, you can temporarily navigate directly to dashboard
    // navigate('/dashboard')
    
    // For production, use actual Google OAuth
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'
    const redirectUri = import.meta.env.DEV
    ? 'http://localhost:8080/auth/callback'
    : import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    // const redirectUri = import.meta.env.VITE_REDIRECT_URI || `${window.location.origin}/auth/callback`
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&response_type=code&access_type=offline`
    
    window.location.href = googleAuthUrl
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Button 
            onClick={handleGoogleSignUp}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Start Tracking Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection
