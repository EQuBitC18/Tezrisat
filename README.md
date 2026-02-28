<p align="center">
  <img src="Tezrisat_Frontend/tezrisat_frontend/public/Tezrisat_Logo_Transparent.png" alt="Tezrisat logo" width="220" />
</p>

# Tezrisat

Tezrisat is an AI-assisted microlearning authoring tool that helps educators generate short, task-oriented microcourses and assessments in minutes.

## Problem Statement

Traditional course planning is slow, and it does not fit well with the way many people learn today. Learners often need short, focused lessons they can complete between meetings, during study breaks, or while picking up a specific skill on demand. Educators, on the other hand, still spend days or weeks planning, structuring, and writing material for those lessons.

Tezrisat focuses on that gap. It is built around microlearning: short, practical learning segments that are easy to consume and quick to produce. With AI-assisted generation, Tezrisat helps educators turn a topic, a few source materials, and a target audience into a usable microcourse with quiz content and recall notes, cutting planning time from weeks to minutes.

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

Tezrisat is aiming to become more than a microcourse generator. The long-term vision is an open, self-hostable learning platform that helps educators create faster and helps learners understand deeper.

If you want to contribute, this roadmap is the best place to orient yourself. Each milestone represents a meaningful leap in product quality, and every improvement here moves Tezrisat closer to being a serious alternative in AI-native education. We want contributors to help shape not just features, but the future of open learning infrastructure.

### 🚀 Milestone 1 - Core Reliability

Build the foundation that makes everything else trustworthy, reproducible, and contributor-friendly.

- 🐳 Docker setup
- ⚙️ User customization
- 🔌 Stable backend/frontend API contracts

### 🧑‍🏫 Milestone 2 - Educator Experience

Make Tezrisat genuinely useful for educators who want control after generation, not just a one-click output.

- ✍️ Course editing after generation
- 📚 More source ingestion
- 🗂️ Versioning and drafts
- 📤 Export capabilities

### 🎓 Milestone 3 - Learner Experience

Turn generated content into an experience that feels interactive, adaptive, and worth coming back to.

- 📈 Progress tracking
- 🧠 Interactive mindmaps
- 📝 Exam mode
- 🤖 More complex AI outputs, not just plain text outputs
- 🧮 Interactive code and math executions

### 🛡️ Milestone 4 - Quality Layer

Raise trust in the generated content so Tezrisat can support serious educational use cases.

- 📎 A dedicated citations section
- ✅ Factuality checks
- 🧩 Course-level consistency checks

### 💡 Why This Matters

Most learning platforms are either closed, slow to customize, or not truly built around AI-native course creation. Tezrisat can be different:

- Open to contributors
- Self-hostable for privacy and control
- Fast for educators
- Interactive for learners
- Extensible for the next generation of learning tools

If this vision excites you, there is room to contribute across backend, frontend, AI pipelines, testing, documentation, and product design.

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

