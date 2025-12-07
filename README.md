# Cinema Booking Application

A full-stack cinema booking platform featuring movie listings, seat selection, booking management, and ticket generation. The application consists of an Angular frontend, a Django REST API backend, and a MySQL database, all fully containerized using Docker.

## Tech Stack

* Frontend: Angular 19, PrimeNG, TailwindCSS
* Backend: Django 6.0, Django REST Framework, Gunicorn
* Database: MySQL 8.0
* Containerization: Docker, Docker Compose
* PDF Generation: jsPDF, html2canvas (Frontend)
* Authentication: JWT (SimpleJWT)

---

## Getting Started

### Prerequisites
* Docker Desktop (must be installed and running)

### 1. Installation

1.  Clone the repository:
    git clone <your-repo-url>
    cd cinema-project

2.  Configure Environment Variables:
    Create a file named .env in the root directory and add your API keys:
    
    STRIPE_SECRET_KEY=sk_test_...
    STRIPE_PUBLISHABLE_KEY=pk_test_...
    STRIPE_WEBHOOK_SECRET=whsec_...
    GEMINI_API_KEY=AIzaSy...
    
    # Optional Overrides
    DEBUG=True

3.  Build and Run:
    Run the application using Docker Compose. This will build the images, create the database, and start all services.
    
    docker compose up --build

    (Wait a few moments for the database to initialize and the backend to apply migrations.)

---

## Accessing the Application

Once the containers are running:

* Frontend: http://localhost (Main user interface)
* Backend API: http://localhost:8000 (Django REST API endpoints)
* Admin Panel: http://localhost:8000/admin (Django Superuser Interface)

### Default Superuser Credentials
The system automatically creates an admin user on startup (configured in docker-compose.yml):

* Email: admin@example.com
* Username: admin
* Password: admin123

---

## Project Structure

cinema-project/
├── docker-compose.yml       # 🐳 Orchestrates Frontend, Backend, and DB
├── .env                     # 🔑 Local secrets (ignored by git)
├── frontend/                # 🅰️ Angular Application
│   ├── Dockerfile           # Multi-stage build (Node -> Nginx)
│   ├── nginx.conf           # Nginx server config
│   └── src/
└── backend/                 # 🐍 Django Application
    ├── Dockerfile           # Python 3.14 image
    ├── entrypoint.sh        # Startup script (migrations + superuser)
    ├── requirements.txt     # Python dependencies
    ├── manage.py
    └── cinema_backend/      # Main Django settings
---

## Development Commands

### Stopping the Application
To stop containers but keep data:
docker compose stop

To stop containers and remove them (data persists in volume):
docker compose down

### Resetting the Database
If you need to wipe the database completely (e.g., if initialization failed):
docker compose down -v
docker compose up --build

### Running Backend Commands
To run Django management commands (like creating a new migration) inside the running container:
docker compose exec backend python manage.py makemigrations
docker compose exec backend python manage.py migrate

### Viewing Logs
To see logs for a specific service (e.g., backend errors):
docker compose logs -f backend

---

## Configuration Notes

* CORS: Configured to allow requests from localhost and localhost:4200.
* Database Host: The backend connects to the hostname 'db' (internal Docker DNS), not 'localhost'.
* Production Build: The frontend uses a multi-stage Docker build. It builds the Angular app with Node.js and serves the static output with Nginx.