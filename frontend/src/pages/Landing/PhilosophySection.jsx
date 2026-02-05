import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PhilosophySection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      className="min-h-screen bg-black py-32 px-6 lg:px-8 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          style={{ y, opacity }}
          className="text-center"
        >
          {/* Large Quote */}
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            {/* Opening Quote Mark */}
            <div className="text-white/10 text-[12rem] md:text-[18rem] font-black leading-none absolute -top-20 left-0">
              "
            </div>

            {/* Quote Text */}
            <p className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight relative z-10 py-12">
              Your knowledge
              <br />
              deserves
              <br />
              <span className="text-gray-400">structure</span>
            </p>

            {/* Closing Quote Mark */}
            <div className="text-white/10 text-[12rem] md:text-[18rem] font-black leading-none absolute -bottom-20 right-0">
              "
            </div>
          </motion.blockquote>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-500 font-light mt-16 max-w-2xl mx-auto"
          >
            Transform scattered thoughts into organized mastery.
            <br />
            One question at a time.
          </motion.p>

          {/* Decorative Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="w-32 h-px bg-white/20 mx-auto mt-12"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PhilosophySection;
