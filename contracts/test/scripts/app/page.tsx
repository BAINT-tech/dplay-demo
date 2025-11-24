'use client';

import React, { useState } from 'react';
import { Smartphone, Download, Star, Shield, Wallet, CheckCircle, X } from 'lucide-react';

const mockApps = [
  {
    id: 1,
    name: "DecentraChat",
    category: "Social",
    icon: "💬",
    rating: 4.8,
    downloads: "50K+",
    size: "12 MB",
    description: "Decentralized messaging app with end-to-end encryption. Chat securely without intermediaries.",
    screenshots: ["📱", "💬", "🔒"],
    version: "2.1.0",
    developer: "0x742d...3f4a",
    ipfsHash: "QmX4z9...demo1"
  },
  {
    id: 2,
    name: "CryptoGaming",
    category: "Games",
    icon: "🎮",
    rating: 4.6,
    downloads: "100K+",
    size: "45 MB",
    description: "Play-to-earn blockchain gaming platform. Collect NFTs and earn rewards while playing.",
    screenshots: ["🎮", "🏆", "💎"],
    version: "1.5.2",
    developer: "0x8a1c...7b2d",
    ipfsHash: "QmY7k3...demo2"
  },
  {
    id: 3,
    name: "DeFi Wallet Pro",
    category: "Finance",
    icon: "💰",
    rating: 4.9,
    downloads: "200K+",
    size: "18 MB",
    description: "Professional DeFi wallet with multi-chain support. Manage your crypto assets securely.",
    screenshots: ["💰", "📊", "🔐"],
    version: "3.0.1",
    developer: "0x3e9f...1c8b",
    ipfsHash: "QmZ8m5...demo3"
  },
  {
    id: 4,
    name: "NFT Marketplace",
    category: "Shopping",
    icon: "🖼️",
    rating: 4.7,
    downloads: "75K+",
    size: "25 MB",
    description: "Browse and trade NFTs across multiple chains. Discover unique digital art and collectibles.",
    screenshots: ["🖼️", "🎨", "💎"],
    version: "2.3.0",
    developer: "0x5c2d...9a4f",
    ipfsHash: "QmA9n6...demo4"
  }
];

const categories = ["All", "Social", "Games", "Finance", "Shopping", "Tools"];

export default function DPlayDemo() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  const filteredApps = selectedCategory === 'All' 
    ? mockApps 
    : mockApps.filter(app => app.category === selectedCategory);

  const featuredApps = mockApps.slice(0, 3);

  const connectWallet = async () => {
    setInstalling(true);
    setTimeout(() => {
      setWalletConnected(true);
      setWalletAddress('0x742d...3f4a');
      setInstalling(false);
      setTimeout(() => {
        setInstalled(true);
        setTimeout(() => {
          setShowWalletModal(false);
          setInstalled(false);
        }, 2000);
      }, 1500);
    }, 2000);
  };

  const handleInstall = (app: any) => {
    setSelectedApp(app);
    setShowWalletModal(true);
  };

  const AppCard = ({ app, featured = false }: { app: any, featured?: boolean }) => (
    <div 
      className={`bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-4 cursor-pointer hover:scale-105 transition-transform ${featured ? 'w-64' : ''}`}
      onClick={() => {
        setSelectedApp(app);
        setCurrentView('detail');
      }}
    >
      <div className="flex items-start gap-3">
        <div className="text-4xl bg-purple-600/30 p-3 rounded-xl">{app.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold truncate">{app.name}</h3>
          <p className="text-purple-300 text-sm">{app.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-300">{app.rating}</span>
            </div>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{app.downloads}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="text-xl font-bold text-white mb-4 px-4">Featured Apps</h2>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
          {featuredApps.map(app => (
            <AppCard key={app.id} app={app} featured />
          ))}
        </div>
      </div>

      <div className="px-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-xl font-bold text-white mb-4">
          {selectedCategory === 'All' ? 'All Apps' : selectedCategory}
        </h2>
        <div className="grid gap-4">
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );

  const DetailView = () => (
    <div className="pb-20">
      <div className="sticky top-0 bg-gradient-to-b from-purple-950 to-transparent z-10 pb-4">
        <button
          onClick={() => setCurrentView('home')}
          className="text-purple-300 hover:text-white p-4"
        >
          ← Back
        </button>
      </div>

      <div className="px-4 space-y-6">
        <div className="flex items-start gap-4">
          <div className="text-6xl bg-purple-600/30 p-4 rounded-2xl">{selectedApp.icon}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white">{selectedApp.name}</h1>
            <p className="text-purple-300">{selectedApp.category}</p><div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">{selectedApp.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4 text-purple-300" />
                <span className="text-gray-300 text-sm">{selectedApp.downloads}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleInstall(selectedApp)}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-purple-600 transition-all"
        >
          Install ({selectedApp.size})
        </button>

        <div>
          <h3 className="text-white font-semibold mb-3">Screenshots</h3>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {selectedApp.screenshots.map((screenshot: string, idx: number) => (
              <div key={idx} className="flex-shrink-0 w-32 h-56 bg-gradient-to-br from-purple-900/40 to-purple-800/30 rounded-xl flex items-center justify-center text-5xl">
                {screenshot}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">About this app</h3>
          <p className="text-gray-300 leading-relaxed">{selectedApp.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-900/30 rounded-xl p-4">
            <p className="text-purple-300 text-sm mb-1">Version</p>
            <p className="text-white font-semibold">{selectedApp.version}</p>
          </div>
          <div className="bg-purple-900/30 rounded-xl p-4">
            <p className="text-purple-300 text-sm mb-1">Size</p>
            <p className="text-white font-semibold">{selectedApp.size}</p>
          </div>
          <div className="bg-purple-900/30 rounded-xl p-4 col-span-2">
            <p className="text-purple-300 text-sm mb-1">Developer</p>
            <p className="text-white font-mono text-sm">{selectedApp.developer}</p>
          </div>
          <div className="bg-purple-900/30 rounded-xl p-4 col-span-2">
            <p className="text-purple-300 text-sm mb-1">IPFS Hash</p>
            <p className="text-white font-mono text-xs break-all">{selectedApp.ipfsHash}</p>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-700/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">Verified on Blockchain</span>
          </div>
          <p className="text-gray-300 text-sm">This app has been verified and registered on Polygon Mumbai testnet.</p>
        </div>
      </div>
    </div>
  );

  const WalletModal = () => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end z-50 animate-in fade-in">
      <div className="bg-gradient-to-b from-purple-900 to-purple-950 w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Install App</h2>
          <button
            onClick={() => {
              setShowWalletModal(false);
              setInstalled(false);
              setWalletConnected(false);
            }}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!walletConnected && !installed && (
          <div className="space-y-4">
            <div className="bg-purple-800/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{selectedApp?.icon}</div>
                <div>
                  <h3 className="text-white font-semibold">{selectedApp?.name}</h3>
                  <p className="text-purple-300 text-sm">{selectedApp?.size}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-gray-300 text-sm">Connect your wallet to install this app on the blockchain.</p>
              
              <button
                onClick={connectWallet}
                disabled={installing}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-700 hover:to-purple-600 transition-all disabled:opacity-50"
              >
                <Wallet className="w-5 h-5" />
                {installing ? 'Connecting...' : 'Connect MetaMask'}
              </button>

              <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4">
                <p className="text-blue-300 text-sm">
                  <strong>Free Installation:</strong> This demo simulates the installation process. No actual transaction will be made.
                </p>
              </div>
            </div>
          </div>
        )}

        {walletConnected && !installed && (
          <div className="text-center py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold mb-2">Installing...</p>
            <p className="text-gray-400 text-sm">Writing to blockchain</p>
          </div>
        )}

        {installed && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-white font-semibold text-xl mb-2">Installed!</p>
            <p className="text-gray-400">App has been added to your device</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-purple-900 to-black">
      <div className="max-w-md mx-auto min-h-screen bg-black shadow-2xl relative">
        <div className="bg-black px-6 py-3 flex justify-between items-center text-white text-sm">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-purple-900 to-transparent px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">D-Play</h1>
            </div>
            {walletConnected && (
              <div className="flex items-center gap-2 bg-purple-800/50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-white font-mono">{walletAddress}</span>
              </div>
            )}
          </div>
          <p className="text-purple-300 text-sm">Powered by BaintComputer AIOPs</p>
        </div>

        <div className="px-0">
          {currentView === 'home' ? <HomeView /> : <DetailView />}
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-black/90 backdrop-blur-lg border-t border-purple-800/50">
          <div className="flex justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-300">
              <Smartphone className="w-6 h-6" />
              <span className="text-xs">Apps</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-400">
              <Star className="w-6 h-6" />
              <span className="text-xs">Featured</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-400">
              <Download className="w-6 h-6" />
              <span className="text-xs">Library</span>
            </button>
          </div>
        </div>

        {showWalletModal && <WalletModal />}
      </div>

      <div className="text-center py-8 text-gray-500 text-sm max-w-md mx-auto">
        <p>D-Play Demo • Polygon Mumbai Testnet</p>
        <p className="mt-2">Contract: 0x... (Deploy to get address)</p>
      </div>
    </div>
  );
}
