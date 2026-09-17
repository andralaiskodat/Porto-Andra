import React from 'react';
import { motion } from 'framer-motion';

/**
 * NeuCard - Soft Neumorphic container component
 * @param {'raised' | 'inset' | 'flat'} variant
 * @param {boolean} hoverLift
 * @param {string} rounded
 */
export const NeuCard = ({
  children,
  variant = 'raised',
  hoverLift = false,
  rounded = 'rounded-2xl',
  className = '',
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'inset':
        return 'bg-[#E8ECF1] shadow-neu-inset';
      case 'flat':
        return 'bg-[#ECF0F3] border border-white/60';
      case 'raised':
      default:
        return 'bg-[#ECF0F3] shadow-neu-flat';
    }
  };

  const hoverClasses = hoverLift
    ? 'transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-neu-hover'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative text-neu-primary transition-all duration-200 ${rounded} ${getVariantStyles()} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default NeuCard;
