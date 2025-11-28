# backend/Dockerfile

# Start from a clean Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    # psycopg2-binary needs this
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy *only* the requirements file first (this is a Docker cache trick)
COPY requirements.txt .

# Install Python packages
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy your entire backend project code into the container
COPY . .

# This is the command that will run your app
# Gunicorn is a "production" server, unlike 'manage.py runserver'
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]