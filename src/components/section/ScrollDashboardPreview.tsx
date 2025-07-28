import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Calendar,
} from "lucide-react";

const ScrollDashboardPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Transform scroll progress to control which section is visible
  const section1Opacity = useTransform(
    scrollYProgress,
    [0.0, 0.15, 0.28],
    [1, 1, 0]
  );
  const section2Opacity = useTransform(
    scrollYProgress,
    [0.18, 0.33, 0.48],
    [0, 1, 0]
  );
  const section3Opacity = useTransform(
    scrollYProgress,
    [0.38, 0.53, 0.68],
    [0, 1, 0]
  );
  const section4Opacity = useTransform(
    scrollYProgress,
    [0.58, 0.73, 0.88],
    [0, 1, 0]
  );
  const section5Opacity = useTransform(
    scrollYProgress,
    [0.78, 0.93, 1.0],
    [0, 1, 1]
  );

  const section1Y = useTransform(scrollYProgress, [0.0, 0.28], [0, -200]);
  const section2Y = useTransform(scrollYProgress, [0.18, 0.48], [200, -200]);
  const section3Y = useTransform(scrollYProgress, [0.38, 0.68], [200, -200]);
  const section4Y = useTransform(scrollYProgress, [0.58, 0.88], [200, -200]);
  const section5Y = useTransform(scrollYProgress, [0.78, 1.0], [200, 0]);

  return (
    <section ref={containerRef} className="py-32 px-6 relative h-[600vh]">
      <div className="sticky top-20 max-w-6xl mx-auto h-[80vh] flex items-center justify-center">
        {/* Section 1: User Profile */}
        <motion.div
          style={{ opacity: section1Opacity, y: section1Y }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm p-0 w-full max-w-xl">
            <img
              src="../../../images/user_profile.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </Card>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }} // delay matches card's transition duration
            className="text-xl text-white-400 font-medium mt-4 italic font-mono tracking-wider"
          >
            Your money journey starts here! 💰
          </motion.span>
        </motion.div>

        {/* Section 2: Financial Overview */}
        <motion.div
          style={{ opacity: section2Opacity, y: section2Y }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm p-0 w-full max-w-2xl">
            <img
              src="../../../images/fin_preview.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </Card>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl text-white-400 font-medium mt-4 font-mono tracking-wider"
          >
            Only 3 numbers that tell your whole story 📊
          </motion.span>
        </motion.div>

        {/* Section 3: Wants vs Needs Chart */}
        <motion.div
          style={{ opacity: section3Opacity, y: section3Y }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm p-0 w-full max-w-xl">
            <img
              src="../../../images/savings graph.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </Card>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }} // delay matches card's transition duration
            className="text-xl text-white-400 font-medium mt-4 italic font-mono tracking-wider"
          >
            The reality check you didn't know you needed! 🤔
          </motion.span>
        </motion.div>

        {/* Section 4: Savings Chart */}
        <motion.div
          style={{ opacity: section4Opacity, y: section4Y }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm p-0 w-full max-w-md">
            <img
              src="../../../images/wants_vs_needs_piechart.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </Card>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }} // delay matches card's transition duration
            className="text-xl text-white-400 font-medium mt-4 italic font-mono tracking-wider"
          >
            Peaks and valleys - every saving journey has its story! 📈
          </motion.span>
        </motion.div>

        {/* Section 5: Total Investments */}
        <motion.div
          style={{ opacity: section5Opacity, y: section5Y }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <Card className="bg-slate-800/90 border-slate-700 backdrop-blur-sm p-0 w-full max-w-2xl">
            <img
              src="../../../images/investments.png"
              alt=""
              className="w-full h-full object-cover"
            />
          </Card>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 1, delay: 0.5 }} // delay matches card's transition duration
            className="text-xl text-white-400 font-medium mt-4 italic font-mono tracking-wider"
          >
            Diversify like a pro - your future self will thank you! 🚀
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollDashboardPreview;
