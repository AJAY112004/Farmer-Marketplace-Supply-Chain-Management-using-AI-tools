from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "unsafe-secret-key")
DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = ["*"]

# Custom User Model
AUTH_USER_MODEL = "users.User"

# -------------------- INSTALLED APPS --------------------
INSTALLED_APPS = [
    # Third-party (place corsheaders BEFORE staticfiles for safety)
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt",

    # Django built-ins
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Local apps
    "users",
    "cart",
    "shipments",
    "products",
    "orders",
]

# -------------------- MIDDLEWARE --------------------
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",          # 👈 must be at the very top
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "raith.urls"
WSGI_APPLICATION = "raith.wsgi.application"

# -------------------- TEMPLATES --------------------
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# -------------------- DATABASE (SQLite for development) --------------------
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# For MongoDB with Djongo (currently incompatible with Django 5.x)
# DATABASES = {
#     "default": {
#         "ENGINE": "djongo",
#         "NAME": "agroconnect_db",
#         "CLIENT": {
#             "host": os.getenv("DATABASE_URL"),
#         },
#     }
# }

# -------------------- REST FRAMEWORK --------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
}

# -------------------- CORS CONFIG --------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173",
    "http://localhost:5174",  # Vite alternate port
    "http://127.0.0.1:5174",
    "http://localhost:3000",  # for React dev servers (optional)
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True

# Allow typical REST headers including JWT auth
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

# -------------------- STATIC FILES --------------------
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"

# -------------------- JWT SETTINGS (optional, for refresh tokens) --------------------
from datetime import timedelta

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

