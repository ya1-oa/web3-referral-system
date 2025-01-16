
import {Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { TestTube } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

interface HeaderProps {
  onConnectIsAddress: Dispatch<SetStateAction<string | null>>;
}

export function Header({ onConnectIsAddress, }: HeaderProps) {
    return (    <header className="bg-[#112A45] border-b border-cyan-900/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <TestTube className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white"> <Link to="/"> Trading Lab</Link> </span>
            </div>
            
            <WalletConnect 
            onConnect={onConnectIsAddress}
             />

          </div>
        </div>
      </header>);
   }