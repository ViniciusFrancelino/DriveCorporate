# Drive Corporativo

Drive Corporativo e um MVP web para armazenamento, organizacao e gerenciamento de arquivos corporativos. A aplicacao funciona como uma versao reduzida de um drive interno: usuarios se cadastram, fazem login, criam pastas, enviam arquivos, pesquisam, baixam, favoritam e removem itens de forma logica.

O projeto foi pensado para execucao local e demonstracao tecnica de um fluxo completo com frontend, backend, autenticacao, persistencia em banco relacional e armazenamento fisico em filesystem.

## Visao Geral

O sistema esta organizado como um monorepo:

```text
DriveCorporate/
├── a_code/
│   ├── a_backend/       # API Java/Spring Boot
│   ├── b_frontend/      # Aplicacao React/Vite
│   ├── c_mysql/         # Script inicial do banco
│   └── docker-compose.yml
├── b_docs/              # Documentacao tecnica complementar
├── c_storage/           # Estrutura local de armazenamento
├── d_scripts/           # Scripts de automacao local
├── README.md
└── LICENSE
```

Arquitetura em alto nivel:

```text
Navegador
  -> Frontend React/Vite
  -> API REST Spring Boot (/api) com JWT
  -> MySQL para usuarios, pastas e metadados
  -> Filesystem local para os arquivos fisicos
```

## Funcionalidades

Fluxo principal entregue:

1. Cadastro de usuario.
2. Login com JWT.
3. Protecao de rotas privadas no frontend e no backend.
4. Criacao e navegacao por pastas.
5. Upload de arquivos.
6. Salvamento fisico dos arquivos no servidor.
7. Persistencia de metadados no MySQL.
8. Listagem de arquivos e pastas do usuario autenticado.
9. Busca de arquivos por nome.
10. Download de arquivos.
11. Favoritar e desfavoritar arquivos e pastas.
12. Tela de favoritos.
13. Tela de configuracoes da conta.
14. KPIs basicos do usuario.
15. Exclusao logica de arquivos.
16. Exclusao de pastas com envio dos arquivos da hierarquia para a lixeira logica.
17. Logout no frontend.

Arquivos aceitos no upload:

- `pdf`
- `docx`
- `xlsx`
- `png`
- `jpg` / `jpeg`
- `txt`
- `zip`

Limite por upload: 50 MB.

## Tecnologias

Backend:

- Java 17
- Spring Boot 3.3.5
- Spring Web
- Spring Data JPA
- Spring Security
- JWT com JJWT
- Bean Validation
- Lombok
- Maven

Banco de dados:

- MySQL
- Hibernate com `ddl-auto: update` para o MVP local

Frontend:

- React 18
- Vite 5
- JavaScript/JSX
- Axios
- React Router DOM
- Bootstrap
- React Icons

Armazenamento:

- Filesystem local
- Caminho padrao local: `c_storage/DriveCorporate`

## Estrutura do Backend

O backend fica em `a_code/a_backend` e expoe uma API REST com prefixo `/api`.

Pacotes principais:

```text
com.company.drive/
├── config/
├── controller/
├── dto/
├── entity/
├── exception/
├── repository/
├── security/
└── service/
```

Responsabilidades principais:

| Camada | Responsabilidade |
|---|---|
| Controllers | Entrada HTTP, validacao inicial e delegacao para services. |
| Services | Regras de negocio, isolamento por usuario, upload, favoritos, lixeira e KPIs. |
| Repositories | Persistencia e consultas JPA. |
| Security | JWT, filtros de autenticacao e configuracao de acesso. |
| StorageService | Validacao e gravacao fisica dos arquivos. |

Entidades principais:

| Entidade | Papel |
|---|---|
| `User` | Usuario da aplicacao, com e-mail unico e senha criptografada. |
| `Folder` | Pasta do usuario, com suporte a pasta pai e favorito. |
| `FileEntity` | Metadados do arquivo, dono, pasta opcional, favorito, lixeira e caminho fisico. |

## Estrutura do Frontend

O frontend fica em `a_code/b_frontend` e consome a API por Axios.

Estrutura principal:

```text
src/
├── App.jsx
├── api.js
├── main.jsx
├── styles.css
├── components/
├── pages/
└── services/
```

Rotas principais:

| Rota | Tela | Protecao |
|---|---|---|
| `/login` | Login | Publica |
| `/register` | Cadastro | Publica |
| `/drive/*` | Drive, pastas, arquivos, upload, busca, recentes e lixeira | Privada |
| `/favorites` | Favoritos | Privada |
| `/settings` | Perfil, e-mail, senha e KPIs | Privada |
| `/files` | Redireciona para `/drive` | Privada |

O token JWT e os dados basicos do usuario sao persistidos no `localStorage` nas chaves:

- `token`
- `user`

O arquivo `src/api.js` injeta automaticamente o header:

```http
Authorization: Bearer <token>
```

## Banco de Dados

Crie o banco MySQL:

```sql
CREATE DATABASE IF NOT EXISTS drive_corporativo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

O mesmo comando existe em:

```text
a_code/c_mysql/init.sql
```

Por padrao, o backend usa:

```text
DB_URL=jdbc:mysql://localhost:3306/drive_corporativo
DB_USERNAME=root
DB_PASSWORD=root
```

Esses valores podem ser sobrescritos por variaveis de ambiente.

## Variaveis de Ambiente

Backend:

```bash
export DB_URL='jdbc:mysql://localhost:3306/drive_corporativo'
export DB_USERNAME='root'
export DB_PASSWORD='root'
export JWT_SECRET='altere-este-segredo-local-com-mais-de-32-caracteres'
export JWT_EXPIRATION='86400000'
export STORAGE_PATH='../../c_storage/DriveCorporate'
```

Quando o backend e iniciado a partir de `a_code/a_backend`, o caminho relativo `../../c_storage/DriveCorporate` aponta para o diretorio de storage na raiz do projeto. Tambem e possivel usar um caminho absoluto em `STORAGE_PATH`.

Frontend, opcionalmente em `a_code/b_frontend/.env`:

```bash
VITE_API_URL=http://localhost:8080/api
```

Se `VITE_API_URL` nao for definido, o frontend usa `http://localhost:8080/api`.

## Como Executar Localmente

Pre-requisitos em Debian/WSL:

- Java 17 ou superior
- Maven
- MySQL Server
- Node.js LTS e npm

Instalacao basica:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven mysql-server
```

Instale o Node.js LTS conforme o repositorio/distribuicao de sua preferencia.

### 1. Preparar o MySQL

Inicie o MySQL e crie o banco:

```bash
sudo service mysql start
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS drive_corporativo
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 2. Executar o Backend

```bash
mkdir -p c_storage/DriveCorporate
cd a_code/a_backend
mvn spring-boot:run
```

Servidor esperado:

```text
http://localhost:8080
```

Base da API:

```text
http://localhost:8080/api
```

### 3. Executar o Frontend

Em outro terminal:

```bash
cd a_code/b_frontend
npm install
npm run dev
```

URL esperada do Vite:

```text
http://localhost:5173
```

## Armazenamento de Arquivos

Os arquivos fisicos nao sao salvos no banco. O MySQL guarda somente metadados como nome original, extensao, tipo, tamanho, usuario, pasta e caminho controlado pelo backend.

Por padrao, o backend cria o storage em:

```text
c_storage/DriveCorporate
```

Os arquivos enviados pelo sistema sao armazenados localmente em `c_storage/DriveCorporate`, fora do diretorio do backend, para separar codigo-fonte e arquivos de usuario. O diretorio e criado automaticamente pelo backend quando a aplicacao inicia; o comando `mkdir -p c_storage/DriveCorporate` no setup apenas antecipa essa criacao.

Estrutura fisica esperada:

```text
c_storage/DriveCorporate/{userId}/{uuid}.{extensao}
```

Exemplo:

```text
c_storage/DriveCorporate/1/9f4c7a2e-4d3f-4f9c-a5e1-221d6c61b9aa.pdf
```

O nome original e preservado como metadado, mas o nome fisico e gerado com UUID. Isso evita conflitos de nome e reduz riscos de manipulacao de caminho.

Se existirem arquivos no storage antigo, a migracao pode ser feita manualmente com:

```bash
bash d_scripts/migrate-storage.sh
```

O script copia arquivos encontrados em diretorios antigos para `c_storage/DriveCorporate` e nao remove nada automaticamente.

## API Resumida

Autenticacao:

| Metodo | Endpoint | Descricao |
|---|---|---|
| `POST` | `/api/auth/register` | Cadastra usuario. |
| `POST` | `/api/auth/login` | Autentica e retorna JWT. |

Arquivos:

| Metodo | Endpoint | Descricao |
|---|---|---|
| `POST` | `/api/files/upload` | Upload multipart de arquivo. |
| `GET` | `/api/files` | Lista arquivos ativos. |
| `GET` | `/api/files/search?name=...` | Busca arquivos por nome. |
| `GET` | `/api/files/trash` | Lista arquivos na lixeira logica. |
| `GET` | `/api/files/{id}` | Retorna metadados de um arquivo. |
| `GET` | `/api/files/{id}/download` | Baixa arquivo. |
| `DELETE` | `/api/files/{id}` | Envia arquivo para a lixeira logica. |
| `PATCH` | `/api/files/{id}/favorite` | Marca arquivo como favorito. |
| `PATCH` | `/api/files/{id}/unfavorite` | Remove arquivo dos favoritos. |

Pastas:

| Metodo | Endpoint | Descricao |
|---|---|---|
| `POST` | `/api/folders` | Cria pasta. |
| `GET` | `/api/folders` | Lista pastas do usuario. |
| `GET` | `/api/folders/{id}` | Retorna uma pasta. |
| `GET` | `/api/folders/{id}/contents` | Lista subpastas e arquivos diretos. |
| `DELETE` | `/api/folders/{id}` | Remove pasta e envia arquivos da hierarquia para lixeira. |
| `PATCH` | `/api/folders/{id}/favorite` | Marca pasta como favorita. |
| `PATCH` | `/api/folders/{id}/unfavorite` | Remove pasta dos favoritos. |

Favoritos e usuario:

| Metodo | Endpoint | Descricao |
|---|---|---|
| `GET` | `/api/favorites` | Lista arquivos e pastas favoritos. |
| `GET` | `/api/users/me` | Retorna usuario autenticado. |
| `PUT` | `/api/users/me/profile` | Atualiza nome. |
| `PUT` | `/api/users/me/email` | Atualiza e-mail com senha atual. |
| `PUT` | `/api/users/me/password` | Altera senha. |
| `GET` | `/api/users/me/kpis` | Retorna total de arquivos, pastas e armazenamento usado. |

Mais detalhes estao em `b_docs/g_api.md`.

## Teste Manual do Fluxo Principal

1. Suba o MySQL.
2. Inicie o backend.
3. Inicie o frontend.
4. Acesse `http://localhost:5173`.
5. Crie uma conta em `/register`.
6. Faca login em `/login`.
7. Crie uma pasta no drive.
8. Envie um arquivo permitido de ate 50 MB.
9. Confirme que o arquivo aparece na listagem.
10. Pesquise o arquivo pelo nome.
11. Baixe o arquivo.
12. Marque arquivo ou pasta como favorito.
13. Acesse a tela de favoritos.
14. Abra configuracoes e valide os KPIs.
15. Exclua o arquivo e confira a lixeira logica.
16. Use logout para remover o token do navegador.

## Decisoes do MVP

- A aplicacao e monorepo, mas frontend e backend rodam separadamente.
- A API e stateless e usa JWT.
- A posse de arquivos e pastas e derivada do usuario autenticado no token.
- O frontend nao envia `userId` nem caminhos fisicos.
- O backend gera nomes fisicos com UUID.
- O backend preserva o nome original apenas como metadado.
- A API nao expoe `storagePath` nem `storedName`.
- Uploads validam tamanho, extensao, content type e nome original.
- Caminhos fisicos sao montados e normalizados pelo backend para bloquear path traversal.
- O banco armazena metadados; os binarios ficam no filesystem.
- A exclusao de arquivos e logica.
- Pastas podem ser hierarquicas por meio de pasta pai.
- Favoritos sao flags em arquivos e pastas.
- O schema e atualizado automaticamente pelo Hibernate no ambiente local.

## Limitacoes Atuais

Ainda nao fazem parte do projeto:

- Compartilhamento publico por link.
- Compartilhamento entre usuarios.
- Permissoes por equipe, papeis ou perfis administrativos.
- Painel administrativo.
- Preview de arquivos.
- OCR.
- IA para resumo de documentos.
- Versionamento de arquivos.
- Tags.
- Upload resumavel.
- Integracoes com S3, Google Drive ou Dropbox.
- E-mail e notificacoes.
- Antivírus.
- Restauracao de arquivo da lixeira.
- Exclusao fisica definitiva via API.
- Refresh token.
- Migrations versionadas com Flyway ou Liquibase.
- Deploy em nuvem.
- Configuracao formal de producao.

Pontos de atencao:

- O storage local exige backup junto com o banco para manter consistencia.
- Multiplas instancias do backend exigiriam volume compartilhado ou storage externo.
- O CORS esta direcionado para o ambiente local do Vite.
- O segredo JWT padrao e apenas para desenvolvimento local e deve ser substituido.

## Documentacao Complementar

Arquivos uteis em `b_docs/`:

| Documento | Conteudo |
|---|---|
| `b_docs/b_architecture.md` | Arquitetura, fluxos e decisoes tecnicas. |
| `b_docs/e_setup.md` | Setup local mais detalhado. |
| `b_docs/g_api.md` | Documentacao dos endpoints. |
| `b_docs/h_backend.md` | Detalhes do backend. |
| `b_docs/i_frontend.md` | Detalhes do frontend. |
| `b_docs/k_spec.md` | Especificacao original do MVP. |

## Licenca

Este projeto esta licenciado conforme o arquivo `LICENSE`.
