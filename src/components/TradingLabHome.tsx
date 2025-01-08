import React from 'react';
import { getUserStats } from '../lib/web3/referral';
import { useState, useEffect } from 'react';
import Dashboard from './TradingLabDash';
import { Header } from './Header';
import { Hero } from './Hero';
import { CourseCard } from './CourseCard';
import { Lock } from 'lucide-react';
import { switchToPolygonAmoy } from '../lib/web3/switchNetwork';

export function TradingLabHome() {
    
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
    <div className="min-h-screen bg-[#0A1929] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBzdHJva2U9IiMxMTJBNDUiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] bg-repeat">
      <Header onConnect={setAddress} isWalletConnected={isWalletConnected} />
      
      {address ? (
        <Dashboard />
      ) : (
        <>
          <Hero isWalletConnected={isWalletConnected} />
          <main className="container mx-auto px-4 py-12">
            <section className="mb-20">
              <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center">Research Modules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <CourseCard
                    key={index}
                    {...course}
                    isLocked={!isWalletConnected}
                  />
                ))}
              </div>
            </section>

            <section className="text-center py-12">
              <div className="bg-[#112A45] border border-cyan-900/50 p-8 rounded-xl max-w-2xl mx-auto backdrop-blur-sm">
                <Lock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Connect Wallet to Access the Trading Lab
                </h3>
                <p className="text-gray-300 mb-6">
                  Begin your trading journey with access to our research modules
                </p>
                <button
                  onClick={handleConnectWallet}
                  className="bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            </section>
          </main>
        </>
      )}
    </div>
);
}
