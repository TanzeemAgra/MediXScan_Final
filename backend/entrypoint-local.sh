#!/bin/sh

set -e

echo "🐳 Local Development: Starting MediXScan Django application..."

# Wait for database to be ready
echo "🐳 Local Development: Waiting for PostgreSQL..."
until python -c "
import os
import psycopg2
import sys
from urllib.parse import urlparse

try:
    url = urlparse(os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@db:5432/medixscan'))
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
echo "🐳 Local Development: PostgreSQL is ready!"

echo "🐳 Local Development: Creating database migrations..."
python manage.py makemigrations --noinput || true

echo "🐳 Local Development: Applying database migrations..."
python manage.py migrate --noinput

echo "🐳 Local Development: Creating superuser if it doesn't exist..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
import os
User = get_user_model()
admin_username = 'admin'
admin_email = 'admin@medixscan.local'
admin_password = 'admin123'
if not User.objects.filter(username=admin_username).exists():
    User.objects.create_superuser(admin_username, admin_email, admin_password)
    print('✅ Local admin user created: admin / admin123')
else:
    print('ℹ️ Local admin user already exists: admin / admin123')
"

echo "🐳 Local Development: Starting Django development server on 0.0.0.0:8000"
exec python manage.py runserver 0.0.0.0:8000