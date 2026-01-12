// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AgentRegistry {
    // MNEE stablecoin contract address
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    
    struct Agent {
        address wallet;
        string name;
        string description;
        uint256 balance;
        bool isActive;
        uint256 createdAt;
    }
    
    mapping(address => Agent) public agents;
    mapping(address => address) public walletToAgent;
    address[] public agentList;
    
    event AgentRegistered(address indexed agent, address indexed wallet, string name);
    event AgentBalanceUpdated(address indexed agent, uint256 newBalance);
    event PaymentMade(address indexed from, address indexed to, uint256 amount);
    
    // Register a new AI agent
    function registerAgent(
        address wallet,
        string memory name,
        string memory description
    ) external returns (bool) {
        require(wallet != address(0), "Invalid wallet address");
        require(agents[msg.sender].wallet == address(0), "Agent already registered");
        
        agents[msg.sender] = Agent({
            wallet: wallet,
            name: name,
            description: description,
            balance: 0,
            isActive: true,
            createdAt: block.timestamp
        });
        
        walletToAgent[wallet] = msg.sender;
        agentList.push(msg.sender);
        
        emit AgentRegistered(msg.sender, wallet, name);
        return true;
    }
    
    // Get agent info
    function getAgent(address agent) external view returns (Agent memory) {
        return agents[agent];
    }
    
    // Get agent balance in MNEE
    function getAgentBalance(address agent) external view returns (uint256) {
        address wallet = agents[agent].wallet;
        if (wallet == address(0)) return 0;
        return IERC20(MNEE_CONTRACT).balanceOf(wallet);
    }
    
    // Make payment from agent wallet
    function makePayment(
        address fromAgent,
        address to,
        uint256 amount
    ) external returns (bool) {
        require(agents[fromAgent].isActive, "Agent not active");
        address wallet = agents[fromAgent].wallet;
        require(wallet != address(0), "Agent wallet not set");
        
        IERC20 mnee = IERC20(MNEE_CONTRACT);
        require(mnee.balanceOf(wallet) >= amount, "Insufficient balance");
        require(mnee.allowance(wallet, address(this)) >= amount, "Insufficient allowance");
        
        require(mnee.transferFrom(wallet, to, amount), "Transfer failed");
        
        emit PaymentMade(wallet, to, amount);
        return true;
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
