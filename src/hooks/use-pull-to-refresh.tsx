import { useState, useRef, useCallback, useEffect } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  maxPull?: number;
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  progress: number;
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    maxPull = 120
  } = options;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    progress: 0
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isRefreshing = useRef<boolean>(false);

  const updateState = useCallback((updates: Partial<PullToRefreshState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only handle pull-to-refresh when at the top of the page
    if (window.scrollY > 0) return;
    
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Only handle pull-to-refresh when at the top of the page
    if (window.scrollY > 0) return;
    
    currentY.current = e.touches[0].clientY;
    const pullDistance = Math.max(0, (currentY.current - startY.current) / resistance);
    
    if (pullDistance > 0) {
      e.preventDefault();
      
      const clampedPull = Math.min(pullDistance, maxPull);
      const progress = Math.min((clampedPull / threshold) * 100, 100);
      
      updateState({
        isPulling: true,
        pullDistance: clampedPull,
        progress
      });
    }
  }, [resistance, maxPull, threshold, updateState]);

  const handleTouchEnd = useCallback(async () => {
    if (!state.isPulling || isRefreshing.current) return;

    if (state.pullDistance >= threshold) {
      // Trigger refresh
      isRefreshing.current = true;
      updateState({ isRefreshing: true });
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Pull-to-refresh failed:', error);
      } finally {
        isRefreshing.current = false;
        updateState({ isRefreshing: false });
      }
    }

    // Reset state
    updateState({
      isPulling: false,
      pullDistance: 0,
      progress: 0
    });
  }, [state.isPulling, state.pullDistance, threshold, onRefresh, updateState]);

  useEffect(() => {
    const element = document.documentElement;
    
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    pullToRefreshStyle: {
      transform: `translateY(${state.pullDistance}px)`,
      transition: state.isRefreshing ? 'transform 0.3s ease-out' : 'none'
    }
  };
} 