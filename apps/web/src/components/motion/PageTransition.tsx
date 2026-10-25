import React, { useEffect } from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE, MOTION_Y_OFFSET } from '../../lib/motion';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: MOTION_Y_OFFSET }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: MOTION_DURATION, ease: MOTION_EASE }}
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
