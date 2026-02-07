# Tezrisat

Tezrisat is an AI-powered microcourse generation platform that helps educators and learners create personalized, interactive learning experiences in minutes.

## Problem Statement

Traditional course creation is time-consuming and requires extensive expertise. Educators spend weeks developing content, while learners struggle with generic materials that do not match their needs. Tezrisat uses AI to generate microcourses with interactive elements, quizzes, and recall notes.

## How It Works

![Tezrisat Flowchart](./tezrisat_flowchart.svg)

## Project Structure

```
Tezrisat/
|-- docs/                     # Documentation and setup guides
|-- Tezrisat_Backend/         # Django REST API backend
|   |-- api/                  # Main API app (models, views, serializers)
|   |-- media/                # User uploaded files (local dev)
|   |-- tzrst_db/             # Vector database for AI embeddings (local dev)
|-- Tezrisat_Frontend/        # React TypeScript frontend
|   |-- tezrisat_frontend/    # Vite React application
|       |-- components/       # Reusable UI components
|       |-- src/              # Main application code
|       |-- public/           # Static assets
|-- Summaries/                # Quick reference guides
|-- CHANGELOG.md              # Version history
|-- CONTRIBUTING.md           # Contribution guidelines
|-- LICENSE                   # MIT license
|-- README.md                 # This file
```

## Documentation

- Setup guide: [docs/setup.md](docs/setup.md)
- API overview: [docs/api.md](docs/api.md)
- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- Licenses: [LICENSE](LICENSE), [LICENSE-COMMERCIAL.md](LICENSE-COMMERCIAL.md)

## Key Technologies

- Python, Django, Django REST Framework
- React, TypeScript, Vite, Tailwind CSS
- OpenAI, LangChain
- ChromaDB

## Open Core Model

### Open Source Features
- Full microcourse generation with AI
- Interactive quizzes and glossary
- PDF and URL content integration
- Local SQLite database
- Self-hosted deployment

### Premium Features (planned)
- Advanced analytics and insights
- Team collaboration tools
- Custom AI model training
- Enterprise integrations
- Priority support

## Contributing

We welcome contributions. See `CONTRIBUTING.md` for details.

## Security Note

Authentication is disabled by default and the API is intended for local/self-hosted use. If you deploy this publicly, add authentication and rate limiting before exposing the API.

## License

Tezrisat follows an open-core model. The core platform is licensed under the MIT License. See `LICENSE` for details.

Commercial features and enterprise offerings (planned) are available under separate licensing.

## Maintainer

- GitHub: https://github.com/EQuBitC18
- LinkedIn: https://www.linkedin.com/in/emre-%C3%A7amkerten-5bb7aa27b/

## Acknowledgments

Thanks to the open-source community and contributors who make projects like this possible.
