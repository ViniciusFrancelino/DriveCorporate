Você é um agente de desenvolvimento atuando dentro da minha IDE.

Existe um arquivo chamado `spec.md` na raiz do projeto. Leia esse arquivo inteiro antes de criar ou alterar qualquer código.

Seu objetivo é iniciar o desenvolvimento do projeto descrito em `spec.md`: um MVP chamado Drive Corporativo, com backend em Java Spring Boot, frontend em React com Vite, banco MySQL e armazenamento local de arquivos.

O projeto será executado inicialmente em Linux Debian dentro do WSL.

Siga obrigatoriamente estas regras:

1. Use o `spec.md` como fonte principal de verdade.
2. Não implemente nada que esteja fora do MVP.
3. Não crie dashboard.
4. Não crie endpoint de dashboard.
5. Não crie cards estatísticos.
6. Não crie gráficos.
7. Não implemente compartilhamento de arquivos.
8. Não implemente permissões avançadas.
9. Não implemente painel administrativo.
10. Não implemente preview de arquivos.
11. Não implemente OCR.
12. Não implemente IA para resumo de documentos.
13. Não implemente integração com S3, Google Drive, Dropbox ou serviços externos.
14. Não torne Docker obrigatório.
15. Não troque as tecnologias definidas.
16. Não substitua MySQL por outro banco.
17. Não substitua armazenamento local por outro tipo de storage.
18. Não implemente arquitetura complexa como microsserviços ou arquitetura hexagonal.
19. Priorize código simples, funcional, executável e fácil de entender.
20. Se algo estiver ambíguo, escolha a solução mais simples compatível com o `spec.md` e documente a decisão no README.

Crie a estrutura inicial do projeto assim:

```txt
drive-corporativo
├── backend
├── frontend
├── storage
│   └── drive-corporativo
└── README.md
```

No backend, use:

* Java 17 ou superior;
* Spring Boot;
* Maven;
* Spring Web;
* Spring Data JPA;
* Spring Security;
* JWT;
* MySQL Driver;
* Validation;
* Lombok.

No frontend, use:

* React;
* Vite;
* Axios;
* React Router DOM;
* Bootstrap.

Comece pela implementação do backend.

Implemente no backend:

1. Estrutura básica do Spring Boot.
2. Configuração do MySQL no `application.yml`.
3. Configuração do diretório local de armazenamento.
4. Entidade `User`.
5. Entidade `Folder`.
6. Entidade `FileEntity`.
7. Repositories.
8. DTOs necessários.
9. Cadastro de usuário.
10. Login com JWT.
11. Criptografia de senha com BCrypt.
12. Proteção de rotas privadas.
13. Upload local de arquivo.
14. Geração de nome físico com UUID.
15. Salvamento dos metadados do arquivo no MySQL.
16. Listagem de arquivos do usuário autenticado.
17. Detalhes de arquivo por ID.
18. Download de arquivo.
19. Exclusão lógica de arquivo.
20. Busca simples de arquivo por nome.
21. Criação de pasta.
22. Listagem de pastas.
23. Consulta de pasta por ID.
24. Validação de posse do usuário autenticado para arquivos e pastas.
25. Tratamento padronizado de erros.

Use esta estrutura de pacotes no backend:

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

Implemente os seguintes endpoints:

```txt
POST /api/auth/register
POST /api/auth/login

POST /api/files/upload
GET /api/files
GET /api/files/{id}
GET /api/files/{id}/download
DELETE /api/files/{id}
GET /api/files/search?name=

POST /api/folders
GET /api/folders
GET /api/folders/{id}
```

Não implemente estes endpoints agora:

```txt
GET /api/dashboard
PUT /api/folders/{id}
DELETE /api/folders/{id}
```

Regras obrigatórias de segurança:

1. Todo arquivo deve pertencer ao usuário autenticado.
2. Toda pasta deve pertencer ao usuário autenticado.
3. O frontend nunca deve enviar `userId` para definir dono de arquivo ou pasta.
4. O backend deve obter o usuário pelo JWT.
5. Um usuário não pode acessar arquivos de outro usuário.
6. Um usuário não pode acessar pastas de outro usuário.
7. O backend não deve expor `storagePath` nas respostas da API.
8. O backend não deve expor `storedName` nas respostas públicas.
9. O backend não deve retornar senha nem hash de senha.
10. Arquivos excluídos logicamente não devem aparecer na listagem.
11. Arquivos excluídos logicamente não devem aparecer na busca.
12. Arquivos excluídos logicamente não devem permitir download.
13. O backend deve validar tamanho máximo de upload de 50MB.
14. O backend deve validar extensões permitidas.
15. O backend deve bloquear path traversal, como `../`.

Tipos de arquivo permitidos:

```txt
PDF
DOCX
XLSX
PNG
JPG
JPEG
TXT
ZIP
```

Configure o storage local inicialmente como:

```txt
./storage/drive-corporativo
```

O formato físico recomendado para salvar arquivos é:

```txt
storage/drive-corporativo/{userId}/{uuid.extensao}
```

Depois de concluir a base do backend, crie o frontend.

No frontend, implemente:

1. Tela de login.
2. Tela de cadastro.
3. Controle de rotas privadas.
4. Tela principal de arquivos.
5. Listagem de arquivos.
6. Listagem de pastas.
7. Botão de criar pasta.
8. Upload de arquivo.
9. Busca por nome de arquivo.
10. Download de arquivo.
11. Exclusão lógica de arquivo.
12. Logout.

A tela principal não deve conter dashboard, cards de resumo, gráficos ou estatísticas.

Crie também um `README.md` principal com:

1. Descrição do projeto.
2. Tecnologias utilizadas.
3. Pré-requisitos para Debian no WSL.
4. Como criar o banco MySQL.
5. Como configurar o backend.
6. Como executar o backend.
7. Como configurar o frontend.
8. Como executar o frontend.
9. Como testar o fluxo principal do MVP.
10. Lista explícita do que está fora da primeira versão.

Critérios de conclusão desta tarefa:

1. O backend deve iniciar com:

```bash
cd backend
mvn spring-boot:run
```

2. O frontend deve iniciar com:

```bash
cd frontend
npm install
npm run dev
```

3. O usuário deve conseguir se cadastrar.
4. O usuário deve conseguir fazer login.
5. O usuário deve conseguir criar uma pasta.
6. O usuário deve conseguir enviar um arquivo.
7. O arquivo físico deve ser salvo localmente.
8. Os metadados devem ser salvos no MySQL.
9. O usuário deve conseguir listar arquivos.
10. O usuário deve conseguir pesquisar arquivo por nome.
11. O usuário deve conseguir baixar arquivo.
12. O usuário deve conseguir excluir logicamente arquivo.
13. O arquivo excluído não deve aparecer na listagem.
14. O sistema não deve conter dashboard.

Ao trabalhar, siga esta ordem:

1. Leia o `spec.md`.
2. Verifique se já existem arquivos no projeto.
3. Crie a estrutura de diretórios.
4. Implemente o backend primeiro.
5. Teste ou valide a compilação do backend.
6. Implemente o frontend.
7. Teste ou valide a instalação/build do frontend.
8. Crie ou atualize o README.
9. Ao final, entregue um resumo com:

   * arquivos criados;
   * principais decisões técnicas;
   * comandos executados;
   * o que foi implementado;
   * o que ainda falta, caso algo não tenha sido possível.

Não pare para perguntar sobre escolhas técnicas que já estão definidas no `spec.md`.

Não adicione funcionalidades extras.

Execute a implementação agora.
