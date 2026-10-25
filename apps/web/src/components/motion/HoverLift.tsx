import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react';

interface HoverLiftProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  yOffset?: number;
}

export const HoverLift: React.FC<HoverLiftProps> = ({
  children,
  yOffset = -4,
  className = '',
  ...props
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={shouldReduceMotion ? undefined : { y: yOffset }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
