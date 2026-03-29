#!/bin/bash
export DATABASE_URL="postgresql://postgres@localhost/m3b_realty"
export NODE_ENV=production
export PORT=5000
export ADMIN_PASSWORD="admin123"
cd /home/ubuntu
node dist/index.cjs
