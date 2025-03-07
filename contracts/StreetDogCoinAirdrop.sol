// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract StreetDogCoinAirdrop is Ownable, ReentrancyGuard {
    IERC20 public token;
    
    uint256 public airdropAmount = 1000 * 10**18; // 1000 tokens por usuário
    uint256 public referralBonus = 200 * 10**18; // 200 tokens por referral
    uint256 public startTime;
    uint256 public endTime;
    
    bool public airdropActive = false;
    
    mapping(address => bool) public hasClaimed;
    mapping(address => uint256) public referralCount;
    mapping(address => address) public referredBy;
    
    event TokensClaimed(address indexed user, uint256 amount, address indexed referrer);
    event ReferralBonusClaimed(address indexed referrer, address indexed referred, uint256 amount);
    event AirdropStatusChanged(bool active);
    event AirdropTimeSet(uint256 startTime, uint256 endTime);
    
    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }
    
    function setToken(address _tokenAddress) external onlyOwner {
        token = IERC20(_tokenAddress);
    }
    
    function setAirdropAmount(uint256 _amount) external onlyOwner {
        airdropAmount = _amount;
    }
    
    function setReferralBonus(uint256 _amount) external onlyOwner {
        referralBonus = _amount;
    }
    
    function setAirdropTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_endTime > _startTime, "End time must be after start time");
        startTime = _startTime;
        endTime = _endTime;
        emit AirdropTimeSet(_startTime, _endTime);
    }
    
    function toggleAirdropStatus() external onlyOwner {
        airdropActive = !airdropActive;
        emit AirdropStatusChanged(airdropActive);
    }
    
    function isEligible(address user) public view returns (bool) {
        return !hasClaimed[user] && block.timestamp >= startTime && block.timestamp <= endTime;
    }

    function claimTokens() external nonReentrant {
        require(airdropActive, "Airdrop is not active");
        require(isEligible(msg.sender), "Not eligible to claim");
        
        hasClaimed[msg.sender] = true;
        token.transfer(msg.sender, airdropAmount);
        
        emit TokensClaimed(msg.sender, airdropAmount, address(0));
    }
    
    function claimWithReferral(address referrer) external nonReentrant {
        require(airdropActive, "Airdrop is not active");
        require(isEligible(msg.sender), "Not eligible to claim");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(referrer != address(0), "Invalid referrer address");
        
        hasClaimed[msg.sender] = true;
        referredBy[msg.sender] = referrer;
        referralCount[referrer]++;
        
        token.transfer(msg.sender, airdropAmount);
        token.transfer(referrer, referralBonus);
        
        emit TokensClaimed(msg.sender, airdropAmount, referrer);
        emit ReferralBonusClaimed(referrer, msg.sender, referralBonus);
    }
    
    function withdrawTokens(uint256 amount) external onlyOwner {
        token.transfer(owner(), amount);
    }
    
    function getAirdropInfo() external view returns (
        bool active,
        uint256 baseAmount,
        uint256 refBonus,
        uint256 start,
        uint256 end
    ) {
        return (airdropActive, airdropAmount, referralBonus, startTime, endTime);
    }
    
    function getUserInfo(address user) external view returns (
        bool claimed,
        uint256 referrals,
        address referrer
    ) {
        return (hasClaimed[user], referralCount[user], referredBy[user]);
    }
}

