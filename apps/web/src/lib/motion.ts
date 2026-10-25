import type { Variants } from 'motion/react';

/**
 * Shared motion tokens and variants for ChargeNearby.
 * Designed according to system standards:
 * - 250ms duration
 * - [0.16, 1, 0.3, 1] cubic-bezier easing
 * - 12px y-axis offset
 */

export const MOTION_DURATION = 0.25;
export const MOTION_EASE = [0.16, 1, 0.3, 1] as const;
export const MOTION_Y_OFFSET = 12;

/**
 * Shared fade-up variant for headers, cards, and sections.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: MOTION_Y_OFFSET },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATION,
      ease: MOTION_EASE,
    },
  },
};

/**
 * Shared stagger container variant for lists, card grids, and staggered headers.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/**
 * Factory helper for custom stagger intervals.
 */
export const createStaggerContainer = (
  staggerChildren = 0.06,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Shared viewport settings for scroll-triggered animations.
 */
export const viewportSettings = {
  once: true,
  margin: '-60px',
} as const;
