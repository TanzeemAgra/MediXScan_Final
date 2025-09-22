#!/bin/bash
# Railway deployment start script with soft coding approach

echo "🚀 Starting MediXScan Backend Deployment..."

# Apply database migrations
echo "📦 Applying database migrations..."
python manage.py migrate --noinput

# Create superuser if it doesn't exist (for production setup)
echo "👤 Setting up admin user..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@medixscan.com', 'MediXScan2025!')
    print('✅ Admin user created successfully')
else:
    print('ℹ️ Admin user already exists')
"

# Collect static files
echo "📄 Collecting static files..."
python manage.py collectstatic --noinput

# Start the Gunicorn server
echo "🌐 Starting Gunicorn server..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --max-requests 1000 \
    --max-requests-jitter 50 \
    --access-logfile - \
    --error-logfile -