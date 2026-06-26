# Manutenção e evolução

## Como localizar pontos importantes

| Necessidade | Onde começar |
|---|---|
| Alterar autenticação | `backend/security`, `AuthService`, `AuthController`, `frontend/src/api.js`, `LoginPage.jsx`. |
| Alterar upload/download | `FileController`, `FileService`, `StorageService`, `FilesPage.jsx`. |
| Alterar pastas | `FolderController`, `FolderService`, `FolderRepository`, `FilesPage.jsx`. |
| Alterar favoritos | `FavoriteController`, `FavoriteService`, endpoints de favorite/unfavorite, `Favorites.jsx`. |
| Alterar configurações da conta | `UserController`, `UserService`, `Settings.jsx`, `userService.js`. |
| Alterar banco | Entidades em `backend/entity`, repositories e `application.yml`. |
| Alterar base URL da API no frontend | `frontend/src/api.js` ou variável `VITE_API_URL`. |
| Alterar storage local | `StorageProperties`, `StorageService`, variável `STORAGE_PATH`. |

## Como adicionar novos endpoints

Fluxo recomendado:

1. Criar ou ajustar DTOs em `backend/src/main/java/com/company/drive/dto/`.
2. Adicionar método no service responsável pela regra de negócio.
3. Usar repositories para persistência, mantendo validação de usuário proprietário quando aplicável.
4. Criar endpoint no controller correspondente.
5. Garantir validação com `@Valid` quando houver corpo de entrada.
6. Atualizar o frontend em `src/services` ou na página que consome o endpoint.
7. Atualizar `docs/api.md`.

## Como adicionar uma nova tela no frontend

1. Criar componente em `frontend/src/pages/`.
2. Criar services em `frontend/src/services/` se a tela consumir endpoints novos.
3. Adicionar rota em `frontend/src/App.jsx`.
4. Se a tela exigir login, envolver com `PrivateRoute`.
5. Adicionar navegação nos menus das telas relevantes.
6. Atualizar `docs/frontend.md`.

## Como adicionar nova entidade

1. Criar entidade em `backend/src/main/java/com/company/drive/entity/`.
2. Criar repository em `backend/src/main/java/com/company/drive/repository/`.
3. Criar DTOs de entrada/saída.
4. Criar service com regras de negócio.
5. Criar controller se a entidade tiver API pública.
6. Avaliar impacto em banco. No estado atual, o Hibernate usa `ddl-auto: update`; para evolução segura, é recomendável adicionar migrations versionadas.
7. Atualizar `docs/database.md`, `docs/backend.md` e `docs/api.md`.

## Como alterar configurações

### Backend

Alterar `backend/src/main/resources/application.yml` apenas para defaults locais. Para ambientes externos, preferir variáveis de ambiente:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `STORAGE_PATH`
- `JWT_SECRET`
- `JWT_EXPIRATION`

### Frontend

Alterar a variável `VITE_API_URL` no arquivo `frontend/.env` local ou no ambiente de build.

## Boas práticas já utilizadas

- Separação entre frontend e backend.
- Uso de DTOs para entrada e saída da API.
- Uso de services para regras de negócio.
- Uso de repositories para persistência.
- Senhas criptografadas com BCrypt.
- Autenticação stateless com JWT.
- Isolamento de dados por usuário nos services.
- Validação de upload por extensão, tamanho, content-type e nome seguro.
- Exclusão lógica de arquivos, reduzindo risco de perda imediata.
- Tratamento global de exceções com formato consistente.

## Riscos técnicos observados

| Risco | Impacto |
|---|---|
| `ddl-auto: update` | Pode alterar schema sem rastreabilidade e causar divergências entre ambientes. |
| Credenciais/defaults locais no versionamento | Valores como `root/root` e segredo JWT default não são adequados para produção. |
| Storage local | Dificulta escala horizontal e exige backup coordenado com banco. |
| Arquivo físico não removido na exclusão lógica | Pode acumular arquivos no disco. |
| Ausência de restauração de lixeira | Usuário pode mover arquivo para lixeira sem fluxo identificado de recuperação. |
| Ausência de exclusão definitiva | Não foi identificado processo de limpeza de arquivos antigos. |
| CORS fixo para `localhost:5173` | Exige alteração para ambientes diferentes. |
| `FilesPage.jsx` muito concentrado | Aumenta custo de manutenção e risco de regressão em mudanças de UI. |
| Ausência de migrations | Dificulta evolução controlada do banco. |
| Ausência de testes identificados | Mudanças em regras críticas dependem de validação manual. |
| Diretório `storage/` presente no repositório | Risco de versionar arquivos enviados ou dados locais. |

## Débitos técnicos visíveis

- Criar migrations versionadas.
- Adicionar `.env.example` sem segredos reais.
- Separar responsabilidades de `FilesPage.jsx` em componentes menores e hooks.
- Criar camada frontend consistente de services para todos os endpoints; hoje algumas páginas chamam `api` diretamente.
- Adicionar testes unitários para services backend.
- Adicionar testes de integração para endpoints críticos.
- Adicionar validação de upload por assinatura de arquivo, se segurança for requisito.
- Adicionar política de limpeza física para arquivos excluídos, se aplicável.
- Adicionar fluxo de restauração de lixeira, se a lixeira for parte funcional do produto.
- Ignorar `storage/` no `.gitignore`, caso o diretório seja apenas runtime/local.

## Sugestões objetivas de melhoria

Estas sugestões são separadas da documentação factual e representam melhorias recomendadas:

1. Substituir `ddl-auto: update` por Flyway ou Liquibase antes de uso em ambiente compartilhado.
2. Criar `.env.example` para backend e frontend, sem valores sensíveis.
3. Remover defaults sensíveis de produção e exigir `JWT_SECRET` via ambiente nos perfis não locais.
4. Criar perfil Spring `dev` e `prod` para separar logs, SQL visível e configurações de banco.
5. Criar `Dockerfile` para backend e frontend se o objetivo for empacotar a aplicação completa.
6. Criar `docker-compose.yml` opcional com backend, frontend e MySQL para onboarding mais simples.
7. Refatorar `FilesPage.jsx` em componentes como `Sidebar`, `FileTable`, `FolderGrid`, `UploadModal`, `DeleteFolderModal` e hooks como `useDriveData`.
8. Adicionar endpoint de restore da lixeira se a lixeira continuar exposta na interface.
9. Adicionar endpoint de exclusão definitiva e rotina de limpeza física, se houver requisito de retenção.
10. Adicionar OpenAPI/Swagger para manter documentação de endpoints sincronizada com o backend.
11. Adicionar testes para `StorageService`, `FolderService.delete`, `AuthService` e `UserService`.
12. Adicionar validação de limite de armazenamento no backend, já que a quota de 5 GB aparece apenas no frontend.

## Checklist antes de alterar regras críticas

- A mudança preserva isolamento por usuário?
- A mudança afeta banco e filesystem ao mesmo tempo?
- Existe rollback ou compensação caso a gravação física falhe?
- O frontend usa o mesmo contrato que o backend retorna?
- A documentação em `docs/` foi atualizada?
- A configuração funciona sem expor segredo real?
- A alteração exige migração de dados existentes?
