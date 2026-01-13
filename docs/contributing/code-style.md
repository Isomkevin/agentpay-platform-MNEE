# Code Style

**Audience**: Developers

## Purpose

Development standards and code style guidelines for Autonomey.

## General Principles

- **Clarity over cleverness** - Code should be easy to understand
- **Consistency** - Follow existing patterns
- **Documentation** - Comment complex logic
- **Testing** - Write tests for new features

## Smart Contracts

### Solidity Style

- Use Solidity ^0.8.20
- Follow OpenZeppelin patterns
- Use named parameters for clarity
- Emit events for all state changes

### Naming Conventions

- Contracts: PascalCase (e.g., `AgentTreasury`)
- Functions: camelCase (e.g., `registerAgent`)
- Variables: camelCase (e.g., `agentBalance`)
- Constants: UPPER_SNAKE_CASE (e.g., `MNEE_CONTRACT`)

### Security

- Check all inputs
- Use modifiers for access control
- Follow checks-effects-interactions pattern
- Emit events for transparency

## Frontend

### TypeScript

- Use TypeScript for all code
- Define types explicitly
- Avoid `any` types
- Use interfaces for contracts

### React

- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic to hooks

### Styling

- Use Tailwind CSS
- Follow existing component patterns
- Ensure responsive design
- Maintain accessibility

## Testing

- Write tests for all new features
- Test edge cases
- Test error conditions
- Maintain test coverage

## Documentation

- Update README for user-facing changes
- Update architecture docs for structural changes
- Add code comments for complex logic
- Keep documentation in sync with code

---

**Related Documentation**:
- [Contribution Guide](contribution-guide.md)
- [Testing Guide](../testing/testing-guide.md)
