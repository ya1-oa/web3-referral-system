import { useState, useEffect } from 'react';
import { getUserStats, getUserReferrals, getReferralTree, getNFTTokenURI, getNFTSubscriptionStatus, getNFTExpiryTime, getBatchUserStats, getAddress } from './referral';

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
  level:  number;
  rewardsEarned: bigint;
}

export function useUserStats(address: string) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchStats() {
      try {
        const data = await getUserStats(address);
        setStats(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [address]);

  return { stats, loading, error };
}

export function useUserReferrals(address: string) {
  const [referrals, setReferrals] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchReferrals() {
      try {
        const data = await getUserReferrals(address);
        setReferrals(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchReferrals();
  }, [address]);

  return { referrals, loading, error };
}

export function useReferralTree(address: string) {
  const [tree, setTree] = useState<ReferralInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchTree() {
      try {
        const data = await getReferralTree(address);
        setTree(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchTree();
  }, [address]);

  return { tree, loading, error };
}

export function useSubscriptionNFT(address: string) {
  const [nftData, setNftData] = useState<{
    timeUntilExpiry: bigint;
    isSubscribed: boolean;
    tokenURI: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchNFTData() {
      try {
        const [timeUntilExpiry, isSubscribed, tokenURI] = await Promise.all([
          getNFTExpiryTime(address),
          getNFTSubscriptionStatus(address),
          getNFTTokenURI(address)
        ]);

        setNftData({
          timeUntilExpiry,
          isSubscribed,
          tokenURI,
        });
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchNFTData();
    // Poll every minute to check subscription status
    const interval = setInterval(fetchNFTData, 60000);
    return () => clearInterval(interval);
  }, [address]);

  return { nftData, loading, error };
}


export function useBatchUserStats(addresses: string[]) {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


    async function fetchStats() {
      try {
        const [data] = await Promise.all([
          getBatchUserStats(addresses)
          ]);

          setStats(data)
        } catch (error) {
          setError(error as Error);
        } finally {
          setLoading(false);
        }}

  fetchStats();

  return { stats, loading, error };
  
}

export function useGetAddress(){
  const [addr, setAddr] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  async function fetchAddr() {
    try {
      const [data] = await Promise.all([
        getAddress()
        ]);
        setAddr(data)
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }}
      
  fetchAddr();

  return { addr, loading, error };
}