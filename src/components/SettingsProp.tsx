import React from 'react'

interface UserStats {
  referrer: string;
  referralCount: bigint;
  totalRewards: bigint;
  isRegistered: boolean;
  isSubscribed: boolean;
  tokenID: bigint;
}

interface SettingsProps {
  stats: UserStats | null;
  address: string | null;
}

function Settings({stats, address}:SettingsProps) {
  return (
    <div>Settings</div>
  )
}

export default Settings