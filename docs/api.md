# API

## Visão geral

A API do backend usa o prefixo `/api` e, em ambiente local, a base URL esperada é:

```text
http://localhost:8080/api
```

A autenticação usa JWT no cabeçalho:

```http
Authorization: Bearer <token>
```

Endpoints sob `/auth/**` são públicos. Os demais endpoints exigem autenticação.

## Formato de erro

O `GlobalExceptionHandler` retorna erros no formato:

```json
{
  "timestamp": "2026-01-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Descrição do erro",
  "path": "/api/exemplo"
}
```

Códigos identificados no tratamento global:

- `400 Bad Request` para validação, corpo inválido e regras de negócio.
- `401 Unauthorized` para falhas de autenticação.
- `403 Forbidden` para acesso negado.
- `404 Not Found` para recurso inexistente ou arquivo logicamente excluído.
- `413 Payload Too Large` para upload acima de 50 MB.
- `500 Internal Server Error` para erro inesperado.

## Autenticação

### `POST /auth/register`

Cadastra um usuário.

Request:

```json
{
  "name": "Vinicius Silva",
  "email": "vinicius@example.com",
  "password": "123456"
}
```

Validações identificadas:

- `name`: obrigatório, máximo 120 caracteres.
- `email`: obrigatório, formato de e-mail, máximo 190 caracteres.
- `password`: obrigatório, entre 6 e 100 caracteres.

Response `201 Created`:

```json
{
  "id": 1,
  "name": "Vinicius Silva",
  "email": "vinicius@example.com"
}
```

Erros relevantes:

- `400`: e-mail já cadastrado ou dados inválidos.

### `POST /auth/login`

Autentica usuário e retorna token JWT.

Request:

```json
{
  "email": "vinicius@example.com",
  "password": "123456"
}
```

Response `200 OK`:

```json
{
  "token": "jwt-token",
  "user": {
    "id": 1,
    "name": "Vinicius Silva",
    "email": "vinicius@example.com"
  }
}
```

Erros relevantes:

- `401`: e-mail ou senha inválidos.

## Arquivos

### `POST /files/upload`

Faz upload de arquivo.

Autenticação: obrigatória.

Content-Type:

```text
multipart/form-data
```

Campos:

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `file` | arquivo | Sim | Arquivo enviado. |
| `folderId` | Long | Não | ID da pasta destino. Se ausente, o arquivo fica na raiz. |

Exemplo com `curl`:

```bash
curl -X POST 'http://localhost:8080/api/files/upload' \
  -H 'Authorization: Bearer <token>' \
  -F 'file=@documento.pdf' \
  -F 'folderId=1'
```

Response `201 Created`:

```json
{
  "id": 10,
  "originalName": "documento.pdf",
  "extension": "pdf",
  "contentType": "application/pdf",
  "size": 12345,
  "folderId": 1,
  "folderName": "Contratos",
  "favorite": false,
  "createdAt": "2026-01-01T10:00:00",
  "updatedAt": "2026-01-01T10:00:00"
}
```

Validações identificadas:

- Tamanho máximo de 50 MB.
- Extensões permitidas: `pdf`, `docx`, `xlsx`, `png`, `jpg`, `jpeg`, `txt`, `zip`.
- `Content-Type` compatível com extensão.
- Nome de arquivo sem path traversal.

### `GET /files`

Lista arquivos ativos do usuário autenticado, ordenados por criação descendente.

Response `200 OK`:

```json
[
  {
    "id": 10,
    "originalName": "documento.pdf",
    "extension": "pdf",
    "contentType": "application/pdf",
    "size": 12345,
    "folderId": 1,
    "folderName": "Contratos",
    "favorite": false,
    "createdAt": "2026-01-01T10:00:00",
    "updatedAt": "2026-01-01T10:00:00"
  }
]
```

### `GET /files/search?name={nome}`

Pesquisa arquivos ativos do usuário por `originalName`, sem diferenciar maiúsculas/minúsculas.

Query params:

| Nome | Obrigatório | Descrição |
|---|---:|---|
| `name` | Sim | Trecho do nome do arquivo. Se vazio, o service retorna a listagem padrão. |

### `GET /files/trash`

Lista arquivos do usuário marcados com `deleted = true`, ordenados por atualização descendente.

### `GET /files/{id}`

Retorna metadados de um arquivo ativo do usuário autenticado.

Path params:

| Nome | Tipo | Descrição |
|---|---|---|
| `id` | Long | ID do arquivo. |

### `GET /files/{id}/download`

Baixa o arquivo físico.

Response:

- Corpo binário do arquivo.
- Header `Content-Disposition: attachment; filename="<nome-original>"`.
- `Content-Type` baseado no metadado salvo.

### `DELETE /files/{id}`

Move arquivo para a lixeira lógica.

Response `200 OK`:

```json
{
  "message": "Arquivo enviado para a lixeira."
}
```

Observação: não foi identificado fluxo de exclusão física do arquivo.

### `PATCH /files/{id}/favorite`

Marca arquivo como favorito.

### `PATCH /files/{id}/unfavorite`

Remove arquivo dos favoritos.

## Pastas

### `POST /folders`

Cria uma pasta.

Request:

```json
{
  "name": "Contratos",
  "parentFolderId": null
}
```

Validações identificadas:

- `name`: obrigatório, máximo 150 caracteres.
- Não pode existir pasta com mesmo nome no mesmo nível para o mesmo usuário.
- `parentFolderId`, quando informado, precisa pertencer ao usuário autenticado.

Response `201 Created`:

```json
{
  "id": 1,
  "name": "Contratos",
  "parentFolderId": null,
  "favorite": false,
  "createdAt": "2026-01-01T10:00:00",
  "updatedAt": "2026-01-01T10:00:00"
}
```

### `GET /folders`

Lista todas as pastas do usuário autenticado, ordenadas por criação descendente.

### `GET /folders/{id}`

Retorna uma pasta do usuário autenticado.

### `GET /folders/{id}/contents`

Retorna a pasta, suas subpastas diretas e seus arquivos ativos diretos.

Response `200 OK`:

```json
{
  "folder": {
    "id": 1,
    "name": "Contratos",
    "parentFolderId": null,
    "favorite": false,
    "createdAt": "2026-01-01T10:00:00",
    "updatedAt": "2026-01-01T10:00:00"
  },
  "subFolders": [],
  "files": []
}
```

### `DELETE /folders/{id}`

Exclui a pasta e subpastas. Arquivos da hierarquia são enviados para a lixeira lógica e desvinculados da pasta.

Response `200 OK`:

```json
{
  "message": "Pasta excluída e arquivos enviados para a lixeira."
}
```

### `PATCH /folders/{id}/favorite`

Marca pasta como favorita.

### `PATCH /folders/{id}/unfavorite`

Remove pasta dos favoritos.

## Favoritos

### `GET /favorites`

Lista pastas e arquivos favoritos do usuário autenticado.

Response `200 OK`:

```json
{
  "folders": [],
  "files": []
}
```

## Usuário atual

### `GET /users/me`

Retorna dados do usuário autenticado.

Response `200 OK`:

```json
{
  "id": 1,
  "name": "Vinicius Silva",
  "email": "vinicius@example.com",
  "createdAt": "2026-01-01T10:00:00",
  "updatedAt": "2026-01-01T10:00:00"
}
```

### `PUT /users/me/profile`

Atualiza nome do usuário.

Request:

```json
{
  "name": "Novo Nome"
}
```

Validações:

- `name`: obrigatório, entre 2 e 120 caracteres.

### `PUT /users/me/email`

Atualiza e-mail do usuário. Exige senha atual.

Request:

```json
{
  "email": "novo.email@example.com",
  "currentPassword": "123456"
}
```

Validações:

- `email`: obrigatório e válido.
- `currentPassword`: obrigatória.
- Senha atual deve corresponder à senha cadastrada.
- E-mail não pode estar em uso por outro usuário.

### `PUT /users/me/password`

Altera senha do usuário.

Request:

```json
{
  "currentPassword": "123456",
  "newPassword": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

Validações:

- `currentPassword`: obrigatória e deve corresponder à senha atual.
- `newPassword`: obrigatória, mínimo 6 caracteres.
- `confirmPassword`: obrigatória e deve ser igual a `newPassword`.

Response `200 OK`:

```json
{
  "message": "Senha alterada com sucesso."
}
```

### `GET /users/me/kpis`

Retorna indicadores do usuário autenticado.

Response `200 OK`:

```json
{
  "totalFiles": 3,
  "totalFolders": 2,
  "storageUsedBytes": 2048,
  "storageUsedFormatted": "2 KB"
}
```

## Funcionalidades de API não identificadas

- Refresh token.
- Logout server-side ou invalidação de token.
- Recuperação de senha.
- Exclusão de conta.
- Restauração de arquivo da lixeira.
- Exclusão física definitiva de arquivo.
- Busca de pastas.
- Compartilhamento de arquivos entre usuários.
- Perfis de autorização além do isolamento por usuário proprietário.
