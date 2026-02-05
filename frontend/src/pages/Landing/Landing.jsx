import Navbar from './Navbar';
import HeroSection from './HeroSection';
import ConceptVisualization from './ConceptVisualization';
import InteractivePreview from './InteractivePreview';
import PhilosophySection from './PhilosophySection';
import FeatureStrip from './FeatureStrip';
import CTAFooter from './CTAFooter';

const Landing = () => {
  return (
    <div className="bg-black overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ConceptVisualization />
      <InteractivePreview />
      <PhilosophySection />
      <FeatureStrip />
      <CTAFooter />
    </div>
  );
};

export default Landing;
