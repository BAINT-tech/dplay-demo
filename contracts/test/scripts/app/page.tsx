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
            <p className="text-purple-300">{selectedApp.category}</p>
