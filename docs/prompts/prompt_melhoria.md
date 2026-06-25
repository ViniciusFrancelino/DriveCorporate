# Evolução do MVP - Drive Corporativo

O projeto já possui um MVP funcional.

O objetivo desta tarefa é **evoluir o sistema existente**, preservando toda a lógica implementada e realizando apenas melhorias e complementações.

## Regras Gerais

* NÃO remover funcionalidades existentes.
* NÃO alterar APIs já implementadas sem necessidade.
* NÃO quebrar compatibilidade com o banco de dados atual.
* Priorizar simplicidade.
* O resultado deve permanecer um MVP funcional.
* Todas as melhorias devem ser completamente integradas ao backend e frontend.

---

# 1. Modernização do Frontend

## Objetivo

Transformar a interface atual em uma experiência semelhante ao Google Drive, porém simplificada.

## Tecnologias

Continuar utilizando:

* React
* Vite
* Bootstrap

É permitido utilizar:

* react-icons
* react-dropzone

Não utilizar bibliotecas pesadas de componentes.

Exemplos:

Não utilizar:

* Material UI
* PrimeReact
* Ant Design

## Layout esperado

### Sidebar esquerda

Itens:

Arquivos

Recentes

Favoritos (placeholder)

Lixeira

Configurações (placeholder)

Botão:

* Novo

---

### Barra superior

Campo de busca centralizado

Usuário logado

Botão Logout

Indicador de espaço utilizado

---

### Área principal

Breadcrumbs

Lista de pastas

Lista de arquivos

Visual semelhante ao Google Drive.

Exemplo:

Home > Projetos > Cliente XPTO

---

## Cards de pastas

Cada pasta deve possuir:

Ícone

Nome

Quantidade de arquivos

Menu de ações

Exemplo:

Renomear

Excluir

---

## Tabela de arquivos

Colunas:

Nome

Tipo

Tamanho

Pasta

Data Upload

Ações

Ações:

Download

Excluir

Detalhes

---

## Upload melhorado

Substituir upload simples.

Adicionar:

Drag and Drop

Área pontilhada

Indicador de progresso

Feedback visual

Exemplo:

Arraste arquivos aqui

ou clique para selecionar

---

# 2. Exclusão de Pastas

## Objetivo

Permitir remover pastas criadas.

### Regra de negócio

Se a pasta estiver vazia:

Excluir normalmente.

Se possuir arquivos:

Exibir mensagem:

"A pasta contém arquivos. Deseja excluir mesmo assim?"

Opções:

Cancelar

Excluir Tudo

Caso confirme:

Arquivos são movidos para lixeira lógica.

Pasta removida.

---

## Backend

Criar endpoint:

DELETE /api/folders/{id}

Implementar validações.

Atualizar repositórios.

Atualizar serviços.

Atualizar controllers.

---

# 3. Exibir pasta do arquivo

Atualmente os arquivos não indicam onde estão armazenados.

Isso deve ser melhorado.

## Requisitos

Ao listar arquivos mostrar:

Nome

Pasta

Tipo

Tamanho

Data Upload

Exemplo:

Contrato.pdf

Projetos

PDF

2 MB

---

## Backend

A resposta da API deve retornar:

folderId

folderName

Exemplo:

{
"id":1,
"name":"Contrato.pdf",
"folderId":5,
"folderName":"Projetos"
}

---

# 4. Navegação semelhante ao Google Drive

## Objetivo

Permitir navegação entre diretórios.

Atualmente a navegação é limitada.

---

## Comportamento esperado

Ao clicar em uma pasta:

Entrar nela.

Atualizar URL.

Exemplo:

/drive

/drive/3

/drive/3/7

/drive/3/7/12

---

## Breadcrumbs

Exemplo:

Home

Projetos

Cliente XPTO

Documentos

Cada item deve ser clicável.

---

## Backend

Criar endpoint:

GET /api/folders/{id}/contents

Resposta:

{
"folder":{},

"subFolders":[],

"files":[]

}

---

## Frontend

Ao abrir pasta:

Atualizar estado.

Atualizar breadcrumbs.

Buscar novos conteúdos.

Não recarregar página.

---

# 5. Melhorias Visuais

Utilizar paleta semelhante ao Google Drive.

Cor principal:

#0F9D58

Secundária:

#4285F4

Background:

#F8F9FA

Cards:

Brancos

Sombras leves.

Border-radius:

12px

Botões arredondados.

Hover em pastas.

Hover em arquivos.

Animações sutis.

Spinner durante carregamento.

Toast de sucesso.

Toast de erro.

---

# Critério de Aceite

A implementação será considerada concluída quando:

* O frontend possuir aparência moderna semelhante a um Drive.
* O usuário puder navegar por pastas utilizando breadcrumbs.
* O usuário puder excluir pastas.
* Arquivos exibirem a pasta onde estão armazenados.
* O upload possuir drag-and-drop.
* A navegação entre pastas ocorrer sem recarregar a página.
* O sistema permanecer compatível com o MVP já implementado.
* Não devem existir regressões nas funcionalidades atuais.
