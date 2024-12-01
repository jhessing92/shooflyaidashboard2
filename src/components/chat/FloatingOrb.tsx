import React, { useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface FloatingOrbProps {
  color: 'blue' | 'green';
  initialPosition: { x: number; y: number };
  mirrorOf?: { x: number; y: number };
}

const FloatingOrb = ({ color, initialPosition, mirrorOf }: FloatingOrbProps) => {
  const orbRef = useRef<HTMLDivElement>(null);
  
  const [{ x, y }, api] = useSpring(() => ({
    x: initialPosition.x,
    y: initialPosition.y,
    config: { mass: 4, tension: 25, friction: 45 },
  }));

  useEffect(() => {
    if (mirrorOf) {
      api.start({ 
        x: 100 - mirrorOf.x, 
        y: mirrorOf.y
      });
      return;
    }

    let direction = { x: 1, y: 1 };
    let position = { x: initialPosition.x, y: initialPosition.y };
    let time = 0;
    
    const animate = () => {
      if (!orbRef.current) return;
      
      // Increased speed to 0.03
      position.x += 0.03 * direction.x;
      position.y = initialPosition.y + Math.sin(time * 0.5) * 15;
      
      time += 0.02;
      
      if (position.x >= 90 || position.x <= 10) direction.x *= -1;
      
      api.start({ x: position.x, y: position.y });
      requestAnimationFrame(animate);
    };

    animate();
  }, [api, initialPosition, mirrorOf]);

  const gradientColor = color === 'blue' ? 'from-blue-500 to-indigo-500' : 'from-emerald-500 to-green-500';

  return (
    <animated.div
      ref={orbRef}
      className={`fixed w-[1200px] h-[1200px] rounded-full bg-gradient-to-br ${gradientColor} opacity-[0.25] blur-[150px] pointer-events-none`}
      style={{
        left: x.to(x => `${x}%`),
        top: y.to(y => `${y}%`),
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default FloatingOrb;