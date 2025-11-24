import { expect } from "chai";
import { ethers } from "hardhat";
import { AppRegistry } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("AppRegistry", function () {
  let appRegistry: AppRegistry;
  let owner: SignerWithAddress;
  let developer: SignerWithAddress;
  let user: SignerWithAddress;
  
  const REGISTRATION_FEE = ethers.utils.parseEther("0.001");
  const APP_PRICE = ethers.utils.parseEther("0.01");

  beforeEach(async function () {
    [owner, developer, user] = await ethers.getSigners();
    
    const AppRegistry = await ethers.getContractFactory("AppRegistry");
    appRegistry = await AppRegistry.deploy();
    await appRegistry.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await appRegistry.owner()).to.equal(owner.address);
    });

    it("Should initialize app count to 0", async function () {
      expect(await appRegistry.appCount()).to.equal(0);
    });

    it("Should set initial registration fee", async function () {
      expect(await appRegistry.registrationFee()).to.equal(REGISTRATION_FEE);
    });
  });

  describe("App Registration", function () {
    it("Should register a new app successfully", async function () {
      const tx = await appRegistry.connect(developer).registerApp(
        "DecentraChat",
        "Social",
        "QmX4z9...demo1",
        0,
        { value: REGISTRATION_FEE }
      );

      await expect(tx)
        .to.emit(appRegistry, "AppRegistered")
        .withArgs(1, "DecentraChat", developer.address, "QmX4z9...demo1");

      expect(await appRegistry.appCount()).to.equal(1);
    });

    it("Should fail with insufficient registration fee", async function () {
      await expect(
        appRegistry.connect(developer).registerApp(
          "TestApp",
          "Games",
          "QmTest123",
          0,
          { value: ethers.utils.parseEther("0.0001") }
        )
      ).to.be.revertedWith("Insufficient registration fee");
    });

    it("Should fail with empty name", async function () {
      await expect(
        appRegistry.connect(developer).registerApp(
          "",
          "Games",
          "QmTest123",
          0,
          { value: REGISTRATION_FEE }
        )
      ).to.be.revertedWith("Name cannot be empty");
    });
  });

  describe("App Installation", function () {
    beforeEach(async function () {
      await appRegistry.connect(developer).registerApp(
        "FreeApp",
        "Tools",
        "QmFree123",
        0,
        { value: REGISTRATION_FEE }
      );

      await appRegistry.connect(developer).registerApp(
        "PaidApp",
        "Finance",
        "QmPaid456",
        APP_PRICE,
        { value: REGISTRATION_FEE }
      );
    });

    it("Should install free app successfully", async function () {
      const tx = await appRegistry.connect(user).installApp(1);

      await expect(tx)
        .to.emit(appRegistry, "AppInstalled")
        .withArgs(1, user.address, 0);

      expect(await appRegistry.hasInstalled(user.address, 1)).to.be.true;
    });

    it("Should install paid app with correct payment", async function () {
      const developerBalanceBefore = await developer.getBalance();

      await appRegistry.connect(user).installApp(2, { value: APP_PRICE });

      const developerBalanceAfter = await developer.getBalance();
      expect(developerBalanceAfter.sub(developerBalanceBefore)).to.equal(APP_PRICE);
    });

    it("Should fail installing paid app with insufficient payment", async function () {
      await expect(
        appRegistry.connect(user).installApp(2, { value: ethers.utils.parseEther("0.001") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should increment download count", async function () {
      await appRegistry.connect(user).installApp(1);
      
      const app = await appRegistry.getApp(1);
      expect(app.downloads).to.equal(1);
    });

    it("Should prevent duplicate installations", async function () {
      await appRegistry.connect(user).installApp(1);
      
      await expect(
        appRegistry.connect(user).installApp(1)
      ).to.be.revertedWith("App already installed");
    });
  });

  describe("App Rating", function () {
    beforeEach(async function () {
      await appRegistry.connect(developer).registerApp(
        "TestApp",
        "Social",
        "QmTest123",
        0,
        { value: REGISTRATION_FEE }
      );

      await appRegistry.connect(user).installApp(1);
    });

    it("Should rate app successfully", async function () {
      const tx = await appRegistry.connect(user).rateApp(1, 5);

      await expect(tx)
        .to.emit(appRegistry, "AppRated")
        .withArgs(1, user.address, 5);

      const app = await appRegistry.getApp(1);
      expect(app.rating).to.equal(5);
      expect(app.ratingCount).to.equal(1);
    });

    it("Should fail rating without installation", async function () {
      const [, , user2] = await ethers.getSigners();

      await expect(
        appRegistry.connect(user2).rateApp(1, 5)
      ).to.be.revertedWith("Must install before rating");
    });
  });

  describe("App Verification", function () {
    beforeEach(async function () {
      await appRegistry.connect(developer).registerApp(
        "TestApp",
        "Social",
        "QmTest123",
        0,
        { value: REGISTRATION_FEE }
      );
    });

    it("Should verify app as owner", async function () {
      const tx = await appRegistry.connect(owner).verifyApp(1);

      await expect(tx)
        .to.emit(appRegistry, "AppVerified")
        .withArgs(1);

      const app = await appRegistry.getApp(1);
      expect(app.verified).to.be.true;
    });

    it("Should fail verifying as non-owner", async function () {
      await expect(
        appRegistry.connect(user).verifyApp(1)
      ).to.be.revertedWith("Only owner can call this");
    });
  });
});
