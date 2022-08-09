/* 
  Description:
    A way for us to trigger scroll-on animations when the element with the
    provided ref (containerRef) is in view based on the provided options.

    Inputs:
      1. "options" - Example Structure: { root: null, rootMargin: "0px", threshold: 0.5 };
    
    Returns:
      1. "containerRef" - A ref we attach to an element to which we'll listen
         to when that element is displayed on screen depending on the options
         provided to this hook
      2. "isVisible" - A boolean which returns true is the element with the ref
         is visible on screen based on the provided options
*/

import { useState, useEffect, useRef } from "react";

const usePageLocation = (options) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunc = (entries) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunc, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  return [containerRef, isVisible];
};

export default usePageLocation;
