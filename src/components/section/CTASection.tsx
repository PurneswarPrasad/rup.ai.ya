import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {startGoogleLogin} from '@/lib/utils'

const CTASection = () => {
  
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
            onClick={startGoogleLogin}
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
