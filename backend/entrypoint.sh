#!/bin/sh

set -e

echo "Applying database migrations..."
python manage.py migrate

echo "Creating superuser..."
python manage.py createsuperuser --noinput || true

# 3. Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 cinema_backend.wsgi:application