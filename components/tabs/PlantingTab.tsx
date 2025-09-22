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
    <div className="p-6 bg-brand-grey border border-brand-darkblue rounded-none">
      <MellowtelAnimation isActive={isActive} />
      <div className="flex justify-center mt-4">
        {isActive ? (
          <Button 
            onClick={onOptOut}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide px-6"
          >
            {chrome.i18n.getMessage('app_stopPlanting')}
          </Button>
        ) : (
          <Button 
            onClick={onOptIn}
            className="bg-brand-darkblue hover:brightness-110 text-white uppercase font-candu tracking-wide px-6"
          >
            {chrome.i18n.getMessage('app_startPlanting')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlantingTab;

