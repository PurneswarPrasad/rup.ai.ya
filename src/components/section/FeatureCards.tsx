import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Target 
} from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Track Expenses',
    description: 'Monitor your spending habits',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Target,
    title: 'Smart Needs vs Wants',
    description: 'Andy zs essential vs. honessencial',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: TrendingUp,
    title: 'Investment Summary',
    description: 'View all your lily - menns in one place',
    color: 'from-purple-500 to-violet-500'
  },
  {
    icon: PieChart,
    title: 'Graph Insights',
    description: 'Visualize your financial data',
    color: 'from-orange-500 to-red-500'
  }
]

const FeatureCards = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6 text-center hover:bg-slate-700/50 transition-all duration-300 group cursor-pointer">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureCards
