import React from 'react';
import { cn } from '../../lib/utils';

// Sizes map
const sizeMap = {
  sm: 'h-5 w-5 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-10 w-10 border-[3px]',
};

/**
 * Loader - unified loading spinner with optional label
 * Props: size(sm|md|lg), label, inline
 */
export function Loader({ size='md', label, inline=false, className }) {
  const spinner = (
    <div className={cn('relative flex items-center justify-center', !inline && 'py-6')}> 
      <div className={cn('animate-spin rounded-full border-primary border-t-transparent', sizeMap[size], 'border-solid')}/>
      {label && <span className="ml-3 text-xs font-medium text-muted-foreground animate-in fade-in-50">{label}</span>}
    </div>
  );
  return inline ? spinner : <div className={cn('flex items-center justify-center', className)}>{spinner}</div>;
}

export default Loader;