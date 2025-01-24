import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Users, Award, BarChart2, TrendingUp, Share2 } from 'lucide-react';
import { useUserStats, useUserReferrals, useReferralTree, useBatchUserStats, useGetAddress } from '../lib/web3/hooks';
import { formatReward, shortenAddress } from '../lib/web3/utils';
import { SubscriptionNFT } from './SubscriptionNFT';
import debounce from 'lodash/debounce';

interface UserStats {
  referrer: string;
  referralCount: bigint;
  totalRewards: bigint;
  isRegistered: boolean;
  isSubscribed: boolean;
  tokenID: bigint;
}

interface ReferralInfo {
  addr: string;
  level: number;
  rewardsEarned: bigint;
  parentAddr?: string;
}

function buildReferralTree(referrals: ReferralInfo[], batchStats: UserStats[]) {  
  const referrerMap = new Map<string, string>();
  
  batchStats.forEach((stats: UserStats, index: number) => {
    if (stats.referrer) {
      referrerMap.set(
        referrals[index].addr.toLowerCase(),
        stats.referrer.toLowerCase()
      );
    }
  });

  return referrals.map(ref => ({
    ...ref,
    parentAddr: referrerMap.get(ref.addr.toLowerCase())
  }));
}

export function ReferralStats() {
  const { address } = useParams<{ address: string }>();
  const { addr: currentUserAddr } = useGetAddress();
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const lastUpdateRef = useRef<number>(0);
  const UPDATE_INTERVAL = 30000;
  const initialLoadRef = useRef<boolean>(false);


  const [treeCache, setTreeCache] = useState<{
    tree: ReferralInfo[];
    timestamp: number;
  } | null>(null);

  const [groupedByLevel, setGroupedByLevel] = useState<Record<number, ReferralInfo[]>>({});

  // Destructure results
    // Hooks called at top level
    const { stats, loading: statsLoading } = useUserStats(address || '');
    const { referrals, loading: referralsLoading } = useUserReferrals(address || '');
    const { tree, loading: treeLoading } = useReferralTree(address || '');
    
    // Memoize referral addresses ;
    const referralAddresses = useMemo(() => 
      tree && tree.length > 0 
        ? tree.map(ref => ref.addr) 
        : [], 
      [tree]
    );
    console.log(referralAddresses);
  const { stats: batchStats, loading: isBatchLoading } = useBatchUserStats(referralAddresses)

  const buildTreeMemoized = useCallback(
    debounce((tree: ReferralInfo[], batchStats: UserStats[]) => {
      const treeWithParents = buildReferralTree(tree, batchStats);
      console.log("tree with parents: ", treeWithParents);
      const grouped = treeWithParents.reduce((acc, ref: ReferralInfo) => {
        acc[ref.level] = acc[ref.level] || [];
        acc[ref.level].push(ref);
        return acc;
      }, {} as Record<number, ReferralInfo[]>);
      setGroupedByLevel(grouped);
      setTreeCache({
        tree: treeWithParents,
        timestamp: Date.now()
      });
    }, 500),
    []
  );
  
  const shouldUpdate = useCallback(() => {
    const now = Date.now();
    return ( 
      !initialLoadRef.current ||
      !treeCache ||
      (now - lastUpdateRef.current >= UPDATE_INTERVAL)
    );
  }, [treeCache]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [])
  
  useEffect(() => {
    if (
      tree &&
      batchStats &&
      !statsLoading &&
      !referralsLoading &&
      !treeLoading && 
      !isBatchLoading
    ) {
      initialLoadRef.current = true;
      lastUpdateRef.current = Date.now();

      buildTreeMemoized(tree, batchStats);

      updateTimeoutRef.current = setTimeout(() => {
        buildTreeMemoized(tree, batchStats)
      }, UPDATE_INTERVAL);
    }
  }, [
    tree,
    batchStats,
    statsLoading,
    referralsLoading,
    treeLoading,
    isBatchLoading,
  ])
  
  if (statsLoading || referralsLoading || treeLoading || isBatchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }
  
  const dashboardStats = {
    totalReferrals: stats?.referralCount || 0,
    totalRewards: Number(stats?.totalRewards || 0),
    activeTraders: Object.values(groupedByLevel).reduce((total, level) => 
      total + level.filter(ref => Number(ref.rewardsEarned) > 0).length, 0
    ),
    averageROI: stats?.totalRewards && stats.referralCount 
      ? (Number(stats.totalRewards) % 18  / Number(stats.referralCount)).toFixed(2)
      : 0
  };
  // Validate render conditions
  if (!address) { 
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: User address is not provided.</div>
      </div>
    );
  }

  if (currentUserAddr && address !== currentUserAddr) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: Unauthorized access to stat page.</div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <SubscriptionNFT userAddress={address} />
      <h1 className="text-3xl font-bold text-white mb-8">Research Dashboard</h1>
      
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">NETWORK</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{Number(dashboardStats.totalReferrals)}</div>
          <div className="text-gray-400 text-sm">Total Referrals</div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">REWARDS</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {formatReward(BigInt(dashboardStats.totalRewards))}
          </div>
          <div className="text-gray-400 text-sm">Total Rewards Earned</div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart2 className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">ACTIVITY</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{dashboardStats.activeTraders}</div>
          <div className="text-gray-400 text-sm">Active Traders</div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-6 h-6 text-cyan-400" />
            <span className="text-xs text-cyan-400 font-mono">PERFORMANCE</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{dashboardStats.averageROI}%</div>
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
          {[1, 2, 3].map(level => (
            groupedByLevel[level]?.length > 0 && (
              <div key={level} className="mb-6">
                <div className="text-cyan-400 text-sm mb-2">
                  Level {level} ({groupedByLevel[level].length} referrals)
                </div>
                <div className="space-y-2">
                  {groupedByLevel[level].map(ref => (
                    <div key={ref.addr} className="flex items-center justify-between bg-[#1a365d] p-3 rounded-lg">
                      <div className="text-white font-mono">
                        {shortenAddress(ref.addr)}
                        {ref.parentAddr && (
                          <span className="text-gray-400 text-sm ml-2">
                            (via {shortenAddress(ref.parentAddr)})
                          </span>
                        )}
                      </div>
                      <div className="text-cyan-400">{formatReward(ref.rewardsEarned)} Tokens</div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          </div>
        </div>

        <div className="bg-[#112A45] border border-cyan-900/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Direct Referrals</h2>
            <BarChart2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-4">
            {referrals?.map((referral: UserStats) => (
              <div key={referral.referrer} className="flex items-center justify-between py-3 border-b border-cyan-900/30">
                <div className="text-white font-medium">{shortenAddress(referral.referrer)}</div>
                <div className="text-cyan-400">
                  {groupedByLevel[1]?.find(ref => ref.addr.toLowerCase() === referral.referrer.toLowerCase())?.rewardsEarned 
                    ? formatReward(groupedByLevel[1].find(ref => ref.addr.toLowerCase() === referral.referrer.toLowerCase())!.rewardsEarned)
                    : "0"} Tokens
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralStats;