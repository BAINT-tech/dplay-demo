import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Starting D-Play AppRegistry deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(await deployer.getBalance()), "MATIC\n");

  console.log("📦 Deploying AppRegistry contract...");
  const AppRegistry = await ethers.getContractFactory("AppRegistry");
  const appRegistry = await AppRegistry.deploy();
  await appRegistry.deployed();

  console.log("✅ AppRegistry deployed to:", appRegistry.address);
  console.log("⛓️  Transaction hash:", appRegistry.deployTransaction.hash);
  console.log("⏳ Waiting for confirmations...\n");

  await appRegistry.deployTransaction.wait(5);

  console.log("📱 Registering demo apps...\n");

  const demoApps = [
    {
      name: "DecentraChat",
      category: "Social",
      ipfsHash: "QmX4z9demo1hash",
      price: 0
    },
    {
      name: "CryptoGaming",
      category: "Games",
      ipfsHash: "QmY7k3demo2hash",
      price: 0
    },
    {
      name: "DeFi Wallet Pro",
      category: "Finance",
      ipfsHash: "QmZ8m5demo3hash",
      price: 0
    }
  ];

  const registrationFee = await appRegistry.registrationFee();

  for (let i = 0; i < demoApps.length; i++) {
    const app = demoApps[i];
    console.log(`${i + 1}. Registering "${app.name}"...`);
    
    const tx = await appRegistry.registerApp(
      app.name,
      app.category,
      app.ipfsHash,
      app.price,
      { value: registrationFee }
    );
    
    await tx.wait();
    console.log(`   ✅ Registered with App ID: ${i + 1}`);
  }

  console.log("\n🔍 Verifying demo apps...\n");

  for (let i = 1; i <= demoApps.length; i++) {
    const tx = await appRegistry.verifyApp(i);
    await tx.wait();
    console.log(`✅ App ID ${i} verified`);
  }

  const appCount = await appRegistry.appCount();
  const contractBalance = await appRegistry.getBalance();

  console.log("\n📊 Deployment Summary:");
  console.log("═".repeat(50));
  console.log("Contract Address:", appRegistry.address);
  console.log("Total Apps Registered:", appCount.toString());
  console.log("Contract Balance:", ethers.utils.formatEther(contractBalance), "MATIC");
  console.log("═".repeat(50));

  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    contractAddress: appRegistry.address,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    appCount: appCount.toString(),
    demoApps: demoApps.map((app, idx) => ({
      appId: idx + 1,
      ...app,
      verified: true
    }))
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deploymentsDir, "latest.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\n🎉 Deployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
