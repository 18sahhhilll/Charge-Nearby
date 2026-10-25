import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE, MOTION_Y_OFFSET, viewportSettings } from '../../lib/motion';

interface StaggerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
}

export const Stagger: React.FC<StaggerProps> = ({
  children,
  staggerDelay = 0.06,
  initialDelay = 0,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: shouldReduceMotion ? 0 : initialDelay,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={viewportSettings}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  yOffset?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  yOffset = MOTION_Y_OFFSET,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : yOffset },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.01 : MOTION_DURATION,
        ease: MOTION_EASE,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className} {...props}>
      {children}
    </motion.div>
  );
};
