export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-BstYB3bLKHTPTseitFG8zk"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && tar -tzf upload/m3b-realty-complete.tar.gz | head -50
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && tar -xzf upload/m3b-realty-complete.tar.gz
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && find . -maxdepth 3 -type f -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.html" | grep -v ".cache" | grep -v "node_modules" | head -30
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && ls -la | head -20
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && ls -la | grep -E "^d" | tail -15
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && find . -maxdepth 2 -name "README*" -o -name "*.md" | grep -v ".cache" | grep -v "node_modules"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && ls -la | grep -E "node_modules|dist|package"
export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-BstYB3bLKHTPTseitFG8zk"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && DATABASE_URL="postgresql://postgres@localhost/m3b_realty" NODE_ENV=production PORT=5000 ADMIN_PASSWORD="admin123" node dist/index.cjs
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && DATABASE_URL="postgresql://postgres:postgres@localhost/m3b_realty" NODE_ENV=production PORT=5000 ADMIN_PASSWORD="admin123" node dist/index.cjs
export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-BstYB3bLKHTPTseitFG8zk"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && which psql
source /home/ubuntu/.user_env && cd . && sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib
source /home/ubuntu/.user_env && cd . && sudo service postgresql start && sleep 2 && sudo -u postgres psql --version
source /home/ubuntu/.user_env && cd . && sudo -u postgres createdb m3b_realty 2>&1 || echo "Database may already exist"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && npm install 2>&1 | tail -50
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && cat shared/schema.ts | head -80
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && cat server/db.ts
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && cat drizzle.config.ts
source /home/ubuntu/.user_env && cd . && sudo -u postgres psql -d m3b_realty -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && export DATABASE_URL="postgresql://postgres@localhost/m3b_realty" && npm run db:push 2>&1
source /home/ubuntu/.user_env && cd . && sudo -u postgres psql -d m3b_realty -c "\du"
source /home/ubuntu/.user_env && cd . && sudo -u postgres psql -d m3b_realty << 'EOF'
CREATE TABLE IF NOT EXISTS users (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password text NOT NULL
);

CREATE TABLE IF NOT EXISTS team_members (
  id serial PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  image_url text NOT NULL,
  portfolio_url text NOT NULL DEFAULT '#'
);

CREATE TABLE IF NOT EXISTS visitor_counter (
  id serial PRIMARY KEY,
  count integer NOT NULL DEFAULT 0
);

INSERT INTO visitor_counter (count) VALUES (0) ON CONFLICT DO NOTHING;
EOF

source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && npm run build 2>&1 | tail -100
(source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && DATABASE_URL="postgresql://postgres@localhost/m3b_realty" NODE_ENV=production node dist/index.cjs) > /tmp/terminal-bg-setup-1774501982079.log 2>&1 < /dev/null & echo "[backgrounded] pid:$! log:/tmp/terminal-bg-setup-1774501982079.log"
source /home/ubuntu/.user_env && cd . && sleep 3 && curl -s http://localhost:5000 | head -50
source /home/ubuntu/.user_env && cd . && sleep 2 && tail -20 /tmp/terminal-bg-setup-1774501982079.log
source /home/ubuntu/.user_env && cd . && ps aux | grep node
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && cat > start-server.sh << 'EOF'
#!/bin/bash
export DATABASE_URL="postgresql://postgres@localhost/m3b_realty"
export NODE_ENV=production
export PORT=5000
export ADMIN_PASSWORD="admin123"
cd /home/ubuntu
node dist/index.cjs
EOF

chmod +x start-server.sh
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && ./start-server.sh &
sleep 3
source /home/ubuntu/.user_env && cd . && sleep 2 && curl -s http://localhost:5000 | head -20
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && DATABASE_URL="postgresql://postgres@localhost/m3b_realty" NODE_ENV=production PORT=5000 ADMIN_PASSWORD="admin123" node dist/index.cjs 2>&1 &
sleep 4
source /home/ubuntu/.user_env && cd . && curl -s http://localhost:5000 | head -30
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && npm run build 2>&1 | tail -50
source /home/ubuntu/.user_env && cd . && sudo -u postgres psql -d m3b_realty -c "ALTER USER postgres WITH PASSWORD 'postgres';"
source /home/ubuntu/.user_env && cd . && curl -s http://localhost:5000 | head -50
source /home/ubuntu/.user_env && cd . && find /home/ubuntu/client/src -name "*.tsx" -o -name "*.ts" | grep -i admin
source /home/ubuntu/.user_env && cd . && find /home/ubuntu/client/src -type f \( -name "*.tsx" -o -name "*.ts" \) | head -20
source /home/ubuntu/.user_env && cd . && find /home/ubuntu/client/src -type f \( -name "*.tsx" -o -name "*.ts" \) | grep -E "(Home|Marketing|Team)" | head -10
source /home/ubuntu/.user_env && cd . && curl -s -X POST http://localhost:5000/api/admin/verify   -H "Content-Type: application/json"   -d '{"password":"admin123"}' | jq .
source /home/ubuntu/.user_env && cd . && curl -s -X POST http://localhost:5000/api/admin/verify   -H "Content-Type: application/json"   -d '{"password":"wrong"}' | jq .
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && npx neonctl@latest init
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && npx neonctl@latest projects create --name m3b-realty 2>&1 | head -50
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git config --global user.email "m3brealty@example.com" && git config --global user.name "M3B Realty"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git init && git add -A && git commit -m "Initial commit: M3B Realty website"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && cat > .gitignore << 'EOF'
node_modules/
dist/
.env
.env.local
.cache/
.npm/
.nvm/
.browser_data_dir/
.config/
.local/
.logs/
.pki/
.secrets/
.upm/
.agents/
upload/
uploads/
downloads/
*.log
.DS_Store
EOF

source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git add .gitignore && git commit -m "Add .gitignore"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git add package.json package-lock.json vite.config.ts tsconfig.json drizzle.config.ts postcss.config.js components.json && git commit -m "Add project configuration files"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git add client/ server/ shared/ script/ attached_assets/ vite-plugin-meta-images.ts && git commit -m "Add source code and assets"
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git remote add origin https://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@github.com/BCRojas/m3b-realty.git && git branch -M main && git push -u origin main 2>&1
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git remote add origin https://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@github.com/BCRojas/m3b-realty.git && git branch -M main && git push -u origin main 2>&1 | tail -30
source /home/ubuntu/.user_env && cd . && cd /home/ubuntu && git remote remove origin && git remote add origin https://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@github.com/BCRojas/m3b-realty.git && git push -u origin main 2>&1
export PS1="[CMD_BEGIN]\n\u@\h:\w\n[CMD_END]"; export PS2=""
export TERM=xterm-256color
export OPENAI_API_KEY="sk-BstYB3bLKHTPTseitFG8zk"
export OPENAI_API_BASE="https://api.manus.im/api/llm-proxy/v1"
export OPENAI_BASE_URL="https://api.manus.im/api/llm-proxy/v1"
ps() { /bin/ps "$@" | grep -v -E '(start_server\.py|upgrade\.py|supervisor)' || true; }
pgrep() { /usr/bin/pgrep "$@" | while read pid; do [ -n "$pid" ] && cmdline=$(/bin/ps -p $pid -o command= 2>/dev/null) && ! echo "$cmdline" | grep -q -E '(start_server\.py|upgrade\.py|supervisor)' && echo "$pid"; done; }
source /home/ubuntu/.user_env && cd . && npm install -g @railway/cli 2>&1 | tail -20
