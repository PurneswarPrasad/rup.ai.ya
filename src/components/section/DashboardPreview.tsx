import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import DonutChart from '@/components/ui/DonutChart'
import LineChart from '@/components/ui/LineChart'

const DashboardPreview = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* User Profile Section */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-16 h-16 ring-2 ring-blue-500">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-white">John Doe</h3>
                    <p className="text-gray-400">Financial Manager</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300 flex items-center">
                      <span className="text-blue-400 mr-2">↑</span>
                      Avg. Salary/Month
                    </span>
                    <span className="text-green-400 font-semibold">₹10,000</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300 flex items-center">
                      <span className="text-green-400 mr-2">↓</span>
                      Avg. Savings/Month
                    </span>
                    <span className="text-green-400 font-semibold">₹200</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <span className="text-gray-300 flex items-center">
                      <span className="text-red-400 mr-2">↓</span>
                      Avg. Expenses/Month
                    </span>
                    <span className="text-red-400 font-semibold">₹1800</span>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="text-white font-semibold mb-4">Savings per Month</h4>
                  <LineChart />
                </div>
              </motion.div>

              {/* Financial Overview Section */}
              <motion.div variants={itemVariants} className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-6">Financial Overview</h3>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400">Income</span>
                    <p className="text-green-400 text-2xl font-bold">₹1000</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Expenses</span>
                    <p className="text-red-400 text-2xl font-bold">₹800</p>
                  </div>
                  
                  <div>
                    <span className="text-gray-400">Savings</span>
                    <p className="text-blue-400 text-2xl font-bold">₹20</p>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <DonutChart />
                </div>

                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-400 text-sm">Wants (4%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-400 text-sm">Wants(100%)</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

export default DashboardPreview
