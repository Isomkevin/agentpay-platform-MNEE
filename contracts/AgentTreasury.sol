// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IMNEE.sol";

contract AgentTreasury {
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    
    struct Agent {
        address wallet;
        string name;
        string description;
        bool isActive;
        uint256 createdAt;
        uint256 dailySpendLimit;
        uint256 dailySpent;
        uint256 lastReset;
        address owner; // Owner who can override
    }
    
    mapping(address => Agent) public agents;
    mapping(address => address) public walletToAgent;
    mapping(address => uint256) public agentBalances; // Track balances in contract
    mapping(address => bool) public authorizedContracts; // Contracts authorized to execute payments
    address[] public agentList;
    
    event AgentRegistered(address indexed agentId, address indexed wallet, string name, address owner);
    event DepositReceived(address indexed agentId, uint256 amount, address depositor);
    event PaymentExecuted(address indexed agentId, address indexed recipient, uint256 amount, bytes32 txHash);
    event SpendingLimitUpdated(address indexed agentId, uint256 newLimit);
    event AgentBalanceUpdated(address indexed agentId, uint256 newBalance);
    event ContractAuthorized(address indexed contractAddress, bool authorized);
    
    modifier onlyAgentOwner(address agentId) {
        require(agents[agentId].owner == msg.sender, "Not agent owner");
        _;
    }
    
    modifier onlyActiveAgent(address agentId) {
        require(agents[agentId].isActive, "Agent not active");
        require(agents[agentId].wallet != address(0), "Agent wallet not set");
        _;
    }
    
    modifier onlyAuthorized(address agentId) {
        require(
            agents[agentId].owner == msg.sender || authorizedContracts[msg.sender],
            "Not authorized"
        );
        _;
    }
    
    // Register a new AI agent
    function registerAgent(
        address wallet,
        string memory name,
        string memory description
    ) external returns (address agentId) {
        require(wallet != address(0), "Invalid wallet address");
        require(agents[msg.sender].wallet == address(0), "Agent already registered");
        
        agents[msg.sender] = Agent({
            wallet: wallet,
            name: name,
            description: description,
            isActive: true,
            createdAt: block.timestamp,
            dailySpendLimit: 0, // Unlimited by default
            dailySpent: 0,
            lastReset: block.timestamp,
            owner: msg.sender
        });
        
        walletToAgent[wallet] = msg.sender;
        agentList.push(msg.sender);
        
        emit AgentRegistered(msg.sender, wallet, name, msg.sender);
        return msg.sender;
    }
    
    // Deposit MNEE to agent treasury
    function depositToAgent(address agentId, uint256 amount) external {
        require(agents[agentId].wallet != address(0), "Agent not registered");
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        agentBalances[agentId] += amount;
        
        emit DepositReceived(agentId, amount, msg.sender);
        emit AgentBalanceUpdated(agentId, agentBalances[agentId]);
    }
    
    // Execute payment from agent treasury (internal function)
    function _executePayment(
        address agentId,
        address recipient,
        uint256 amount
    ) internal returns (bool) {
        require(agentBalances[agentId] >= amount, "Insufficient balance");
        
        // Reset daily spent if new day
        if (block.timestamp >= agents[agentId].lastReset + 1 days) {
            agents[agentId].dailySpent = 0;
            agents[agentId].lastReset = block.timestamp;
        }
        
        // Check daily limit
        if (agents[agentId].dailySpendLimit > 0) {
            require(
                agents[agentId].dailySpent + amount <= agents[agentId].dailySpendLimit,
                "Daily limit exceeded"
            );
        }
        
        agentBalances[agentId] -= amount;
        agents[agentId].dailySpent += amount;
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.transfer(recipient, amount), "Transfer failed");
        
        emit PaymentExecuted(agentId, recipient, amount, keccak256(abi.encodePacked(block.timestamp, agentId, recipient, amount)));
        emit AgentBalanceUpdated(agentId, agentBalances[agentId]);
        
        return true;
    }
    
    // Execute payment (can be called by owner or authorized contracts)
    function executePayment(
        address agentId,
        address recipient,
        uint256 amount
    ) external onlyActiveAgent(agentId) onlyAuthorized(agentId) returns (bool) {
        return _executePayment(agentId, recipient, amount);
    }
    
    // Authorize a contract to execute payments for all agents
    // In production, this should be controlled by governance or agent-specific authorization
    // For MVP, we allow contract deployment to authorize itself (called in constructor)
    function authorizeContract(address contractAddress, bool authorized) external {
        // For MVP: Allow any address to authorize (deployment will handle this)
        // In production: Add access control (e.g., owner or governance)
        authorizedContracts[contractAddress] = authorized;
        emit ContractAuthorized(contractAddress, authorized);
    }
    
    // Get agent balance
    function getBalance(address agentId) external view returns (uint256) {
        return agentBalances[agentId];
    }
    
    // Get agent info
    function getAgent(address agentId) external view returns (Agent memory) {
        return agents[agentId];
    }
    
    // Set spending limit
    function setSpendingLimit(address agentId, uint256 limit) external onlyAgentOwner(agentId) {
        agents[agentId].dailySpendLimit = limit;
        emit SpendingLimitUpdated(agentId, limit);
    }
    
    // Get total number of agents
    function getAgentCount() external view returns (uint256) {
        return agentList.length;
    }
    
    // Check if address is registered agent
    function isAgent(address addr) external view returns (bool) {
        return agents[addr].wallet != address(0);
    }
}
