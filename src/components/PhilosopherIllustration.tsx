
import { useEffect } from "react";
import Vivus from 'vivus';
import { PhilosopherName, philosopherData } from "@/constants/philosophers";

interface PhilosopherIllustrationProps {
  philosopher: PhilosopherName;
}

export const PhilosopherIllustration = ({ philosopher }: PhilosopherIllustrationProps) => {
  useEffect(() => {
    // Clear the previous SVG content
    const svgContainer = document.getElementById('my-svg');
    if (svgContainer) {
      svgContainer.innerHTML = '';
    }

    // Initialize new SVG
    new Vivus('my-svg', {
      duration: 300,
      animTimingFunction: Vivus.EASE,
      file: philosopherData[philosopher].svgPath
    }, () => {
      console.log('Animation completed');
    });
  }, [philosopher]);

  return <div id="my-svg" className="mb-8" />;
};
