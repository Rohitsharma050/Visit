import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractivePreview = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay was prevented:', error);
      });
    }
  }, []);

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

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative flex justify-center items-center"
        >
          <div className="relative w-full max-w-5xl">
            <video
              ref={videoRef}
              className="w-full h-auto border border-white"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
            >
              <source src="/Assets/VisitVideo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractivePreview;
