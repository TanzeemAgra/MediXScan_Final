#!/bin/sh

set -e

echo "Railway Deployment: Starting MediXScan Django application..."

# Set default PORT if not provided
if [ -z "$PORT" ]; then
    export PORT=8000
fi

echo "Railway Deployment: Using PORT=$PORT"

# Wait for database to be ready (using DATABASE_URL)
echo "Railway Deployment: Waiting for PostgreSQL..."
until python -c "
import os
import psycopg2
import sys
from urllib.parse import urlparse

try:
    url = urlparse(os.environ.get('DATABASE_URL', ''))
    conn = psycopg2.connect(
        host=url.hostname,
        port=url.port,
        user=url.username,
        password=url.password,
        database=url.path[1:]
    )
    conn.close()
    sys.exit(0)
except Exception as e:
    print(f'Database not ready: {e}')
    sys.exit(1)
" 2>/dev/null; do
    echo "Waiting for database connection..."
    sleep 2
done
echo "Railway Deployment: PostgreSQL is ready!"

echo "Railway Deployment: Creating database migrations..."
python manage.py makemigrations --noinput || true

echo "Railway Deployment: Applying database migrations..."
python manage.py migrate --noinput

echo "Railway Deployment: Collecting static files..."
python manage.py collectstatic --noinput

echo "Railway Deployment: Creating superuser if it doesn't exist..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
import os
User = get_user_model()
admin_username = os.environ.get('DJANGO_ADMIN_USERNAME', 'admin')
admin_email = os.environ.get('DJANGO_ADMIN_EMAIL', 'admin@medixscan.com')
admin_password = os.environ.get('DJANGO_ADMIN_PASSWORD', 'MediXScan2025!')
if not User.objects.filter(username=admin_username).exists():
    User.objects.create_superuser(admin_username, admin_email, admin_password)
    print('✅ Admin user created successfully')
else:
    print('ℹ️ Admin user already exists')
"

echo "Railway Deployment: Starting Gunicorn server on 0.0.0.0:$PORT"
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --threads 2 \
    --timeout 120 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --access-logfile - \
    --error-logfile - \
    --log-level info