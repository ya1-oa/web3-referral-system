import { useUserStats, useUserReferrals, useReferralTree } from '../lib/web3/hooks';
import { formatReward, shortenAddress } from '../lib/web3/utils';
import '../styles/ReferralStats.css';
import { useEffect, useState } from 'react';
import { getUserStats } from '../lib/web3/referral';
import { SubscriptionNFT } from './SubscriptionNFT';

interface UserStats {
  totalRewards: number;
  referralCount: number;
  referrer: string;
  isRegistered: boolean;
}

interface Props {
  userAddress: string;
}

interface ReferralInfo {
  addr: string;
  level: number;
  rewardsEarned: bigint;
  parentAddr?: string;
}

async function buildReferralTree(referrals: ReferralInfo[]) {
  const referrerMap = new Map<string, string>();
  
  // First pass: build referrer map
  for (const ref of referrals) {
    const stats = await getUserStats(ref.addr);
    if (stats.referrer) {
      referrerMap.set(ref.addr.toLowerCase(), stats.referrer.toLowerCase());
    }
  }

  return referrals.map(ref => ({
    ...ref,
    parentAddr: referrerMap.get(ref.addr.toLowerCase())
  }));
}

export function ReferralStats({ userAddress }: Props) {
  const { stats, loading: statsLoading } = useUserStats(userAddress) as { stats: UserStats | null, loading: boolean };
  const { referrals, loading: referralsLoading } = useUserReferrals(userAddress);
  const { tree, loading: treeLoading } = useReferralTree(userAddress);

  const [groupedByLevel, setGroupedByLevel] = useState<Record<number, ReferralInfo[]>>({});

  useEffect(() => {
    async function updateTree() {
      const treeWithParents = await buildReferralTree(tree);
      const grouped = treeWithParents.reduce((acc, ref: ReferralInfo) => {
        acc[ref.level] = acc[ref.level] || [];
        acc[ref.level].push(ref);
        return acc;
      }, {} as Record<number, ReferralInfo[]>);
      setGroupedByLevel(grouped);
    }
    
    updateTree();
  }, [tree]);

  if (statsLoading || referralsLoading || treeLoading) {
    return <div className="text-center">Loading...</div>;
  }

  //function getConnectorOffset(parentAddr: string, parentLevel: ReferralInfo[]) {
  //  if (!parentLevel) return 0;
  //  const parentIndex = parentLevel.findIndex(p => p.addr.toLowerCase() === parentAddr.toLowerCase());
  //  return parentIndex * 240; // Adjust based on node width + gap
  //}

  return (
    <div className="stats-container">
      <SubscriptionNFT userAddress={userAddress} />
      
      <h2 className="stats-header">Your Referral Stats</h2>
      {stats && (
        <div className="stats-grid mt-6">
          <div className="stat-card">
            <label className="stat-label">Total Rewards</label>
            <div className="stat-value">{formatReward(BigInt(stats.totalRewards))} Tokens</div>
          </div>
          <div className="stat-card">
            <label className="stat-label">Referral Count</label>
            <div className="stat-value">{stats.referralCount}</div>
          </div>
          {stats.referrer && (
            <div className="stat-card">
              <label className="stat-label">Your Referrer</label>
              <div className="stat-value">{shortenAddress(stats.referrer)}</div>
            </div>
          )}
        </div>
      )}

      {tree.length > 0 && (
        <div className="referral-section">
          <h3 className="stats-header">Your Referral Network</h3>
          <div className="tree-container">
            <div className="tree">
              {[1, 2, 3].map(level => (
                groupedByLevel[level]?.length > 0 && (
                  <div key={level} className="tree-level">
                    <span className="level-indicator">Level {level}</span>
                    {groupedByLevel[level].map(ref => (
                      <div key={ref.addr} className="tree-node">
                        <div className="node-address">
                          {shortenAddress(ref.addr)}
                        </div>
                        <div className="node-rewards">
                          {formatReward(ref.rewardsEarned)} Tokens
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {referrals && referrals.length > 0 && (
        <div className="referral-section">
          <h3 className="stats-header">All Direct Referrals</h3>
          <ul className="referral-list">
            {referrals.map((address) => (
              <li key={address} className="referral-item">
                {shortenAddress(address)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}