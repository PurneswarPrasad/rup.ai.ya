import { motion } from 'framer-motion'

const TestimonialSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.blockquote
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-light text-gray-300 leading-relaxed mb-8"
        >
          "The best app for managing personal finances.{' '}
          <br className="hidden md:block" />
          Simple yet powerful"
        </motion.blockquote>
        
        <motion.cite
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-xl text-blue-400 font-medium"
        >
          Simran P.
        </motion.cite>
      </div>
    </section>
  )
}

export default TestimonialSection
