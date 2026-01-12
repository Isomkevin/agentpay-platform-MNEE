// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IMNEE.sol";
import "./AgentTreasury.sol";

/**
 * @title PaymentRules
 * @notice Handles conditional payment logic for agents
 * @dev Enables agents to execute payments based on programmable rules
 */
contract PaymentRules {
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    AgentTreasury public treasury;
    
    enum RuleType {
        Always,           // Always execute (no condition)
        TimeBased,        // Execute at specific time
        Threshold,        // Execute if value > threshold
        SuccessBased      // Execute only if success condition met
    }
    
    struct PaymentRule {
        uint256 id;
        address agentId;
        address recipient;
        uint256 amount;
        RuleType ruleType;
        bool isActive;
        uint256 createdAt;
        uint256 executedAt;
        bytes conditionData; // Encoded condition parameters
    }
    
    mapping(uint256 => PaymentRule) public rules;
    mapping(address => uint256[]) public agentRules;
    uint256 public ruleCount;
    
    event PaymentRuleCreated(
        uint256 indexed ruleId,
        address indexed agentId,
        address recipient,
        uint256 amount,
        RuleType ruleType
    );
    event ConditionalPaymentExecuted(
        uint256 indexed ruleId,
        address indexed agentId,
        address recipient,
        uint256 amount
    );
    event PaymentRuleDeactivated(uint256 indexed ruleId);
    
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
     * @notice Create a new payment rule
     * @param agentId The agent ID that owns this rule
     * @param recipient The address to receive payment
     * @param amount The amount to pay (in MNEE, 18 decimals)
     * @param ruleType The type of rule
     * @param conditionData Encoded condition parameters
     */
    function createRule(
        address agentId,
        address recipient,
        uint256 amount,
        RuleType ruleType,
        bytes calldata conditionData
    ) external onlyAgentOwner(agentId) returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be > 0");
        require(treasury.isAgent(agentId), "Agent not registered");
        
        ruleCount++;
        rules[ruleCount] = PaymentRule({
            id: ruleCount,
            agentId: agentId,
            recipient: recipient,
            amount: amount,
            ruleType: ruleType,
            isActive: true,
            createdAt: block.timestamp,
            executedAt: 0,
            conditionData: conditionData
        });
        
        agentRules[agentId].push(ruleCount);
        
        emit PaymentRuleCreated(ruleCount, agentId, recipient, amount, ruleType);
        return ruleCount;
    }
    
    /**
     * @notice Execute a payment rule if conditions are met
     * @param ruleId The rule ID to execute
     * @param proof Additional proof data for condition evaluation
     */
    function executeRule(
        uint256 ruleId,
        bytes calldata proof
    ) external returns (bool) {
        PaymentRule storage rule = rules[ruleId];
        require(rule.isActive, "Rule not active");
        require(rule.executedAt == 0, "Rule already executed");
        
        // Evaluate condition based on rule type
        bool conditionMet = evaluateCondition(rule, proof);
        require(conditionMet, "Condition not met");
        
        // Execute payment via treasury
        require(
            treasury.executePayment(rule.agentId, rule.recipient, rule.amount),
            "Payment execution failed"
        );
        
        rule.executedAt = block.timestamp;
        rule.isActive = false;
        
        emit ConditionalPaymentExecuted(
            ruleId,
            rule.agentId,
            rule.recipient,
            rule.amount
        );
        
        return true;
    }
    
    /**
     * @notice Evaluate condition for a payment rule
     * @param rule The payment rule to evaluate
     * @param proof Additional proof data
     */
    function evaluateCondition(
        PaymentRule memory rule,
        bytes calldata proof
    ) internal view returns (bool) {
        if (rule.ruleType == RuleType.Always) {
            return true;
        }
        
        if (rule.ruleType == RuleType.TimeBased) {
            // conditionData should encode uint256 timestamp
            uint256 executeTime = abi.decode(rule.conditionData, (uint256));
            return block.timestamp >= executeTime;
        }
        
        if (rule.ruleType == RuleType.Threshold) {
            // conditionData should encode uint256 threshold
            // proof should encode uint256 actualValue
            uint256 threshold = abi.decode(rule.conditionData, (uint256));
            uint256 actualValue = abi.decode(proof, (uint256));
            return actualValue >= threshold;
        }
        
        if (rule.ruleType == RuleType.SuccessBased) {
            // conditionData should encode bool expectedSuccess
            // proof should encode bool actualSuccess
            bool expectedSuccess = abi.decode(rule.conditionData, (bool));
            bool actualSuccess = abi.decode(proof, (bool));
            return actualSuccess == expectedSuccess && actualSuccess == true;
        }
        
        return false;
    }
    
    /**
     * @notice Deactivate a payment rule
     */
    function deactivateRule(uint256 ruleId) external {
        PaymentRule storage rule = rules[ruleId];
        require(
            treasury.agents(rule.agentId).owner == msg.sender,
            "Not authorized"
        );
        rule.isActive = false;
        emit PaymentRuleDeactivated(ruleId);
    }
    
    /**
     * @notice Get a payment rule
     */
    function getRule(uint256 ruleId) external view returns (PaymentRule memory) {
        return rules[ruleId];
    }
    
    /**
     * @notice Get all rules for an agent
     */
    function getAgentRules(address agentId) external view returns (uint256[] memory) {
        return agentRules[agentId];
    }
}
