import React, { ButtonHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playSplashSound } from '../../utils/audio';
import { twMerge } from 'tailwind-merge';

interface SplashButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SplashButton: React.FC<SplashButtonProps> = ({ children, className, onClick, ...props }) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSplashSound();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples([...ripples, newRipple]);
    
    if (onClick) {
      onClick(e);
    }
    
    setTimeout(() => {
      setRipples(r => r.filter(rip => rip.id !== newRipple.id));
    }, 500);
  };

  return (
    <button
      className={twMerge("relative overflow-hidden active:scale-95 transition-transform duration-150", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};