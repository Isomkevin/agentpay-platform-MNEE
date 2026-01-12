// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IMNEE.sol";
import "./AgentTreasury.sol";

/**
 * @title StreamingPayments
 * @notice Handles recurring and streaming payments for agents
 * @dev Enables agents to set up subscriptions and continuous payment streams
 */
contract StreamingPayments {
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    AgentTreasury public treasury;
    
    enum StreamType {
        Subscription,    // Recurring payment (monthly, weekly, etc.)
        Linear          // Continuous stream over time
    }
    
    struct Subscription {
        uint256 id;
        address agentId;
        address recipient;
        uint256 amount;          // Amount per period (for subscriptions) or total amount (for streams)
        uint256 period;          // Period in seconds (e.g., 30 days = 2592000)
        uint256 nextPayment;     // Timestamp of next payment
        StreamType streamType;
        bool isActive;
        uint256 createdAt;
        uint256 totalPaid;       // Total amount paid so far
        uint256 startTime;       // Start timestamp (for linear streams)
        uint256 duration;        // Duration in seconds (for linear streams)
    }
    
    mapping(uint256 => Subscription) public subscriptions;
    mapping(address => uint256[]) public agentSubscriptions;
    uint256 public subscriptionCount;
    
    event SubscriptionCreated(
        uint256 indexed subscriptionId,
        address indexed agentId,
        address recipient,
        uint256 amount,
        StreamType streamType
    );
    event PaymentStreamed(
        uint256 indexed subscriptionId,
        address indexed recipient,
        uint256 amount
    );
    event SubscriptionCancelled(uint256 indexed subscriptionId);
    
    modifier onlyAgentOwner(address agentId) {
        require(
            treasury.agents(agentId).owner == msg.sender,
            "Not agent owner"
        );
        _;
    }
    
    constructor(address _treasury) {
        require(_treasury != address(0), "Invalid treasury address");
        treasury = AgentTreasury(_treasury);
    }
    
    /**
     * @notice Create a recurring subscription
     * @param agentId The agent ID
     * @param recipient The address to receive payments
     * @param amount The amount per period (in MNEE, 18 decimals)
     * @param period The period in seconds (e.g., 30 days = 2592000)
     */
    function createSubscription(
        address agentId,
        address recipient,
        uint256 amount,
        uint256 period
    ) external onlyAgentOwner(agentId) returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(period > 0, "Period must be > 0");
        require(treasury.isAgent(agentId), "Agent not registered");
        
        subscriptionCount++;
        subscriptions[subscriptionCount] = Subscription({
            id: subscriptionCount,
            agentId: agentId,
            recipient: recipient,
            amount: amount,
            period: period,
            nextPayment: block.timestamp + period,
            streamType: StreamType.Subscription,
            isActive: true,
            createdAt: block.timestamp,
            totalPaid: 0,
            startTime: 0,
            duration: 0
        });
        
        agentSubscriptions[agentId].push(subscriptionCount);
        
        emit SubscriptionCreated(
            subscriptionCount,
            agentId,
            recipient,
            amount,
            StreamType.Subscription
        );
        
        return subscriptionCount;
    }
    
    /**
     * @notice Create a linear payment stream
     * @param agentId The agent ID
     * @param recipient The address to receive payments
     * @param totalAmount The total amount to stream (in MNEE, 18 decimals)
     * @param duration The duration of the stream in seconds
     */
    function createStream(
        address agentId,
        address recipient,
        uint256 totalAmount,
        uint256 duration
    ) external onlyAgentOwner(agentId) returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(totalAmount > 0, "Amount must be > 0");
        require(duration > 0, "Duration must be > 0");
        require(treasury.isAgent(agentId), "Agent not registered");
        
        subscriptionCount++;
        subscriptions[subscriptionCount] = Subscription({
            id: subscriptionCount,
            agentId: agentId,
            recipient: recipient,
            amount: totalAmount,
            period: 0,
            nextPayment: block.timestamp + 1 days, // Daily withdrawals for linear streams
            streamType: StreamType.Linear,
            isActive: true,
            createdAt: block.timestamp,
            totalPaid: 0,
            startTime: block.timestamp,
            duration: duration
        });
        
        agentSubscriptions[agentId].push(subscriptionCount);
        
        emit SubscriptionCreated(
            subscriptionCount,
            agentId,
            recipient,
            totalAmount,
            StreamType.Linear
        );
        
        return subscriptionCount;
    }
    
    /**
     * @notice Process subscription payment (can be called by anyone)
     * @param subscriptionId The subscription ID to process
     */
    function processPayment(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.isActive, "Subscription not active");
        require(block.timestamp >= sub.nextPayment, "Payment not due");
        
        if (sub.streamType == StreamType.Subscription) {
            // Recurring subscription payment
            require(
                treasury.executePayment(sub.agentId, sub.recipient, sub.amount),
                "Payment failed"
            );
            
            sub.totalPaid += sub.amount;
            sub.nextPayment = block.timestamp + sub.period;
        } else {
            // Linear stream payment
            require(block.timestamp < sub.startTime + sub.duration, "Stream completed");
            
            uint256 elapsed = block.timestamp - sub.startTime;
            uint256 totalShouldHavePaid = (sub.amount * elapsed) / sub.duration;
            uint256 amountToPay = totalShouldHavePaid - sub.totalPaid;
            
            if (amountToPay > 0) {
                require(
                    treasury.executePayment(sub.agentId, sub.recipient, amountToPay),
                    "Payment failed"
                );
                
                sub.totalPaid += amountToPay;
                sub.nextPayment = block.timestamp + 1 days;
            }
        }
        
        emit PaymentStreamed(subscriptionId, sub.recipient, sub.amount);
    }
    
    /**
     * @notice Withdraw from a linear stream
     * @param subscriptionId The stream ID
     */
    function withdrawFromStream(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(sub.isActive, "Stream not active");
        require(sub.streamType == StreamType.Linear, "Not a linear stream");
        require(block.timestamp < sub.startTime + sub.duration, "Stream completed");
        
        uint256 elapsed = block.timestamp - sub.startTime;
        uint256 totalShouldHavePaid = (sub.amount * elapsed) / sub.duration;
        uint256 amountToWithdraw = totalShouldHavePaid - sub.totalPaid;
        
        require(amountToWithdraw > 0, "Nothing to withdraw");
        
        require(
            treasury.executePayment(sub.agentId, sub.recipient, amountToWithdraw),
            "Payment failed"
        );
        
        sub.totalPaid += amountToWithdraw;
        
        emit PaymentStreamed(subscriptionId, sub.recipient, amountToWithdraw);
    }
    
    /**
     * @notice Cancel a subscription or stream
     */
    function cancelSubscription(uint256 subscriptionId) external {
        Subscription storage sub = subscriptions[subscriptionId];
        require(
            treasury.agents(sub.agentId).owner == msg.sender,
            "Not authorized"
        );
        sub.isActive = false;
        emit SubscriptionCancelled(subscriptionId);
    }
    
    /**
     * @notice Get subscription details
     */
    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory) {
        return subscriptions[subscriptionId];
    }
    
    /**
     * @notice Get all subscriptions for an agent
     */
    function getAgentSubscriptions(address agentId) external view returns (uint256[] memory) {
        return agentSubscriptions[agentId];
    }
}
