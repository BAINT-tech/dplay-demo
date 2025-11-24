// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title AppRegistry
 * @dev Decentralized app registry for D-Play
 * @notice Manages app registration, verification, and metadata on-chain
 */
contract AppRegistry {
    struct App {
        string name;
        string category;
        string ipfsHash;
        address developer;
        uint256 price;
        uint256 downloads;
        uint256 rating;
        uint256 ratingCount;
        bool verified;
        uint256 registeredAt;
    }

    // State variables
    mapping(uint256 => App) public apps;
    mapping(address => uint256[]) public developerApps;
    mapping(address => mapping(uint256 => bool)) public userInstalls;
    
    uint256 public appCount;
    address public owner;
    uint256 public registrationFee = 0.001 ether;

    // Events
    event AppRegistered(
        uint256 indexed appId,
        string name,
        address indexed developer,
        string ipfsHash
    );
    
    event AppInstalled(
        uint256 indexed appId,
        address indexed user,
        uint256 price
    );
    
    event AppRated(
        uint256 indexed appId,
        address indexed user,
        uint256 rating
    );
    
    event AppVerified(uint256 indexed appId);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier validAppId(uint256 _appId) {
        require(_appId > 0 && _appId <= appCount, "Invalid app ID");
        _;
    }

    modifier onlyDeveloper(uint256 _appId) {
        require(apps[_appId].developer == msg.sender, "Not the developer");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Register a new app on the platform
     * @param _name App name
     * @param _category App category
     * @param _ipfsHash IPFS hash containing app metadata and files
     * @param _price Price in wei (0 for free apps)
     */
    function registerApp(
        string memory _name,
        string memory _category,
        string memory _ipfsHash,
        uint256 _price
    ) external payable returns (uint256) {
        require(msg.value >= registrationFee, "Insufficient registration fee");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");

        appCount++;
        
        apps[appCount] = App({
            name: _name,
            category: _category,
            ipfsHash: _ipfsHash,
            developer: msg.sender,
            price: _price,
            downloads: 0,
            rating: 0,
            ratingCount: 0,
            verified: false,
            registeredAt: block.timestamp
        });

        developerApps[msg.sender].push(appCount);

        emit AppRegistered(appCount, _name, msg.sender, _ipfsHash);

        return appCount;
    }

    /**
     * @dev Install an app (free or paid)
     * @param _appId ID of the app to install
     */
    function installApp(uint256 _appId) 
        external 
        payable 
        validAppId(_appId) 
    {
        App storage app = apps[_appId];
        require(msg.value >= app.price, "Insufficient payment");
        require(!userInstalls[msg.sender][_appId], "App already installed");

        userInstalls[msg.sender][_appId] = true;
        app.downloads++;

        // Transfer payment to developer
        if (app.price > 0) {
            payable(app.developer).transfer(app.price);
        }

        emit AppInstalled(_appId, msg.sender, app.price);

        // Refund excess payment
        if (msg.value > app.price) {
            payable(msg.sender).transfer(msg.value - app.price);
        }
    }

    /**
     * @dev Rate an app (1-5 stars)
     * @param _appId ID of the app to rate
     * @param _rating Rating value (1-5)
     */
    function rateApp(uint256 _appId, uint256 _rating) 
        external 
        validAppId(_appId) 
    {
        require(_rating >= 1 && _rating <= 5, "Rating must be 1-5");
        require(userInstalls[msg.sender][_appId], "Must install before rating");

        App storage app = apps[_appId];
        
        // Update average rating
        uint256 totalRating = app.rating * app.ratingCount;
        app.ratingCount++;
        app.rating = (totalRating + _rating) / app.ratingCount;

        emit AppRated(_appId, msg.sender, _rating);
    }

    /**
     * @dev Verify an app (owner only)
     * @param _appId ID of the app to verify
     */
    function verifyApp(uint256 _appId) 
        external 
        onlyOwner 
        validAppId(_appId) 
    {
        apps[_appId].verified = true;
        emit AppVerified(_appId);
    }

    /**
     * @dev Update app metadata
     * @param _appId ID of the app to update
     * @param _ipfsHash New IPFS hash
     */
    function updateApp(uint256 _appId, string memory _ipfsHash) 
        external 
        validAppId(_appId) 
        onlyDeveloper(_appId) 
    {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        apps[_appId].ipfsHash = _ipfsHash;
    }

    /**
     * @dev Get app details
     * @param _appId ID of the app
     */
    function getApp(uint256 _appId) 
        external 
        view 
        validAppId(_appId) 
        returns (App memory) 
    {
        return apps[_appId];
    }

    /**
     * @dev Get all apps by a developer
     * @param _developer Developer address
     */
    function getDeveloperApps(address _developer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return developerApps[_developer];
    }

    /**
     * @dev Check if user has installed an app
     * @param _user User address
     * @param _appId App ID
     */
    function hasInstalled(address _user, uint256 _appId) 
        external 
        view 
        returns (bool) 
    {
        return userInstalls[_user][_appId];
    }

    /**
     * @dev Update registration fee (owner only)
     * @param _newFee New fee in wei
     */
    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
