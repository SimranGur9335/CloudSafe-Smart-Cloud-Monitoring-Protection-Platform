import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const followerRef = useRef<HTMLDivElement>(null);
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
      }

      setTrails(prev => {
        const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() };
        return [...prev.slice(-10), newTrail];
      });

      const target = e.target as HTMLElement;
      const isInteractive = target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.interactive') !== null;
      setIsHovering(isInteractive);
    };

    const handleClick = (e: MouseEvent) => {
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <>
      <div 
        ref={followerRef} 
        className={`cursor-follower ${isHovering ? 'scale-150' : 'scale-100'}`}
      />
      {trails.map((trail, i) => (
        <div 
          key={trail.id}
          className="cursor-trail"
          style={{
            left: trail.x - 4,
            top: trail.y - 4,
            opacity: (i / trails.length) * 0.5,
            transform: `scale(${i / trails.length})`
          }}
        />
      ))}
      {ripples.map(ripple => (
        <div 
          key={ripple.id}
          className="fixed pointer-events-none border-2 border-cyber-neon rounded-full animate-ping"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
            zIndex: 10000
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
