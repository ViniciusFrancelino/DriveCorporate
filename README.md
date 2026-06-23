# Drive Corporativo

MVP local para armazenar e organizar arquivos corporativos. O fluxo entregue é: cadastro, login com JWT, criação de pastas, upload, listagem, busca, download, exclusão lógica e logout.

## Tecnologias

- Backend: Java 17+, Spring Boot, Maven, Spring Web, Spring Data JPA, Spring Security, JWT, Validation e Lombok.
- Banco de dados: MySQL.
- Frontend: React, Vite, Axios, React Router DOM e Bootstrap.
- Arquivos: filesystem local em `./storage/drive-corporativo`.

## Pré-requisitos no Debian/WSL

Instale Java 17+, Maven, MySQL Server e Node.js LTS. Por exemplo:

```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven mysql-server
# Instale o Node.js LTS conforme a distribuição/repositório de sua preferência.
```

## Banco de dados

Inicie o MySQL e crie o banco:

```sql
CREATE DATABASE drive_corporativo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Por padrão, o backend conecta em `jdbc:mysql://localhost:3306/drive_corporativo` com usuário `root` e senha `root`. Ajuste `backend/src/main/resources/application.yml` ou defina estas variáveis antes de iniciar:

```bash
export DB_URL='jdbc:mysql://localhost:3306/drive_corporativo'
export DB_USERNAME='root'
export DB_PASSWORD='sua_senha'
export JWT_SECRET='um-segredo-local-com-no-minimo-32-caracteres'
```

O Hibernate cria/atualiza as tabelas automaticamente para este MVP (`ddl-auto: update`).

## Backend

O armazenamento é criado automaticamente em `./storage/drive-corporativo`. Para iniciar:

```bash
cd backend
mvn spring-boot:run
```

O servidor inicia em `http://localhost:8080`. As rotas privadas exigem `Authorization: Bearer <token>`.

## Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço indicado pelo Vite (normalmente `http://localhost:5173`). Se a API estiver em outro endereço, crie `frontend/.env` com, por exemplo:

```bash
VITE_API_URL=http://localhost:8080/api
```

## Teste do fluxo principal

1. Acesse `/register` e cadastre nome, e-mail e senha (mínimo de 6 caracteres).
2. Faça login.
3. Crie uma pasta na tela de arquivos.
4. Selecione um arquivo permitido — PDF, DOCX, XLSX, PNG, JPG/JPEG, TXT ou ZIP — de até 50MB, opcionalmente selecionando a pasta.
5. Confirme que ele aparece na tabela e que existe fisicamente em `storage/drive-corporativo/<id-do-usuario>/`.
6. Use a busca pelo nome, baixe o arquivo e, por fim, exclua-o. A exclusão é lógica: o item desaparece da lista e não pode mais ser baixado, mas permanece no disco.
7. Use **Sair** para remover o token do navegador.

## Decisões do MVP

- A posse de arquivos e pastas é derivada exclusivamente do usuário presente no JWT; a interface não envia `userId` nem caminhos físicos.
- O backend gera nomes físicos com UUID, preserva o nome original apenas como metadado e nunca expõe `storagePath` ou `storedName` pela API.
- A validação combina extensão permitida, content type informado pelo cliente e limite de 50MB. O caminho de destino é sempre construído pelo servidor e normalizado para bloquear path traversal.
- Para manter o escopo simples, a tela principal mostra todas as pastas do usuário e permite escolher uma pasta ao enviar um arquivo. Não há navegação hierárquica de subpastas nesta primeira versão.

## Fora da primeira versão

Não fazem parte deste MVP: dashboard, cards, gráficos ou estatísticas; compartilhamento; permissões avançadas; painel administrativo; preview de arquivos; OCR; IA; versionamento; tags; favoritos; upload em lote ou resumável; integrações S3/Google Drive/Dropbox; e-mail; notificações; antivírus; lixeira visual/restauração; Docker obrigatório; deploy em nuvem; edição ou exclusão de pastas.
