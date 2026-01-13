// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IMNEE.sol";

contract EscrowContract {
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    
    enum EscrowStatus { Pending, Completed, Cancelled, Disputed }
    enum EscrowType { Single, Milestone }
    
    struct Escrow {
        uint256 id;
        address payer;
        address payee;
        uint256 totalAmount;      // Total amount in escrow
        uint256 releasedAmount;   // Amount released so far
        string description;
        EscrowStatus status;
        EscrowType escrowType;
        uint256 createdAt;
        uint256 completedAt;
        bool autoRelease;
        uint256 releaseTime;
        // Milestone fields
        uint256 milestoneCount;
        uint256 amountPerMilestone;
        uint256 completedMilestones;
    }
    
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;
    
    event EscrowCreated(uint256 indexed escrowId, address indexed payer, address indexed payee, uint256 amount, EscrowType escrowType);
    event EscrowReleased(uint256 indexed escrowId, address indexed payee, uint256 amount);
    event EscrowCancelled(uint256 indexed escrowId, address indexed payer);
    event MilestoneReleased(uint256 indexed escrowId, uint256 milestoneNumber, uint256 amount);
    
    // Create a single payment escrow
    function createEscrow(
        address payee,
        uint256 amount,
        string memory description,
        bool autoRelease,
        uint256 releaseTime
    ) external returns (uint256) {
        require(payee != address(0), "Invalid payee address");
        require(amount > 0, "Amount must be greater than 0");
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(mnee.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        
        require(mnee.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        escrowCount++;
        escrows[escrowCount] = Escrow({
            id: escrowCount,
            payer: msg.sender,
            payee: payee,
            totalAmount: amount,
            releasedAmount: 0,
            description: description,
            status: EscrowStatus.Pending,
            escrowType: EscrowType.Single,
            createdAt: block.timestamp,
            completedAt: 0,
            autoRelease: autoRelease,
            releaseTime: releaseTime > 0 ? block.timestamp + releaseTime : 0,
            milestoneCount: 0,
            amountPerMilestone: 0,
            completedMilestones: 0
        });
        
        emit EscrowCreated(escrowCount, msg.sender, payee, amount, EscrowType.Single);
        return escrowCount;
    }
    
    // Create a milestone-based escrow
    function createMilestoneEscrow(
        address payee,
        uint256 totalAmount,
        uint256 milestoneCount,
        string memory description
    ) external returns (uint256) {
        require(payee != address(0), "Invalid payee address");
        require(totalAmount > 0, "Amount must be greater than 0");
        require(milestoneCount > 0, "Must have at least one milestone");
        require(totalAmount >= milestoneCount, "Amount must be >= milestone count");
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.balanceOf(msg.sender) >= totalAmount, "Insufficient balance");
        require(mnee.allowance(msg.sender, address(this)) >= totalAmount, "Insufficient allowance");
        
        require(mnee.transferFrom(msg.sender, address(this), totalAmount), "Transfer failed");
        
        uint256 amountPerMilestone = totalAmount / milestoneCount;
        
        escrowCount++;
        escrows[escrowCount] = Escrow({
            id: escrowCount,
            payer: msg.sender,
            payee: payee,
            totalAmount: totalAmount,
            releasedAmount: 0,
            description: description,
            status: EscrowStatus.Pending,
            escrowType: EscrowType.Milestone,
            createdAt: block.timestamp,
            completedAt: 0,
            autoRelease: false,
            releaseTime: 0,
            milestoneCount: milestoneCount,
            amountPerMilestone: amountPerMilestone,
            completedMilestones: 0
        });
        
        emit EscrowCreated(escrowCount, msg.sender, payee, totalAmount, EscrowType.Milestone);
        return escrowCount;
    }
    
    // Release escrow (payer confirms completion - for single escrow)
    function releaseEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.escrowType == EscrowType.Single, "Use releaseMilestone for milestone escrow");
        require(escrow.payer == msg.sender, "Only payer can release");
        
        uint256 amountToRelease = escrow.totalAmount - escrow.releasedAmount;
        require(amountToRelease > 0, "Nothing to release");
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payee, amountToRelease), "Transfer failed");
        
        escrow.releasedAmount = escrow.totalAmount;
        escrow.status = EscrowStatus.Completed;
        escrow.completedAt = block.timestamp;
        
        emit EscrowReleased(escrowId, escrow.payee, amountToRelease);
    }
    
    // Release a milestone (payer confirms milestone completion)
    function releaseMilestone(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.escrowType == EscrowType.Milestone, "Not a milestone escrow");
        require(escrow.payer == msg.sender, "Only payer can release");
        require(escrow.completedMilestones < escrow.milestoneCount, "All milestones released");
        
        escrow.completedMilestones++;
        escrow.releasedAmount += escrow.amountPerMilestone;
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payee, escrow.amountPerMilestone), "Transfer failed");
        
        if (escrow.completedMilestones >= escrow.milestoneCount) {
            escrow.status = EscrowStatus.Completed;
            escrow.completedAt = block.timestamp;
        }
        
        emit MilestoneReleased(escrowId, escrow.completedMilestones, escrow.amountPerMilestone);
        emit EscrowReleased(escrowId, escrow.payee, escrow.amountPerMilestone);
    }
    
    // Cancel escrow (payer cancels before release)
    function cancelEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.payer == msg.sender, "Only payer can cancel");
        
        uint256 remainingAmount = escrow.totalAmount - escrow.releasedAmount;
        require(remainingAmount > 0, "Nothing to cancel");
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payer, remainingAmount), "Transfer failed");
        
        escrow.status = EscrowStatus.Cancelled;
        
        emit EscrowCancelled(escrowId, escrow.payer);
    }
    
    // Auto-release if conditions are met (time-based)
    function checkAutoRelease(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.escrowType == EscrowType.Single, "Auto-release only for single escrow");
        require(escrow.autoRelease, "Auto-release not enabled");
        require(escrow.releaseTime > 0 && block.timestamp >= escrow.releaseTime, "Release time not reached");
        
        uint256 amountToRelease = escrow.totalAmount - escrow.releasedAmount;
        require(amountToRelease > 0, "Nothing to release");
        
        IMNEE mnee = IMNEE(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payee, amountToRelease), "Transfer failed");
        
        escrow.releasedAmount = escrow.totalAmount;
        escrow.status = EscrowStatus.Completed;
        escrow.completedAt = block.timestamp;
        
        emit EscrowReleased(escrowId, escrow.payee, amountToRelease);
    }
    
    // Get escrow details
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }
    
    // Get contract MNEE balance
    function getContractBalance() external view returns (uint256) {
        return IMNEE(MNEE_CONTRACT).balanceOf(address(this));
    }
}
