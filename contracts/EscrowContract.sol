// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract EscrowContract {
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    
    enum EscrowStatus { Pending, Completed, Cancelled, Disputed }
    
    struct Escrow {
        uint256 id;
        address payer;
        address payee;
        uint256 amount;
        string description;
        EscrowStatus status;
        uint256 createdAt;
        uint256 completedAt;
        bool autoRelease;
        uint256 releaseTime;
    }
    
    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;
    
    event EscrowCreated(uint256 indexed escrowId, address indexed payer, address indexed payee, uint256 amount);
    event EscrowReleased(uint256 indexed escrowId, address indexed payee, uint256 amount);
    event EscrowCancelled(uint256 indexed escrowId, address indexed payer);
    
    // Create an escrow
    function createEscrow(
        address payee,
        uint256 amount,
        string memory description,
        bool autoRelease,
        uint256 releaseTime
    ) external returns (uint256) {
        require(payee != address(0), "Invalid payee address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 mnee = IERC20(MNEE_CONTRACT);
        require(mnee.balanceOf(msg.sender) >= amount, "Insufficient balance");
        require(mnee.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        
        require(mnee.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        escrowCount++;
        escrows[escrowCount] = Escrow({
            id: escrowCount,
            payer: msg.sender,
            payee: payee,
            amount: amount,
            description: description,
            status: EscrowStatus.Pending,
            createdAt: block.timestamp,
            completedAt: 0,
            autoRelease: autoRelease,
            releaseTime: releaseTime > 0 ? block.timestamp + releaseTime : 0
        });
        
        emit EscrowCreated(escrowCount, msg.sender, payee, amount);
        return escrowCount;
    }
    
    // Release escrow (payer confirms completion)
    function releaseEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.payer == msg.sender, "Only payer can release");
        
        IERC20 mnee = IERC20(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payee, escrow.amount), "Transfer failed");
        
        escrow.status = EscrowStatus.Completed;
        escrow.completedAt = block.timestamp;
        
        emit EscrowReleased(escrowId, escrow.payee, escrow.amount);
    }
    
    // Cancel escrow (payer cancels before release)
    function cancelEscrow(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.payer == msg.sender, "Only payer can cancel");
        
        IERC20 mnee = IERC20(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payer, escrow.amount), "Transfer failed");
        
        escrow.status = EscrowStatus.Cancelled;
        
        emit EscrowCancelled(escrowId, escrow.payer);
    }
    
    // Auto-release if conditions are met
    function checkAutoRelease(uint256 escrowId) external {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.Pending, "Escrow not pending");
        require(escrow.autoRelease, "Auto-release not enabled");
        require(escrow.releaseTime > 0 && block.timestamp >= escrow.releaseTime, "Release time not reached");
        
        IERC20 mnee = IERC20(MNEE_CONTRACT);
        require(mnee.transfer(escrow.payee, escrow.amount), "Transfer failed");
        
        escrow.status = EscrowStatus.Completed;
        escrow.completedAt = block.timestamp;
        
        emit EscrowReleased(escrowId, escrow.payee, escrow.amount);
    }
    
    // Get escrow details
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        return escrows[escrowId];
    }
    
    // Get contract MNEE balance
    function getContractBalance() external view returns (uint256) {
        return IERC20(MNEE_CONTRACT).balanceOf(address(this));
    }
}
