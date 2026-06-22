# TaskFlow — Jira Clone

A full-stack project management app inspired by Jira: Kanban board, backlog, sprints,
issue tracking, and multi-project support.

- **Frontend:** React 18 (works standalone with built-in mock data — no backend required to try it out)
- **Backend:** Java 17 + Spring Boot 3 + Spring Data JPA + H2 (dev) / PostgreSQL (prod-ready)

---

## Quick Start (Frontend Only — fastest way to see it running)

The frontend ships with realistic in-memory sample data, so you can run it **standalone**
with zero backend setup:

```bash
cd frontend
npm install
npm start
```

Open **http://localhost:3000** — you'll see a fully working board, backlog, drag-and-drop,
issue creation/editing, sprints, and multiple projects, all running in the browser.

> This mode does not persist data between page refreshes — it's an in-memory mock layer
> in `src/context/AppContext.jsx`, perfect for demos, design feedback, or frontend dev.

---

## Full Stack Setup (Frontend + Spring Boot Backend)

### 1. Backend

Requirements: **Java 17+** and **Maven 3.6+**

```bash
cd backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. It uses an in-memory H2 database seeded
automatically with one sample project, two sprints, and five issues
(see `DataSeeder.java`). H2 console is available at `http://localhost:8080/h2-console`
(JDBC URL: `jdbc:h2:mem:jiradb`, user `sa`, no password).

Build a jar instead:
```bash
mvn clean package
java -jar target/jira-clone-backend-1.0.0.jar
```

### 2. Wire the Frontend to the Real Backend

The frontend currently manages all state locally in `AppContext.jsx` for instant demos.
To use the real Spring Boot API instead:

1. A ready-to-use fetch client already exists at `frontend/src/utils/api.js`
   (`ProjectAPI`, `SprintAPI`, `IssueAPI`).
2. In `AppContext.jsx`, replace the `useState(initialIssues)` etc. with calls to those
   API functions inside `useEffect` on mount, and call the API inside each mutator
   (`createIssue`, `updateIssue`, `moveIssue`, etc.) instead of `setIssues`.
3. Optionally set a custom API URL via env var:
   ```bash
   # frontend/.env.local
   REACT_APP_API_URL=http://localhost:8080/api
   ```

This separation was intentional so you can demo the UI instantly, then wire up
persistence whenever you're ready.

### 3. Run Both Together

```bash
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2
cd frontend && npm install && npm start
```

---

## Project Structure

```
jira-clone/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/jiraclone/
│       │   ├── JiraCloneApplication.java
│       │   ├── config/        # CORS + sample data seeder
│       │   ├── controller/    # REST endpoints (Issue, Sprint, Project)
│       │   ├── service/       # Business logic
│       │   ├── repository/    # Spring Data JPA repositories
│       │   ├── model/         # JPA entities (Issue, Sprint, Project)
│       │   └── dto/           # Request/response DTOs
│       └── resources/
│           └── application.properties
│
└── frontend/
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.jsx
        ├── index.js
        ├── context/AppContext.jsx   # Global state (mock data + actions)
        ├── pages/                  # BoardPage, BacklogPage, ProjectsPage
        ├── components/
        │   ├── Navbar/
        │   ├── Sidebar/
        │   ├── Issue/               # IssueCard + badges/avatars
        │   └── Modal/                # Issue detail + create issue/sprint/project
        ├── utils/api.js             # Fetch client for the Spring Boot API
        └── styles/App.css
```

---

## Features

- **Kanban Board** — drag-and-drop issues across To Do / In Progress / In Review / Done
- **Backlog** — grouped by sprint, drag issues between backlog and sprints, create/start/complete sprints
- **Sprint management** — plan, start, and complete sprints; completing one returns unfinished issues to the backlog
- **Issue detail modal** — inline-editable title/description, status, assignee, reporter, type, priority, story points, labels
- **Multi-project support** — switch projects from the sidebar, each with its own board/backlog/sprints
- **Filters** — by assignee (avatar picker) and issue type, plus a global search
- **REST API** — full CRUD for Projects, Sprints, and Issues, ready for a real database

## Tech Notes

- Backend uses H2 in-memory DB by default (`spring.jpa.hibernate.ddl-auto=create-drop`,
  so data resets on every restart). The `postgresql` driver is already in `pom.xml`
  — swap the four `spring.datasource.*` properties in `application.properties` to point
  at a real Postgres instance for persistence.
- Frontend has no external UI library — all components and styles are hand-built
  (plain CSS files per component) for a lightweight bundle and full design control.
