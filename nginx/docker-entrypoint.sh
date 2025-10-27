#!/bin/sh
set -e

echo "Substituting environment variables in nginx config..."
echo "FRONTEND_URL: ${FRONTEND_URL}"
echo "BACKEND_URL: ${BACKEND_URL}"
echo "ADMIN_DASHBOARD_URL: ${ADMIN_DASHBOARD_URL}"

envsubst '${FRONTEND_URL} ${BACKEND_URL} ${ADMIN_DASHBOARD_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

echo "Starting nginx..."
exec nginx -g 'daemon off;'
