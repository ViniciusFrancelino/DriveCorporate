# Backend

## Visão geral

O backend existe no diretório `backend/` e foi implementado em Java 17 com Spring Boot 3.3.5. Ele expõe uma API REST sob o prefixo `/api`, usa Spring Security com JWT para autenticação stateless, persiste metadados no MySQL via Spring Data JPA e grava os arquivos físicos no filesystem local.

## Tecnologias

| Tecnologia | Uso identificado |
|---|---|
| Java 17 | Versão configurada no `pom.xml`. |
| Spring Boot 3.3.5 | Framework principal do backend. |
| Spring Web | Controllers REST. |
| Spring Data JPA | Persistência de entidades em MySQL. |
| Spring Security | Autenticação/autorização. |
| JJWT | Geração e validação de tokens JWT. |
| Bean Validation | Validação de DTOs de entrada. |
| Lombok | Getters, setters e construtores simples. |
| MySQL Connector/J | Driver JDBC para MySQL. |
| Maven | Build e gerenciamento de dependências. |

## Estrutura de pacotes

```text
backend/src/main/java/com/company/drive/
├── DriveApplication.java
├── config/
│   ├── AuthenticationConfig.java
│   └── StorageProperties.java
├── controller/
│   ├── AuthController.java
│   ├── FavoriteController.java
│   ├── FileController.java
│   ├── FolderController.java
│   └── UserController.java
├── dto/
├── entity/
│   ├── FileEntity.java
│   ├── Folder.java
│   └── User.java
├── exception/
├── repository/
│   ├── FileRepository.java
│   ├── FolderRepository.java
│   └── UserRepository.java
├── security/
└── service/
```

## Camadas

### Controllers

| Controller | Prefixo | Responsabilidade |
|---|---|---|
| `AuthController` | `/api/auth` | Cadastro e login. |
| `FileController` | `/api/files` | Upload, listagem, busca, lixeira, download, exclusão lógica e favoritos de arquivos. |
| `FolderController` | `/api/folders` | Criação, listagem, conteúdo, consulta, exclusão e favoritos de pastas. |
| `FavoriteController` | `/api/favorites` | Listagem consolidada de pastas e arquivos favoritos. |
| `UserController` | `/api/users/me` | Dados do usuário atual, alteração de perfil, e-mail, senha e KPIs. |

Os controllers possuem `@CrossOrigin(origins = "http://localhost:5173")`, alinhado ao servidor local do Vite.

### Services

| Service | Responsabilidade |
|---|---|
| `AuthService` | Cadastro, autenticação, normalização de e-mail, criptografia de senha e geração de JWT. |
| `CurrentUserService` | Resolução do usuário autenticado a partir do contexto de segurança. |
| `FileService` | Regras de arquivos: upload, listagem, busca, lixeira, download, exclusão lógica e favoritos. |
| `FolderService` | Regras de pastas: criação hierárquica, listagem, conteúdo, exclusão recursiva e favoritos. |
| `FavoriteService` | Agregação de pastas e arquivos favoritos do usuário atual. |
| `StorageService` | Validação e gravação física de arquivos no filesystem local. |
| `UserService` | Dados da conta, alteração de nome/e-mail/senha e KPIs do usuário. |

### Repositories

| Repository | Entidade | Observações |
|---|---|---|
| `UserRepository` | `User` | Busca e valida unicidade por e-mail. |
| `FolderRepository` | `Folder` | Consulta por usuário, pasta pai, favoritos e duplicidade por nível. |
| `FileRepository` | `FileEntity` | Consulta arquivos ativos, lixeira, busca por nome, favoritos e soma de armazenamento usado. |

### Entidades

| Entidade | Tabela | Responsabilidade |
|---|---|---|
| `User` | `users` | Usuário da aplicação, com nome, e-mail único e senha criptografada. |
| `Folder` | `folders` | Pasta do usuário, com relacionamento opcional para pasta pai e marcação de favorito. |
| `FileEntity` | `files` | Metadados dos arquivos enviados, referência ao usuário, pasta opcional, flags de lixeira e favorito e caminho físico. |

## Segurança

A segurança é configurada em `SecurityConfig`:

- CSRF desabilitado.
- Sessão stateless.
- `/api/auth/**` liberado sem autenticação.
- Requisições `OPTIONS /**` liberadas.
- Demais endpoints exigem autenticação.
- Filtro JWT registrado antes de `UsernamePasswordAuthenticationFilter`.
- Senhas criptografadas com `BCryptPasswordEncoder`.

O `JwtService` exige segredo com pelo menos 32 caracteres. O token usa o identificador do usuário como `subject` no fluxo de login identificado.

## Configurações relevantes

Arquivo principal: `backend/src/main/resources/application.yml`.

Configurações identificadas:

- `spring.datasource.url`: usa `DB_URL` com default local para MySQL.
- `spring.datasource.username`: usa `DB_USERNAME` com default `root`.
- `spring.datasource.password`: usa `DB_PASSWORD` com default `root`.
- `spring.jpa.hibernate.ddl-auto`: `update`.
- `spring.jpa.show-sql`: `true`.
- `spring.servlet.multipart.max-file-size`: `50MB`.
- `spring.servlet.multipart.max-request-size`: `50MB`.
- `app.storage.path`: usa `STORAGE_PATH` com default `./storage/drive-corporativo`.
- `jwt.secret`: usa `JWT_SECRET` com default local.
- `jwt.expiration`: usa `JWT_EXPIRATION` com default `86400000` milissegundos.

## Fluxos principais de negócio

### Cadastro

1. Recebe `name`, `email` e `password`.
2. Normaliza o e-mail com `trim().toLowerCase()`.
3. Verifica duplicidade de e-mail.
4. Criptografa senha com BCrypt.
5. Persiste usuário.
6. Retorna `UserResponse`.

### Login

1. Recebe e-mail e senha.
2. Autentica usando Spring Security.
3. Busca usuário pelo e-mail normalizado.
4. Gera JWT.
5. Retorna token e dados básicos do usuário.

### Upload de arquivo

1. Resolve usuário autenticado.
2. Valida pasta destino quando `folderId` é informado.
3. Valida arquivo físico em `StorageService`.
4. Gera nome armazenado com UUID.
5. Cria diretório do usuário dentro do storage.
6. Copia o arquivo para o filesystem.
7. Persiste metadados em `files`.
8. Retorna `FileResponse`.

Validações identificadas para arquivo:

- Arquivo não pode estar vazio.
- Tamanho máximo de 50 MB.
- Extensões permitidas: `pdf`, `docx`, `xlsx`, `png`, `jpg`, `jpeg`, `txt`, `zip`.
- `Content-Type` deve ser compatível com a extensão.
- Nome original não pode conter `..`, `/` ou `\`.

### Exclusão de arquivo

A exclusão de arquivo é lógica: o campo `deleted` é alterado para `true`. O arquivo físico não é removido do filesystem pelo fluxo identificado.

### Exclusão de pasta

A exclusão de pasta coleta a hierarquia de subpastas, move os arquivos ativos encontrados para a lixeira lógica, remove o vínculo com a pasta e exclui os registros de pasta de baixo para cima.

### Favoritos

Arquivos e pastas possuem flag booleana `favorite`. Existem endpoints separados para favoritar e desfavoritar arquivos e pastas. A listagem consolidada é feita por `FavoriteService`.

### KPIs do usuário

O backend calcula:

- Total de arquivos ativos.
- Total de pastas.
- Soma de bytes dos arquivos ativos.
- Valor formatado em B, KB, MB ou GB.

## Como executar o backend

Com banco MySQL disponível:

```bash
cd backend
mvn spring-boot:run
```

Servidor esperado:

```text
http://localhost:8080
```

## Pontos importantes para manutenção

- Alterações em endpoints devem ser refletidas nos serviços frontend em `frontend/src/services` ou nas chamadas diretas das páginas.
- Novas entidades JPA devem ser avaliadas junto à estratégia `ddl-auto: update`; para ambientes reais, migrations versionadas são recomendáveis.
- O storage local é uma dependência operacional do backend; backup de banco sem backup do diretório de arquivos deixa o sistema inconsistente.
- O segredo JWT default é adequado apenas para execução local; deve ser substituído por variável segura fora do código.
- O CORS está direcionado para `http://localhost:5173`; produção exigirá configuração apropriada.
