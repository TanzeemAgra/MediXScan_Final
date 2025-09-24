# Dockerfile for Local Development
FROM python:3.9-slim-bullseye

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    libmagic1 \
    postgresql-client && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY backend/ /app/

# Make entrypoint script executable
RUN chmod +x /app/entrypoint-local.sh

# Expose port
EXPOSE 8000

# Use local entrypoint script
CMD ["/app/entrypoint-local.sh"]