import React from 'react';
import { Users, BarChart2, TrendingUp, Award, Share2, TestTube, Microscope, Lock } from 'lucide-react';

// ... (keep existing interfaces and ReferralNode component)

function TradingLabModules() {

  const modules = [
    {
      title: "Market Analysis Lab",
      description: "Scientific approach to reading charts and market patterns",
      icon: <Microscope className="w-6 h-6 text-cyan-400" />,
      progress: 60,
      status: "In Progress"
    },
    {
      title: "Risk Management Research",
      description: "Data-driven strategies to optimize your trading performance",
      icon: <TestTube className="w-6 h-6 text-cyan-400" />,
      progress: 100,
      status: "Completed"
    },
    {
      title: "Advanced Trading Experiments",
      description: "Test and validate complex trading hypotheses",
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      progress: 0,
      status: "Not Started"
    }
  ];

  // ... (keep existing referralTree and stats)

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* ... (keep existing stats cards) */}
      </div>

      {/* Trading Modules Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-6">Active Research Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div key={index} className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-cyan-500/10 rounded-lg">
                  {module.icon}
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  module.status === "Completed" ? "bg-green-500/20 text-green-400" :
                  module.status === "In Progress" ? "bg-cyan-500/20 text-cyan-400" :
                  "bg-gray-500/20 text-gray-400"
                }`}>
                  {module.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2">{module.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{module.description}</p>
              
              <div className="mb-2">
                <div className="h-2 bg-[#0A1929] rounded-full">
                  <div 
                    className={`h-full rounded-full ${
                      module.status === "Completed" ? "bg-green-500" : "bg-cyan-500"
                    }`}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{module.progress}% Complete</span>
                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  {module.status === "Completed" ? "Review" : "Continue"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Network and Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ... (keep existing referral tree and activity sections) */}
      </div>
    </div>
  );
}

export default TradingLabModules;