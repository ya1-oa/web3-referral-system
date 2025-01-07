import { useState, useEffect } from 'react';
import { WalletConnect } from '../components/WalletConnect';
import { ReferralRegistration } from '../components/ReferralRegistration';
import { ReferralStats } from '../components/ReferralStats';
import { getUserStats } from '../lib/web3/referral';
import { switchToPolygonAmoy } from '../lib/web3/contract';

export function ReferralDashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Check for referral in URL when component mounts
    const params = new URLSearchParams(window.location.search);
    const referralAddress = params.get('ref');
    if (referralAddress) {
      localStorage.setItem('referrer', referralAddress);
    }
  }, []);

  useEffect(() => {
    if (address) {
      checkRegistration();
      // Ensure correct network when address changes
      switchToPolygonAmoy().catch(console.error);
    }
  }, [address]);

  const checkRegistration = async () => {
    if (!address) return;
    try {
      const stats = await getUserStats(address);
      setIsRegistered(stats.isRegistered);
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Web3 Referral Program
        </h1>
        <WalletConnect onConnect={setAddress} />
        {address && (
          <div className="mt-8">
            {!isRegistered ? (
              <ReferralRegistration userAddress={address} />
            ) : (
              <ReferralStats userAddress={address} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}