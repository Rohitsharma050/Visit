import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractivePreview = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const fullText = 'What is the Pythagorean theorem?';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          currentIndex = 0;
          setTypedText('');
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setRotation({
      x: (y / rect.height) * 20,
      y: (x / rect.width) * 20,
    });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <section className="min-h-screen bg-black py-32 px-6 lg:px-8 flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-20 tracking-tight"
        >
          Experience it
        </motion.h2>

        {/* Interactive Preview Window */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex justify-center items-center"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{
              rotateX: rotation.x,
              rotateY: rotation.y,
              transformStyle: 'preserve-3d',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-full max-w-4xl"
          >
            {/* Glassmorphic Container */}
            <div className="relative backdrop-blur-xl bg-white/5 border-2 border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Window Controls */}
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
                <div className="w-3 h-3 rounded-full bg-white/20" />
              </div>

              {/* Editor Interface */}
              <div className="space-y-6">
                {/* Subject Header */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">Mathematics</div>
                    <div className="text-gray-400 text-xs">42 questions</div>
                  </div>
                </div>

                {/* Question Input with Typing Animation */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                  <div className="text-gray-500 text-xs mb-2">Question</div>
                  <div className="text-white text-xl font-light min-h-[2rem]">
                    {typedText}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-6 bg-white ml-1"
                    />
                  </div>
                </div>

                {/* Answer Preview */}
                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                  <div className="text-gray-500 text-xs mb-2">Answer</div>
                  <div className="text-gray-400 text-sm leading-relaxed">
                    a² + b² = c²
                    <br />
                    <span className="text-gray-500 text-xs">
                      In a right triangle, the square of the hypotenuse...
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                      Medium
                    </span>
                    <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                      Geometry
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-2 bg-white text-black rounded-lg text-sm font-semibold"
                  >
                    Save
                  </motion.button>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent blur-3xl" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractivePreview;
