import { useState, useEffect } from "react";

export function UseScrollToBottom() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      const distanceBeforeAppear = Math.round(windowHeight / 20); // Height before the button appears

      setShowButton(distanceFromBottom > distanceBeforeAppear);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => {
    const { scrollHeight, clientHeight } = document.documentElement;
    const heightWithoutInput = scrollHeight - 65;
    if (heightWithoutInput > clientHeight) {
      window.scrollTo({
        top: scrollHeight,
        behavior: "auto",
      });
    }
  };

  return { showButton, scrollToBottom };
}
