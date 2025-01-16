import { ReferralDashboard } from './components/ReferralDashboard';
import { Header } from './components/Header';
import { useState, useEffect } from 'react';
import { switchToPolygonAmoy } from './lib/web3/contract';
import { getUserStats } from './lib/web3/referral';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from 'lucide-react';
import { ReferralStats } from './components/ReferralStats';
import Dashboard from './components/TradingLabDash';

function App() {
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
      console.log(stats);
    } catch (err) {
      console.error('Error checking registration:', err);
    }
  };
  return (
    <div className="min-h-screen bg-[#0A1929] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCAyOCAwIDEgMCA1NiAwYTI4IDI4IDAgMSAwLTU2IDB6IiBzdHJva2U9IiMxMTJBNDUiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] bg-repeat">
      <main>
        <Header onConnectIsAddress={setAddress} />
          <Routes>
            <Route path="/" element= {<ReferralDashboard isRegistered={isRegistered} address={address} />} />
            <Route path="/stats/:address" element= {<ReferralStats />} />
          </Routes>

      </main>
    </div>
  );
}

export default App;
