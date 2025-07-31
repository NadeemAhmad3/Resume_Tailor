// /components/resume-maker/ResumePreview.tsx
import { ResumeData } from '@/app/lib/resume-data';
import { ThemeName } from '@/app/resume-maker/page';
import NadeemAhmadTheme from './templates/NadeemAhmadTheme';
import MaxJohnsonTheme from './templates/MaxJohnsonTheme';
import { useRef, useState, useLayoutEffect } from 'react';

interface Props {
  data: ResumeData;
  theme: ThemeName;
}

// A4 aspect ratio
const A4_RATIO = 210 / 297; 
// A4 width in mm
const A4_WIDTH_MM = 210; 

export default function ResumePreview({ data, theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // This effect calculates and applies the correct scale to fit the preview
  useLayoutEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 794px is the standard width of a 210mm paper at 96DPI
        const newScale = containerWidth / 794; 
        setScale(newScale < 1 ? newScale : 1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  return (
    // This outer container is responsive and controls the size
    <div
      ref={containerRef}
      className="w-full h-full flex justify-center items-start bg-gray-200/50 p-4"
    >
      {/* The inner container is scaled using a transform */}
      <div 
        id="resume-preview-wrapper" 
        className="bg-white shadow-2xl"
        style={{
            aspectRatio: `${A4_RATIO}`,
            width: `${A4_WIDTH_MM * (scale/scale)}mm`, // A4 width
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
        }}
      >
        {/* This ID is now what we capture for the PDF */}
        <div id="resume-preview-content" className="w-full h-full">
            {theme === 'NadeemAhmad' && <NadeemAhmadTheme data={data} />}
            {theme === 'MaxJohnson' && <MaxJohnsonTheme data={data} />}
        </div>
      </div>
    </div>
  );
}