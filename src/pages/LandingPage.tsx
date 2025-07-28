import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '../components/section/HeroSection'
// import DashboardPreview from '../components/section/DashboardPreview'
import ScrollDashboardPreview from '../components/section/ScrollDashboardPreview'
import TestimonialSection from '../components/section/TestimonialSection'
import CTASection from '../components/section/CTASection'
import LoadingSpinner from '../components/ui/LoadingSpinner'

// Lazy load feature sections for better performance
const FeatureCards = lazy(() => import('../components/section/FeatureCards'))

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <HeroSection />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <ScrollDashboardPreview />
        </motion.div>

        <Suspense fallback={<LoadingSpinner />}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <FeatureCards />
          </motion.div>
        </Suspense>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <TestimonialSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <CTASection />
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LandingPage
