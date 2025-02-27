import React from 'react';
import { Button } from "@/components/ui/button";
import { MellowtelAnimation } from '../MellowtelAnimation';

interface PlantingTabProps {
  isActive: boolean;
  onOptIn: () => void;
  onOptOut: () => void;
}

const PlantingTab: React.FC<PlantingTabProps> = ({ isActive, onOptIn, onOptOut }) => {
  return (
    <div>
      <MellowtelAnimation isActive={isActive} />
      <div className="flex justify-center mt-4">
        {isActive ? (
          <Button 
            variant="outline" 
            onClick={onOptOut}
            className="bg-white hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
          >
            Stop Planting
          </Button>
        ) : (
          <Button 
            onClick={onOptIn}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Start Planting
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlantingTab;
