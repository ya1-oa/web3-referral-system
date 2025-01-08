import React from 'react';
import { Users, BarChart2, TrendingUp, Award, Share2 } from 'lucide-react';

interface ReferralNode {
  address: string;
  level: number;
  rewards: number;
  children: ReferralNode[];
}

function Dashboard() {
  // Mock data - replace with actual data from your system
  const stats = {
    totalReferrals: 28,
    totalRewards: 1250,
    activeTraders: 15,
    averageROI: 24.5
  };

  const referralTree: ReferralNode = {
    address: "0x1234...5678",
    level: 0,
    rewards: 450,
    children: [
      {
        address: "0x8765...4321",
        level: 1,
        rewards: 200,
        children: [
          {
            address: "0x9876...1234",
            level: 2,
            rewards: 100,
            children: []
          }
        ]
      },
      {
        address: "0x5432...8765",
        level: 1,
        rewards: 150,
        children: []
      }
    ]
  };

  const ReferralNode = ({ node, isLast, prefix = "" }: { node: ReferralNode; isLast: boolean; prefix?: string }) => {
    const childPrefix = prefix + (isLast ? "    " : "│   ");

    return (
      <div className="font-mono text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">{prefix}{isLast ? "└── " : "├── "}</span>
          <span className="text-cyan-400">{node.address}</span>
          <span className="text-gray-400">({node.rewards} rewards)</span>
        </div>
        {node.children.map((child, index) => (
          <ReferralNode
            key={child.address}
            node={child}
            isLast={index === node.children.length - 1}
            prefix={childPrefix}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Research Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">NETWORK</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalReferrals}</div>
          <div className="text-gray-400 text-sm">Total Referrals</div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">REWARDS</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">${stats.totalRewards}</div>
          <div className="text-gray-400 text-sm">Total Rewards Earned</div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart2 className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">ACTIVITY</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.activeTraders}</div>
          <div className="text-gray-400 text-sm">Active Traders</div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">PERFORMANCE</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.averageROI}%</div>
          <div className="text-gray-400 text-sm">Average ROI</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Referral Network</h2>
            <Share2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="overflow-x-auto">
            <ReferralNode node={referralTree} isLast={true} />
          </div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <BarChart2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-cyan-900/30">
                <div>
                  <div className="text-white font-medium">New Referral Joined</div>
                  <div className="text-sm text-gray-400">0x3456...7890</div>
                </div>
                <div className="text-right">
                  <div className="text-cyan-400">+50 USDT</div>
                  <div className="text-sm text-gray-400">2 hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;