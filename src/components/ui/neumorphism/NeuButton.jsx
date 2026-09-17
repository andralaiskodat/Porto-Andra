import React from 'react';
import { motion } from 'framer-motion';

/**
 * NeuButton - Tactile Neumorphic Button
 * @param {'raised' | 'inset' | 'gradient' | 'icon' | 'outline'} variant
 * @param {'sm' | 'md' | 'lg'} size
 */
export const NeuButton = ({
  children,
  as: Component = 'button',
  variant = 'raised',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  href,
  download,
  target,
  rel,
  type = 'button',
  ...props
}) => {
  const getSizeStyles = () => {
    if (variant === 'icon') {
      switch (size) {
        case 'sm': return 'w-9 h-9 text-sm';
        case 'lg': return 'w-14 h-14 text-xl';
        case 'md':
        default: return 'w-11 h-11 text-base';
      }
    }

    switch (size) {
      case 'sm':
        return 'px-4 py-1.5 text-xs font-medium';
      case 'lg':
        return 'px-8 py-3.5 text-base font-semibold';
      case 'md':
      default:
        return 'px-5 py-2.5 text-sm font-medium';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-[#7C6EF2] to-[#F2739E] text-white shadow-neu-flat hover:shadow-neu-hover active:shadow-neu-pressed hover:brightness-105';
      case 'inset':
        return 'bg-[#E8ECF1] text-neu-accent shadow-neu-inset font-semibold';
      case 'icon':
        return 'rounded-full bg-[#ECF0F3] text-neu-primary shadow-neu-flat hover:shadow-neu-hover active:shadow-neu-pressed flex items-center justify-center';
      case 'outline':
        return 'bg-[#ECF0F3] text-neu-primary border border-neu-accent/30 shadow-neu-flat-sm hover:border-neu-accent hover:shadow-neu-hover active:shadow-neu-pressed';
      case 'raised':
      default:
        return 'bg-[#ECF0F3] text-neu-primary shadow-neu-flat hover:shadow-neu-hover active:shadow-neu-pressed hover:-translate-y-0.5 active:translate-y-0';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2 select-none cursor-pointer
    transition-all duration-200 ease-out font-poppins rounded-xl
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
  `;

  if (Component === 'a') {
    return (
      <a
        href={href}
        download={download}
        target={target}
        rel={rel}
        onClick={onClick}
        className={`${baseClasses} ${getSizeStyles()} ${getVariantStyles()} ${className}`}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${getSizeStyles()} ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default NeuButton;
