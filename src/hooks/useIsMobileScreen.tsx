import { useEffect } from "react";
import { useState } from "react";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

function useIsMobileScreen() {
  const [isMobile, setIsMobile] = useState(getWindowDimensions().width < 730);

  useEffect(() => {
    const handleResize = () => setIsMobile(getWindowDimensions().width < 730);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default useIsMobileScreen;
