import { useState, useEffect, RefObject } from'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
}

export function useIntersectionObserver(
  ref: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const { threshold = 0.1, root = null, rootMargin ='0px' } = options;

  useEffect(() => {
    const target = ref.current;
    if (!target || typeof IntersectionObserver ==='undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, root, rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [ref, threshold, root, rootMargin]);

  return isIntersecting;
}
