#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.2
done
echo "PostgreSQL started"

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
