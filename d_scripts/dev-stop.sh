#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CURRENT_DIR="$(pwd)"

MYSQL_CONTAINER="drive-corporativo-mysql"
PID_DIR="$PROJECT_ROOT/.pids"
BACKEND_PID="$PID_DIR/backend.pid"
FRONTEND_PID="$PID_DIR/frontend.pid"

STOP_MYSQL=false
for arg in "$@"; do
  case "$arg" in
    --mysql|--with-mysql|--stop-mysql)
      STOP_MYSQL=true
      ;;
    -h|--help)
      cat <<EOF
Uso:
  bash d_scripts/dev-stop.sh
  bash d_scripts/dev-stop.sh --mysql

Por padrao, para apenas backend e frontend.
Use --mysql para parar tambem o container MySQL usado pelos scripts.
EOF
      exit 0
      ;;
    *)
      echo "Opcao desconhecida: $arg"
      exit 1
      ;;
  esac
done

if [ "$CURRENT_DIR" != "$PROJECT_ROOT" ]; then
  echo "Execute este script a partir da raiz do projeto:"
  echo "  cd $PROJECT_ROOT"
  echo "  bash d_scripts/dev-stop.sh"
  exit 1
fi

stop_pid_file() {
  local name="$1"
  local pid_file="$2"

  if [ ! -f "$pid_file" ]; then
    echo "$name nao possui arquivo de PID."
    return
  fi

  local pid
  pid="$(cat "$pid_file" 2>/dev/null || true)"

  if [ -z "$pid" ]; then
    rm -f "$pid_file"
    echo "$name tinha PID vazio; arquivo removido."
    return
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    kill "$pid" >/dev/null 2>&1 || true
    for _ in $(seq 1 20); do
      if ! kill -0 "$pid" >/dev/null 2>&1; then
        break
      fi
      sleep 1
    done

    if kill -0 "$pid" >/dev/null 2>&1; then
      kill -9 "$pid" >/dev/null 2>&1 || true
    fi

    echo "$name parado."
  else
    echo "$name nao estava rodando."
  fi

  rm -f "$pid_file"
}

stop_pid_file "Backend" "$BACKEND_PID"
stop_pid_file "Frontend" "$FRONTEND_PID"

if [ "$STOP_MYSQL" = true ]; then
  if command -v docker >/dev/null 2>&1 && docker ps --format '{{.Names}}' | grep -qx "$MYSQL_CONTAINER"; then
    docker stop "$MYSQL_CONTAINER" >/dev/null
    echo "Container MySQL parado: $MYSQL_CONTAINER"
  else
    echo "Container MySQL $MYSQL_CONTAINER nao esta rodando."
  fi
else
  echo "MySQL mantido em execucao. Use --mysql para parar o container usado pelos scripts."
fi
