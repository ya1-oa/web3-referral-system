import { Wallet } from 'lucide-react';
import { getWalletClient, switchToPolygonAmoy } from '../lib/web3/contract';
import { useState, Dispatch, SetStateAction } from 'react';
import { TestTube } from 'lucide-react';

interface HeaderProps {
  isWalletConnected: boolean;
  isLoading: boolean;
  onConnect: Dispatch<SetStateAction<string | null>>;
  onConnectWallet: () => void;
  error: string | null;
}


export function Header({ isWalletConnected, onConnectWallet , isLoading, error}: HeaderProps) {
    
if (isLoading) {
    return (    <header className="bg-[#112A45] border-b border-cyan-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <TestTube className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white">Trading Lab</span>
            </div>
            
            <button
              onClick={onConnectWallet}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                isWalletConnected
                  ? 'bg-green-500 text-white'
                  : 'bg-cyan-500 text-white hover:bg-cyan-400'
              } transition-colors`}
            >
              <Wallet className="w-5 h-5" />
              <span>
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </span>
            </button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </div>
        </div>
      </header>);
   }
return (
    <header className="bg-[#112A45] border-b border-cyan-900/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <TestTube className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold text-white">Trading Lab</span>
          </div>
          
          <button
            onClick={onConnectWallet}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
              isWalletConnected
                ? 'bg-green-500 text-white'
                : 'bg-cyan-500 text-white hover:bg-cyan-400'
            } transition-colors`}
          >
            <Wallet className="w-5 h-5" />
            <span>
              {isWalletConnected ? 'Connected' : 'Connect Wallet'}
            </span>
          </button>
          {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
      </div>
    </header>);
}