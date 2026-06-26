# Frontend

## Visão geral

O frontend existe no diretório `frontend/` e foi implementado com React, Vite e JavaScript/JSX. Ele consome a API do backend por Axios, usando o token JWT salvo em `localStorage` para autenticar requisições protegidas.

## Tecnologias e bibliotecas

| Tecnologia | Uso identificado |
|---|---|
| React 18 | Construção da interface. |
| Vite 5 | Servidor de desenvolvimento e build frontend. |
| JavaScript/JSX | Linguagem dos componentes. |
| React Router DOM | Rotas de login, cadastro, drive, favoritos e configurações. |
| Axios | Cliente HTTP para comunicação com o backend. |
| Bootstrap | Estilização base importada em `main.jsx`. |
| React Icons | Ícones usados nas telas do drive, favoritos e configurações. |

## Estrutura de pastas

```text
frontend/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── api.js
    ├── main.jsx
    ├── styles.css
    ├── components/
    │   ├── AuthCard.jsx
    │   ├── AuthLayout.jsx
    │   ├── InputField.jsx
    │   └── LoadingButton.jsx
    ├── pages/
    │   ├── Favorites.jsx
    │   ├── FilesPage.jsx
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   └── Settings.jsx
    └── services/
        ├── favoriteService.js
        ├── fileService.js
        ├── folderService.js
        └── userService.js
```

## Inicialização da aplicação

O arquivo `src/main.jsx` cria a aplicação React, importa Bootstrap, importa `styles.css`, envolve a aplicação com `BrowserRouter` e renderiza o componente `App` no elemento `root`.

O arquivo `src/App.jsx` concentra as rotas principais. A proteção de rotas é feita por `PrivateRoute`, que verifica a existência de `token` no `localStorage`.

## Rotas identificadas

| Rota | Componente | Proteção | Função |
|---|---|---:|---|
| `/login` | `LoginPage` | Não | Autenticação do usuário. |
| `/register` | `RegisterPage` | Não | Cadastro de usuário. |
| `/drive/*` | `FilesPage` | Sim | Tela principal do drive, navegação por pastas, upload, busca, recentes e lixeira. |
| `/favorites` | `Favorites` | Sim | Lista arquivos e pastas favoritos. |
| `/settings` | `Settings` | Sim | Configurações da conta, alteração de nome, e-mail, senha e KPIs. |
| `/files` | Redireciona para `/drive` | Sim | Compatibilidade de navegação. |
| `*` | Redireciona para `/drive` | Sim | Fallback. |

## Comunicação com o backend

O arquivo `src/api.js` cria uma instância Axios com base URL definida por `VITE_API_URL` ou pelo default `http://localhost:8080/api`. O mesmo arquivo registra um interceptor que lê `token` do `localStorage` e adiciona `Authorization: Bearer <token>` às requisições.

Serviços identificados:

| Arquivo | Funções | Endpoints consumidos |
|---|---|---|
| `services/favoriteService.js` | `getFavorites` | `GET /favorites` |
| `services/fileService.js` | `favoriteFile`, `unfavoriteFile` | `PATCH /files/{id}/favorite`, `PATCH /files/{id}/unfavorite` |
| `services/folderService.js` | `favoriteFolder`, `unfavoriteFolder` | `PATCH /folders/{id}/favorite`, `PATCH /folders/{id}/unfavorite` |
| `services/userService.js` | `getCurrentUser`, `updateProfile`, `updateEmail`, `changePassword`, `getUserKpis` | `/users/me`, `/users/me/profile`, `/users/me/email`, `/users/me/password`, `/users/me/kpis` |

Além dos serviços, `FilesPage.jsx`, `LoginPage.jsx`, `RegisterPage.jsx` e `Favorites.jsx` também chamam `api` diretamente.

## Principais telas

### `LoginPage.jsx`

Responsável por autenticar o usuário via `POST /auth/login`. Em caso de sucesso, salva `token` e `user` no `localStorage` e navega para `/files`, que é redirecionado para `/drive`.

### `RegisterPage.jsx`

Responsável por cadastrar usuário via `POST /auth/register`. Antes de enviar, valida no frontend se `password` e `confirmPassword` coincidem. Após cadastro bem-sucedido, direciona o fluxo para login ou navegação definida no componente.

### `FilesPage.jsx`

Tela principal do drive. Responsabilidades identificadas:

- Listar pastas e arquivos.
- Navegar por pastas usando rota `/drive/{id}/{id...}`.
- Montar breadcrumbs com base em `parentFolderId`.
- Criar pasta no nível atual.
- Fazer upload de um ou mais arquivos para a pasta atual ou raiz.
- Validar limite de 50 MB no frontend antes do upload.
- Pesquisar arquivos por nome.
- Exibir recentes.
- Exibir lixeira lógica.
- Baixar arquivos.
- Favoritar e desfavoritar arquivos e pastas.
- Excluir arquivo movendo para lixeira lógica.
- Excluir pasta, movendo arquivos da hierarquia para a lixeira.
- Exibir detalhes do arquivo.
- Calcular uso local exibido contra uma quota fixa de 5 GB no frontend.

### `Favorites.jsx`

Lista pastas e arquivos favoritos consumindo `GET /favorites`. Permite abrir pasta, baixar arquivo e remover itens dos favoritos.

### `Settings.jsx`

Tela de configurações da conta. Responsabilidades identificadas:

- Buscar dados do usuário em `GET /users/me`.
- Buscar KPIs em `GET /users/me/kpis`.
- Atualizar nome via `PUT /users/me/profile`.
- Atualizar e-mail via `PUT /users/me/email`, exigindo senha atual.
- Alterar senha via `PUT /users/me/password`.
- Atualizar `localStorage.user` após alterações de nome ou e-mail.

## Componentes reutilizáveis

| Componente | Responsabilidade |
|---|---|
| `AuthCard.jsx` | Card visual usado em telas de autenticação. |
| `AuthLayout.jsx` | Layout base para páginas de login/cadastro. |
| `InputField.jsx` | Campo de formulário reutilizável. |
| `LoadingButton.jsx` | Botão com estado visual de carregamento. |

## Gerenciamento de estado

Não foi identificado uso de Redux, Zustand, Context API global ou outra solução centralizada de estado. O estado é gerenciado localmente com hooks do React, principalmente `useState`, `useEffect`, `useMemo`, `useCallback` e `useRef`.

A sessão do usuário é persistida em `localStorage` por meio das chaves:

- `token`
- `user`

## Como executar o frontend

```bash
cd frontend
npm install
npm run dev
```

Por padrão, o Vite expõe a aplicação em `http://localhost:5173`.

Configuração opcional de ambiente:

```bash
# frontend/.env
VITE_API_URL=http://localhost:8080/api
```

## Pontos importantes para manutenção

- As rotas protegidas dependem apenas da presença de `token` no `localStorage`; a validade real é verificada pelo backend nas chamadas autenticadas.
- A base URL da API deve permanecer consistente com o prefixo `/api` do backend.
- `FilesPage.jsx` concentra muitas responsabilidades; novas funcionalidades do drive podem aumentar a complexidade desse componente.
- A quota de 5 GB exibida no frontend está fixa no código da tela e não foi identificada como regra persistida no backend.
- A busca identificada é por arquivos; busca por pastas não foi identificada no backend.
- Recuperação de arquivos da lixeira e exclusão física definitiva não foram identificadas no frontend.
