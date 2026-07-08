# Evolução Frontend — Telas de Login e Cadastro

O projeto Drive Corporativo já possui MVP inicial com frontend React + Vite e backend Spring Boot.

O objetivo desta tarefa é melhorar visualmente apenas as telas de Login e Cadastro, mantendo a lógica existente de autenticação.

## Regras Gerais

* Não alterar endpoints do backend.
* Não alterar regras de autenticação.
* Não remover validações existentes.
* Não quebrar o fluxo atual de login e cadastro.
* Não reescrever o projeto inteiro.
* Fazer apenas melhorias visuais e pequenos ajustes de usabilidade.

## Objetivo Visual

As telas devem ter aparência mais moderna, limpa e coerente com um sistema de arquivos corporativo.

Usar estilo inspirado em aplicações como Google Drive, OneDrive e sistemas SaaS corporativos.

## Telas a Melhorar

### Login

A tela de login deve conter:

* Nome do sistema: Drive Corporativo
* Subtítulo curto
* Campo de e-mail
* Campo de senha
* Botão de entrar
* Link para cadastro
* Mensagens de erro bem posicionadas
* Estado de carregamento no botão

Texto sugerido:

```txt
Acesse seus arquivos corporativos com segurança.
```

### Cadastro

A tela de cadastro deve conter:

* Nome do sistema
* Subtítulo curto
* Campo de nome
* Campo de e-mail
* Campo de senha
* Campo de confirmação de senha, se ainda não existir
* Botão de criar conta
* Link para login
* Mensagens de erro e sucesso
* Estado de carregamento no botão

Texto sugerido:

```txt
Crie sua conta para organizar e acessar seus documentos.
```

## Layout Esperado

Criar um layout dividido em duas áreas:

### Área esquerda

Painel visual com:

* Nome do projeto
* Ícone ou ilustração simples relacionada a arquivos, nuvem ou pasta
* Frase institucional curta
* Fundo com gradiente suave

Exemplo de frase:

```txt
Organize, armazene e acesse documentos da sua equipe em um só lugar.
```

### Área direita

Card centralizado contendo o formulário.

O card deve ter:

* Fundo branco
* Bordas arredondadas
* Sombra leve
* Espaçamento interno adequado
* Largura máxima controlada
* Campos bem alinhados

## Estilo Visual

Utilizar uma paleta simples:

```txt
Verde principal: #0F9D58
Azul secundário: #4285F4
Fundo claro: #F8F9FA
Texto principal: #202124
Texto secundário: #5F6368
```

Aplicar:

* Border-radius entre 10px e 16px
* Botões arredondados
* Hover nos botões
* Transições suaves
* Inputs com foco destacado
* Responsividade para telas menores

## Componentização

Criar ou ajustar componentes reutilizáveis, se fizer sentido:

* AuthLayout
* InputField
* AuthCard
* LoadingButton

Evitar excesso de abstração. O código deve continuar simples.

## Responsividade

Em telas grandes:

* Exibir painel visual à esquerda
* Formulário à direita

Em telas pequenas:

* Ocultar ou reduzir o painel visual
* Centralizar formulário
* Manter boa leitura em mobile

## Validações Visuais

Exibir mensagens claras para:

* Campos obrigatórios
* E-mail inválido
* Senha inválida
* Senhas divergentes
* Erro de login
* Cadastro realizado com sucesso

## Restrições

Não usar bibliotecas pesadas de UI.

Permitido usar:

* Bootstrap
* React Icons
* CSS Modules ou CSS comum

Não usar:

* Material UI
* Ant Design
* PrimeReact

## Critérios de Aceite

A tarefa será considerada concluída quando:

* Tela de login estiver visualmente mais moderna.
* Tela de cadastro estiver visualmente mais moderna.
* Fluxo de autenticação continuar funcionando.
* O usuário conseguir fazer login normalmente.
* O usuário conseguir criar conta normalmente.
* As telas estiverem responsivas.
* Mensagens de erro e sucesso forem exibidas corretamente.
* Nenhum endpoint do backend for alterado.
* Nenhuma funcionalidade existente for removida.