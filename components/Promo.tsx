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
  const { user, referralCode, loading } = useAuth();

  // While auth is loading, hide everything to avoid flicker (e.g., signup promo flashing then disappearing)
  if (loading) {
    return null;
  }
  // Hide by default while referral code is loading to avoid flash
  // TanStack useQuery sets data as undefined initially, then null or object after resolve
  if (user && typeof referralCode === 'undefined') {
    return null;
  }

  // Show referral promo only if logged in and confirmed no referral code yet
  const showReferralPromo = !!user && referralCode === null;
  // Show signup promo if logged out
  const showSignupPromo = !user;

  if (!showReferralPromo && !showSignupPromo) {
    // Logged-in user who already has a referral code -> hide promo entirely
    return null;
  }

  const title = showReferralPromo ? t('promo_referral_title') : t('promo_signup_title');
  const description = showReferralPromo ? t('promo_referral_description') : t('promo_signup_description');

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
        {showReferralPromo ? (
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
