# Contributing to Tezrisat

Thank you for your interest in contributing to Tezrisat.

## Open Core Model

Tezrisat follows an open-core business model:

- Core features (source-available): microcourse generation, AI content creation, interactive quizzes, and self-hosted deployment under the Business Source License 1.1. The license changes to MIT on 2028-02-07.
- Premium features (planned): cloud hosting, enterprise integrations, custom AI model training, and priority support.

Contributions to core open-source features are encouraged. Ideas for premium features are welcome but may be implemented by maintainers under separate licensing.

## How to Contribute

### Types of Contributions
- Bug reports
- Feature requests
- Code contributions
- Documentation improvements
- Tests

### Development Setup

See `docs/setup.md`.

## Code Standards

### Backend (Django)
- Follow Django best practices
- Use type hints where possible
- Write docstrings for public functions
- Follow PEP 8
- Use `black` for formatting

### Frontend (React/TypeScript)
- Use TypeScript for new code
- Follow React hooks best practices
- Use functional components
- Follow existing component structure
- Use ESLint and Prettier

### General
- Write clear commit messages
- Add tests for new features
- Update documentation as needed

## Pull Request Process

1. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-number-description
   ```

2. Make your changes following the code standards.

3. Test your changes:
   - Backend: `python manage.py test`
   - Frontend: `npm run lint` and `npm run build`

4. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: add microcourse template feature"
   ```

5. Push and open a pull request on GitHub.

### PR Requirements
- Clear description of changes
- Reference related issues or discussions
- CI checks pass
- At least one approval from maintainers

## Issue Reporting

When reporting bugs or requesting features:

- Bug reports: include steps to reproduce, expected vs actual behavior, environment, and error messages.
- Feature requests: describe the problem and proposed solution.
- Questions: use GitHub Discussions (if enabled).

## Testing

- Write unit tests for backend functions.
- Write integration tests for API endpoints.
- Test frontend components and user flows.

## Documentation

- Update `README.md` for significant changes.
- Add docstrings to new functions/classes.
- Update API documentation for endpoint changes.

## Code of Conduct

We follow a code of conduct to ensure a welcoming environment for all contributors. See `CODE_OF_CONDUCT.md`.

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (Business Source License 1.1, changing to MIT on 2028-02-07). Premium features may be subject to different licensing terms.

## Recognition

Contributors may be recognized in `README.md` and release notes.
