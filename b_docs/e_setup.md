# Setup local

## Pré-requisitos

Identificados no repositório:

- Java 17 ou superior.
- Maven.
- Node.js LTS e npm.
- MySQL Server local ou Docker com Docker Compose.

## 1. Preparar banco de dados

### Opção A — usando Docker Compose

Na raiz do projeto:

```bash
docker compose -f a_code/docker-compose.yml up -d mysql
```

O serviço usa MySQL 8.4, cria o banco `drive_corporativo` e expõe a porta `3306`.

Verificar containers:

```bash
docker ps
```

Parar o banco:

```bash
docker compose -f a_code/docker-compose.yml down
```

Remover também o volume de dados local:

```bash
docker compose -f a_code/docker-compose.yml down -v
```

Use `down -v` apenas quando quiser apagar os dados persistidos no volume `mysql_data`.

### Opção B — usando MySQL local

Criar o banco manualmente:

```sql
CREATE DATABASE IF NOT EXISTS drive_corporativo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

O mesmo comando está no arquivo `a_code/c_mysql/init.sql`.

## 2. Configurar variáveis do backend

Para execução local com os defaults do repositório, as variáveis são opcionais. Para evitar depender de defaults, configure explicitamente:

```bash
export DB_URL='jdbc:mysql://localhost:3306/drive_corporativo'
export DB_USERNAME='root'
export DB_PASSWORD='root'
export JWT_SECRET='altere-este-segredo-local-com-mais-de-32-caracteres'
export JWT_EXPIRATION='86400000'
export STORAGE_PATH='../../c_storage/DriveCorporate'
```

Ajuste `DB_USERNAME` e `DB_PASSWORD` conforme seu MySQL local.
Quando o backend for iniciado a partir de `a_code/a_backend`, `../../c_storage/DriveCorporate` aponta para o diretório de storage na raiz do projeto. Use um caminho absoluto em `STORAGE_PATH` se executar o backend a partir de outro diretório.

## 3. Executar backend

```bash
mkdir -p c_storage/DriveCorporate
cd a_code/a_backend
mvn spring-boot:run
```

URL esperada:

```text
http://localhost:8080
```

Prefixo da API:

```text
http://localhost:8080/api
```

## 4. Configurar frontend

Criar arquivo opcional:

```bash
cd a_code/b_frontend
cat > .env <<'EOF'
VITE_API_URL=http://localhost:8080/api
EOF
```

Se `.env` não existir, `a_code/b_frontend/src/api.js` usa `http://localhost:8080/api` como default.

## 5. Instalar dependências e executar frontend

```bash
cd a_code/b_frontend
npm install
npm run dev
```

URL esperada do Vite:

```text
http://localhost:5173
```

## 6. Build do frontend

```bash
cd a_code/b_frontend
npm run build
```

Pré-visualização do build:

```bash
npm run preview
```

## 7. Fluxo básico para validação manual

1. Subir MySQL.
2. Subir backend.
3. Subir frontend.
4. Acessar `http://localhost:5173`.
5. Criar usuário em `/register`.
6. Fazer login em `/login`.
7. Criar pasta.
8. Fazer upload de arquivo permitido.
9. Baixar arquivo.
10. Favoritar/desfavoritar arquivo ou pasta.
11. Abrir favoritos.
12. Abrir configurações e validar KPIs.
13. Excluir arquivo e conferir lixeira.

## Problemas comuns identificáveis pelo repositório

### Backend não conecta ao banco

Verifique se o MySQL está ativo e se `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` correspondem ao ambiente local.

### Login ou endpoints protegidos retornam 401

O frontend precisa ter `token` salvo no `localStorage`. Faça login novamente. Se o token expirou, o backend rejeitará a requisição.

### Upload rejeitado

O backend aceita somente arquivos não vazios, até 50 MB, com extensão e `Content-Type` compatíveis. Extensões permitidas: `pdf`, `docx`, `xlsx`, `png`, `jpg`, `jpeg`, `txt`, `zip`.

### Frontend não acessa API

Confirme se o backend está em `http://localhost:8080/api` ou ajuste `VITE_API_URL` no arquivo `frontend/.env`.

### CORS em ambiente diferente de localhost

Os controllers estão configurados para `http://localhost:5173`. Para outro host/porta, será necessário ajustar a configuração de CORS no backend.

## Automação local identificada

- `d_scripts/dev-start.sh`: inicia MySQL, backend e frontend localmente.
- `d_scripts/dev-stop.sh`: para backend e frontend; opcionalmente para o MySQL.
- `d_scripts/dev-status.sh`: mostra status dos serviços, portas e logs.
- `d_scripts/migrate-storage.sh`: copia arquivos de storages antigos para o storage local atual.

## Itens não identificados no repositório

- Dockerfile para backend.
- Dockerfile para frontend.
- Docker Compose com backend e frontend.
- Testes automatizados executáveis documentados.
- Configuração de ambiente de produção.
