import { Link, Navigate } from 'react-router-dom';
import { ReferralRegistration } from '../components/ReferralRegistration';
import { TestTube } from 'lucide-react';
import { CheckCircle } from 'lucide-react';
interface ReferralDashboardProps {
  address: string | null;
  isRegistered: boolean;
}

export function ReferralDashboard({ address, isRegistered }: ReferralDashboardProps) {
  return (
    <div className="relative py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex items-center space-x-3 mb-6">
            <TestTube className="w-8 h-8 text-cyan-400" />
            <span className="text-cyan-400 font-mono">TRADING LAB v1.0</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            Scientific Trading Analysis & Research Center
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Apply scientific methods to trading. Test hypotheses, analyze data, and develop proven strategies.
          </p>
            {address ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 inline-flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-500">Lab access granted. Begin your research.</span>
              {!isRegistered ? (
                  <ReferralRegistration userAddress={address} />
                ) : (
                  <Link to={`/stats/${address}`}>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                      View Stats
                    </button>
                  </Link>
                )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <button className="bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
                Enter Lab
              </button>
              <button className="border border-cyan-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#112A45] transition-colors">
                View Research
              </button>
            </div>
          )}
        </div>
      </div>
    <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
      <TestTube className="w-full h-full text-cyan-400" />
    </div>
  </div>
  )
}