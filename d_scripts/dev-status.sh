#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CURRENT_DIR="$(pwd)"

MYSQL_CONTAINER="drive-corporativo-mysql"
MYSQL_PORT="3306"
BACKEND_PORT="8080"
FRONTEND_PORT="5173"

LOG_DIR="$PROJECT_ROOT/.logs"
PID_DIR="$PROJECT_ROOT/.pids"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
MYSQL_LOG="$LOG_DIR/mysql.log"
BACKEND_PID="$PID_DIR/backend.pid"
FRONTEND_PID="$PID_DIR/frontend.pid"

if [ "$CURRENT_DIR" != "$PROJECT_ROOT" ]; then
  echo "Execute este script a partir da raiz do projeto:"
  echo "  cd $PROJECT_ROOT"
  echo "  bash d_scripts/dev-status.sh"
  exit 1
fi

tcp_port_is_open() {
  local port="$1"
  (echo >"/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1
}

pid_status() {
  local name="$1"
  local pid_file="$2"
  local port="$3"

  if [ ! -f "$pid_file" ]; then
    if tcp_port_is_open "$port"; then
      echo "$name: porta $port aberta, mas sem PID dos scripts"
    else
      echo "$name: parado (sem PID)"
    fi
    return
  fi

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"
  if [ -n "$pid" ] && kill -0 "$pid" >/dev/null 2>&1; then
    echo "$name: rodando (PID $pid)"
  elif tcp_port_is_open "$port"; then
    echo "$name: porta $port aberta, mas PID antigo invalido (${pid:-vazio})"
  else
    echo "$name: parado (PID antigo: ${pid:-vazio})"
  fi
}

port_status() {
  local port="$1"
  if tcp_port_is_open "$port"; then
    echo "porta $port: aberta"
  else
    echo "porta $port: fechada"
  fi
}

mysql_status() {
  if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -qx "$MYSQL_CONTAINER"; then
    echo "MySQL: rodando no container $MYSQL_CONTAINER"
  elif tcp_port_is_open "$MYSQL_PORT"; then
    echo "MySQL: porta $MYSQL_PORT aberta em localhost"
  else
    echo "MySQL: nao identificado"
  fi
}

echo "Status do ambiente local"
echo
mysql_status
pid_status "Backend" "$BACKEND_PID" "$BACKEND_PORT"
pid_status "Frontend" "$FRONTEND_PID" "$FRONTEND_PORT"
echo
echo "Portas esperadas:"
port_status "$MYSQL_PORT"
port_status "$BACKEND_PORT"
port_status "$FRONTEND_PORT"
echo
echo "URLs esperadas:"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo "API:      http://localhost:$BACKEND_PORT/api"
echo "Frontend: http://localhost:$FRONTEND_PORT"
echo
echo "Logs:"
echo "MySQL:    $MYSQL_LOG"
echo "Backend: $BACKEND_LOG"
echo "Frontend: $FRONTEND_LOG"
