import React from 'react';
import { NavLink } from 'react-router';
import { Home, Waves, Dumbbell, Apple, User } from 'lucide-react';
import { playSplashSound } from '../../utils/audio';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/water', icon: Waves, label: 'Water' },
    { to: '/land', icon: Dumbbell, label: 'Land' },
    { to: '/diet', icon: Apple, label: 'Diet' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="absolute bottom-0 w-full bg-slate-900 border-t border-cyan-900 pb-safe z-50 shadow-[0_-4px_20px_rgba(6,182,212,0.15)]">
      <div className="flex justify-around items-center h-[72px] px-2 mb-2 sm:mb-0">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => playSplashSound()}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                {isActive && (
                  <div className="absolute top-0 w-12 h-1 bg-cyan-400 rounded-b-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};