/**
 * Contract ABIs for Autonomey
 * These are minimal ABIs containing only the functions we need for the frontend
 * Full ABIs will be generated after contract compilation
 */

// ERC20 ABI (MNEE)
export const MNEE_ABI = [
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// AgentTreasury ABI
export const AGENT_TREASURY_ABI = [
  {
    inputs: [
      { name: 'wallet', type: 'address' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
    ],
    name: 'registerAgent',
    outputs: [{ name: 'agentId', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'agentId', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'depositToAgent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'agentId', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'executePayment',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'agentId', type: 'address' }],
    name: 'getBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'agentId', type: 'address' }],
    name: 'getAgent',
    outputs: [
      {
        components: [
          { name: 'wallet', type: 'address' },
          { name: 'name', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'isActive', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'dailySpendLimit', type: 'uint256' },
          { name: 'dailySpent', type: 'uint256' },
          { name: 'lastReset', type: 'uint256' },
          { name: 'owner', type: 'address' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'agentId', type: 'address' },
      { name: 'limit', type: 'uint256' },
    ],
    name: 'setSpendingLimit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'addr', type: 'address' }],
    name: 'isAgent',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// PaymentRules ABI
export const PAYMENT_RULES_ABI = [
  {
    inputs: [
      { name: 'agentId', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'ruleType', type: 'uint8' },
      { name: 'conditionData', type: 'bytes' },
    ],
    name: 'createRule',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'ruleId', type: 'uint256' },
      { name: 'proof', type: 'bytes' },
    ],
    name: 'executeRule',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'ruleId', type: 'uint256' }],
    name: 'getRule',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'agentId', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'ruleType', type: 'uint8' },
          { name: 'isActive', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'executedAt', type: 'uint256' },
          { name: 'conditionData', type: 'bytes' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'agentId', type: 'address' }],
    name: 'getAgentRules',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// StreamingPayments ABI
export const STREAMING_PAYMENTS_ABI = [
  {
    inputs: [
      { name: 'agentId', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'period', type: 'uint256' },
    ],
    name: 'createSubscription',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'agentId', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'duration', type: 'uint256' },
    ],
    name: 'createStream',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'subscriptionId', type: 'uint256' }],
    name: 'processPayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'subscriptionId', type: 'uint256' }],
    name: 'cancelSubscription',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'subscriptionId', type: 'uint256' }],
    name: 'getSubscription',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'agentId', type: 'address' },
          { name: 'recipient', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'period', type: 'uint256' },
          { name: 'nextPayment', type: 'uint256' },
          { name: 'streamType', type: 'uint8' },
          { name: 'isActive', type: 'bool' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'totalPaid', type: 'uint256' },
          { name: 'startTime', type: 'uint256' },
          { name: 'duration', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'agentId', type: 'address' }],
    name: 'getAgentSubscriptions',
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// EscrowContract ABI
export const ESCROW_CONTRACT_ABI = [
  {
    inputs: [
      { name: 'payee', type: 'address' },
      { name: 'amount', type: 'uint256' },
      { name: 'description', type: 'string' },
      { name: 'autoRelease', type: 'bool' },
      { name: 'releaseTime', type: 'uint256' },
    ],
    name: 'createEscrow',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'payee', type: 'address' },
      { name: 'totalAmount', type: 'uint256' },
      { name: 'milestoneCount', type: 'uint256' },
      { name: 'description', type: 'string' },
    ],
    name: 'createMilestoneEscrow',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'uint256' }],
    name: 'releaseEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'uint256' }],
    name: 'releaseMilestone',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'uint256' }],
    name: 'cancelEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'escrowId', type: 'uint256' }],
    name: 'getEscrow',
    outputs: [
      {
        components: [
          { name: 'id', type: 'uint256' },
          { name: 'payer', type: 'address' },
          { name: 'payee', type: 'address' },
          { name: 'totalAmount', type: 'uint256' },
          { name: 'releasedAmount', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'status', type: 'uint8' },
          { name: 'escrowType', type: 'uint8' },
          { name: 'createdAt', type: 'uint256' },
          { name: 'completedAt', type: 'uint256' },
          { name: 'autoRelease', type: 'bool' },
          { name: 'releaseTime', type: 'uint256' },
          { name: 'milestoneCount', type: 'uint256' },
          { name: 'amountPerMilestone', type: 'uint256' },
          { name: 'completedMilestones', type: 'uint256' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'escrowCount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
