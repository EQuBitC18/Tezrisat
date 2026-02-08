<p align="center">
  <img src="Tezrisat_Frontend/tezrisat_frontend/public/Tezrisat_Logo_Transparent.png" alt="Tezrisat logo" width="220" />
</p>

# Tezrisat

Tezrisat is an AI-powered microcourse generation platform that helps educators and learners create personalized, interactive learning experiences in minutes.

## Problem Statement

Traditional course creation is time-consuming and requires extensive expertise. Educators spend weeks developing content, while learners struggle with generic materials that do not match their needs. Tezrisat uses AI to generate microcourses with interactive elements, quizzes, and recall notes.

> **Local/self‑hosted only:** Public hosting or offering Tezrisat as a service to third parties is not allowed without a commercial license.

## How It Works

![Tezrisat Flowchart](./tezrisat_flowchart.svg)

## One-click Local Setup

Use the one-liner for a fast start. It clones the repo, creates the virtual environment, installs dependencies, runs migrations, starts the backend, and launches the frontend. Make sure you are in a python environment (e.g conda).

Windows (PowerShell):

```powershell
irm https://raw.githubusercontent.com/EQuBitC18/Tezrisat/main/scripts/bootstrap.ps1 | iex
```

macOS/Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/EQuBitC18/Tezrisat/main/scripts/bootstrap.sh | bash
```

If you already cloned the repo and want to run locally:

```powershell
.\scripts\dev.ps1
```

```bash
chmod +x ./scripts/dev.sh
./scripts/dev.sh
```

If you prefer a step-by-step manual setup, follow [docs/setup.md](docs/setup.md).

To enable pre-commit and pre-push checks, run:

```bash
./scripts/install-githooks.sh
```

```powershell
.\scripts\install-githooks.ps1
```

## Project Structure

```
Tezrisat/
|-- .github/                  # CI workflows and GitHub templates
|-- docs/                     # Documentation and setup guides
|-- Tezrisat_Backend/         # Django REST API backend
|   |-- api/                  # Main API app (models, views, serializers)
|   |-- media/                # Uploaded files (local dev)
|   |-- db.sqlite3            # Local dev database (created on first run)
|-- Tezrisat_Frontend/        # React + Vite frontend
|   |-- tezrisat_frontend/    # Frontend app workspace
|       |-- components/       # Reusable UI components
|       |-- src/              # Main application code
|       |-- public/           # Static assets
|-- scripts/                  # Local dev helper scripts
|-- .env.example              # Environment variable template
|-- CHANGELOG.md              # Version history
|-- CONTRIBUTING.md           # Contribution guidelines
|-- LICENSE                   # Business Source License 1.1
|-- LICENSE-MIT               # Future MIT license (effective 2028-02-07)
|-- TRADEMARKS.md             # Trademark and branding policy
|-- README.md                 # This file
```

## Documentation

| Resource | What it covers |
| --- | --- |
| [SETUP](docs/setup.md) | Quick start and local dev setup |
| [API](docs/api.md) | API overview and key handling |
| [CONTRIBUTING](CONTRIBUTING.md) | Contribution workflow and standards |
| [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md) | Community expectations |
| [SECURITY](SECURITY.md) | Vulnerability reporting |
| [CHANGELOG](CHANGELOG.md) | Release history |
| [LICENSE](LICENSE) | Business Source License 1.1 (changes to MIT on 2028-02-07) |
| [LICENSE-MIT](LICENSE-MIT) | MIT license text (effective on 2028-02-07) |
| [LICENSE-COMMERCIAL](LICENSE-COMMERCIAL.md) | Commercial license terms |
| [TRADEMARKS](TRADEMARKS.md) | Trademark and branding policy |

## Key Technologies

- Python, Django, Django REST Framework
- React, TypeScript, Vite, Tailwind CSS
- OpenAI, LangChain
- ChromaDB

## Open Core Model

### Core Features (source-available)
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

## Roadmap

1. Stabilize API responses and add contract tests for core endpoints.
2. Improve content quality controls and add more deterministic generation options.
3. Expand documentation with usage examples and troubleshooting playbooks.
4. Address context length limits in the LLM pipeline.
5. Build a simple hosting guide for self-hosted deployments.

## Security Note

Authentication is disabled by default and the API is intended for local/self-hosted use.

## License

Tezrisat follows an open-core model. The core platform is licensed under the Business Source License 1.1 (BSL 1.1), which changes to MIT on 2028-02-07. See `LICENSE` for details.

License note: Internal use is allowed for teams of any size. Public hosting or offering it as a service to third parties is not allowed without a separate commercial license.

Commercial features and enterprise offerings (planned) are available under separate licensing.

## Maintainer

- GitHub: [EQuBitC18](https://github.com/EQuBitC18) 
- LinkedIn: [Emre Çamkerten](https://www.linkedin.com/in/emre-%C3%A7amkerten-5bb7aa27b/) 

## Acknowledgments

Thanks to the open-source community and contributors who make projects like this possible.

