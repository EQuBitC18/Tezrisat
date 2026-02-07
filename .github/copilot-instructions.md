# Tezrisat Copilot Instructions

## Architecture Overview
- **Backend**: Django REST Framework with SQLite (dev) + ChromaDB for vector storage
- **Frontend**: React + TypeScript + Vite, using HashRouter for SPA routing
- **Auth**: JWT tokens stored in localStorage, axios interceptors handle auth headers
- **AI Integration**: LangChain + OpenAI for microcourse generation (sections, glossary, quizzes, recall notes)

## Key Components
- **Microcourses**: User-generated courses with sections containing content, code examples, math expressions, glossary terms, quiz questions, and recall notes
- **Data Flow**: Frontend → Django API → LangChain/OpenAI → ChromaDB for embeddings
- **File Storage**: PDFs stored in `media/pdfs/`, URLs as JSON strings in database

## Development Setup
### Backend (Django)
```bash
cd Tezrisat_Backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver  # Runs on http://localhost:8000
```

### Frontend (React)
```bash
cd Tezrisat_Frontend/tezrisat_frontend
npm install
npm run dev  # Runs on http://localhost:5173 (Vite default)
```

## API Patterns
- **Authentication**: Use `@permission_classes([IsAuthenticated])` for protected endpoints
- **File Uploads**: Use `MultiPartParser, FormParser` for PDF uploads
- **OpenAI Key**: Always use `os.getenv("OPENAI_API_KEY")` from backend environment, never user-provided keys
- **Error Handling**: Return `JsonResponse({"error": "message"}, status=400)` for failures

## Code Conventions
- **Backend Models**: Use `related_name` for reverse relationships (e.g., `microcourses`, `sections`)
- **Frontend API Calls**: Import from `../api.js`, use async/await with try/catch
- **LangChain Imports**: Use `langchain_openai.ChatOpenAI` instead of deprecated `langchain_community.llms.OpenAI`
- **File Paths**: Store relative paths in database, use `settings.MEDIA_ROOT` for absolute paths
- **Logging**: Use `logger.info/error` for debugging API endpoints

## Common Workflows
- **Adding Microcourse**: POST to `/api/add_microcourse/` with title, topic, complexity, audience, URLs (JSON), PDFs
- **Generating Sections**: Use `generate_microcourse_section()` from `api/generate_microcourse.py`
- **User Management**: JWT login via `/api/token/`, profile updates via `/api/update_profile/`
- **Database Queries**: Filter by `user=request.user` for user-specific data

## Key Files
- `api/models.py`: Microcourse, MicrocourseSection, GlossaryTerm, QuizQuestion, RecallNote models
- `api/views.py`: API endpoints for CRUD operations and AI generation
- `api/generate_microcourse.py`: LangChain logic for content generation
- `src/api.js`: Axios configuration with JWT interceptors
- `src/App.tsx`: Route definitions with ProtectedRoute wrapper
- `Tezrisat_Backend/settings.py`: Database config (SQLite for dev, PostgreSQL for prod)

## Testing & Debugging
- **Backend**: Use Django shell (`python manage.py shell`) for model testing
- **Frontend**: Check browser Network tab for API calls, console for errors
- **AI Generation**: Test with small prompts first, check ChromaDB logs for embedding issues
- **Migrations**: Always run `makemigrations` + `migrate` after model changes

## Deployment Notes
- **Environment Variables**: Set `OPENAI_API_KEY`, `DJANGO_ENV=production` for prod
- **Database**: Switch to PostgreSQL via `DATABASE_URL` in production
- **Static Files**: Use Whitenoise for serving static files in production