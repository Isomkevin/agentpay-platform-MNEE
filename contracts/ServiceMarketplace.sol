// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract ServiceMarketplace {
    address public constant MNEE_CONTRACT = 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF;
    
    struct Service {
        uint256 id;
        address provider;
        string name;
        string description;
        string endpoint;
        uint256 price; // Price in MNEE (with 18 decimals)
        bool isActive;
        uint256 totalPurchases;
        uint256 createdAt;
    }
    
    struct Purchase {
        uint256 serviceId;
        address buyer;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }
    
    mapping(uint256 => Service) public services;
    mapping(address => uint256[]) public providerServices;
    mapping(uint256 => Purchase[]) public servicePurchases;
    
    uint256 public serviceCount;
    uint256 public totalTransactions;
    
    event ServiceListed(uint256 indexed serviceId, address indexed provider, string name, uint256 price);
    event ServicePurchased(uint256 indexed serviceId, address indexed buyer, uint256 amount);
    event PaymentProcessed(address indexed provider, uint256 amount);
    
    // List a new service
    function listService(
        string memory name,
        string memory description,
        string memory endpoint,
        uint256 price
    ) external returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(price > 0, "Price must be greater than 0");
        
        serviceCount++;
        services[serviceCount] = Service({
            id: serviceCount,
            provider: msg.sender,
            name: name,
            description: description,
            endpoint: endpoint,
            price: price,
            isActive: true,
            totalPurchases: 0,
            createdAt: block.timestamp
        });
        
        providerServices[msg.sender].push(serviceCount);
        
        emit ServiceListed(serviceCount, msg.sender, name, price);
        return serviceCount;
    }
    
    // Purchase a service
    function purchaseService(uint256 serviceId) external returns (bool) {
        Service storage service = services[serviceId];
        require(service.isActive, "Service not active");
        require(service.price > 0, "Invalid service");
        
        IERC20 mnee = IERC20(MNEE_CONTRACT);
        require(mnee.balanceOf(msg.sender) >= service.price, "Insufficient balance");
        require(mnee.allowance(msg.sender, address(this)) >= service.price, "Insufficient allowance");
        
        require(mnee.transferFrom(msg.sender, service.provider, service.price), "Transfer failed");
        
        service.totalPurchases++;
        totalTransactions++;
        
        Purchase memory purchase = Purchase({
            serviceId: serviceId,
            buyer: msg.sender,
            amount: service.price,
            timestamp: block.timestamp,
            completed: true
        });
        
        servicePurchases[serviceId].push(purchase);
        
        emit ServicePurchased(serviceId, msg.sender, service.price);
        emit PaymentProcessed(service.provider, service.price);
        
        return true;
    }
    
    // Get service details
    function getService(uint256 serviceId) external view returns (Service memory) {
        return services[serviceId];
    }
    
    // Get all services
    function getAllServices() external view returns (Service[] memory) {
        Service[] memory allServices = new Service[](serviceCount);
        for (uint256 i = 1; i <= serviceCount; i++) {
            allServices[i - 1] = services[i];
        }
        return allServices;
    }
    
    // Get active services
    function getActiveServices() external view returns (Service[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 1; i <= serviceCount; i++) {
            if (services[i].isActive) activeCount++;
        }
        
        Service[] memory activeServices = new Service[](activeCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= serviceCount; i++) {
            if (services[i].isActive) {
                activeServices[index] = services[i];
                index++;
            }
        }
        return activeServices;
    }
    
    // Get provider's services
    function getProviderServices(address provider) external view returns (Service[] memory) {
        uint256[] memory serviceIds = providerServices[provider];
        Service[] memory providerServicesList = new Service[](serviceIds.length);
        
        for (uint256 i = 0; i < serviceIds.length; i++) {
            providerServicesList[i] = services[serviceIds[i]];
        }
        
        return providerServicesList;
    }
    
    // Update service price
    function updateServicePrice(uint256 serviceId, uint256 newPrice) external {
        Service storage service = services[serviceId];
        require(service.provider == msg.sender, "Not service provider");
        require(newPrice > 0, "Price must be greater than 0");
        service.price = newPrice;
    }
    
    // Toggle service active status
    function toggleService(uint256 serviceId) external {
        Service storage service = services[serviceId];
        require(service.provider == msg.sender, "Not service provider");
        service.isActive = !service.isActive;
    }
}
