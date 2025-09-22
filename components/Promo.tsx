import React from 'react';
import { Gift } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../context/AuthProvider';
import type { TabType } from '../api/types';

interface PromoProps {
  onNavigate?: (tab: TabType) => void;
}

const Promo: React.FC<PromoProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const title = user ? t('promo_referral_title') : t('promo_signup_title');
  const description = user ? t('promo_referral_description') : t('promo_signup_description');

  const handleReferralClick = () => {
    if (onNavigate) {
      onNavigate('referral');
    }
  };

  return (
    <div className="bg-brand-yellow text-brand-darkblue border-0 rounded-none p-4 my-4 flex items-start gap-3">
      <div className="flex-shrink-0 pt-0.5">
        <Gift className="h-5 w-5 text-brand-darkblue" />
      </div>
      <div>
        <p className="font-bold text-sm">{title}</p>
        {user ? (
          <p className="text-xs cursor-pointer hover:underline" onClick={handleReferralClick}>
            {description}
          </p>
        ) : (
          <p className="text-xs">{description}</p>
        )}
      </div>
    </div>
  );
};

export default Promo;
