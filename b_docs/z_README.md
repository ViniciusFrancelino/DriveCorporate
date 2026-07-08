# Drive Corporativo — Documentação técnica

## Visão geral

O projeto identificado no repositório é o **Drive Corporativo**. A aplicação implementa um MVP de armazenamento e organização de arquivos corporativos, com autenticação de usuários, navegação por pastas, upload, download, busca, favoritos, lixeira lógica e configurações de conta.

O repositório possui frontend e backend separados, banco MySQL e armazenamento local em filesystem. A comunicação entre frontend e backend ocorre por API HTTP sob o prefixo `/api`, com autenticação via JWT após login.

## Objetivo geral do sistema

Permitir que usuários autenticados gerenciem arquivos e pastas em uma interface semelhante a um drive simples, mantendo metadados no banco de dados e arquivos físicos no disco local da aplicação.

## Principais módulos existentes

| Módulo | Local | Responsabilidade |
|---|---|---|
| Frontend | `frontend/` | Interface React/Vite para login, cadastro, drive, favoritos e configurações. |
| Backend | `backend/` | API Spring Boot para autenticação, usuários, arquivos, pastas, favoritos, persistência e armazenamento físico. |
| Banco de dados | `mysql/` e `docker-compose.yml` | MySQL usado pela aplicação backend via Spring Data JPA/Hibernate. |
| Armazenamento local | `storage/drive-corporativo` e `app.storage.path` | Diretório local onde os arquivos enviados são gravados fisicamente. |
| Documentação técnica | `docs/` | Documentação técnica do estado atual do projeto. |

Arquivos de prompt, exemplos de prompt, documentos auxiliares de IA e conteúdos similares existentes no repositório não foram documentados por não fazerem parte da implementação executável do sistema.

## Tecnologias

### Backend

- Java 17.
- Spring Boot 3.3.5.
- Maven.
- Spring Web.
- Spring Data JPA.
- Spring Security.
- JWT com biblioteca `jjwt`.
- Bean Validation/Jakarta Validation.
- Lombok.
- MySQL Connector/J.

### Frontend

- React 18.
- Vite 5.
- JavaScript/JSX.
- Axios.
- React Router DOM.
- Bootstrap.
- React Icons.

### Banco e infraestrutura local

- MySQL 8.4 via Docker Compose.
- Volume Docker `mysql_data`.
- Script `mysql/init.sql` para criação do banco `drive_corporativo`.
- Armazenamento de arquivos no filesystem local.

## Estrutura geral do repositório

```text
DriveCorporate/
├── backend/
│   ├── pom.xml
│   ├── README.md
│   ├── src/main/java/com/company/drive/
│   └── src/main/resources/application.yml
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
├── mysql/
│   └── init.sql
├── storage/
│   └── drive-corporativo/
├── docs/
├── docker-compose.yml
├── README.md
└── LICENSE
```

## Documentos técnicos

- [Frontend](./frontend.md)
- [Backend](./backend.md)
- [Arquitetura](./architecture.md)
- [Ambiente e variáveis](./environment.md)
- [Setup local](./setup.md)
- [API](./api.md)
- [Banco de dados](./database.md)
- [Documentação do código](./code-documentation.md)
- [Manutenção e evolução](./maintenance.md)

## Itens não identificados no repositório

- Pipeline de CI/CD.
- Deploy em produção.
- Testes automatizados implementados.
- Arquivo `.env.example`.
- Migrations versionadas com Flyway, Liquibase ou ferramenta equivalente.
- Seed de dados de aplicação, além da criação do banco em `mysql/init.sql`.
- Política de backup do banco ou do diretório de arquivos.
