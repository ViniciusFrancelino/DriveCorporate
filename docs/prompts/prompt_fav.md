Você é um agente de desenvolvimento atuando dentro da minha IDE.

Existe um arquivo chamado `spec.md` na raiz do projeto. Leia esse arquivo inteiro antes de criar ou alterar qualquer código.

Sua tarefa agora NÃO é recriar o projeto inteiro.

Sua tarefa é implementar exclusivamente a funcionalidade de Favoritos no projeto Drive Corporativo.

A funcionalidade deve permitir que o usuário autenticado favorite e desfavorite arquivos e pastas, visualize todos os seus favoritos em uma tela própria e use um menu de três pontos para acessar as ações de arquivos e pastas.

====================================================================
OBJETIVO DA IMPLEMENTAÇÃO
=========================

Implementar a funcionalidade de Favoritos com os seguintes comportamentos:

1. Usuário pode favoritar arquivos.
2. Usuário pode desfavoritar arquivos.
3. Usuário pode favoritar pastas.
4. Usuário pode desfavoritar pastas.
5. Usuário pode acessar uma tela `/favorites`.
6. A tela `/favorites` deve listar todos os arquivos e pastas favoritados pelo usuário autenticado.
7. Arquivos excluídos logicamente não devem aparecer nos favoritos.
8. Pastas de outro usuário nunca devem aparecer nos favoritos.
9. Arquivos de outro usuário nunca devem aparecer nos favoritos.
10. Nas listagens de arquivos e pastas, as ações devem ficar dentro de um botão de três pontos.
11. O botão de três pontos deve abrir um menu com as opções disponíveis.
12. A opção `Favoritar` ou `Desfavoritar` deve aparecer dentro desse menu.

====================================================================
REGRAS GERAIS
=============

Antes de alterar qualquer coisa:

1. Leia o arquivo `spec.md`.
2. Analise a estrutura atual do backend.
3. Analise a estrutura atual do frontend.
4. Verifique como autenticação JWT está implementada.
5. Verifique como arquivos e pastas estão listados atualmente.
6. Verifique quais ações já existem para arquivos e pastas.
7. Preserve tudo que já funciona.
8. Não recrie o projeto do zero.
9. Não altere funcionalidades não relacionadas a favoritos.
10. Não implemente dashboard.
11. Não crie endpoint `/api/dashboard`.
12. Não crie gráficos.
13. Não implemente compartilhamento.
14. Não implemente permissões avançadas.
15. Não implemente lixeira visual.
16. Não implemente preview de arquivos.
17. Não implemente upload em lote.
18. Não implemente drag and drop avançado.
19. Não implemente tags.
20. Não implemente comentários.
21. Não implemente painel administrativo.

Use sempre a solução mais simples e compatível com o MVP.

====================================================================
ESCOPO BACKEND
==============

A funcionalidade de favoritos deve ser implementada no backend para arquivos e pastas.

Para manter o MVP simples, use campo booleano nas entidades existentes.

Na entidade de arquivos, adicione ou reutilize:

```java
private boolean favorite = false;
```

Na entidade de pastas, adicione ou reutilize:

```java
private boolean favorite = false;
```

Não crie tabela separada de favoritos nesta versão, a menos que a estrutura atual do projeto torne isso inevitável.

Não crie relacionamento complexo para favoritos.

Não crie compartilhamento de favoritos entre usuários.

Favorito pertence apenas ao usuário dono do arquivo ou da pasta.

====================================================================
BACKEND — ENDPOINTS OBRIGATÓRIOS
================================

Implemente ou ajuste os seguintes endpoints protegidos por JWT.

Arquivos:

```txt
PATCH /api/files/{id}/favorite
PATCH /api/files/{id}/unfavorite
```

Pastas:

```txt
PATCH /api/folders/{id}/favorite
PATCH /api/folders/{id}/unfavorite
```

Favoritos consolidados:

```txt
GET /api/favorites
```

O endpoint `/api/favorites` deve retornar todos os favoritos do usuário autenticado, separados por tipo.

Response esperado:

```json
{
  "folders": [
    {
      "id": 1,
      "name": "Contratos",
      "parentFolderId": null,
      "favorite": true,
      "createdAt": "2026-06-22T10:00:00",
      "updatedAt": "2026-06-22T10:10:00"
    }
  ],
  "files": [
    {
      "id": 10,
      "originalName": "contrato.pdf",
      "extension": "pdf",
      "contentType": "application/pdf",
      "size": 102400,
      "folderId": 1,
      "favorite": true,
      "createdAt": "2026-06-22T10:00:00",
      "updatedAt": "2026-06-22T10:10:00"
    }
  ]
}
```

Não retornar:

```txt
storagePath
storedName
password
passwordHash
dados de outro usuário
```

====================================================================
REGRAS BACKEND — FAVORITAR ARQUIVO
==================================

Endpoint:

```txt
PATCH /api/files/{id}/favorite
```

Regras:

1. Exigir autenticação JWT.
2. Obter o usuário autenticado pelo token.
3. Buscar o arquivo pelo ID.
4. Validar se o arquivo pertence ao usuário autenticado.
5. Validar se o arquivo não está excluído logicamente.
6. Marcar `favorite = true`.
7. Salvar alteração no banco.
8. Retornar os dados atualizados do arquivo.
9. Não retornar `storagePath`.
10. Não retornar `storedName`.

Caso o arquivo não exista, retornar 404.

Caso o arquivo pertença a outro usuário, retornar 403 ou 404.

Caso o arquivo esteja excluído logicamente, retornar 404 ou erro de negócio.

====================================================================
REGRAS BACKEND — DESFAVORITAR ARQUIVO
=====================================

Endpoint:

```txt
PATCH /api/files/{id}/unfavorite
```

Regras:

1. Exigir autenticação JWT.
2. Obter o usuário autenticado pelo token.
3. Buscar o arquivo pelo ID.
4. Validar se o arquivo pertence ao usuário autenticado.
5. Validar se o arquivo não está excluído logicamente.
6. Marcar `favorite = false`.
7. Salvar alteração no banco.
8. Retornar os dados atualizados do arquivo.
9. Não excluir o arquivo.
10. Não alterar `deleted`.

====================================================================
REGRAS BACKEND — FAVORITAR PASTA
================================

Endpoint:

```txt
PATCH /api/folders/{id}/favorite
```

Regras:

1. Exigir autenticação JWT.
2. Obter o usuário autenticado pelo token.
3. Buscar a pasta pelo ID.
4. Validar se a pasta pertence ao usuário autenticado.
5. Marcar `favorite = true`.
6. Salvar alteração no banco.
7. Retornar os dados atualizados da pasta.

Caso a pasta não exista, retornar 404.

Caso a pasta pertença a outro usuário, retornar 403 ou 404.

====================================================================
REGRAS BACKEND — DESFAVORITAR PASTA
===================================

Endpoint:

```txt
PATCH /api/folders/{id}/unfavorite
```

Regras:

1. Exigir autenticação JWT.
2. Obter o usuário autenticado pelo token.
3. Buscar a pasta pelo ID.
4. Validar se a pasta pertence ao usuário autenticado.
5. Marcar `favorite = false`.
6. Salvar alteração no banco.
7. Retornar os dados atualizados da pasta.
8. Não excluir a pasta.

====================================================================
REGRAS BACKEND — LISTAR FAVORITOS
=================================

Endpoint:

```txt
GET /api/favorites
```

Regras:

1. Exigir autenticação JWT.
2. Obter o usuário autenticado pelo token.
3. Buscar apenas arquivos do usuário autenticado com `favorite = true` e `deleted = false`.
4. Buscar apenas pastas do usuário autenticado com `favorite = true`.
5. Não retornar arquivos excluídos logicamente.
6. Não retornar dados de outro usuário.
7. Não retornar caminhos físicos.
8. Separar o retorno em `folders` e `files`.

====================================================================
BACKEND — CLASSES RECOMENDADAS
==============================

Crie ou ajuste as classes conforme a estrutura existente do projeto.

Controllers:

```txt
FileController.java
FolderController.java
FavoriteController.java
```

Services:

```txt
FileService.java
FolderService.java
FavoriteService.java
```

Repositories:

```txt
FileRepository.java
FolderRepository.java
```

DTOs:

```txt
FileResponse.java
FolderResponse.java
FavoritesResponse.java
```

Caso já existam DTOs equivalentes, reutilize e apenas adicione o campo `favorite`.

Não crie DTO duplicado se já existir um equivalente.

====================================================================
BACKEND — REPOSITORIES
======================

No `FileRepository`, adicione método para buscar arquivos favoritos ativos do usuário.

Exemplo lógico:

```java
List<FileEntity> findByUserAndFavoriteTrueAndDeletedFalse(User user);
```

No `FolderRepository`, adicione método para buscar pastas favoritas do usuário.

Exemplo lógico:

```java
List<Folder> findByUserAndFavoriteTrue(User user);
```

Adapte os nomes conforme as entidades reais do projeto.

====================================================================
BACKEND — DTOs
==============

Atualize `FileResponse` para incluir:

```json
{
  "favorite": true
}
```

Atualize `FolderResponse` para incluir:

```json
{
  "favorite": true
}
```

Crie `FavoritesResponse`, caso não exista:

```java
public class FavoritesResponse {
    private List<FolderResponse> folders;
    private List<FileResponse> files;
}
```

====================================================================
FRONTEND — OBJETIVO
===================

No frontend, implemente:

1. Tela `/favorites`.
2. Link de navegação para Favoritos.
3. Ações de favoritar/desfavoritar arquivos.
4. Ações de favoritar/desfavoritar pastas.
5. Menu de três pontos nas listagens de arquivos.
6. Menu de três pontos nas listagens de pastas.
7. Remoção dos ícones/botões soltos de ações, substituindo por menu.

====================================================================
FRONTEND — ROTA
===============

Crie ou ajuste a rota protegida:

```txt
/favorites
```

Regras:

1. Usuário sem token deve ser redirecionado para `/login`.
2. Usuário autenticado pode acessar `/favorites`.
3. A tela deve usar o mesmo layout privado já existente.
4. Deve existir link para voltar à tela principal de arquivos.
5. Deve existir link na navegação para `Favoritos`.

====================================================================
FRONTEND — TELA DE FAVORITOS
============================

Crie ou ajuste:

```txt
frontend/src/pages/Favorites.jsx
```

A tela deve conter:

1. Título: `Favoritos`.
2. Seção `Pastas favoritas`.
3. Seção `Arquivos favoritos`.
4. Lista de pastas favoritedas.
5. Lista de arquivos favoritados.
6. Estado vazio quando não houver favoritos.
7. Botão para abrir pasta favorita.
8. Botão para baixar arquivo favorito.
9. Botão para remover pasta dos favoritos.
10. Botão para remover arquivo dos favoritos.
11. Menu de três pontos para ações, mantendo padrão visual da tela principal.

Texto de estado vazio:

```txt
Nenhum arquivo ou pasta favoritado ainda.
```

Não criar:

```txt
dashboard
gráficos
cards estatísticos
preview
compartilhamento
tags
comentários
permissões
```

====================================================================
FRONTEND — MENU DE TRÊS PONTOS
==============================

Nas listagens de arquivos e pastas, substitua os botões/ícones de ação por um botão de três pontos.

O botão deve exibir:

```txt
⋮
```

Ou, se preferir:

```txt
...
```

Use o componente dropdown do Bootstrap ou uma implementação simples equivalente.

Não instale biblioteca nova de ícones apenas para isso.

Não use biblioteca complexa de UI.

====================================================================
FRONTEND — MENU DE ARQUIVO
==========================

Para cada arquivo listado, o menu de três pontos deve conter, conforme as funcionalidades já existentes:

```txt
Baixar
Detalhes
Excluir
Favoritar
```

Quando o arquivo já estiver favoritado, trocar `Favoritar` por:

```txt
Desfavoritar
```

Regras:

1. Clicar em `Baixar` deve baixar o arquivo.
2. Clicar em `Detalhes` deve abrir detalhes se essa funcionalidade já existir.
3. Clicar em `Excluir` deve manter a exclusão lógica já existente.
4. Clicar em `Favoritar` deve chamar `PATCH /api/files/{id}/favorite`.
5. Clicar em `Desfavoritar` deve chamar `PATCH /api/files/{id}/unfavorite`.
6. Após favoritar/desfavoritar, atualizar a lista na tela.
7. Não excluir arquivo ao desfavoritar.
8. Não esconder arquivo da tela principal ao desfavoritar.

====================================================================
FRONTEND — MENU DE PASTA
========================

Para cada pasta listada, o menu de três pontos deve conter, conforme as funcionalidades já existentes:

```txt
Abrir
Favoritar
```

Quando a pasta já estiver favoritada, trocar `Favoritar` por:

```txt
Desfavoritar
```

Se o projeto já tiver ações de pasta como renomear ou excluir, manter essas ações dentro do mesmo menu.

Exemplo com ações já existentes:

```txt
Abrir
Renomear
Excluir
Favoritar
```

Ou, quando já favoritada:

```txt
Abrir
Renomear
Excluir
Desfavoritar
```

Regras:

1. Clicar em `Abrir` deve manter a navegação de pasta já existente.
2. Clicar em `Favoritar` deve chamar `PATCH /api/folders/{id}/favorite`.
3. Clicar em `Desfavoritar` deve chamar `PATCH /api/folders/{id}/unfavorite`.
4. Após favoritar/desfavoritar, atualizar a lista na tela.
5. Não excluir pasta ao desfavoritar.
6. Não alterar arquivos dentro da pasta ao favoritar/desfavoritar a pasta.

====================================================================
FRONTEND — SERVICES
===================

Crie ou ajuste os serviços:

```txt
frontend/src/services/fileService.js
frontend/src/services/folderService.js
frontend/src/services/favoriteService.js
```

Funções necessárias para arquivos:

```javascript
favoriteFile(fileId)
unfavoriteFile(fileId)
```

Funções necessárias para pastas:

```javascript
favoriteFolder(folderId)
unfavoriteFolder(folderId)
```

Função para buscar favoritos:

```javascript
getFavorites()
```

Se já existir um padrão de serviços no projeto, siga o padrão existente.

Se já existir `axiosConfig.js`, reutilize.

Não crie uma configuração paralela de Axios.

====================================================================
FRONTEND — COMPONENTES
======================

Se existirem componentes de lista, ajuste-os:

```txt
FileList.jsx
FolderList.jsx
```

Caso não existam, ajuste diretamente a tela onde arquivos e pastas são renderizados.

Crie componentes auxiliares apenas se isso simplificar o código.

Componentes opcionais:

```txt
ActionMenu.jsx
FavoriteButton.jsx
```

Não criar arquitetura excessivamente componentizada.

Não criar abstrações complexas.

====================================================================
FRONTEND — ESTADOS E ATUALIZAÇÃO
================================

A tela deve tratar:

1. Carregamento inicial.
2. Erro ao buscar favoritos.
3. Lista vazia.
4. Sucesso ao favoritar.
5. Sucesso ao desfavoritar.
6. Erro ao favoritar.
7. Erro ao desfavoritar.

Após favoritar ou desfavoritar:

1. Atualizar a lista atual.
2. Não recarregar a página inteira.
3. Não perder o token.
4. Não redirecionar o usuário desnecessariamente.

Na tela `/favorites`, ao desfavoritar um item:

1. Remover o item da lista de favoritos exibida.
2. Não excluir o arquivo ou pasta.
3. Não afetar o arquivo ou pasta original.

====================================================================
FRONTEND — NAVEGAÇÃO
====================

Atualize a navegação privada para incluir:

```txt
Arquivos
Favoritos
Configurações
Sair
```

Se `Configurações` ainda não existir, não implemente agora, apenas não quebre a navegação existente.

Se já existir navbar, apenas adicione o link `Favoritos`.

Se não existir navbar, crie uma navbar simples com Bootstrap.

Não criar sidebar complexa obrigatória.

====================================================================
REGRAS DE SEGURANÇA
===================

1. Nenhum endpoint de favoritos deve funcionar sem JWT.
2. Backend deve obter o usuário autenticado pelo token.
3. Frontend não deve enviar `userId`.
4. Usuário não pode favoritar arquivo de outro usuário.
5. Usuário não pode desfavoritar arquivo de outro usuário.
6. Usuário não pode favoritar pasta de outro usuário.
7. Usuário não pode desfavoritar pasta de outro usuário.
8. Usuário não pode listar favoritos de outro usuário.
9. Arquivos excluídos logicamente não devem aparecer nos favoritos.
10. Arquivos excluídos logicamente não devem permitir favoritar.

====================================================================
TRATAMENTO DE ERROS
===================

Use o padrão de erro já existente no projeto.

Caso ainda não exista, use o formato:

```json
{
  "timestamp": "2026-06-22T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Mensagem do erro",
  "path": "/api/rota"
}
```

Mensagens esperadas:

```txt
Arquivo não encontrado.
Pasta não encontrada.
Acesso negado.
Arquivo excluído não pode ser favoritado.
Não foi possível carregar favoritos.
Não foi possível favoritar o item.
Não foi possível remover dos favoritos.
```

====================================================================
O QUE NÃO FAZER
===============

Não implemente:

1. Dashboard.
2. Endpoint `/api/dashboard`.
3. Gráficos.
4. Compartilhamento.
5. Permissões avançadas.
6. Tags.
7. Comentários.
8. Preview.
9. OCR.
10. IA para resumo.
11. Lixeira visual.
12. Exclusão física.
13. Upload em lote.
14. Drag and drop avançado.
15. Integração externa.
16. Favoritos compartilhados.
17. Favoritos por equipe.
18. Ordenação avançada de favoritos.
19. Filtros avançados de favoritos.
20. Busca exclusiva dentro de favoritos, a menos que já exista busca reutilizável e seja simples integrar.

====================================================================
CRITÉRIOS DE ACEITE
===================

A implementação será considerada concluída quando:

1. O backend compilar sem erros.
2. O frontend iniciar sem erros.
3. A entidade de arquivo possuir campo `favorite`.
4. A entidade de pasta possuir campo `favorite`.
5. Arquivos novos iniciarem com `favorite = false`.
6. Pastas novas iniciarem com `favorite = false`.
7. Usuário conseguir favoritar arquivo próprio.
8. Usuário conseguir desfavoritar arquivo próprio.
9. Usuário conseguir favoritar pasta própria.
10. Usuário conseguir desfavoritar pasta própria.
11. Usuário não conseguir favoritar arquivo de outro usuário.
12. Usuário não conseguir favoritar pasta de outro usuário.
13. Usuário não conseguir listar favoritos de outro usuário.
14. `GET /api/favorites` retornar arquivos e pastas favoritos do usuário autenticado.
15. Arquivos excluídos logicamente não aparecerem em `/api/favorites`.
16. A tela `/favorites` existir.
17. A tela `/favorites` ser protegida por autenticação.
18. A tela `/favorites` listar pastas favoritas.
19. A tela `/favorites` listar arquivos favoritos.
20. A tela `/favorites` exibir estado vazio quando não houver favoritos.
21. A tela principal permitir favoritar arquivo pelo menu de três pontos.
22. A tela principal permitir desfavoritar arquivo pelo menu de três pontos.
23. A tela principal permitir favoritar pasta pelo menu de três pontos.
24. A tela principal permitir desfavoritar pasta pelo menu de três pontos.
25. Os botões/ícones soltos de ações dos arquivos forem substituídos por menu de três pontos.
26. Os botões/ícones soltos de ações das pastas forem substituídos por menu de três pontos.
27. Desfavoritar item na tela `/favorites` remover o item da lista sem excluir o arquivo ou pasta.
28. Nenhum dashboard ser criado.
29. Nenhuma funcionalidade fora do escopo ser adicionada.

====================================================================
ORDEM DE EXECUÇÃO
=================

Execute nesta ordem:

1. Leia `spec.md`.
2. Analise a estrutura atual do backend.
3. Identifique as entidades de arquivo e pasta.
4. Adicione campo `favorite` em arquivos e pastas.
5. Atualize DTOs de arquivo e pasta.
6. Atualize repositories.
7. Implemente métodos de favoritar/desfavoritar arquivos.
8. Implemente métodos de favoritar/desfavoritar pastas.
9. Implemente endpoint consolidado `GET /api/favorites`.
10. Compile o backend.
11. Corrija erros de compilação.
12. Analise a estrutura atual do frontend.
13. Crie ou ajuste serviços de favoritos.
14. Crie tela `/favorites`.
15. Adicione rota protegida `/favorites`.
16. Adicione link `Favoritos` na navegação.
17. Substitua ações visuais soltas por menu de três pontos nos arquivos.
18. Substitua ações visuais soltas por menu de três pontos nas pastas.
19. Adicione opção `Favoritar`/`Desfavoritar` nos menus.
20. Teste fluxo de favoritos no frontend.
21. Atualize README, se necessário.
22. Entregue resumo final.

====================================================================
RESUMO FINAL ESPERADO
=====================

Ao terminar, informe:

1. Arquivos criados.
2. Arquivos alterados.
3. Endpoints adicionados.
4. Campos adicionados nas entidades.
5. Componentes ou páginas criadas.
6. Como testar favoritos de arquivos.
7. Como testar favoritos de pastas.
8. Como testar o menu de três pontos.
9. Resultado da compilação do backend.
10. Resultado da execução ou build do frontend.
11. Pendências, caso existam.

Execute agora apenas a implementação de Favoritos e menus de três pontos.
