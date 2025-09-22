import React, { useEffect, useRef } from 'react';
import { Sprout } from 'lucide-react';
import unionMask from 'url:~assets/Union.svg';
import seedlingVideo from 'url:~assets/7654892-hd_1080_1920_25fps.mp4';




export const MellowtelAnimation: React.FC<any> = ({ isActive }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {
        // ignore autoplay restrictions
      });
    } else {
      v.pause();
      v.currentTime = 0; // optional: reset to the start for a clean poster-like look
    }
  }, [isActive]);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-full h-[300px] flex items-center justify-center">
        <video
          ref={videoRef}
          src={seedlingVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{
            WebkitMaskImage: `url(${unionMask})`,
            maskImage: `url(${unionMask})`,
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            backgroundColor: 'transparent',
            filter: isActive ? 'none' : 'grayscale(100%)'
          }}
        />
      </div>
      {!isActive && (
        <div className="mt-4 text-center text-gray-500 font-medium flex items-center gap-2">
          <Sprout className="w-4 h-4" />
          {chrome.i18n.getMessage('planting_inactiveMessage')}
        </div>
      )}
    </div>
  );
};