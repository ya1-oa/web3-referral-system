import { useState, Dispatch, SetStateAction } from 'react';
import { getWalletClient, switchToPolygonAmoy } from '../lib/web3/contract';

interface WalletConnectProps {
  onConnect: Dispatch<SetStateAction<string | null>>;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    try {
      // First request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Then switch network
      await switchToPolygonAmoy();
      
      const walletClient = await getWalletClient();
      const [address] = await walletClient.getAddresses();
      onConnect(address);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={connectWallet} 
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}