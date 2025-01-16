import { useState, Dispatch, SetStateAction } from 'react';
import { getWalletClient, switchToPolygonAmoy } from '../lib/web3/contract';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: Dispatch<SetStateAction<string | null>>;
}

export function WalletConnect({ onConnect }: WalletConnectProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await switchToPolygonAmoy();
      
      const walletClient = await getWalletClient();
      const [addr] = await walletClient.getAddresses();
      setAddress(addr);
      onConnect(addr);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <button
              onClick={connectWallet}
              disabled={loading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                address
                  ? 'bg-green-500 text-white'
                  : 'bg-cyan-500 text-white hover:bg-cyan-400'
              } transition-colors`}
            >
              <Wallet className="w-5 h-5" />
              <span>{loading ? 'Connecting...' : address ? 'Connected' : 'Connect Wallet'}</span>
            </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}