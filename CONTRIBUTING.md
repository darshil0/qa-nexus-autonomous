# Contributing to QA Nexus Autonomous

We welcome contributions! Here's how to get started:

## Contribution Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes**
   - Follow code standards
   - Write tests
   - Update docs
4. **Run checks**
   ```bash
   npm run ci
   npm run lint:fix
   ```
5. **Commit with conventional format**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/tools

**Examples**:
```
feat(agent1): add security issue detection
fix(gemini): handle empty API responses
docs(readme): update installation guide
test(workflow): add integration test
```

## Code Standards

- ✅ **TypeScript**: Strict mode enabled. All functions and variables must be properly typed.
- ✅ **ESLint**: Code must pass linting without warnings. Run `npm run lint` to check.
- ✅ **Testing**: New features should include unit or component tests. Run `npm test` to verify.
- ✅ **Documentation**: Update relevant `.md` files if you change architecture or user workflows.
- ✅ **Design**: Maintain the Glassmorphism UI aesthetic using the Vanilla CSS custom properties.
