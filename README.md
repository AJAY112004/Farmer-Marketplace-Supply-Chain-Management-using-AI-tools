# Farmer Marketplace - Full Stack Application

A full-stack agricultural marketplace application with Django REST Framework backend and React frontend.

## Prerequisites

Before running this project, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** and **npm** - [Download Node.js](https://nodejs.org/)
- **Git** (optional) - [Download Git](https://git-scm.com/downloads)

---

## Setup Instructions

### Step 1: Clone or Download the Project

```bash
# Option A: Clone with Git
git clone <repository-url>
cd project

# Option B: Download and extract the project folder, then navigate to it
cd project
```

---

### Step 2: Backend Setup (Django)

#### 2.1 Navigate to Backend Directory

```bash
cd raith
```

#### 2.2 Create Python Virtual Environment

**Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1

# If you encounter execution policy error, run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.3 Install Python Dependencies

```bash
pip install django==5.2.7
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
```

#### 2.4 Setup Database

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 2.5 (Optional) Create Admin User

```bash
python manage.py createsuperuser
# Follow prompts to create admin account
```

#### 2.6 Start Django Development Server

```bash
python manage.py runserver
```

**Expected Output:**
```
Django version 5.2.7, using settings 'raith.settings'
Starting development server at http://127.0.0.1:8000/
```

✅ **Backend is now running on http://127.0.0.1:8000/**

**Keep this terminal running** and open a new terminal for the frontend.

---

### Step 3: Frontend Setup (React)

#### 3.1 Open New Terminal

In your editor or command prompt, open a **new terminal window/tab**.

#### 3.2 Navigate to Frontend Directory

```bash
# From project root
cd src

# Or if you're in the 'raith' folder:
cd ../src
```

#### 3.3 Install Node Dependencies

```bash
npm install

# If you encounter errors, try:
npm install --legacy-peer-deps
```

#### 3.4 Start React Development Server

```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **Frontend is now running on http://localhost:5173/**

---

## Running the Application

### Both Servers Must Be Running

**Terminal 1 (Backend):**
```bash
cd raith
.\venv\Scripts\Activate.ps1  # Windows
# OR
source venv/bin/activate      # macOS/Linux

python manage.py runserver
```

**Terminal 2 (Frontend):**
```bash
cd src
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173/
- **Backend API:** http://127.0.0.1:8000/api/
- **Admin Panel:** http://127.0.0.1:8000/admin/ (if superuser created)

---

## Available API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `GET /api/users/profile/` - Get user profile
- `PATCH /api/users/profile/` - Update user profile
- `POST /api/users/change-password/` - Change password

### Products
- `GET /api/products/` - List all products

### Cart
- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `DELETE /api/cart/remove/<product_name>/` - Remove item from cart
- `PUT /api/cart/update/<product_name>/` - Update cart item quantity
- `DELETE /api/cart/clear/` - Clear entire cart

### Orders
- `POST /api/orders/` - Create new order
- `GET /api/orders/list/` - List user's orders
- `GET /api/orders/<id>/` - Get specific order details

---

## Tech Stack

### Backend
- Django 5.2.7
- Django REST Framework
- djangorestframework-simplejwt (JWT authentication)
- django-cors-headers (CORS support)
- SQLite3 (Database)

### Frontend
- React 18 with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Axios (HTTP client)
- React Router (Routing)

---

## Troubleshooting

### Port Already in Use

**Django (Port 8000):**
```bash
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# Or use different port
python manage.py runserver 8001
```

**React (Port 5173):**
Kill the process and restart `npm run dev`

### CORS Errors

Ensure `raith/raith/settings.py` includes:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
]
```

### Module Not Found Errors

**Python:**
```bash
pip install <module-name>
```

**Node:**
```bash
npm install <package-name>
```

### Database Issues

```bash
# Delete database and recreate (WARNING: Deletes all data)
cd raith
rm db.sqlite3  # or del db.sqlite3 on Windows
python manage.py migrate
python manage.py createsuperuser
```

---

## Project Structure

```
project/
├── raith/                    # Django backend
│   ├── cart/                # Cart app
│   ├── users/               # Users app
│   ├── orders/              # Orders app
│   ├── products/            # Products app
│   ├── raith/               # Main settings
│   ├── manage.py
│   └── db.sqlite3           # Database (created after migrations)
│
└── src/                      # React frontend
    ├── components/
    ├── contexts/
    ├── pages/
    ├── App.tsx
    └── package.json
```

---

## Quick Start Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Virtual environment created and activated
- [ ] Python dependencies installed
- [ ] Database migrations applied
- [ ] Django server running on port 8000
- [ ] Node dependencies installed
- [ ] React server running on port 5173
- [ ] Both servers accessible in browser

**Ready to use!** 🎉