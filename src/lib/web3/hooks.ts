import { useState, useEffect } from 'react';
import { getUserStats, getUserReferrals, getReferralTree } from './referral';

interface UserStats {
  referrer: string;
  referralCount: number;
  totalRewards: number;
  isRegistered: boolean;
}

interface ReferralInfo {
  addr: string;
  level: number;
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
  const [referrals, setReferrals] = useState<string[]>([]);
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
        setReferrals(data as string[]);
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