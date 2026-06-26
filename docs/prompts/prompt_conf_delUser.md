Você é um agente de desenvolvimento atuando dentro da minha IDE.

Existe um arquivo chamado `spec.md` na raiz do projeto. Leia esse arquivo inteiro antes de criar ou alterar qualquer código.

Sua tarefa agora NÃO é recriar o projeto inteiro.

Sua tarefa é adicionar apenas a funcionalidade de deletar conta na tela de Configurações do usuário atual.

Essa funcionalidade deve permitir que o usuário autenticado exclua/desative a própria conta com confirmação de senha.

====================================================================
OBJETIVO DA IMPLEMENTAÇÃO
=========================

Adicionar na tela de Configurações um botão:

```txt
Deletar conta
```

Ao clicar nesse botão, o sistema deve:

1. Exibir uma confirmação clara.
2. Solicitar a senha atual do usuário.
3. Enviar a solicitação para o backend.
4. Validar a senha atual.
5. Desativar a conta do usuário autenticado.
6. Encerrar a sessão no frontend.
7. Remover o token JWT do navegador.
8. Redirecionar o usuário para a tela de login.

Essa implementação deve afetar apenas a conta do usuário autenticado.

O frontend nunca deve enviar `userId`.

O backend deve identificar o usuário pelo JWT.

====================================================================
REGRAS GERAIS
=============

Antes de alterar código:

1. Leia `spec.md`.
2. Analise a estrutura atual do backend.
3. Analise a estrutura atual do frontend.
4. Verifique como a tela de Configurações está implementada.
5. Verifique como o usuário autenticado é obtido pelo JWT.
6. Preserve todas as funcionalidades existentes.
7. Não recrie o projeto.
8. Não altere upload de arquivos.
9. Não altere listagem de arquivos.
10. Não altere favoritos.
11. Não altere pastas.
12. Não crie dashboard.
13. Não crie painel administrativo.
14. Não crie gerenciamento de múltiplos usuários.
15. Não implemente exclusão de conta de outros usuários.
16. Não implemente envio de e-mail.
17. Não implemente confirmação por e-mail.
18. Não implemente recuperação de conta.
19. Não implemente exclusão física de arquivos neste momento.

Use a solução mais simples, segura e compatível com o MVP.

====================================================================
DECISÃO TÉCNICA OBRIGATÓRIA
===========================

Para o MVP, a exclusão da conta deve ser tratada como desativação lógica da conta.

Não apague fisicamente o usuário do banco.

Não apague fisicamente os arquivos do disco.

Não remova registros diretamente do banco, a menos que a estrutura atual já tenha sido desenhada para isso.

A abordagem recomendada é adicionar na entidade `User` um campo:

```java
private boolean active = true;
```

Quando o usuário deletar a conta:

```txt
active = false
```

A partir disso:

1. O usuário não deve conseguir fazer login novamente.
2. O usuário não deve conseguir acessar endpoints protegidos após logout.
3. O token deve ser removido do frontend.
4. Os dados devem permanecer no banco para evitar inconsistências com arquivos, pastas e histórico.

Se a entidade `User` já possuir campo equivalente, como `enabled`, `deleted`, `active` ou `status`, reutilize o campo existente em vez de criar outro.

====================================================================
BACKEND — ENDPOINT OBRIGATÓRIO
==============================

Implemente ou ajuste o endpoint:

```txt
DELETE /api/users/me
```

Esse endpoint deve ser protegido por JWT.

Request esperado:

```json
{
  "currentPassword": "senhaAtual"
}
```

Response esperado:

```json
{
  "message": "Conta deletada com sucesso."
}
```

Regras obrigatórias:

1. Exigir autenticação JWT.
2. Obter o usuário autenticado pelo token.
3. Não aceitar `userId` no request.
4. Exigir `currentPassword`.
5. Validar se `currentPassword` está correta.
6. Se a senha estiver incorreta, retornar erro.
7. Marcar a conta como inativa.
8. Não retornar senha.
9. Não retornar hash da senha.
10. Não deletar conta de outro usuário.
11. Não deletar fisicamente arquivos do disco.
12. Não deletar fisicamente pastas do banco.
13. Não deletar fisicamente arquivos do banco.

====================================================================
BACKEND — AJUSTE NO LOGIN
=========================

Ajuste o fluxo de login para impedir login de usuário inativo.

Se a entidade `User` receber o campo:

```java
active
```

Então o login deve validar:

```txt
active = true
```

Se o usuário estiver inativo, retornar erro de autenticação.

Mensagem sugerida:

```txt
Conta desativada.
```

Não gerar JWT para usuário inativo.

====================================================================
BACKEND — DTOs RECOMENDADOS
===========================

Crie ou reutilize DTOs conforme a estrutura existente.

DTO para deletar conta:

```java
public class DeleteAccountRequest {
    private String currentPassword;
}
```

DTO de resposta simples:

```java
public class MessageResponse {
    private String message;
}
```

Se já existir `MessageResponse`, reutilize.

Não crie DTO duplicado.

====================================================================
BACKEND — SERVICE RECOMENDADO
=============================

No `UserService`, crie um método semelhante a:

```java
public MessageResponse deleteCurrentAccount(DeleteAccountRequest request)
```

Esse método deve:

1. Obter o usuário autenticado.
2. Validar senha atual com `PasswordEncoder`.
3. Marcar `active = false`.
4. Salvar o usuário.
5. Retornar mensagem de sucesso.

Se o projeto já tiver um padrão diferente para usuário autenticado, siga o padrão existente.

====================================================================
BACKEND — VALIDAÇÕES
====================

Validações obrigatórias:

1. `currentPassword` é obrigatória.
2. `currentPassword` não pode ser vazia.
3. A senha atual deve ser validada com BCrypt.
4. Usuário inativo não pode fazer login.
5. Endpoint privado não pode funcionar sem JWT.
6. Usuário autenticado só pode deletar a própria conta.

Mensagens sugeridas:

```txt
Senha atual é obrigatória.
Senha atual incorreta.
Conta deletada com sucesso.
Conta desativada.
Usuário não encontrado.
```

====================================================================
BACKEND — TRATAMENTO DE ERROS
=============================

Use o padrão de erro já existente no projeto.

Caso não exista, use:

```json
{
  "timestamp": "2026-06-22T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Mensagem do erro",
  "path": "/api/users/me"
}
```

Códigos esperados:

```txt
400 — senha ausente ou inválida
401 — usuário não autenticado
403 — senha atual incorreta ou acesso negado
404 — usuário não encontrado
500 — erro inesperado
```

====================================================================
FRONTEND — TELA DE CONFIGURAÇÕES
================================

Altere apenas a tela de Configurações.

Arquivo provável:

```txt
frontend/src/pages/Settings.jsx
```

Se o projeto usar outro arquivo para configurações, ajuste o arquivo correto.

Adicionar uma seção no final da tela:

```txt
Zona de perigo
```

Dentro dessa seção, adicionar:

```txt
Deletar conta
```

A seção deve ter aparência visual de alerta usando Bootstrap.

Exemplo visual esperado:

```txt
Zona de perigo

Ao deletar sua conta, seu acesso será desativado e você será desconectado.
Esta ação não pode ser desfeita pela interface.

[Deletar conta]
```

Use classes Bootstrap como:

```txt
alert alert-danger
btn btn-danger
border border-danger
```

Não instale biblioteca visual nova.

====================================================================
FRONTEND — CONFIRMAÇÃO
======================

Ao clicar em `Deletar conta`, exibir uma confirmação antes de enviar a requisição.

Pode ser um modal Bootstrap ou uma confirmação simples implementada no próprio componente.

Preferência:

1. Usar modal simples se o projeto já usa Bootstrap.
2. Se modal for complexo demais, usar uma área condicional simples na tela.

O fluxo deve pedir:

1. Senha atual.
2. Confirmação textual opcional.

Implementação mínima obrigatória:

```txt
Senha atual
```

Implementação recomendada:

```txt
Digite EXCLUIR para confirmar
Senha atual
```

Se usar confirmação textual, só habilitar o botão final quando o usuário digitar:

```txt
EXCLUIR
```

Botão final:

```txt
Confirmar exclusão da conta
```

====================================================================
FRONTEND — SERVICE
==================

Crie ou ajuste o service de usuário.

Arquivo provável:

```txt
frontend/src/services/userService.js
```

Adicionar função:

```javascript
deleteAccount(data)
```

Ela deve chamar:

```txt
DELETE /api/users/me
```

Enviando no body:

```json
{
  "currentPassword": "senhaAtual"
}
```

Observação técnica:

Axios permite body em DELETE usando:

```javascript
api.delete('/users/me', { data })
```

Use o padrão de Axios já existente no projeto.

Não crie uma configuração paralela se já existir `axiosConfig.js`.

====================================================================
FRONTEND — COMPORTAMENTO APÓS SUCESSO
=====================================

Após deletar a conta com sucesso:

1. Remover token JWT do localStorage/sessionStorage, conforme o projeto usa.
2. Limpar dados locais do usuário, se existirem.
3. Redirecionar para `/login`.
4. Exibir mensagem simples, se possível.

Mensagem sugerida:

```txt
Conta deletada com sucesso.
```

Se o redirecionamento ocorrer imediatamente, a mensagem pode ser exibida na tela de login apenas se o projeto já suportar isso.

Não manter o usuário logado após deletar conta.

====================================================================
FRONTEND — COMPORTAMENTO EM CASO DE ERRO
========================================

Tratar erros simples:

1. Senha atual vazia.
2. Senha atual incorreta.
3. Falha na requisição.
4. Usuário não autenticado.

Mensagens sugeridas:

```txt
Informe sua senha atual.
Senha atual incorreta.
Não foi possível deletar a conta.
Sessão expirada. Faça login novamente.
```

Não quebrar a tela inteira em caso de erro.

====================================================================
O QUE NÃO FAZER
===============

Não implemente:

1. Exclusão física de arquivos.
2. Exclusão física de pastas.
3. Exclusão física do usuário no banco.
4. Exclusão de conta de outro usuário.
5. Tela administrativa.
6. Listagem de usuários.
7. Confirmação por e-mail.
8. Envio de e-mail.
9. Recuperação de conta.
10. Agendamento de exclusão.
11. Exportação de dados.
12. Dashboard.
13. Endpoint `/api/dashboard`.
14. Logs avançados.
15. Auditoria complexa.
16. Notificações.
17. Reautenticação por token externo.
18. OAuth2.
19. Alteração de permissões.

====================================================================
CRITÉRIOS DE ACEITE
===================

A implementação será considerada concluída quando:

1. A tela de Configurações exibir a seção `Zona de perigo`.
2. A seção conter o botão `Deletar conta`.
3. Clicar em `Deletar conta` abrir confirmação.
4. A confirmação solicitar a senha atual.
5. O frontend chamar `DELETE /api/users/me`.
6. O backend exigir JWT.
7. O backend obter o usuário pelo JWT.
8. O backend não aceitar `userId`.
9. O backend validar a senha atual.
10. Senha incorreta impedir exclusão.
11. Senha correta desativar a conta.
12. A conta desativada não conseguir fazer login novamente.
13. O frontend remover o token após sucesso.
14. O frontend redirecionar para `/login`.
15. Nenhuma senha ou hash ser retornado pela API.
16. Nenhum arquivo físico ser deletado do disco.
17. Nenhuma funcionalidade fora do escopo ser criada.
18. O backend compilar sem erros.
19. O frontend iniciar sem erros.

====================================================================
ORDEM DE EXECUÇÃO
=================

Execute nesta ordem:

1. Leia `spec.md`.
2. Analise a implementação atual de autenticação.
3. Analise a entidade `User`.
4. Verifique se já existe campo de status, ativo ou deletado.
5. Se não existir, adicione `active = true`.
6. Ajuste o login para bloquear usuário inativo.
7. Crie ou ajuste `DeleteAccountRequest`.
8. Crie ou reutilize `MessageResponse`.
9. Implemente `DELETE /api/users/me`.
10. Compile o backend.
11. Corrija erros de compilação.
12. Analise a tela de Configurações.
13. Adicione a seção `Zona de perigo`.
14. Adicione o botão `Deletar conta`.
15. Adicione confirmação com senha atual.
16. Crie ou ajuste `deleteAccount` no service do frontend.
17. Após sucesso, remover token e redirecionar para login.
18. Teste o fluxo.
19. Atualize o README apenas se necessário.
20. Entregue resumo final.

====================================================================
RESUMO FINAL ESPERADO
=====================

Ao terminar, informe:

1. Arquivos criados.
2. Arquivos alterados.
3. Endpoint adicionado.
4. Campo adicionado na entidade, se houver.
5. Como testar a deleção de conta.
6. Resultado da compilação do backend.
7. Resultado da execução ou build do frontend.
8. Pendências, caso existam.

Execute agora apenas a implementação do botão de deletar conta em Configurações.
