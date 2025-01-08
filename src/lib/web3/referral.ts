import { publicClient, getWalletClient } from './contract';
import { CONTRACT_ADDRESS, NFT_CONTRACT_ADDRESS, REWARD_TOKEN_ADDRESS } from './config';
import { contractABI, tokenABI, nftABI } from './abi';

const zeroAddress = '0x0000000000000000000000000000000000000000';

export async function registerUser(referrerAddress?: string) {
  try {
    const walletClient = await getWalletClient();
    const [address] = await walletClient.getAddresses();

    // Check token balance first
    const balance = await publicClient.readContract({
      address: REWARD_TOKEN_ADDRESS,
      abi: tokenABI,
      functionName: 'balanceOf',
      args: [address],
    }) as bigint;

    if (balance < BigInt('100000000000000000000')) { // 100 tokens
      return {
        success: false,
        error: new Error("Insufficient token balance. You need 100 REF tokens to register.")
      };
    }

    // First approve tokens
    const approveHash = await walletClient.writeContract({
      address: REWARD_TOKEN_ADDRESS,
      abi: tokenABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, BigInt('1000000000000000000000')], // 1000 tokens to be safe
      account: address,
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Validate that user isn't trying to refer themselves
    if (referrerAddress && referrerAddress.toLowerCase() === address.toLowerCase()) {
      return { 
        success: false, 
        error: new Error("You cannot refer yourself") 
      };
    }

    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'register',
      args: [referrerAddress || zeroAddress],
      account: address,
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return { success: true, hash: receipt.transactionHash };
  } catch (error: any) {
    console.error('Error in registerUser:', error);
    
    if (error.message.includes("insufficient")) {
      return { 
        success: false, 
        error: new Error("Insufficient token balance. You need 100 REF tokens to register.") 
      };
    }
    // Handle specific error messages
    if (error.message.includes("already registered")) {
      return { 
        success: false, 
        error: new Error("This address is already registered") 
      };
    }
    if (error.message.includes("invalid referrer")) {
      return { 
        success: false, 
        error: new Error("Invalid referrer address") 
      };
    }

    return { 
      success: false, 
      error: new Error("Registration failed. Please try again.") 
    };
  }
}

export async function getUserStats(address: string) {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'getUserStats',
      args: [address],
    }) as [string, bigint, bigint, boolean, boolean, bigint];

    return {
      referrer: data[0],
      referralCount: Number(data[1]),
      totalRewards: Number(data[2]),
      isRegistered: data[3],
      isSubscribed: data[4],
      tokenId: data[5],
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    throw error;
  }
}


export async function getUserReferrals(address: string) {
  try {
    const referrals = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'getUserReferrals',
      args: [address],
    });

    return referrals;
  } catch (error) {
    console.error('Error in getUserReferrals:', error);
    throw error;
  }
}

interface ReferralInfo {
  addr: string;
  level: number;
  rewardsEarned: bigint;
}

export async function getReferralTree(address: string): Promise<ReferralInfo[]> {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'getReferralTree',
      args: [address],
    }) as ReferralInfo[];

    return data;
  } catch (error) {
    console.error('Error in getReferralTree:', error);
    throw error;
  }
}

export async function getNFTExpiryTime(address: string) {
  const tokenId = await publicClient.readContract({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: 'getUserStats',
    args: [address],
  }) as [string, bigint, bigint, boolean, boolean, bigint];
  
  const TOKENID = tokenId[5];
  
  try {
    const data = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: nftABI,
      functionName: 'timeUntilExpired',
      args: [TOKENID],
    }) as bigint;
    return data;
  } catch (error) {
    console.error('Error in getNFTExpiryTime:', error);
    throw error;
  }
}

export async function getNFTSubscriptionStatus(address: string) {
  try {
    const data = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'checkSubscriptionStatus',
      args: [address],
    }) as boolean;

    return data;
  } catch (error) {
    console.error('Error in getNFTSubscriptionStatus:', error);
    throw error;
  }
}

// call this on the NFT contract
export async function getNFTTokenURI(address: string) {
  try {
    const tokenId = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'getUserStats',
      args: [address],
    }) as [string, bigint, bigint, boolean, boolean, bigint];
    
    const TOKENID = tokenId[5];

    const uri = await publicClient.readContract({
      address: NFT_CONTRACT_ADDRESS,
      abi: nftABI,
      functionName: 'tokenURI',
      args: [TOKENID],
    }) as string;

    // Fetch and parse metadata
    const response = await fetch(uri);
    const metadata = await response.json();
    return metadata.image || uri; // Return image URL or fallback to URI

  } catch (error) {
    console.error('Error in getNFTTokenURI:', error);
    throw error;
  }
}

export async function renewSubscription(address: string) {
  try {
    const walletClient = await getWalletClient();
    const [walletAddress] = await walletClient.getAddresses();
    
    // First approve tokens for subscription
    const approveHash = await walletClient.writeContract({
      address: REWARD_TOKEN_ADDRESS,
      abi: tokenABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, BigInt('50000000000000000000')], // 50 tokens
      account: walletAddress,
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    // Then call subscribe
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: contractABI,
      functionName: 'subscribe',
      args: [address],
      account: walletAddress,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return { success: true };
  } catch (error) {
    console.error('Error in renewSubscription:', error);
    throw error;
  }
}