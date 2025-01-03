import { useState, useRef, useEffect } from "react";

const useScroll = () => {
  const [isScrollbarVisible, setIsScrollbarVisible] = useState(false);
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    if (scrollContainer.current) {
      const delta = e.movementX * -1;
      scrollContainer.current.scrollLeft += delta;
    }
  };

  useEffect(() => {
    const checkScrollbarVisibility = () => {
      if (scrollContainer.current) {
        const hasHorizontalScrollbar =
          scrollContainer.current.scrollWidth >
          scrollContainer.current.clientWidth;
        setIsScrollbarVisible(hasHorizontalScrollbar);
      }
    };

    checkScrollbarVisibility();

    window.addEventListener("resize", checkScrollbarVisibility);
    return () => window.removeEventListener("resize", checkScrollbarVisibility);
  }, []);

  const restoreScrollContainerPointer = () => {
    if (scrollContainer.current) {
      scrollContainer.current.style.pointerEvents = "auto";
    }
  };

  return {
    isScrollbarVisible,
    scrollContainer,
    restoreScrollContainerPointer,
    handleScroll,
  };
};

export default useScroll;
