# Especificação Funcional — Drive Corporativo MVP

## 1. Visão Geral

O projeto consiste em um sistema web simples para armazenamento e gerenciamento de arquivos corporativos, semelhante a uma versão reduzida do Google Drive, com foco em uso interno e demonstração técnica.

A prioridade do projeto é entregar um fluxo funcional de ponta a ponta:

1. Usuário se cadastra.
2. Usuário faz login.
3. Usuário cria uma pasta.
4. Usuário envia um arquivo.
5. Usuário visualiza seus arquivos.
6. Usuário pesquisa arquivo por nome.
7. Usuário baixa o arquivo.
8. Usuário exclui logicamente o arquivo.

A primeira versão não deve conter dashboard.

## 2. Nome Provisório

Drive Corporativo

## 3. Objetivo Funcional do Projeto

Criar uma aplicação web funcional para gerenciamento de arquivos, demonstrando domínio básico de:

* autenticação;
* upload de arquivos;
* proteção de acesso por usuário;
* organização básica por pastas.

## 4. Escopo Funcional Obrigatório do MVP Inicial

O MVP inicial deve conter obrigatoriamente:

1. Cadastro de usuário.
2. Login.
3. Logout.
4. Upload de arquivo.
5. Listagem de arquivos do usuário autenticado.
6. Download de arquivo.
7. Exclusão lógica de arquivo.
8. Criação de pasta.
9. Listagem de pastas.
10. Associação opcional de arquivo a uma pasta.
11. Busca simples por nome de arquivo.
12. Interface web funcional.

## 5. Funcionalidades Fora do MVP Inicial

A IA não deve implementar no MVP inicial:

* Dashboard.
* Cards de resumo.
* Gráficos.
* Indicadores visuais de estatísticas.
* Total de arquivos em tela separada.
* Total de pastas em tela separada.
* Espaço utilizado em dashboard.
* Últimos arquivos enviados em dashboard.
* Compartilhamento público por link.
* Compartilhamento entre usuários.
* Permissões por equipe.
* Perfis de acesso.
* Painel administrativo.
* Preview de PDF.
* Preview de imagem.
* OCR.
* IA para resumo de documentos.
* Versionamento de arquivos.
* Recuperação de senha por e-mail.
* Envio de e-mails.
* Notificações.
* Comentários em arquivos.
* Favoritos.
* Tags.
* Upload em lote.
* Upload resumível.
* Drag and drop avançado.
* Controle de cota por usuário.
* Lixeira visual com tela própria.
* Restauração de arquivos excluídos.

Qualquer funcionalidade não descrita no escopo obrigatório deve ser considerada fora do MVP inicial.

## 6. Funcionalidades e Regras de Negócio

### 6.1 Cadastro de Usuário

O sistema deve permitir que um novo usuário se cadastre informando:

* nome;
* e-mail;
* senha.

Regras:

* o e-mail deve ser único;

### 6.2 Login

O sistema deve permitir login com e-mail e senha.

### 6.3 Logout

O usuário deve conseguir encerrar sua sessão.

Após o logout:

* redirecionar o usuário para a tela de login.

### 6.4 Gerenciamento de Arquivos

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

### 6.5 Upload de Arquivo

A associação do arquivo a uma pasta é opcional.

Regras:

* O arquivo deve pertencer ao usuário autenticado.
* Se uma pasta for informada, ela deve pertencer ao usuário autenticado.
* Arquivos excluídos logicamente não devem ser sobrescritos.

### 6.6 Listagem de Arquivos

Regras:

* listar apenas arquivos do usuário autenticado;
* não listar arquivos excluídos logicamente;
* não retornar dados de outros usuários.

### 6.7 Detalhes do Arquivo

Regras:

* Só permitir acesso ao dono do arquivo.

### 6.8 Download de Arquivo

Regras:

* Apenas o dono do arquivo pode fazer download.
* Arquivo excluído logicamente não pode ser baixado.

### 6.9 Exclusão Lógica de Arquivo

Regras:

* O arquivo não deve aparecer na listagem padrão.
* O arquivo não deve aparecer na busca.
* O arquivo não deve permitir download após exclusão lógica.
* Apenas o dono do arquivo pode excluir.

### 6.10 Busca de Arquivos

Regras:

* buscar apenas arquivos do usuário autenticado;
* buscar apenas arquivos não excluídos;
* buscar por nome original do arquivo;
* não implementar busca avançada no MVP.

### 6.11 Gerenciamento de Pastas

O usuário autenticado deve conseguir:

* criar pasta;
* listar pastas;
* acessar pasta pelo ID;
* associar arquivos a uma pasta.

Para simplificar a primeira versão, renomear e excluir pastas podem ficar fora do MVP inicial.

### 6.12 Criação de Pasta

Regras:

* o nome da pasta é obrigatório;
* a pasta deve pertencer ao usuário autenticado;
* a pasta pai é opcional;
* se uma pasta pai for informada, ela deve pertencer ao usuário autenticado;
* não permitir duas pastas com o mesmo nome no mesmo nível para o mesmo usuário.

### 6.13 Listagem de Pastas

Regras:

* listar apenas pastas do usuário autenticado;
* não listar pastas de outros usuários.

### 6.14 Detalhes da Pasta

Regras:

* apenas o dono da pasta pode consultar;

## 7. Telas do Frontend

### 7.1 Tela de Login

Campos:

* e-mail;
* senha.

Ações:

* fazer login;
* redirecionar para tela principal após login;
* link para cadastro.

### 7.2 Tela de Cadastro

Campos:

* nome;
* e-mail;
* senha.

Ações:

* cadastrar usuário;
* redirecionar para login ou entrar automaticamente após cadastro.

### 7.3 Tela Principal de Arquivos

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

### 7.4 Tela ou Modal de Detalhes do Arquivo

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

## 8. Regras de Negócio

1. Um usuário só pode acessar seus próprios arquivos.
2. Um usuário só pode acessar suas próprias pastas.
3. Arquivos excluídos logicamente devem ser ocultados da listagem padrão.
4. Arquivos excluídos logicamente não podem ser baixados.
5. O sistema deve validar tipos de arquivo permitidos.
6. O sistema deve limitar o tamanho máximo de upload.
7. Arquivos podem estar vinculados a uma pasta ou à raiz.
8. Pastas podem ter subpastas.
9. Não permitir duplicidade de nome de pasta no mesmo nível para o mesmo usuário.
10. O sistema não deve possuir dashboard na primeira versão.
11. O sistema não deve implementar funcionalidades fora do MVP.

## 9. Critérios de Aceite Funcionais

O MVP será considerado funcional quando:

1. O usuário conseguir se cadastrar.
2. O usuário conseguir fazer login.
3. O usuário conseguir acessar a tela principal após login.
4. O usuário conseguir criar uma pasta.
5. O usuário conseguir listar suas pastas.
6. O usuário conseguir enviar um arquivo.
7. O usuário conseguir listar seus arquivos.
8. O usuário conseguir pesquisar arquivos por nome.
9. O usuário conseguir baixar um arquivo.
10. O usuário conseguir excluir logicamente um arquivo.
11. O arquivo excluído deixar de aparecer na listagem.
12. O usuário conseguir fazer logout.
13. O sistema funcionar sem dashboard.

## 10. Fluxo de Demonstração

Durante a apresentação, o sistema deve demonstrar o seguinte fluxo:

1. Usuário acessa a tela de cadastro.
2. Usuário cria uma conta.
3. Usuário faz login.
4. Usuário acessa a tela principal de arquivos.
5. Usuário cria uma pasta.
6. Usuário faz upload de um arquivo.
7. Usuário visualiza o arquivo na listagem.
8. Usuário pesquisa o arquivo pelo nome.
9. Usuário faz download do arquivo.
10. Usuário exclui logicamente o arquivo.
11. Sistema remove o arquivo da listagem.
12. Usuário faz logout.

Não demonstrar dashboard, pois essa funcionalidade não faz parte da primeira versão.

## 11. Diretriz Final do MVP

O fluxo principal obrigatório é:

1. Usuário se cadastra.
2. Usuário faz login.
3. Usuário cria uma pasta.
4. Usuário envia um arquivo.
5. Frontend lista o arquivo.
6. Usuário pesquisa o arquivo por nome.
7. Usuário baixa o arquivo.
8. Usuário exclui logicamente o arquivo.
9. Usuário faz logout.

Qualquer funcionalidade que não contribua diretamente para esse fluxo deve ficar fora do MVP inicial.

A IA não deve adicionar funcionalidades extras por conta própria.

A IA não deve criar dashboard.

A IA não deve criar cards estatísticos.

A IA não deve criar gráficos.

A IA não deve implementar permissões avançadas.

A IA não deve implementar compartilhamento de arquivos.
