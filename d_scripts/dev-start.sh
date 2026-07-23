#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CURRENT_DIR="$(pwd)"

MYSQL_CONTAINER="drive-corporativo-mysql"
MYSQL_IMAGE="mysql:8.0"
MYSQL_DATABASE="drive_corporativo"
MYSQL_HOST="127.0.0.1"
MYSQL_PORT="3306"
MYSQL_USER="root"
MYSQL_PASSWORD="root"

BACKEND_PORT="8080"
FRONTEND_PORT="5173"

LOG_DIR="$PROJECT_ROOT/.logs"
PID_DIR="$PROJECT_ROOT/.pids"
STORAGE_DIR="$PROJECT_ROOT/c_storage/DriveCorporate"

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
MYSQL_LOG="$LOG_DIR/mysql.log"
BACKEND_PID="$PID_DIR/backend.pid"
FRONTEND_PID="$PID_DIR/frontend.pid"

if [ "$CURRENT_DIR" != "$PROJECT_ROOT" ]; then
  echo "Execute este script a partir da raiz do projeto:"
  echo "  cd $PROJECT_ROOT"
  echo "  bash d_scripts/dev-start.sh"
  exit 1
fi

if [ ! -f "$PROJECT_ROOT/b_docs/k_spec.md" ] && [ ! -f "$PROJECT_ROOT/spec.md" ]; then
  echo "Arquivo de especificacao nao encontrado."
  echo "Esperado: spec.md ou b_docs/k_spec.md"
  exit 1
fi

if [ -f "$PROJECT_ROOT/backend/pom.xml" ]; then
  BACKEND_DIR="$PROJECT_ROOT/backend"
elif [ -f "$PROJECT_ROOT/a_code/a_backend/pom.xml" ]; then
  BACKEND_DIR="$PROJECT_ROOT/a_code/a_backend"
else
  echo "Nao foi encontrado backend/pom.xml nem a_code/a_backend/pom.xml."
  exit 1
fi

if [ -f "$PROJECT_ROOT/frontend/package.json" ]; then
  FRONTEND_DIR="$PROJECT_ROOT/frontend"
elif [ -f "$PROJECT_ROOT/a_code/b_frontend/package.json" ]; then
  FRONTEND_DIR="$PROJECT_ROOT/a_code/b_frontend"
else
  echo "Nao foi encontrado frontend/package.json nem a_code/b_frontend/package.json."
  exit 1
fi

mkdir -p "$LOG_DIR" "$PID_DIR" "$STORAGE_DIR"
: > "$MYSQL_LOG"

log_mysql() {
  printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >> "$MYSQL_LOG"
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

pid_is_running() {
  local pid_file="$1"
  [ -f "$pid_file" ] || return 1
  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  [ -n "$pid" ] && kill -0 "$pid" >/dev/null 2>&1
}

mysql_exec_host() {
  mysql \
    --protocol=tcp \
    -h "$MYSQL_HOST" \
    -P "$MYSQL_PORT" \
    -u "$MYSQL_USER" \
    "-p$MYSQL_PASSWORD" \
    -e "$1" >/dev/null
}

tcp_port_is_open() {
  local port="$1"
  (echo >"/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1
}

mysql_exec_docker() {
  docker exec "$MYSQL_CONTAINER" \
    mysql \
    -u "$MYSQL_USER" \
    "-p$MYSQL_PASSWORD" \
    -e "$1" >/dev/null
}

mysql_is_ready() {
  local sql="SELECT 1;"

  if command_exists mysql && mysql_exec_host "$sql" >> "$MYSQL_LOG" 2>&1; then
    return 0
  fi

  if command_exists docker && docker ps --format '{{.Names}}' | grep -qx "$MYSQL_CONTAINER"; then
    if mysql_exec_docker "$sql" >> "$MYSQL_LOG" 2>&1; then
      return 0
    fi
  fi

  return 1
}

wait_for_mysql() {
  local attempts=60

  for _ in $(seq 1 "$attempts"); do
    if mysql_is_ready; then
      return 0
    fi

    sleep 2
  done

  return 1
}

ensure_mysql() {
  log_mysql "Validando MySQL em $MYSQL_HOST:$MYSQL_PORT"

  if mysql_is_ready; then
    log_mysql "MySQL ja esta disponivel."
  elif command_exists docker; then
    if docker ps -a --format '{{.Names}}' | grep -qx "$MYSQL_CONTAINER"; then
      log_mysql "Iniciando container existente $MYSQL_CONTAINER"
      docker start "$MYSQL_CONTAINER" >> "$MYSQL_LOG" 2>&1
    else
      log_mysql "Criando container $MYSQL_CONTAINER com imagem $MYSQL_IMAGE"
      docker run -d \
        --name "$MYSQL_CONTAINER" \
        -e MYSQL_ROOT_PASSWORD="$MYSQL_PASSWORD" \
        -e MYSQL_DATABASE="$MYSQL_DATABASE" \
        -p "$MYSQL_PORT:3306" \
        "$MYSQL_IMAGE" >> "$MYSQL_LOG" 2>&1
    fi

    if ! wait_for_mysql; then
      echo "MySQL nao ficou disponivel. Veja $MYSQL_LOG."
      exit 1
    fi
  else
    echo "MySQL nao esta acessivel em localhost:3306 e Docker nao esta disponivel."
    echo "Inicie um MySQL local com usuario root/root e banco $MYSQL_DATABASE."
    exit 1
  fi

  local create_db_sql="CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  if command_exists mysql && mysql_exec_host "$create_db_sql" >> "$MYSQL_LOG" 2>&1; then
    log_mysql "Banco $MYSQL_DATABASE validado via cliente mysql local."
  elif command_exists docker && docker ps --format '{{.Names}}' | grep -qx "$MYSQL_CONTAINER"; then
    mysql_exec_docker "$create_db_sql" >> "$MYSQL_LOG" 2>&1
    log_mysql "Banco $MYSQL_DATABASE validado via container Docker."
  else
    echo "Nao foi possivel criar/validar o banco $MYSQL_DATABASE. Veja $MYSQL_LOG."
    exit 1
  fi
}

start_backend() {
  if pid_is_running "$BACKEND_PID"; then
    echo "Backend ja esta rodando com PID $(cat "$BACKEND_PID")."
    return
  fi

  if tcp_port_is_open "$BACKEND_PORT"; then
    echo "A porta $BACKEND_PORT ja esta em uso, mas nao ha PID valido em $BACKEND_PID."
    echo "Pare o processo existente ou registre o PID antes de iniciar o backend pelos scripts."
    exit 1
  fi

  if ! command_exists mvn; then
    echo "Maven nao encontrado no PATH."
    exit 1
  fi

  : > "$BACKEND_LOG"
  (
    cd "$BACKEND_DIR"
    export DB_URL="jdbc:mysql://localhost:$MYSQL_PORT/$MYSQL_DATABASE"
    export DB_USERNAME="$MYSQL_USER"
    export DB_PASSWORD="$MYSQL_PASSWORD"
    export STORAGE_PATH="$STORAGE_DIR"
    mvn spring-boot:run
  ) >> "$BACKEND_LOG" 2>&1 &

  echo "$!" > "$BACKEND_PID"
  echo "Backend iniciado com PID $(cat "$BACKEND_PID")."
}

start_frontend() {
  if pid_is_running "$FRONTEND_PID"; then
    echo "Frontend ja esta rodando com PID $(cat "$FRONTEND_PID")."
    return
  fi

  if tcp_port_is_open "$FRONTEND_PORT"; then
    echo "A porta $FRONTEND_PORT ja esta em uso, mas nao ha PID valido em $FRONTEND_PID."
    echo "Pare o processo existente ou registre o PID antes de iniciar o frontend pelos scripts."
    exit 1
  fi

  if ! command_exists npm; then
    echo "npm nao encontrado no PATH."
    exit 1
  fi

  : > "$FRONTEND_LOG"
  (
    cd "$FRONTEND_DIR"
    if [ ! -d node_modules ]; then
      npm install
    fi
    npm run dev -- --host 0.0.0.0
  ) >> "$FRONTEND_LOG" 2>&1 &

  echo "$!" > "$FRONTEND_PID"
  echo "Frontend iniciado com PID $(cat "$FRONTEND_PID")."
}

ensure_mysql
start_backend
start_frontend

cat <<EOF

Ambiente local iniciado.

URLs:
  Backend:  http://localhost:$BACKEND_PORT
  API:      http://localhost:$BACKEND_PORT/api
  Frontend: http://localhost:$FRONTEND_PORT

Logs:
  MySQL:    $MYSQL_LOG
  Backend: $BACKEND_LOG
  Frontend: $FRONTEND_LOG

PIDs:
  Backend:  $BACKEND_PID
  Frontend: $FRONTEND_PID

Storage:
  $STORAGE_DIR

Para ver o status:
  bash d_scripts/dev-status.sh

Para parar backend e frontend:
  bash d_scripts/dev-stop.sh
EOF
