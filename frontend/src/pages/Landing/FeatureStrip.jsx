import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeatureStrip = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    // Infinite marquee scroll
    gsap.to(marquee, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: 'linear',
    });
  }, []);

  const features = [
    { keyword: 'Organize', description: 'Structure your knowledge base' },
    { keyword: 'Track', description: 'Monitor your progress' },
    { keyword: 'Revise', description: 'Master through repetition' },
    { keyword: 'Master', description: 'Achieve excellence' },
  ];

  const marqueeWords = ['Organize', 'Track', 'Revise', 'Master', 'Learn', 'Excel', 'Grow'];

  return (
    <section id="features" className="bg-black py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-20 tracking-tight"
        >
          What you get
        </motion.h2>

        {/* Vertical Timeline */}
        <div className="space-y-12 mb-32">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative pl-12 md:pl-24 border-l-2 border-white/10"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white rounded-full" />

              {/* Content */}
              <div className="group cursor-default">
                <h3 className="text-5xl md:text-7xl font-black text-white mb-3 tracking-tight group-hover:text-gray-300 transition-colors">
                  {feature.keyword}
                </h3>
                <p className="text-lg text-gray-500 font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Infinite Marquee */}
        <div className="relative overflow-hidden py-12 border-y border-white/10">
          <div
            ref={marqueeRef}
            className="flex whitespace-nowrap"
          >
            {/* Duplicate words for seamless loop */}
            {[...marqueeWords, ...marqueeWords].map((word, index) => (
              <span
                key={index}
                className="text-6xl md:text-8xl font-black text-white/5 mx-8 inline-block"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureStrip;
