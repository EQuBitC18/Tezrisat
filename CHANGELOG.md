# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog and this project adheres to Semantic Versioning.

## [Unreleased]

### Added
- Initial project setup and documentation
- Open-core licensing structure
- Security policy and contribution guidelines

### Changed
- Updated README with comprehensive project information

### Fixed
- Various bug fixes and improvements

## [1.0.0] - 2024-02-01

### Added
- AI-powered microcourse generation
- Interactive learning elements (quizzes, glossary terms, recall notes)
- PDF and URL content processing for course generation
- JWT authentication
- React + TypeScript frontend
- ChromaDB integration for embeddings
- REST API with Django REST Framework
- SPA architecture
- Unit and integration test coverage

### Technical Features
- Backend: Django 4.2+ with SQLite (dev) / PostgreSQL (prod)
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- AI/ML: LangChain integration with OpenAI models
- Database: ChromaDB for embeddings, relational DB for app data
- Deployment: Docker/Heroku-ready with environment-based configuration

### Security
- JWT token-based authentication
- Secure API key handling (backend-managed)
- CORS configuration for development/production
- Input validation and sanitization

### Documentation
- Setup guides for development and production
- API documentation and endpoint specifications
- Architecture diagrams and component overviews
- Contributing guidelines and code standards

## Version History

This project follows Semantic Versioning:

- MAJOR for incompatible API changes
- MINOR for backwards-compatible additions
- PATCH for backwards-compatible bug fixes

## Release Process

1. Version bump in relevant files.
2. Update changelog with release notes.
3. Create Git tag with version number.
4. Create GitHub release with notes.
5. Update any version-specific docs.
