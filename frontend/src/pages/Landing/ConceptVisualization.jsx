import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ConceptVisualization = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const nodes = document.querySelectorAll('.concept-node');

    nodes.forEach((node, index) => {
      gsap.fromTo(
        node,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: node,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Animate connecting lines
    const lines = document.querySelectorAll('.concept-line');
    lines.forEach((line, index) => {
      gsap.fromTo(
        line,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          delay: index * 0.2 + 0.3,
          scrollTrigger: {
            trigger: line,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  const concepts = [
    { title: 'Subject', description: 'Create organized topics' },
    { title: 'Questions', description: 'Store what matters' },
    { title: 'Answers', description: 'Build understanding' },
    { title: 'Mastery', description: 'Achieve excellence' },
  ];

  return (
    <motion.section
      ref={sectionRef}
      style={{ opacity }}
      id="product"
      className="min-h-screen bg-black py-32 px-6 lg:px-8 flex items-center"
    >
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-20 tracking-tight"
        >
          How it works
        </motion.h2>

        {/* Horizontal Flow */}
        <div className="relative">
          {/* Concept Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {concepts.map((concept, index) => (
              <div key={index} className="relative">
                {/* Node */}
                <div className="concept-node">
                  <div className="relative group">
                    {/* Number */}
                    <div className="text-8xl font-black text-white/5 mb-4">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <div className="border-2 border-white/20 rounded-2xl p-8 bg-black hover:border-white/40 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                      <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                        {concept.title}
                      </h3>
                      <p className="text-gray-400 text-sm font-light">
                        {concept.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting Arrow (except last) */}
                {index < concepts.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <div className="concept-line origin-left">
                      <svg
                        width="30"
                        height="2"
                        viewBox="0 0 30 2"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 1H30"
                          stroke="white"
                          strokeOpacity="0.3"
                          strokeWidth="2"
                        />
                      </svg>
                      <div className="absolute -right-1 -top-1.5 w-0 h-0 border-l-8 border-l-white/30 border-t-4 border-t-transparent border-b-4 border-b-transparent" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ConceptVisualization;
