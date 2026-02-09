import { motion } from 'framer-motion';

/**
 * Skeleton pulse animation
 */
const pulseAnimation = {
  initial: { opacity: 0.4 },
  animate: { 
    opacity: [0.4, 0.7, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

/**
 * Base skeleton block
 */
export const SkeletonBlock = ({ className = '', width, height }) => (
  <motion.div
    {...pulseAnimation}
    className={`bg-gray-200 dark:bg-gray-800 rounded ${className}`}
    style={{ width, height }}
  />
);

/**
 * Subject card skeleton
 */
export const SubjectCardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <SkeletonBlock className="h-6 w-3/4 mb-2" />
        <SkeletonBlock className="h-4 w-1/2" />
      </div>
      <SkeletonBlock className="h-8 w-8 rounded-full" />
    </div>
    <div className="flex items-center justify-between">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

/**
 * Question card skeleton
 */
export const QuestionCardSkeleton = () => (
  <div className="card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <SkeletonBlock className="h-5 w-4/5 mb-3" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-6 w-16 rounded-full" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
        </div>
      </div>
    </div>
    <SkeletonBlock className="h-4 w-full mb-2" />
    <SkeletonBlock className="h-4 w-3/4 mb-2" />
    <SkeletonBlock className="h-4 w-1/2" />
  </div>
);

/**
 * Stats card skeleton
 */
export const StatsCardSkeleton = () => (
  <div className="card p-4">
    <div className="flex items-center gap-3">
      <SkeletonBlock className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <SkeletonBlock className="h-4 w-20 mb-2" />
        <SkeletonBlock className="h-6 w-12" />
      </div>
    </div>
  </div>
);

/**
 * Dashboard skeleton
 */
export const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <SubjectCardSkeleton key={i} />
    ))}
  </div>
);

/**
 * Subject detail skeleton
 */
export const SubjectDetailSkeleton = () => (
  <div>
    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[1, 2, 3, 4].map(i => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Questions */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map(i => (
        <QuestionCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Text line skeleton
 */
export const TextSkeleton = ({ lines = 1, className = '' }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBlock 
        key={i} 
        className={`h-4 mb-2 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

export default {
  SkeletonBlock,
  SubjectCardSkeleton,
  QuestionCardSkeleton,
  StatsCardSkeleton,
  DashboardSkeleton,
  SubjectDetailSkeleton,
  TextSkeleton
};
