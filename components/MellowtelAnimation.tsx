import React from 'react';
import Lottie from 'react-lottie-player';
import { Sprout } from 'lucide-react';
import plantAnimation from '../assets/plant.json';
import { motion } from 'framer-motion';




export const MellowtelAnimation: React.FC<any> = ({ isActive }) => {
  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400">
        <Sprout className="w-16 h-16 mb-4" />
        <p className="text-center">Idleforest is inactive. Enable it to start growing your forest!</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[300px] flex items-center justify-center overflow-hidden">
      
      <Lottie
        loop
        animationData={plantAnimation}
        play
        style={{ width: 200, height: 200 }}
      />
      
      <div className="absolute bottom-8 text-center text-green-700 font-medium">
        Growing seeds while you browse...
      </div>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-200 rounded-full"
          initial={{ 
            x: Math.random() * 200 - 100,
            y: 150,
            opacity: 0 
          }}
          animate={{
            y: -150,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};