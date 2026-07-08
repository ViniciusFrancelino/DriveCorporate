Você é um agente de desenvolvimento atuando dentro da minha IDE.

Existe um arquivo chamado `spec.md` na raiz do projeto. Leia esse arquivo inteiro antes de criar ou alterar qualquer código.

Sua tarefa agora NÃO é recriar o projeto inteiro.

Sua tarefa é implementar apenas a área de Configurações do usuário atual no projeto Drive Corporativo.

A tela de Configurações deve permitir que o usuário autenticado:

1. Visualize seus dados básicos.
2. Altere seu nome.
3. Altere seu e-mail.
4. Altere sua senha.
5. Visualize KPIs básicos da própria conta:

   * quantidade de arquivos;
   * quantidade de pastas;
   * armazenamento utilizado.

Esses KPIs devem aparecer dentro da tela de Configurações. Não crie uma tela de dashboard.

====================================================================
REGRAS GERAIS
=============

Antes de alterar código:

1. Leia o `spec.md`.
2. Verifique a estrutura atual do projeto.
3. Não recrie o backend do zero se ele já existir.
4. Não recrie o frontend do zero se ele já existir.
5. Preserve funcionalidades já existentes.
6. Altere apenas o necessário para criar a tela de Configurações e seus endpoints de apoio.
7. Não implemente funcionalidades fora deste pedido.
8. Não crie dashboard.
9. Não crie endpoint `/api/dashboard`.
10. Não crie gráficos.
11. Não implemente painel administrativo.
12. Não implemente permissões avançadas.
13. Não implemente upload de foto de perfil.
14. Não implemente exclusão de conta.
15. Não implemente configurações globais do sistema.
16. Não implemente configurações de storage pela interface.
17. Não permita que o usuário altere o caminho dos arquivos.
18. Não implemente envio de e-mail.
19. Não implemente confirmação de e-mail.
20. Não implemente recuperação de senha por e-mail.

Use sempre a solução mais simples, funcional e compatível com o MVP.

====================================================================
ESCOPO DA IMPLEMENTAÇÃO
=======================

Implementar uma tela protegida no frontend:

```txt
/settings
```

Essa tela deve conter:

1. Título: `Configurações`.
2. Seção `Resumo da conta`.
3. Cards simples de KPI:

   * total de arquivos;
   * total de pastas;
   * armazenamento utilizado.
4. Seção `Dados do usuário`.
5. Exibição do nome atual.
6. Exibição do e-mail atual.
7. Formulário para alterar nome.
8. Formulário para alterar e-mail.
9. Formulário para alterar senha.
10. Mensagens simples de sucesso e erro.
11. Botão ou link para voltar à tela principal de arquivos.
12. Botão de logout, se já existir layout com logout.

A tela deve ser simples, usando Bootstrap.

Não usar:

* Redux;
* Zustand;
* Material UI;
* Tailwind;
* biblioteca de gráficos;
* dashboard;
* componentes complexos.

====================================================================
BACKEND — ENDPOINTS NECESSÁRIOS
===============================

Implemente ou ajuste os seguintes endpoints protegidos por JWT:

```txt
GET /api/users/me
PUT /api/users/me/profile
PUT /api/users/me/email
PUT /api/users/me/password
GET /api/users/me/kpis
```

Todos esses endpoints devem exigir autenticação.

O backend deve obter o usuário atual pelo JWT.

O frontend nunca deve enviar `userId` para identificar o usuário.

====================================================================
ENDPOINT 1 — CONSULTAR USUÁRIO ATUAL
====================================

Endpoint:

```txt
GET /api/users/me
```

Objetivo:

Retornar os dados básicos do usuário autenticado.

Response esperado:

```json
{
  "id": 1,
  "name": "Usuário Teste",
  "email": "usuario@email.com",
  "createdAt": "2026-06-22T10:00:00",
  "updatedAt": "2026-06-22T10:00:00"
}
```

Regras:

1. Não retornar senha.
2. Não retornar hash da senha.
3. Não retornar dados de outro usuário.
4. O usuário deve ser identificado pelo JWT.

====================================================================
ENDPOINT 2 — ALTERAR NOME
=========================

Endpoint:

```txt
PUT /api/users/me/profile
```

Objetivo:

Alterar apenas o nome do usuário autenticado.

Request esperado:

```json
{
  "name": "Novo Nome"
}
```

Response esperado:

```json
{
  "id": 1,
  "name": "Novo Nome",
  "email": "usuario@email.com",
  "createdAt": "2026-06-22T10:00:00",
  "updatedAt": "2026-06-22T10:10:00"
}
```

Regras:

1. O campo `name` é obrigatório.
2. O campo `name` não pode ser vazio.
3. Não alterar e-mail neste endpoint.
4. Não alterar senha neste endpoint.
5. Não retornar senha.
6. Não retornar hash da senha.

====================================================================
ENDPOINT 3 — ALTERAR E-MAIL
===========================

Endpoint:

```txt
PUT /api/users/me/email
```

Objetivo:

Alterar o e-mail do usuário autenticado.

Request esperado:

```json
{
  "email": "novoemail@email.com",
  "currentPassword": "senhaAtual"
}
```

Response esperado:

```json
{
  "id": 1,
  "name": "Usuário Teste",
  "email": "novoemail@email.com",
  "createdAt": "2026-06-22T10:00:00",
  "updatedAt": "2026-06-22T10:15:00"
}
```

Regras:

1. O campo `email` é obrigatório.
2. O e-mail deve ter formato válido.
3. O novo e-mail deve ser único no banco.
4. Não permitir usar e-mail já cadastrado por outro usuário.
5. Exigir `currentPassword` para alterar o e-mail.
6. Validar se `currentPassword` está correta.
7. Se a senha atual estiver incorreta, retornar erro.
8. Não implementar confirmação por e-mail nesta versão.
9. Não enviar e-mail.
10. Não retornar senha.
11. Não retornar hash da senha.

Motivo da senha atual:

Alteração de e-mail é uma operação sensível. Mesmo no MVP, deve exigir senha atual.

====================================================================
ENDPOINT 4 — ALTERAR SENHA
==========================

Endpoint:

```txt
PUT /api/users/me/password
```

Objetivo:

Alterar a senha do usuário autenticado.

Request esperado:

```json
{
  "currentPassword": "senhaAtual",
  "newPassword": "novaSenha123",
  "confirmPassword": "novaSenha123"
}
```

Response esperado:

```json
{
  "message": "Senha alterada com sucesso."
}
```

Regras:

1. `currentPassword` é obrigatório.
2. `newPassword` é obrigatório.
3. `confirmPassword` é obrigatório.
4. Validar se `currentPassword` está correta.
5. `newPassword` deve ter no mínimo 6 caracteres.
6. `newPassword` e `confirmPassword` devem ser iguais.
7. A nova senha deve ser salva com BCrypt.
8. Nunca salvar senha em texto puro.
9. Não retornar senha.
10. Não retornar hash da senha.

====================================================================
ENDPOINT 5 — KPIS DO USUÁRIO ATUAL
==================================

Endpoint:

```txt
GET /api/users/me/kpis
```

Objetivo:

Retornar os KPIs básicos do usuário autenticado para exibição na tela de Configurações.

Response esperado:

```json
{
  "totalFiles": 12,
  "totalFolders": 4,
  "storageUsedBytes": 73400320,
  "storageUsedFormatted": "70 MB"
}
```

Regras:

1. Contar apenas arquivos do usuário autenticado.
2. Não contar arquivos de outros usuários.
3. Não contar arquivos excluídos logicamente, se o projeto usa `deleted = true`.
4. Contar apenas pastas do usuário autenticado.
5. Somar o tamanho dos arquivos ativos do usuário.
6. O armazenamento utilizado deve ser calculado a partir do campo `size` dos arquivos.
7. Não calcular espaço lendo o filesystem diretamente.
8. Não retornar caminho físico dos arquivos.
9. Não retornar `storagePath`.
10. Não retornar `storedName`.

Regra para armazenamento utilizado:

```txt
storageUsedBytes = soma do campo size de todos os arquivos do usuário autenticado onde deleted = false
```

O campo `storageUsedFormatted` deve ser gerado no backend ou no frontend. Preferencialmente no backend para padronizar a exibição.

Exemplos de formatação:

```txt
0 B
850 KB
12.5 MB
1.2 GB
```

====================================================================
BACKEND — CLASSES RECOMENDADAS
==============================

Se ainda não existirem, crie ou ajuste:

Controller:

```txt
UserController.java
```

Service:

```txt
UserService.java
```

Repository:

```txt
UserRepository.java
FileRepository.java
FolderRepository.java
```

DTOs:

```txt
CurrentUserResponse.java
UpdateProfileRequest.java
UpdateEmailRequest.java
ChangePasswordRequest.java
UserKpiResponse.java
MessageResponse.java
```

Exception handling:

```txt
GlobalExceptionHandler.java
```

Caso o projeto já tenha DTOs equivalentes, reutilize-os em vez de criar duplicados.

====================================================================
BACKEND — CONSULTAS NECESSÁRIAS
===============================

No `FileRepository`, implemente métodos para:

1. Contar arquivos ativos do usuário.
2. Somar tamanho dos arquivos ativos do usuário.

Exemplo lógico:

```java
long countByUserAndDeletedFalse(User user);
```

```java
@Query("select coalesce(sum(f.size), 0) from FileEntity f where f.user = :user and f.deleted = false")
Long sumStorageUsedByUser(@Param("user") User user);
```

No `FolderRepository`, implemente método para:

```java
long countByUser(User user);
```

Adapte os nomes conforme as entidades reais do projeto.

====================================================================
BACKEND — VALIDAÇÕES OBRIGATÓRIAS
=================================

Nome:

1. Obrigatório.
2. Não pode ser vazio.
3. Recomenda-se mínimo de 2 caracteres.

E-mail:

1. Obrigatório.
2. Formato válido.
3. Único no banco.
4. Exige senha atual para alteração.
5. Não pode pertencer a outro usuário.

Senha:

1. Senha atual obrigatória.
2. Nova senha obrigatória.
3. Confirmação obrigatória.
4. Nova senha com mínimo de 6 caracteres.
5. Nova senha e confirmação devem ser iguais.
6. Nova senha deve ser criptografada com BCrypt.

KPIs:

1. Usar usuário autenticado pelo JWT.
2. Não aceitar `userId` como parâmetro.
3. Não retornar dados de outros usuários.
4. Não contar arquivos excluídos logicamente.
5. Não acessar filesystem diretamente para calcular armazenamento.

====================================================================
FRONTEND — ROTA
===============

Crie ou ajuste a rota protegida:

```txt
/settings
```

Ela deve ser acessível apenas para usuário autenticado.

Se não houver token JWT, redirecionar para:

```txt
/login
```

Após login, o usuário pode acessar a tela de configurações pelo menu ou navbar.

====================================================================
FRONTEND — TELA DE CONFIGURAÇÕES
================================

Crie ou ajuste o arquivo:

```txt
frontend/src/pages/Settings.jsx
```

A tela deve conter as seguintes áreas:

1. Resumo da conta.
2. Dados do usuário.
3. Alterar nome.
4. Alterar e-mail.
5. Alterar senha.

Use Bootstrap para layout.

Sugestão visual simples:

```txt
Configurações

[Card] Arquivos
[Card] Pastas
[Card] Armazenamento utilizado

Dados do usuário
Nome: ...
E-mail: ...

Alterar nome
[ input nome ]
[ botão salvar nome ]

Alterar e-mail
[ input novo e-mail ]
[ input senha atual ]
[ botão salvar e-mail ]

Alterar senha
[ input senha atual ]
[ input nova senha ]
[ input confirmar nova senha ]
[ botão alterar senha ]
```

Os cards de KPI devem ser simples e pequenos. Não criar gráficos.

====================================================================
FRONTEND — SERVICES
===================

Crie ou ajuste:

```txt
frontend/src/services/userService.js
```

Com funções:

```javascript
getCurrentUser()
updateProfile(data)
updateEmail(data)
changePassword(data)
getUserKpis()
```

Essas funções devem usar Axios e enviar o JWT no header, seguindo o padrão já existente no projeto.

Se já existir `axiosConfig.js`, reutilize.

Não crie uma nova configuração paralela de Axios se já existir uma.

====================================================================
FRONTEND — ESTADOS DA TELA
==========================

A tela deve tratar:

1. Carregamento inicial.
2. Erro ao carregar dados.
3. Erro ao carregar KPIs.
4. Sucesso ao alterar nome.
5. Sucesso ao alterar e-mail.
6. Sucesso ao alterar senha.
7. Erro de senha atual incorreta.
8. Erro de e-mail já cadastrado.
9. Erro de validação de campos.

Mensagens simples são suficientes.

Exemplos:

```txt
Dados atualizados com sucesso.
E-mail atualizado com sucesso.
Senha alterada com sucesso.
Senha atual incorreta.
Este e-mail já está em uso.
Não foi possível carregar os dados da conta.
```

====================================================================
FRONTEND — REGRAS DE UX
=======================

1. Após alterar nome, atualizar os dados exibidos na tela.
2. Após alterar e-mail, atualizar os dados exibidos na tela.
3. Após alterar senha, limpar os campos de senha.
4. Não limpar os dados da conta se apenas os KPIs falharem.
5. Não deslogar automaticamente após alterar nome.
6. Não deslogar automaticamente após alterar senha.
7. Após alterar e-mail, manter o usuário logado, salvo se a autenticação atual do projeto exigir outro comportamento.
8. Não exibir senha em nenhum momento.
9. Usar campos do tipo `password` para senhas.
10. Exibir armazenamento formatado de forma amigável.

====================================================================
O QUE NÃO FAZER
===============

Não implemente:

1. Dashboard.
2. Página `/dashboard`.
3. Endpoint `/api/dashboard`.
4. Gráficos.
5. Relatórios.
6. Exportação de dados.
7. Exclusão de conta.
8. Upload de avatar.
9. Configurações globais do sistema.
10. Configurações de storage.
11. Configurações administrativas.
12. Alteração de roles/perfis.
13. Gerenciamento de outros usuários.
14. Recuperação de senha.
15. Envio de e-mail.
16. Confirmação de e-mail.
17. OAuth2.
18. Integração externa.
19. Dark mode obrigatório.
20. Página separada só para KPIs.

Os KPIs devem ficar somente dentro da tela `/settings`.

====================================================================
CRITÉRIOS DE ACEITE
===================

A implementação será considerada concluída quando:

1. O backend compilar sem erros.
2. O frontend iniciar sem erros.
3. A rota `/settings` existir.
4. A rota `/settings` for protegida por autenticação.
5. Usuário sem token for redirecionado para `/login`.
6. Usuário autenticado conseguir acessar `/settings`.
7. A tela exibir nome e e-mail do usuário atual.
8. A tela exibir quantidade de arquivos do usuário atual.
9. A tela exibir quantidade de pastas do usuário atual.
10. A tela exibir armazenamento utilizado pelo usuário atual.
11. A contagem de arquivos ignorar arquivos excluídos logicamente.
12. O armazenamento utilizado ignorar arquivos excluídos logicamente.
13. O usuário conseguir alterar o nome.
14. O usuário conseguir alterar o e-mail informando senha atual.
15. O sistema impedir e-mail duplicado.
16. O sistema impedir alteração de e-mail com senha atual incorreta.
17. O usuário conseguir alterar a senha informando senha atual.
18. O sistema impedir alteração de senha com senha atual incorreta.
19. O sistema impedir alteração de senha quando confirmação for diferente.
20. O sistema salvar a nova senha com BCrypt.
21. Nenhuma resposta da API retornar senha ou hash.
22. Nenhum endpoint aceitar `userId` vindo do frontend.
23. Nenhum dado de outro usuário ser retornado.
24. Nenhum dashboard ser criado.

====================================================================
ORDEM DE EXECUÇÃO
=================

Execute nesta ordem:

1. Leia `spec.md`.
2. Analise a estrutura atual do backend.
3. Identifique como o usuário autenticado é obtido pelo JWT.
4. Crie ou ajuste `UserController`.
5. Crie ou ajuste `UserService`.
6. Crie ou ajuste DTOs necessários.
7. Adicione consultas de KPI em `FileRepository` e `FolderRepository`.
8. Implemente endpoints de usuário atual.
9. Compile o backend.
10. Corrija erros de compilação.
11. Analise a estrutura atual do frontend.
12. Crie ou ajuste `userService.js`.
13. Crie ou ajuste `Settings.jsx`.
14. Adicione rota protegida `/settings`.
15. Adicione link para Configurações na navegação existente.
16. Teste a tela no frontend.
17. Atualize o README, se necessário.
18. Entregue resumo final.

====================================================================
RESUMO FINAL ESPERADO
=====================

Ao terminar, informe:

1. Arquivos criados.
2. Arquivos alterados.
3. Endpoints adicionados.
4. Componentes/telas criados.
5. Como testar a tela de configurações.
6. Resultado da compilação do backend.
7. Resultado da execução ou build do frontend.
8. Pendências, caso existam.

Não implemente nada além da tela de Configurações, seus endpoints de usuário e seus KPIs.

Execute agora.