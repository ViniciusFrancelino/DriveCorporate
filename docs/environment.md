# Ambiente e configurações

## Backend

As configurações do backend estão em `backend/src/main/resources/application.yml` e usam variáveis de ambiente com valores default para desenvolvimento local.

| Variável | Obrigatória | Default identificado | Onde é usada | Descrição | Impacto se ausente |
|---|---:|---|---|---|---|
| `DB_URL` | Não para dev; sim para ambiente configurado fora do default | `jdbc:mysql://localhost:3306/drive_corporativo` | `spring.datasource.url` | URL JDBC do MySQL. | Usa o banco local default. Se o banco local não existir, o backend falha ao conectar. |
| `DB_USERNAME` | Não para dev; sim para ambiente seguro | `root` | `spring.datasource.username` | Usuário do banco. | Usa `root`. Pode falhar se o usuário/senha não existirem. |
| `DB_PASSWORD` | Não para dev; sim para ambiente seguro | `root` | `spring.datasource.password` | Senha do banco. | Usa `root`. Pode falhar se a senha do banco for diferente. |
| `STORAGE_PATH` | Não | `./storage/drive-corporativo` | `app.storage.path` | Diretório raiz para armazenamento físico dos arquivos. | Usa o diretório local default relativo ao processo do backend. |
| `JWT_SECRET` | Não para dev; sim para ambiente seguro | Valor local definido em `application.yml` | `jwt.secret` | Segredo usado para assinar tokens JWT. Deve ter pelo menos 32 caracteres. | Usa segredo default local. Não recomendado para produção. |
| `JWT_EXPIRATION` | Não | `86400000` | `jwt.expiration` | Tempo de expiração do token em milissegundos. | Usa 24 horas. |

### Configurações não baseadas em variável

| Configuração | Valor identificado | Efeito |
|---|---|---|
| `spring.jpa.hibernate.ddl-auto` | `update` | Hibernate cria/atualiza o schema automaticamente. |
| `spring.jpa.show-sql` | `true` | Exibe SQL no log. |
| `spring.servlet.multipart.max-file-size` | `50MB` | Limite de arquivo enviado. |
| `spring.servlet.multipart.max-request-size` | `50MB` | Limite da requisição multipart. |

## Frontend

| Variável | Obrigatória | Default identificado | Onde é usada | Descrição | Impacto se ausente |
|---|---:|---|---|---|---|
| `VITE_API_URL` | Não | `http://localhost:8080/api` | `frontend/src/api.js` | Base URL da API consumida pelo Axios. | Usa backend local na porta 8080 com prefixo `/api`. |

Exemplo local:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8080/api
```

## Docker Compose / MySQL

O arquivo `docker-compose.yml` define um serviço `mysql`.

| Configuração | Valor identificado | Observação |
|---|---|---|
| Imagem | `mysql:8.4` | Banco usado em desenvolvimento local. |
| Container | `drive_corporativo_mysql` | Nome fixo do container. |
| Porta | `3306:3306` | Expõe MySQL localmente. |
| `MYSQL_ROOT_PASSWORD` | `root` | Valor local. Deve ser tratado como segredo em ambientes reais. |
| `MYSQL_DATABASE` | `drive_corporativo` | Banco criado pelo container. |
| Volume | `mysql_data:/var/lib/mysql` | Persistência dos dados do MySQL. |
| Script inicial | `./mysql/init.sql:/docker-entrypoint-initdb.d/init.sql` | Cria o banco se não existir. |

## Arquivos de ambiente identificados

- `backend/src/main/resources/application.yml`.
- `docker-compose.yml`.
- `frontend/vite.config.js`.
- `frontend/package.json`.
- `backend/pom.xml`.

## Arquivos não identificados

- `.env.example`: não identificado no repositório.
- Arquivo de configuração específico de produção: não identificado no repositório.
- Arquivo de secrets seguro: não identificado no repositório.

## Segurança de credenciais

Não use os valores default `root/root` e segredo JWT local em ambiente real. Para produção ou ambientes compartilhados, defina variáveis externas seguras e evite versionar credenciais.
