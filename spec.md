# Especificação do Projeto — Drive Corporativo MVP

## 1. Visão Geral

O projeto consiste em um sistema web simples para armazenamento e gerenciamento de arquivos corporativos, semelhante a uma versão reduzida do Google Drive, com foco em uso interno e demonstração técnica.

A primeira versão deve ser um MVP funcional, executável localmente em ambiente Linux Debian dentro do WSL, com backend em Java Spring Boot, frontend em React com Vite, banco de dados MySQL e armazenamento local de arquivos no servidor.

A prioridade do projeto é entregar um fluxo funcional de ponta a ponta:

1. Usuário se cadastra.
2. Usuário faz login.
3. Usuário cria uma pasta.
4. Usuário envia um arquivo.
5. Backend salva o arquivo localmente.
6. Backend salva os metadados no MySQL.
7. Usuário visualiza seus arquivos.
8. Usuário pesquisa arquivo por nome.
9. Usuário baixa o arquivo.
10. Usuário exclui logicamente o arquivo.

A primeira versão não deve conter dashboard.

---

## 2. Nome Provisório

Drive Corporativo

---

## 3. Objetivo do Projeto

Criar uma aplicação web funcional para gerenciamento de arquivos, demonstrando domínio básico de:

* frontend;
* backend;
* autenticação;
* upload de arquivos;
* persistência em banco de dados;
* armazenamento local;
* proteção de acesso por usuário;
* organização básica por pastas.

O objetivo não é criar uma arquitetura corporativa completa, mas sim um MVP simples, funcional e fácil de apresentar.

---

## 4. Ambiente de Execução Inicial

O sistema deve ser desenvolvido e executado inicialmente em ambiente local.

Ambiente obrigatório:

* Sistema operacional: Debian dentro do WSL.
* Backend: Java 17 ou superior.
* Build backend: Maven.
* Banco de dados: MySQL.
* Frontend: Node.js LTS.
* Armazenamento: local no filesystem.
* Execução inicial: sem Docker obrigatório.

O projeto deve conter um `README.md` com instruções claras para:

1. Instalar dependências necessárias.
2. Criar o banco de dados MySQL.
3. Configurar usuário e senha do banco.
4. Executar o backend.
5. Executar o frontend.
6. Criar ou validar o diretório de armazenamento.
7. Testar o fluxo principal do MVP.

---

## 5. Tecnologias Definidas

## 5.1 Frontend

Tecnologias obrigatórias:

* React;
* Vite;
* Axios;
* React Router DOM;
* Bootstrap.

O frontend deve ser simples, funcional e direto.

Não usar no MVP inicial:

* Tailwind CSS;
* Redux;
* Zustand;
* Material UI;
* Next.js;
* Server Side Rendering;
* bibliotecas visuais complexas;
* gráficos;
* dashboard;
* painéis administrativos.

---

## 5.2 Backend

Tecnologia obrigatória:

* Java com Spring Boot.

Módulos recomendados:

* Spring Web;
* Spring Data JPA;
* Spring Security;
* MySQL Driver;
* Validation;
* Lombok;
* JWT.

O backend deve seguir uma estrutura simples em camadas:

* controller;
* service;
* repository;
* entity;
* dto;
* security;
* exception;
* config.

Não usar no MVP inicial:

* microsserviços;
* arquitetura hexagonal;
* mensageria;
* Kafka;
* RabbitMQ;
* cache distribuído;
* Redis;
* OAuth2;
* Keycloak;
* integração com serviços externos;
* Docker obrigatório;
* Kubernetes.

---

## 5.3 Banco de Dados

Banco obrigatório:

* MySQL.

O banco será responsável por armazenar:

* usuários;
* metadados dos arquivos;
* estrutura de pastas.

Não armazenar o conteúdo binário dos arquivos no banco.

Os arquivos físicos devem ser armazenados no filesystem local. O banco deve armazenar apenas os metadados e o caminho controlado pelo backend.

---

## 5.4 Armazenamento de Arquivos

Tipo de armazenamento:

* local no servidor.

Diretório recomendado para o MVP:

```txt
./storage/drive-corporativo
```

Estrutura física recomendada:

```txt
storage/drive-corporativo/{userId}/{storedName}
```

Exemplo:

```txt
storage/drive-corporativo/1/9f4c7a2e-4d3f-4f9c-a5e1-221d6c61b9aa.pdf
```

O backend deve gerar o nome físico do arquivo.

O nome original do arquivo deve ser preservado no banco de dados, mas não deve ser usado como nome físico principal no disco.

---

## 6. Escopo Obrigatório do MVP Inicial

O MVP inicial deve conter obrigatoriamente:

1. Cadastro de usuário.
2. Login com JWT.
3. Logout no frontend.
4. Proteção de rotas privadas no backend.
5. Proteção de rotas privadas no frontend.
6. Upload de arquivo.
7. Salvamento físico do arquivo em diretório local.
8. Salvamento dos metadados do arquivo no MySQL.
9. Listagem de arquivos do usuário autenticado.
10. Download de arquivo.
11. Exclusão lógica de arquivo.
12. Criação de pasta.
13. Listagem de pastas.
14. Associação opcional de arquivo a uma pasta.
15. Busca simples por nome de arquivo.
16. Interface web funcional em React.
17. Instruções de execução no README.

---

## 7. Fora do MVP Inicial — Não Implementar

A IA não deve implementar no MVP inicial:

1. Dashboard.
2. Cards de resumo.
3. Gráficos.
4. Indicadores visuais de estatísticas.
5. Total de arquivos em tela separada.
6. Total de pastas em tela separada.
7. Espaço utilizado em dashboard.
8. Últimos arquivos enviados em dashboard.
9. Compartilhamento público por link.
10. Compartilhamento entre usuários.
11. Permissões por equipe.
12. Perfis de acesso.
13. Painel administrativo.
14. Preview de PDF.
15. Preview de imagem.
16. OCR.
17. IA para resumo de documentos.
18. Versionamento de arquivos.
19. Integração com S3.
20. Integração com Google Drive.
21. Integração com Dropbox.
22. Antivírus.
23. Criptografia avançada de arquivos.
24. Recuperação de senha por e-mail.
25. Envio de e-mails.
26. Notificações.
27. Comentários em arquivos.
28. Favoritos.
29. Tags.
30. Upload em lote.
31. Upload resumível.
32. Drag and drop avançado.
33. Controle de cota por usuário.
34. Logs avançados de auditoria.
35. Lixeira visual com tela própria.
36. Restauração de arquivos excluídos.
37. Exclusão física automática.
38. Docker obrigatório.
39. Deploy em nuvem.
40. Testes automatizados complexos.

Qualquer funcionalidade não descrita no escopo obrigatório deve ser considerada fora do MVP inicial.

---

## 8. Funcionalidades do MVP

## 8.1 Cadastro de Usuário

O sistema deve permitir que um novo usuário se cadastre informando:

* nome;
* e-mail;
* senha.

Regras:

* o e-mail deve ser único;
* a senha deve ser criptografada com BCrypt;
* não salvar senha em texto puro;
* não retornar senha ou hash de senha em nenhuma resposta da API.

Endpoint:

```txt
POST /api/auth/register
```

Request esperado:

```json
{
  "name": "Usuário Teste",
  "email": "usuario@email.com",
  "password": "123456"
}
```

Response esperado:

```json
{
  "id": 1,
  "name": "Usuário Teste",
  "email": "usuario@email.com"
}
```

---

## 8.2 Login

O sistema deve permitir login com e-mail e senha.

A autenticação deve usar JWT.

Endpoint:

```txt
POST /api/auth/login
```

Request esperado:

```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
```

Response esperado:

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Usuário Teste",
    "email": "usuario@email.com"
  }
}
```

Regras:

* o token JWT deve ser enviado pelo frontend nas requisições privadas;
* o header obrigatório deve ser:

```txt
Authorization: Bearer <token>
```

* o backend deve identificar o usuário autenticado a partir do token;
* endpoints privados não podem aceitar `userId` enviado manualmente pelo frontend para definir posse de arquivo ou pasta.

---

## 8.3 Logout

O logout será tratado no frontend.

Regra:

* remover o token JWT armazenado no navegador;
* redirecionar o usuário para a tela de login.

No MVP, não é necessário implementar blacklist de token no backend.

---

## 8.4 Gerenciamento de Arquivos

O usuário autenticado deve conseguir:

* enviar arquivo;
* listar seus arquivos;
* baixar arquivo;
* visualizar informações básicas do arquivo;
* excluir logicamente arquivo;
* pesquisar arquivo por nome.

Tipos aceitos inicialmente:

* PDF;
* DOCX;
* XLSX;
* PNG;
* JPG;
* JPEG;
* TXT;
* ZIP.

Tamanho máximo inicial:

```txt
50MB
```

O backend deve validar:

* extensão;
* content type;
* tamanho máximo;
* usuário autenticado;
* propriedade do arquivo.

---

## 8.5 Upload de Arquivo

Endpoint:

```txt
POST /api/files/upload
```

Tipo de request:

```txt
multipart/form-data
```

Campos:

```txt
file: obrigatório
folderId: opcional
```

Regras:

1. O arquivo deve ser salvo fisicamente no diretório local configurado.
2. O nome físico deve ser gerado pelo backend.
3. O nome físico recomendado é UUID + extensão.
4. O nome original deve ser salvo no banco.
5. O caminho físico não deve ser exposto ao frontend.
6. O arquivo deve pertencer ao usuário autenticado.
7. Se `folderId` for informado, a pasta deve pertencer ao usuário autenticado.
8. Arquivos excluídos logicamente não devem ser sobrescritos.
9. O backend não deve aceitar caminho de arquivo enviado pelo frontend.

Response esperado:

```json
{
  "id": 1,
  "originalName": "contrato.pdf",
  "extension": "pdf",
  "contentType": "application/pdf",
  "size": 102400,
  "folderId": null,
  "createdAt": "2026-06-22T10:00:00"
}
```

---

## 8.6 Listagem de Arquivos

Endpoint:

```txt
GET /api/files
```

Response esperado:

```json
[
  {
    "id": 1,
    "originalName": "contrato.pdf",
    "extension": "pdf",
    "contentType": "application/pdf",
    "size": 102400,
    "folderId": null,
    "createdAt": "2026-06-22T10:00:00"
  }
]
```

Regras:

* listar apenas arquivos do usuário autenticado;
* não listar arquivos com `deleted = true`;
* não retornar `storagePath`;
* não retornar dados de outros usuários.

---

## 8.7 Detalhes do Arquivo

Endpoint:

```txt
GET /api/files/{id}
```

Response esperado:

```json
{
  "id": 1,
  "originalName": "contrato.pdf",
  "extension": "pdf",
  "contentType": "application/pdf",
  "size": 102400,
  "folderId": null,
  "createdAt": "2026-06-22T10:00:00"
}
```

Regras:

* só permitir acesso ao dono do arquivo;
* se o arquivo não existir, retornar 404;
* se o arquivo pertencer a outro usuário, retornar 403 ou 404;
* se o arquivo estiver excluído logicamente, retornar 404.

---

## 8.8 Download de Arquivo

Endpoint:

```txt
GET /api/files/{id}/download
```

Regras:

1. Apenas o dono do arquivo pode fazer download.
2. Arquivo excluído logicamente não pode ser baixado.
3. O backend deve buscar o caminho físico a partir do banco.
4. O frontend não deve enviar caminho físico.
5. O backend deve retornar o arquivo com headers adequados para download.

Headers recomendados:

```txt
Content-Type: <contentType>
Content-Disposition: attachment; filename="<originalName>"
```

---

## 8.9 Exclusão Lógica de Arquivo

Endpoint:

```txt
DELETE /api/files/{id}
```

Regras:

1. O arquivo não deve ser removido fisicamente do disco no MVP.
2. O campo `deleted` deve ser marcado como `true`.
3. O arquivo não deve aparecer na listagem padrão.
4. O arquivo não deve aparecer na busca.
5. O arquivo não deve permitir download após exclusão lógica.
6. Apenas o dono do arquivo pode excluir.

Response esperado:

```json
{
  "message": "Arquivo excluído com sucesso."
}
```

---

## 8.10 Busca de Arquivos

Endpoint:

```txt
GET /api/files/search?name=
```

Exemplo:

```txt
GET /api/files/search?name=contrato
```

Regras:

* buscar apenas arquivos do usuário autenticado;
* buscar apenas arquivos não excluídos;
* buscar por nome original do arquivo;
* busca deve ser simples, usando `LIKE`;
* não implementar busca avançada no MVP.

Response esperado:

```json
[
  {
    "id": 1,
    "originalName": "contrato.pdf",
    "extension": "pdf",
    "contentType": "application/pdf",
    "size": 102400,
    "folderId": null,
    "createdAt": "2026-06-22T10:00:00"
  }
]
```

---

## 8.11 Gerenciamento de Pastas

O usuário autenticado deve conseguir:

* criar pasta;
* listar pastas;
* acessar pasta pelo ID;
* associar arquivos a uma pasta.

Para simplificar a primeira versão, renomear e excluir pastas podem ficar fora do MVP inicial.

---

## 8.12 Criação de Pasta

Endpoint:

```txt
POST /api/folders
```

Request esperado:

```json
{
  "name": "Contratos",
  "parentFolderId": null
}
```

Response esperado:

```json
{
  "id": 1,
  "name": "Contratos",
  "parentFolderId": null,
  "createdAt": "2026-06-22T10:00:00"
}
```

Regras:

* o nome da pasta é obrigatório;
* a pasta deve pertencer ao usuário autenticado;
* `parentFolderId` é opcional;
* se `parentFolderId` for informado, a pasta pai deve pertencer ao usuário autenticado;
* não permitir duas pastas com o mesmo nome no mesmo nível para o mesmo usuário.

---

## 8.13 Listagem de Pastas

Endpoint:

```txt
GET /api/folders
```

Response esperado:

```json
[
  {
    "id": 1,
    "name": "Contratos",
    "parentFolderId": null,
    "createdAt": "2026-06-22T10:00:00"
  }
]
```

Regras:

* listar apenas pastas do usuário autenticado;
* não listar pastas de outros usuários.

---

## 8.14 Detalhes da Pasta

Endpoint:

```txt
GET /api/folders/{id}
```

Response esperado:

```json
{
  "id": 1,
  "name": "Contratos",
  "parentFolderId": null,
  "createdAt": "2026-06-22T10:00:00"
}
```

Regras:

* apenas o dono da pasta pode consultar;
* se a pasta não existir, retornar 404;
* se a pasta pertencer a outro usuário, retornar 403 ou 404.

---

## 9. Entidades Principais

## 9.1 User

Campos:

* id;
* name;
* email;
* password;
* createdAt.

Regras:

* `email` deve ser único;
* `password` deve armazenar hash BCrypt;
* `createdAt` deve ser preenchido automaticamente.

---

## 9.2 Folder

Campos:

* id;
* name;
* parentFolderId;
* user;
* createdAt;
* updatedAt.

Regras:

* `name` obrigatório;
* `user` obrigatório;
* `parentFolderId` opcional;
* a pasta pode estar na raiz;
* a pasta pode ter uma pasta pai;
* não permitir nomes duplicados no mesmo nível para o mesmo usuário.

---

## 9.3 File

Campos:

* id;
* originalName;
* storedName;
* extension;
* contentType;
* size;
* storagePath;
* folder;
* user;
* deleted;
* createdAt;
* updatedAt.

Regras:

* `originalName` obrigatório;
* `storedName` obrigatório e único;
* `extension` obrigatório;
* `contentType` obrigatório;
* `size` obrigatório;
* `storagePath` obrigatório;
* `folder` opcional;
* `user` obrigatório;
* `deleted` deve iniciar como `false`;
* `createdAt` deve ser preenchido automaticamente.

---

## 10. Estrutura Sugerida do Backend

```txt
src/main/java/com/company/drive
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
├── security
├── service
└── DriveApplication.java
```

Estrutura recomendada de classes:

```txt
controller
├── AuthController.java
├── FileController.java
└── FolderController.java

service
├── AuthService.java
├── FileService.java
├── FolderService.java
└── StorageService.java

repository
├── UserRepository.java
├── FileRepository.java
└── FolderRepository.java

entity
├── User.java
├── FileEntity.java
└── Folder.java

dto
├── LoginRequest.java
├── LoginResponse.java
├── RegisterRequest.java
├── UserResponse.java
├── FileResponse.java
├── FolderRequest.java
└── FolderResponse.java

security
├── JwtService.java
├── JwtAuthenticationFilter.java
├── SecurityConfig.java
└── UserDetailsServiceImpl.java

exception
├── GlobalExceptionHandler.java
├── ResourceNotFoundException.java
└── AccessDeniedException.java

config
└── StorageProperties.java
```

---

## 11. Endpoints do MVP

## 11.1 Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

---

## 11.2 Files

```txt
POST /api/files/upload
GET /api/files
GET /api/files/{id}
GET /api/files/{id}/download
DELETE /api/files/{id}
GET /api/files/search?name=
```

---

## 11.3 Folders

```txt
POST /api/folders
GET /api/folders
GET /api/folders/{id}
```

Endpoints fora do MVP inicial:

```txt
PUT /api/folders/{id}
DELETE /api/folders/{id}
```

---

## 12. Telas do Frontend

## 12.1 Tela de Login

Campos:

* e-mail;
* senha.

Ações:

* fazer login;
* redirecionar para tela principal após login;
* link para cadastro.

---

## 12.2 Tela de Cadastro

Campos:

* nome;
* e-mail;
* senha.

Ações:

* cadastrar usuário;
* redirecionar para login ou entrar automaticamente após cadastro.

---

## 12.3 Tela Principal de Arquivos

Esta será a principal tela do sistema.

Componentes obrigatórios:

* lista de arquivos;
* lista de pastas;
* botão para criar pasta;
* botão para upload;
* campo de busca;
* botão de download;
* botão de excluir;
* botão de logout.

Não deve conter:

* dashboard;
* cards de resumo;
* gráficos;
* indicadores estatísticos;
* painel administrativo.

---

## 12.4 Tela ou Modal de Detalhes do Arquivo

Pode ser implementado como modal ou seção simples.

Exibir:

* nome original;
* tipo;
* tamanho;
* data de envio;
* pasta associada, quando houver;
* botão de download;
* botão de excluir.

Não exibir:

* caminho físico do arquivo;
* nome físico interno;
* dados técnicos sensíveis.

---

## 13. Configurações Recomendadas

## 13.1 application.yml

Configuração inicial recomendada:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/drive_corporativo
    username: root
    password: root

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB

app:
  storage:
    path: ./storage/drive-corporativo

jwt:
  secret: alterar_este_valor_para_um_segredo_maior
  expiration: 86400000
```

Observação:

Para o MVP local, `ddl-auto: update` é aceitável. Em uma versão futura, pode ser substituído por migrations com Flyway ou Liquibase.

---

## 14. Regras de Segurança Obrigatórias

1. Um usuário nunca pode acessar arquivos de outro usuário.
2. Um usuário nunca pode acessar pastas de outro usuário.
3. Todo download deve validar o dono do arquivo.
4. Toda exclusão deve validar o dono do arquivo.
5. Toda listagem deve filtrar pelo usuário autenticado.
6. O backend não deve aceitar `userId` enviado pelo frontend para definir propriedade.
7. O backend deve obter o usuário a partir do JWT.
8. O backend não deve aceitar caminho físico enviado pelo frontend.
9. O backend deve gerar o caminho de armazenamento.
10. O backend deve bloquear path traversal, como `../`.
11. O backend deve validar extensão de arquivo.
12. O backend deve validar content type.
13. O backend deve limitar upload a 50MB.
14. O backend não deve expor `storagePath` nas respostas.
15. O backend não deve expor `storedName` nas respostas públicas.
16. O backend não deve retornar senha ou hash de senha.
17. Endpoints privados devem exigir token JWT.
18. Requisições sem token devem retornar 401.
19. Acesso a recurso de outro usuário deve retornar 403 ou 404.

---

## 15. Tratamento de Erros

O backend deve retornar respostas padronizadas de erro.

Formato recomendado:

```json
{
  "timestamp": "2026-06-22T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Tipo de arquivo não permitido",
  "path": "/api/files/upload"
}
```

Erros mínimos:

* 400 para dados inválidos;
* 401 para usuário não autenticado;
* 403 para acesso negado;
* 404 para recurso não encontrado;
* 413 para arquivo maior que o permitido;
* 500 para erro interno inesperado.

---

## 16. Regras de Negócio

1. Um usuário só pode acessar seus próprios arquivos.
2. Um usuário só pode acessar suas próprias pastas.
3. Arquivos excluídos logicamente devem ser ocultados da listagem padrão.
4. Arquivos excluídos logicamente não podem ser baixados.
5. O nome físico do arquivo salvo deve ser único.
6. O nome original do arquivo deve ser preservado no banco.
7. O sistema deve validar tipos de arquivo permitidos.
8. O sistema deve limitar o tamanho máximo de upload.
9. Arquivos podem estar vinculados a uma pasta ou à raiz.
10. Pastas podem ter subpastas.
11. Não permitir duplicidade de nome de pasta no mesmo nível para o mesmo usuário.
12. O sistema não deve possuir dashboard na primeira versão.
13. O sistema não deve implementar funcionalidades fora do MVP.

---

## 17. Critérios de Aceite Funcionais

O MVP será considerado funcional quando:

1. O usuário conseguir se cadastrar.
2. O usuário conseguir fazer login.
3. O usuário conseguir acessar a tela principal após login.
4. O usuário conseguir criar uma pasta.
5. O usuário conseguir listar suas pastas.
6. O usuário conseguir enviar um arquivo.
7. O arquivo for salvo localmente.
8. Os metadados do arquivo forem salvos no MySQL.
9. O usuário conseguir listar seus arquivos.
10. O usuário conseguir pesquisar arquivos por nome.
11. O usuário conseguir baixar um arquivo.
12. O usuário conseguir excluir logicamente um arquivo.
13. O arquivo excluído deixar de aparecer na listagem.
14. O usuário conseguir fazer logout.
15. O sistema funcionar sem dashboard.

---

## 18. Critérios de Aceite Técnicos

1. O backend deve iniciar sem erros com:

```bash
mvn spring-boot:run
```

2. O frontend deve iniciar sem erros com:

```bash
npm run dev
```

3. O banco MySQL deve ser configurável pelo `application.yml`.

4. As tabelas devem ser criadas automaticamente via JPA ou por script SQL documentado.

5. O projeto deve funcionar seguindo apenas as instruções do README.

6. Nenhum endpoint privado deve funcionar sem token JWT.

7. Download de arquivo de outro usuário deve retornar 403 ou 404.

8. Exclusão de arquivo de outro usuário deve retornar 403 ou 404.

9. Arquivos excluídos logicamente não devem aparecer na listagem padrão.

10. Arquivos excluídos logicamente não devem aparecer na busca.

11. O arquivo físico deve existir no diretório local após upload.

12. O banco deve conter os metadados após upload.

13. O frontend não deve quebrar ao recarregar a página quando houver token válido.

14. O frontend deve redirecionar para login quando não houver token.

15. Nenhuma tela de dashboard deve ser criada no MVP.

---

## 19. Ordem Recomendada de Desenvolvimento

## Fase 1 — Base do Backend

1. Criar projeto Spring Boot.
2. Configurar Maven.
3. Configurar MySQL no `application.yml`.
4. Criar entidade `User`.
5. Criar entidade `Folder`.
6. Criar entidade `FileEntity`.
7. Criar repositories.
8. Validar conexão com banco.

---

## Fase 2 — Autenticação

9. Implementar cadastro de usuário.
10. Implementar criptografia de senha com BCrypt.
11. Implementar login.
12. Implementar geração de JWT.
13. Implementar filtro de autenticação JWT.
14. Proteger endpoints privados.
15. Testar autenticação via Postman, Insomnia ou curl.

---

## Fase 3 — Arquivos

16. Implementar configuração do diretório de storage.
17. Implementar upload local.
18. Implementar geração de nome físico com UUID.
19. Implementar salvamento de metadados no MySQL.
20. Implementar listagem de arquivos.
21. Implementar detalhes do arquivo.
22. Implementar download.
23. Implementar exclusão lógica.
24. Implementar busca por nome.

---

## Fase 4 — Pastas

25. Implementar criação de pasta.
26. Implementar listagem de pastas.
27. Implementar consulta de pasta por ID.
28. Permitir upload associado a uma pasta.
29. Validar posse da pasta pelo usuário autenticado.

---

## Fase 5 — Frontend

30. Criar projeto React com Vite.
31. Instalar Axios, React Router DOM e Bootstrap.
32. Criar tela de login.
33. Criar tela de cadastro.
34. Criar controle de rotas privadas.
35. Criar tela principal de arquivos.
36. Criar componente de upload.
37. Criar listagem de arquivos.
38. Criar listagem de pastas.
39. Criar busca por nome.
40. Criar ação de download.
41. Criar ação de exclusão lógica.
42. Criar logout.

---

## Fase 6 — Finalização

43. Criar README.
44. Documentar comandos de execução.
45. Documentar criação do banco.
46. Validar fluxo principal.
47. Remover código morto.
48. Padronizar mensagens de erro.
49. Garantir que não exista dashboard no MVP.

---

## 20. Fluxo de Demonstração

Durante a apresentação, o sistema deve demonstrar o seguinte fluxo:

1. Usuário acessa a tela de cadastro.
2. Usuário cria uma conta.
3. Usuário faz login.
4. Usuário acessa a tela principal de arquivos.
5. Usuário cria uma pasta.
6. Usuário faz upload de um arquivo.
7. Sistema salva o arquivo no storage local.
8. Sistema salva os metadados no MySQL.
9. Usuário visualiza o arquivo na listagem.
10. Usuário pesquisa o arquivo pelo nome.
11. Usuário faz download do arquivo.
12. Usuário exclui logicamente o arquivo.
13. Sistema remove o arquivo da listagem.
14. Usuário faz logout.

Não demonstrar dashboard, pois essa funcionalidade não faz parte da primeira versão.

---

## 21. Restrições para Geração por IA

A IA deve gerar código simples, funcional e direto.

A IA deve evitar:

* abstrações desnecessárias;
* arquitetura hexagonal;
* microsserviços;
* mensageria;
* filas;
* cache distribuído;
* Docker obrigatório;
* Kubernetes;
* autenticação OAuth2;
* integração com serviços externos;
* componentes visuais complexos;
* código genérico demais;
* funcionalidades não descritas neste documento.

A IA deve priorizar:

* clareza;
* código executável;
* baixa complexidade;
* separação básica entre controller, service, repository, entity e dto;
* README com comandos;
* endpoints testáveis;
* frontend simples;
* integração funcional entre frontend e backend.

A IA não deve alterar as tecnologias definidas.

A IA não deve substituir:

* React por outro frontend;
* Spring Boot por outro backend;
* MySQL por outro banco;
* armazenamento local por serviço externo;
* JWT por sessão tradicional.

---

## 22. Estrutura Esperada do Repositório

Estrutura recomendada:

```txt
drive-corporativo
├── backend
│   ├── src
│   ├── pom.xml
│   └── README.md
│
├── frontend
│   ├── src
│   ├── package.json
│   └── README.md
│
├── storage
│   └── drive-corporativo
│
└── README.md
```

O diretório `storage` pode ser criado manualmente ou automaticamente pelo backend na inicialização.

---

## 23. README Obrigatório

O `README.md` principal deve conter:

1. Descrição do projeto.
2. Tecnologias utilizadas.
3. Pré-requisitos.
4. Como criar o banco MySQL.
5. Como configurar o backend.
6. Como executar o backend.
7. Como configurar o frontend.
8. Como executar o frontend.
9. Fluxo de teste do MVP.
10. Lista clara do que não faz parte da primeira versão.

Comando exemplo para criação do banco:

```sql
CREATE DATABASE drive_corporativo;
```

Comando exemplo para executar backend:

```bash
cd backend
mvn spring-boot:run
```

Comando exemplo para executar frontend:

```bash
cd frontend
npm install
npm run dev
```

---

## 24. Diretriz Final do MVP

Este projeto deve ser desenvolvido como MVP funcional, simples e executável localmente no Debian dentro do WSL.

A prioridade é entregar um sistema funcionando de ponta a ponta, não uma arquitetura corporativa completa.

O fluxo principal obrigatório é:

1. Usuário se cadastra.
2. Usuário faz login.
3. Usuário cria uma pasta.
4. Usuário envia um arquivo.
5. Backend salva o arquivo localmente.
6. Backend salva os metadados no MySQL.
7. Frontend lista o arquivo.
8. Usuário pesquisa o arquivo por nome.
9. Usuário baixa o arquivo.
10. Usuário exclui logicamente o arquivo.
11. Usuário faz logout.

Qualquer funcionalidade que não contribua diretamente para esse fluxo deve ficar fora do MVP inicial.

A IA não deve adicionar funcionalidades extras por conta própria.

A IA não deve criar dashboard.

A IA não deve criar endpoint de dashboard.

A IA não deve criar cards estatísticos.

A IA não deve criar gráficos.

A IA não deve trocar as tecnologias definidas.

A IA não deve substituir MySQL por outro banco.

A IA não deve substituir armazenamento local por serviço externo.

A IA não deve criar arquitetura de microsserviços.

A IA não deve exigir Docker para executar o projeto.

A IA não deve implementar permissões avançadas.

A IA não deve implementar compartilhamento de arquivos.

O resultado esperado é uma aplicação local, simples, funcional, demonstrável e fácil de explicar em uma apresentação técnica.
