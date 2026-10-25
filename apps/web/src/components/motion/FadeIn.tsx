import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE, MOTION_Y_OFFSET, viewportSettings } from '../../lib/motion';

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = MOTION_Y_OFFSET,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getOffset = () => {
    if (shouldReduceMotion || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      default:
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportSettings}
      transition={{
        duration: shouldReduceMotion ? 0.01 : MOTION_DURATION,
        delay: shouldReduceMotion ? 0 : delay,
        ease: MOTION_EASE,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
