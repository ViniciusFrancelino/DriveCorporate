Você é um agente de desenvolvimento atuando dentro da minha IDE.

Sua tarefa é revisar toda a documentação existente no projeto e atualizá-la para refletir fielmente o estado atual do código-fonte.

Este prompt deve ser executado sempre que o sistema receber novas alterações e a documentação puder estar desatualizada.

====================================================================
OBJETIVO PRINCIPAL
==================

Ler o projeto inteiro, identificar toda documentação existente e atualizar o que for necessário para que a documentação fique coerente com o código atual.

A documentação deve refletir o sistema como ele está agora, não como ele era em versões anteriores.

Se houver divergência entre documentação antiga e código atual, considere o código atual como fonte principal de verdade, exceto quando existir uma regra explícita em `spec.md` que ainda seja válida e esteja sendo violada pelo código.

====================================================================
FONTES DE ANÁLISE
=================

Analise obrigatoriamente:

1. `spec.md`, se existir.
2. `README.md`, se existir.
3. Documentações dentro de `docs/`, se existir.
4. Documentações dentro de `backend/`, se existir.
5. Documentações dentro de `frontend/`, se existir.
6. Documentações dentro de `deploy/`, se existir.
7. Comentários relevantes no código.
8. Scripts de execução.
9. Arquivos de configuração.
10. Estrutura real de diretórios.
11. Endpoints implementados.
12. Telas implementadas.
13. Services do frontend.
14. Controllers, services, repositories, entities e DTOs do backend.

Não documente com base em suposição genérica.

Documente apenas o que existir no projeto.

====================================================================
REGRA OBRIGATÓRIA DE DOCUMENTAÇÃO
=================================

Sempre que este prompt for executado, você deve criar ou atualizar a documentação do projeto.

A documentação deve ser atualizada mesmo que as alterações sejam pequenas.

Se nenhuma mudança documental for necessária, informe explicitamente que a documentação foi revisada e que não foram encontradas divergências relevantes.

Nunca finalize sem revisar a documentação.

====================================================================
ESCOPO DA TAREFA
================

Você deve:

1. Ler a estrutura atual do projeto.
2. Identificar quais funcionalidades existem hoje.
3. Identificar quais funcionalidades foram removidas, alteradas ou adicionadas.
4. Identificar novos caminhos, diretórios e configurações.
5. Atualizar documentação desatualizada.
6. Corrigir comandos de execução que não refletem mais a estrutura atual.
7. Corrigir paths antigos.
8. Corrigir nomes antigos de diretórios.
9. Corrigir endpoints documentados incorretamente.
10. Corrigir telas documentadas incorretamente.
11. Corrigir variáveis de ambiente documentadas incorretamente.
12. Corrigir instruções de execução local.
13. Corrigir instruções de execução em AWS, se existirem.
14. Corrigir instruções de scripts shell, se existirem.
15. Corrigir lista de funcionalidades do MVP.
16. Corrigir lista de funcionalidades fora do MVP.
17. Corrigir estrutura do projeto documentada.
18. Corrigir documentação de storage.
19. Corrigir documentação de autenticação.
20. Corrigir documentação de favoritos.
21. Corrigir documentação de configurações do usuário.
22. Corrigir documentação de deleção de conta, se existir.
23. Corrigir documentação de KPIs, se existir.

====================================================================
REGRAS GERAIS
=============

Antes de alterar qualquer arquivo:

1. Leia `spec.md`, se existir.
2. Leia os READMEs existentes.
3. Leia a documentação dentro de `docs/`, se existir.
4. Analise a estrutura real do projeto.
5. Analise o backend.
6. Analise o frontend.
7. Analise scripts.
8. Analise arquivos de deploy.
9. Compare documentação atual com código atual.
10. Faça alterações apenas na documentação, salvo quando for necessário criar arquivos documentais.

Não altere código-fonte de aplicação.

Não altere regras de negócio.

Não altere endpoints.

Não altere entidades.

Não altere telas.

Não altere services.

Não altere scripts, exceto se a tarefa documental exigir apenas comentários ou correção de instruções dentro de arquivos `.md`.

Não altere arquivos de configuração, salvo se forem exemplos documentais como `.env.example`.

====================================================================
ARQUIVOS QUE PODEM SER ALTERADOS
================================

Você pode criar ou atualizar:

```txt
README.md
docs/*.md
backend/README.md
frontend/README.md
deploy/**/*.md
.env.example
.env.production.example
.env.aws.example
```

Você também pode criar documentação nova, se fizer sentido:

```txt
docs/arquitetura.md
docs/backend.md
docs/frontend.md
docs/api.md
docs/storage.md
docs/deploy-aws.md
docs/execucao-local.md
docs/funcionalidades.md
docs/estrutura-projeto.md
```

Mas não crie documentação excessiva sem necessidade.

Se o projeto já tiver um padrão documental, siga o padrão existente.

====================================================================
ARQUIVOS QUE NÃO DEVEM SER ALTERADOS
====================================

Não altere, exceto se houver autorização explícita:

```txt
src/
backend/src/
frontend/src/
pom.xml
package.json
package-lock.json
vite.config.*
docker-compose.yml
scripts/*.sh
deploy/*.sh
```

Exceção:

Se existirem comentários de documentação claramente errados dentro de código ou scripts, você pode atualizar comentários, mas não altere comportamento.

====================================================================
ATUALIZAÇÃO DE PATHS
====================

Verifique cuidadosamente paths antigos e novos.

Procure referências documentais a caminhos como:

```txt
storage/DriveCorporate
storage/drive-corporativo
a_code/a_backend/storage/DriveCorporate
a_backend/storage/DriveCorporate
backend/storage/DriveCorporate
```

Se o projeto atual usa:

```txt
c_storage/DriveCorporate
```

atualize a documentação para esse novo caminho.

Documente claramente:

1. Onde os arquivos são salvos atualmente.
2. Se o caminho é configurável por variável de ambiente.
3. Qual variável controla o storage, se existir.
4. Se o diretório é criado automaticamente.
5. Se arquivos antigos precisam de migração manual.

Não invente migração se ela não existir.

Se existir script de migração, documente como usar.

====================================================================
DOCUMENTAÇÃO DE BACKEND
=======================

Atualize a documentação do backend com base no código real.

Verifique e documente:

1. Versão Java esperada.
2. Uso de Maven.
3. Porta padrão.
4. Profiles existentes.
5. Configurações do `application.yml`.
6. Variáveis de ambiente.
7. Banco de dados.
8. Storage.
9. Autenticação JWT.
10. Controllers existentes.
11. Endpoints existentes.
12. DTOs relevantes.
13. Regras de segurança.
14. Regras de upload.
15. Regras de favoritos.
16. Regras de configurações do usuário.
17. Regras de deleção de conta, se existir.
18. Regras de KPIs, se existir.

Não documente endpoints que não existem.

Não documente funcionalidades não implementadas.

====================================================================
DOCUMENTAÇÃO DE FRONTEND
========================

Atualize a documentação do frontend com base no código real.

Verifique e documente:

1. React.
2. Vite.
3. Axios.
4. React Router.
5. Bootstrap ou biblioteca visual realmente usada.
6. Variáveis de ambiente usadas pelo frontend.
7. Rotas públicas.
8. Rotas privadas.
9. Telas implementadas.
10. Services existentes.
11. Fluxo de autenticação.
12. Armazenamento do token.
13. Tela de arquivos.
14. Tela de favoritos.
15. Tela de configurações.
16. KPIs exibidos, se existirem.
17. Menus de três pontos, se existirem.
18. Comandos de execução.
19. Comandos de build.

Não documente telas que não existem.

Não documente dashboard se ele não existir.

====================================================================
DOCUMENTAÇÃO DE API
===================

Crie ou atualize documentação de API se existir `docs/api.md` ou seção equivalente.

Documente apenas endpoints implementados no código.

Para cada endpoint, sempre que possível, documente:

1. Método HTTP.
2. Path.
3. Autenticação exigida ou não.
4. Request body.
5. Query params.
6. Response esperado.
7. Regras relevantes.
8. Códigos de erro comuns.

Exemplo de formato:

````md
### POST /api/auth/login

Autenticação: pública.

Descrição:
Realiza login do usuário e retorna token JWT.

Request:
```json
{
  "email": "usuario@email.com",
  "password": "123456"
}
````

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "Usuário",
    "email": "usuario@email.com"
  }
}
```

````

Não invente payloads se o código mostrar outro formato.

====================================================================
DOCUMENTAÇÃO DE EXECUÇÃO LOCAL
====================================================================

Atualize a documentação de execução local.

Verifique comandos reais para:

1. Subir banco.
2. Subir backend.
3. Subir frontend.
4. Parar ambiente.
5. Ver status.
6. Rodar scripts shell.
7. Configurar storage.
8. Configurar variáveis de ambiente.

Se existirem scripts, documente os scripts reais.

Exemplos possíveis:

```bash
bash scripts/dev-start.sh
bash scripts/dev-stop.sh
bash scripts/dev-status.sh
````

Mas só documente se os scripts existirem.

====================================================================
DOCUMENTAÇÃO DE AWS / DEPLOY
============================

Se existir diretório `deploy/aws`, revise a documentação de AWS.

Atualize:

1. Pré-requisitos.
2. Variáveis de ambiente.
3. Build do backend.
4. Build do frontend.
5. Configuração do Nginx.
6. Porta pública.
7. IP público.
8. Storage em produção.
9. MySQL local.
10. Scripts AWS.
11. Logs.
12. Limitações da demonstração.

Não adicione instruções de AWS se o projeto não tiver arquivos relacionados e isso não for necessário.

====================================================================
DOCUMENTAÇÃO DE FUNCIONALIDADES
===============================

Atualize a lista de funcionalidades atuais.

Verifique se existem e documente somente se implementadas:

1. Cadastro.
2. Login.
3. Logout.
4. Upload.
5. Download.
6. Listagem de arquivos.
7. Criação/listagem de pastas.
8. Busca.
9. Exclusão lógica.
10. Favoritos de arquivos.
11. Favoritos de pastas.
12. Tela de favoritos.
13. Configurações do usuário.
14. Alteração de nome.
15. Alteração de e-mail.
16. Alteração de senha.
17. Deleção/desativação de conta.
18. KPIs do usuário.
19. Scripts de execução local.
20. Deploy AWS.

Não documente funcionalidades planejadas como existentes.

Se quiser citar funcionalidades futuras, coloque em seção separada chamada:

```md
## Fora do MVP atual
```

====================================================================
PADRÃO DE ESCRITA
=================

A documentação deve estar em português do Brasil.

Use linguagem técnica, direta e objetiva.

Evite textos genéricos.

Evite prometer funcionalidades que não existem.

Evite excesso de teoria.

Use exemplos práticos de comandos.

Use caminhos reais do projeto.

Use nomes reais de arquivos.

Use nomes reais de endpoints.

Use nomes reais de variáveis de ambiente.

====================================================================
REGRAS DE CONSISTÊNCIA
======================

Garanta que não existam contradições como:

1. README aponta storage antigo e código usa storage novo.
2. API documentada não existe no controller.
3. Frontend documenta rota que não existe.
4. Deploy documenta porta diferente da configurada.
5. Script documentado não existe.
6. Variável de ambiente documentada não é usada.
7. Tecnologia documentada não está no projeto.
8. Funcionalidade descrita como pronta, mas não existe no código.
9. Dashboard documentado mesmo tendo sido removido do MVP.
10. Docker descrito como obrigatório quando não é.

====================================================================
SAÍDA ESPERADA
==============

Ao final, entregue um resumo com:

1. Documentos analisados.
2. Documentos criados.
3. Documentos atualizados.
4. Principais inconsistências encontradas.
5. Principais correções feitas.
6. Funcionalidades documentadas.
7. Paths atualizados.
8. Endpoints revisados.
9. Instruções de execução revisadas.
10. Pontos que ainda precisam de validação manual, se houver.

====================================================================
CRITÉRIOS DE ACEITE
===================

A tarefa será considerada concluída quando:

1. Toda documentação existente tiver sido revisada.
2. READMEs estiverem coerentes com o código atual.
3. Paths antigos forem corrigidos.
4. Endpoints documentados existirem no código.
5. Telas documentadas existirem no frontend.
6. Scripts documentados existirem no projeto.
7. Storage atual estiver documentado corretamente.
8. Variáveis de ambiente atuais estiverem documentadas.
9. Instruções de execução local estiverem atualizadas.
10. Documentação AWS estiver atualizada, se existir.
11. Funcionalidades atuais estiverem descritas corretamente.
12. Funcionalidades inexistentes não forem apresentadas como implementadas.
13. O texto estiver em português do Brasil.
14. Nenhum código de aplicação tiver sido alterado indevidamente.

====================================================================
ORDEM DE EXECUÇÃO
=================

Execute nesta ordem:

1. Leia `spec.md`, se existir.
2. Mapeie a estrutura atual do projeto.
3. Localize todos os arquivos `.md`.
4. Leia os READMEs existentes.
5. Analise backend.
6. Analise frontend.
7. Analise scripts.
8. Analise deploy.
9. Compare documentação com código.
10. Atualize README principal.
11. Atualize documentações específicas.
12. Crie documentação nova apenas se necessário.
13. Atualize exemplos de `.env`, se necessário.
14. Revise se ainda existem referências antigas.
15. Entregue resumo final.

Execute agora a revisão e atualização da documentação do projeto.
