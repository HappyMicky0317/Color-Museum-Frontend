import { useState, useEffect } from "react";

const useIntersection = (element, rootMargin) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry && entry.isIntersecting);
      },
      { rootMargin }
    );

    element && observer.observe(element.current);

    // return () => observer && observer.unobserve(element.current);
  }, []);

  return isVisible;
};

export default useIntersection;
