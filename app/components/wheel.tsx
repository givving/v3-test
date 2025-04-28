import { useState, useRef, useEffect } from "react";

interface WheelSelectorProps {
  options: string[];
  defaultSelectedIndex?: number;
  onChange?: (selectedOption: string, selectedIndex: number) => void;
  height?: number;
  itemHeight?: number;
  className?: string;
}

export function WheelSelector({
  options,
  defaultSelectedIndex = 0,
  onChange,
  height = 200,
  itemHeight = 40,
  className = "",
}: WheelSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);
  const [scrolling, setScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Number of visible items on each side of the selected item
  const visibleItems = Math.floor(height / itemHeight / 2);
  
  // Handle scroll events on the wheel
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    
    let touchStartY = 0;
    let startScrollTop = 0;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleTouchStart = (e: TouchEvent) => {
      clearTimeout(scrollTimeout);
      touchStartY = e.touches[0].clientY;
      startScrollTop = wheel.scrollTop;
      setScrolling(true);
    };
    
    const handleTouchEnd = () => {
      const index = Math.round(wheel.scrollTop / itemHeight);
      scrollToIndex(index);
      
      scrollTimeout = setTimeout(() => {
        setScrolling(false);
      }, 100);
    };
    
    // Snap to the closest option after scrolling stops
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!scrolling) return;
        
        const index = Math.round(wheel.scrollTop / itemHeight);
        scrollToIndex(index);
        setScrolling(false);
      }, 150);
    };
    
    const scrollToIndex = (index: number) => {
      const clampedIndex = Math.max(0, Math.min(options.length - 1, index));
      const top = clampedIndex * itemHeight;
      
      wheel.scrollTo({
        top,
        behavior: 'smooth'
      });
      
      if (selectedIndex !== clampedIndex) {
        setSelectedIndex(clampedIndex);
        onChange?.(options[clampedIndex], clampedIndex);
      }
    };
    
    wheel.addEventListener('touchstart', handleTouchStart);
    wheel.addEventListener('touchend', handleTouchEnd);
    wheel.addEventListener('scroll', handleScroll);
    
    return () => {
      wheel.removeEventListener('touchstart', handleTouchStart);
      wheel.removeEventListener('touchend', handleTouchEnd);
      wheel.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [itemHeight, onChange, options, selectedIndex]);
  
  // Ensure the wheel is scrolled to the selected index on mount
  useEffect(() => {
    if (wheelRef.current) {
      wheelRef.current.scrollTop = selectedIndex * itemHeight;
    }
  }, [selectedIndex, itemHeight]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: `${height}px` }}
    >
      {/* Selection Highlight */}
      <div 
        className="absolute left-0 right-0 border-t border-b border-gray-300 bg-gray-100 bg-opacity-30 pointer-events-none z-10"
        style={{ 
          top: `${height / 2 - itemHeight / 2}px`,
          height: `${itemHeight}px`
        }}
      />
      
      {/* Wheel */}
      <div
        ref={wheelRef}
        className="absolute inset-0 overflow-auto scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Top padding */}
        <div style={{ height: `${height / 2 - itemHeight / 2}px` }} />
        
        {/* Options */}
        {options.map((option, index) => (
          <div
            key={index}
            className="flex items-center justify-center transition-opacity"
            style={{ 
              height: `${itemHeight}px`,
              opacity: scrolling ? 1 : index === selectedIndex ? 1 : 0.5,
            }}
          >
            <span className="text-center text-md font-medium">{option}</span>
          </div>
        ))}
        
        {/* Bottom padding */}
        <div style={{ height: `${height / 2 - itemHeight / 2}px` }} />
      </div>
      
      {/* Gradient overlays for fading effect */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </div>
  );
}