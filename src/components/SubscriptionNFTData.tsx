import { useSubscriptionNFT } from '../lib/web3/hooks';
import { renewSubscription } from '../lib/web3/referral';
import { useState } from 'react';

interface Props {
  userAddress: string;
}

export function SubscriptionNFT({ userAddress }: Props) {
  const { nftData, loading } = useSubscriptionNFT(userAddress);
  const [renewing, setRenewing] = useState(false);

  const handleRenew = async () => {
    setRenewing(true);
    try {
      await renewSubscription();
      window.location.reload();
    } catch (err: any) {
      console.error('Failed to renew:', err);
      const errorMessage = err.message?.includes("reason: ") 
        ? err.message.split("reason: ")[1].split('"')[0]
        : "Unknown error occurred";
      alert(`Renewal failed: ${errorMessage}`);
    } finally {
      setRenewing(false);
    }
  };

  if (loading) return <div>Loading NFT...</div>;
  if (!nftData) return null;

  const timeLeft = nftData.timeUntilExpiry

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">Subscription Status</h3>
      <div className="flex items-center space-x-6">
        <div>
          <div className={`text-lg font-medium mb-2 ${
            nftData.isSubscribed ? 'text-green-400' : 'text-red-400'
          }`}>
            {nftData.isSubscribed ? 'Active' : 'Expired'}
          </div>
          {nftData && (
            <div className="text-gray-300">
              Expires in: {Number(nftData.timeUntilExpiry) / 86400} days
            </div>
          )}
        </div>
      </div>
      <div>
      </div>
    </div>
  );
}