Você é um agente de desenvolvimento atuando dentro da minha IDE.

Existe um arquivo chamado `spec.md` na raiz do projeto. Leia esse arquivo inteiro antes de alterar qualquer arquivo.

Sua tarefa agora NÃO é recriar o projeto.

Sua tarefa é alterar exclusivamente o diretório de armazenamento físico dos arquivos do sistema Drive Corporativo.

Atualmente, o MVP está criando arquivos, pastas e diretórios dentro de:

```txt
a_code/a_backend/storage/DriveCorporate/
```

O novo diretório obrigatório deve ser:

```txt
c_storage/DriveCorporate/
```

O objetivo é tirar o storage de dentro do backend e centralizar os arquivos em um diretório próprio na raiz do projeto.

====================================================================
OBJETIVO DA ALTERAÇÃO
=====================

Alterar o projeto para que todos os novos arquivos enviados pelo usuário sejam salvos fisicamente em:

```txt
c_storage/DriveCorporate/
```

A estrutura final esperada deve ser semelhante a:

```txt
c_storage
└── DriveCorporate
    └── {userId}
        └── {uuid.extensao}
```

Exemplo:

```txt
c_storage/DriveCorporate/1/9f4c7a2e-4d3f-4f9c-a5e1-221d6c61b9aa.pdf
```

Não salvar mais arquivos em:

```txt
a_code/a_backend/storage/DriveCorporate/
```

====================================================================
REGRAS GERAIS
=============

Antes de alterar qualquer coisa:

1. Leia `spec.md`.
2. Analise a estrutura atual do projeto.
3. Localize onde o storage está configurado atualmente.
4. Localize onde o backend cria diretórios.
5. Localize onde o backend salva arquivos físicos.
6. Localize scripts shell que criam diretórios de storage.
7. Localize arquivos README que mencionam o caminho antigo.
8. Localize `.gitignore`, se existir.
9. Preserve todas as funcionalidades existentes.
10. Não recrie o projeto.
11. Não altere endpoints.
12. Não altere entidades sem necessidade.
13. Não altere DTOs.
14. Não altere regras de autenticação.
15. Não altere regras de upload além do caminho de armazenamento.
16. Não altere frontend, salvo se houver referência direta ao caminho antigo.
17. Não implemente dashboard.
18. Não implemente funcionalidades novas.
19. Não apague arquivos existentes automaticamente.
20. Não exponha `storagePath` na API.

A tarefa é somente alterar o local físico de armazenamento.

====================================================================
CAMINHO ANTIGO
==============

Procure referências ao caminho antigo em todo o projeto.

Possíveis variações:

```txt
a_code/a_backend/storage/DriveCorporate
storage/DriveCorporate
storage/drive-corporativo
./storage/DriveCorporate
./storage/drive-corporativo
backend/storage/DriveCorporate
a_backend/storage/DriveCorporate
```

Substitua apenas as referências relacionadas ao storage físico do MVP.

Não substitua textos históricos ou exemplos se não fizer sentido, exceto README e documentação operacional.

====================================================================
CAMINHO NOVO
============

O novo caminho padrão deve ser:

```txt
c_storage/DriveCorporate
```

Preferencialmente, o caminho deve continuar configurável por variável de ambiente.

Use uma configuração semelhante a:

```yaml
app:
  storage:
    path: ${STORAGE_PATH:../../c_storage/DriveCorporate}
```

Atenção:

Se o backend normalmente é executado a partir do diretório:

```txt
a_code/a_backend
```

então o caminho relativo correto para chegar na raiz do projeto e acessar `c_storage/DriveCorporate` provavelmente será:

```txt
../../c_storage/DriveCorporate
```

Antes de aplicar, verifique a estrutura real do projeto.

Se o backend for executado a partir da raiz do projeto, o caminho correto pode ser:

```txt
c_storage/DriveCorporate
```

Escolha o caminho padrão compatível com a forma real como o backend é iniciado pelos scripts e pelo README.

Se houver dúvida, priorize uma solução configurável por variável de ambiente:

```txt
STORAGE_PATH
```

E documente como ajustar manualmente.

====================================================================
BACKEND — ALTERAÇÕES NECESSÁRIAS
================================

Localize e ajuste a configuração de storage no backend.

Arquivos prováveis:

```txt
a_code/a_backend/src/main/resources/application.yml
a_code/a_backend/src/main/resources/application-dev.yml
a_code/a_backend/src/main/resources/application-prod.yml
```

Ou equivalente conforme a estrutura real.

Ajuste para que o backend use o novo caminho:

```txt
c_storage/DriveCorporate
```

ou, quando executado de dentro de `a_code/a_backend`:

```txt
../../c_storage/DriveCorporate
```

O backend deve:

1. Ler o caminho de storage a partir da configuração.
2. Permitir sobrescrita por variável de ambiente `STORAGE_PATH`.
3. Criar o diretório automaticamente se ele não existir.
4. Criar subdiretório por usuário, se essa regra já existir.
5. Salvar novos uploads no novo caminho.
6. Continuar salvando metadados no MySQL normalmente.
7. Não expor caminho físico nas respostas da API.
8. Não alterar regra de geração de UUID.
9. Não alterar validação de extensão.
10. Não alterar limite de upload.

====================================================================
BACKEND — STORAGE SERVICE
=========================

Localize a classe responsável por armazenamento físico.

Possíveis nomes:

```txt
StorageService.java
FileStorageService.java
FileService.java
UploadService.java
```

Verifique se existe algum caminho fixo no código.

Se houver caminho hardcoded como:

```java
"a_code/a_backend/storage/DriveCorporate"
"storage/DriveCorporate"
"./storage/DriveCorporate"
```

substitua por leitura da configuração centralizada.

Regra obrigatória:

Não deixar caminho fixo espalhado no código.

O caminho deve vir de uma configuração única, como:

```java
@Value("${app.storage.path}")
private String storagePath;
```

ou classe de properties equivalente, como:

```java
StorageProperties
```

Se já existir `StorageProperties`, reutilize.

Não crie configuração duplicada.

====================================================================
CRIAÇÃO DO DIRETÓRIO
====================

O backend deve garantir que o diretório novo exista.

Ao iniciar ou antes de salvar arquivo, criar:

```txt
c_storage/DriveCorporate
```

e, se aplicável:

```txt
c_storage/DriveCorporate/{userId}
```

Não falhar se o diretório já existir.

Não apagar conteúdo existente.

Não recriar diretórios desnecessariamente.

Não usar `rm -rf`.

====================================================================
SCRIPTS SHELL
=============

Procure scripts shell que criam storage.

Possíveis arquivos:

```txt
scripts/dev-start.sh
scripts/dev-stop.sh
scripts/dev-status.sh
deploy/aws/aws-build.sh
deploy/aws/aws-start-backend.sh
```

Atualize qualquer referência antiga para o novo caminho.

O script local deve criar:

```bash
mkdir -p c_storage/DriveCorporate
```

Se o script executa o backend de dentro de `a_code/a_backend`, ele deve exportar:

```bash
export STORAGE_PATH="../../c_storage/DriveCorporate"
```

ou usar o caminho absoluto calculado a partir da raiz do projeto.

Preferência técnica:

Use caminho absoluto no script para evitar erro de diretório de execução.

Exemplo lógico:

```bash
PROJECT_ROOT="$(pwd)"
export STORAGE_PATH="$PROJECT_ROOT/c_storage/DriveCorporate"
```

Depois disso, iniciar o backend.

Não usar caminho relativo frágil se o script já conhece a raiz do projeto.

====================================================================
AWS / DEPLOY
============

Se existir configuração de AWS ou produção, preserve o caminho próprio de produção quando fizer sentido.

Exemplo:

```txt
/opt/drive-corporativo/storage
```

Não substitua automaticamente storage de produção por `c_storage/DriveCorporate` se o arquivo for claramente de deploy AWS.

Mas atualize documentação local para deixar claro que, no MVP local, o storage fica em:

```txt
c_storage/DriveCorporate
```

Regra:

1. Ambiente local: `c_storage/DriveCorporate`.
2. Ambiente AWS/produção simples: pode continuar usando `/opt/drive-corporativo/storage`, se já estiver documentado assim.
3. Não quebrar profiles existentes.

====================================================================
README E DOCUMENTAÇÃO
=====================

Atualize o README principal e qualquer documentação local que mencione o caminho antigo.

Substituir:

```txt
a_code/a_backend/storage/DriveCorporate
```

por:

```txt
c_storage/DriveCorporate
```

Adicionar uma explicação curta:

```txt
Os arquivos enviados pelo sistema são armazenados localmente em `c_storage/DriveCorporate`, fora do diretório do backend, para separar código-fonte e arquivos de usuário.
```

Também documentar que o diretório é criado automaticamente pelo backend ou pelos scripts de execução.

Se houver seção de execução local, atualizar para incluir:

```bash
mkdir -p c_storage/DriveCorporate
```

====================================================================
GITIGNORE
=========

Se existir `.gitignore`, ajuste para ignorar o novo diretório de storage.

Adicionar:

```txt
c_storage/
```

ou, se preferir ser mais específico:

```txt
c_storage/DriveCorporate/
```

Também garanta que arquivos enviados pelos usuários não sejam versionados.

Não remova regras úteis existentes.

Se o `.gitignore` já ignora o caminho antigo, pode manter a regra antiga por segurança, mas adicione o novo caminho.

Exemplo:

```txt
# Arquivos enviados pelos usuários durante execução local
c_storage/
a_code/a_backend/storage/
```

====================================================================
MIGRAÇÃO DE ARQUIVOS EXISTENTES
===============================

Não mover arquivos automaticamente sem confirmação.

Mas crie, se fizer sentido, um script opcional de migração:

```txt
scripts/migrate-storage.sh
```

Esse script deve mover/copiar arquivos do caminho antigo para o novo caminho apenas quando executado manualmente.

Comportamento recomendado:

1. Verificar se o diretório antigo existe.
2. Criar o diretório novo.
3. Copiar arquivos preservando estrutura.
4. Não apagar o diretório antigo automaticamente.
5. Exibir mensagem orientando o usuário a validar antes de remover o antigo.

Exemplo de lógica:

```bash
OLD_STORAGE="a_code/a_backend/storage/DriveCorporate"
NEW_STORAGE="c_storage/DriveCorporate"

mkdir -p "$NEW_STORAGE"

if [ -d "$OLD_STORAGE" ]; then
  cp -a "$OLD_STORAGE/." "$NEW_STORAGE/"
  echo "Arquivos copiados para $NEW_STORAGE."
  echo "Valide o sistema antes de remover o diretório antigo."
else
  echo "Diretório antigo não encontrado."
fi
```

Se criar esse script, documente no README que ele é opcional.

Não executar a migração automaticamente.

====================================================================
TESTES / VALIDAÇÃO
==================

Depois de alterar o caminho:

1. Compile o backend.
2. Verifique se o backend inicia.
3. Verifique se o diretório novo é criado.
4. Verifique se o upload salva arquivo em `c_storage/DriveCorporate`.
5. Verifique se o banco continua salvando metadados.
6. Verifique se o download continua funcionando para arquivos novos.
7. Verifique se a exclusão lógica continua funcionando.
8. Verifique se nenhum arquivo novo é salvo em `a_code/a_backend/storage/DriveCorporate`.

Comandos sugeridos:

```bash
cd a_code/a_backend
mvn compile
```

Se houver script de start:

```bash
bash scripts/dev-start.sh
```

Ajuste os comandos conforme a estrutura real do projeto.

====================================================================
O QUE NÃO FAZER
===============

Não fazer:

1. Não recriar o projeto.
2. Não alterar endpoints.
3. Não alterar regras de autenticação.
4. Não alterar entidades desnecessariamente.
5. Não alterar DTOs.
6. Não alterar regras de upload além do caminho físico.
7. Não alterar validação de arquivos.
8. Não alterar limite de upload.
9. Não alterar frontend sem necessidade.
10. Não apagar arquivos do storage antigo.
11. Não mover arquivos automaticamente sem script opcional.
12. Não expor `storagePath` na API.
13. Não versionar arquivos enviados.
14. Não criar dashboard.
15. Não adicionar funcionalidades novas.

====================================================================
CRITÉRIOS DE ACEITE
===================

A alteração será considerada concluída quando:

1. O caminho padrão de storage local for `c_storage/DriveCorporate`.
2. O backend não salvar mais novos arquivos em `a_code/a_backend/storage/DriveCorporate`.
3. O backend criar `c_storage/DriveCorporate` se não existir.
4. Upload continuar funcionando.
5. Download continuar funcionando para arquivos novos.
6. Exclusão lógica continuar funcionando.
7. Metadados continuarem sendo salvos no MySQL.
8. O caminho estiver configurável por `STORAGE_PATH`.
9. Scripts locais criarem o novo diretório.
10. README mencionar o novo diretório.
11. `.gitignore` ignorar o novo storage.
12. Nenhuma funcionalidade fora do escopo ser alterada.
13. Backend compilar sem erros.
14. Nenhum arquivo existente ser apagado automaticamente.

====================================================================
ORDEM DE EXECUÇÃO
=================

Execute nesta ordem:

1. Leia `spec.md`.
2. Analise a estrutura do projeto.
3. Localize o caminho antigo no código e documentação.
4. Localize a configuração atual de storage.
5. Ajuste a configuração para `c_storage/DriveCorporate`.
6. Garanta suporte à variável `STORAGE_PATH`.
7. Ajuste o service de storage se houver caminho hardcoded.
8. Ajuste scripts shell de execução local.
9. Ajuste README e documentação.
10. Ajuste `.gitignore`.
11. Crie script opcional de migração apenas se fizer sentido.
12. Compile o backend.
13. Corrija erros causados pela alteração.
14. Entregue resumo final.

====================================================================
RESUMO FINAL ESPERADO
=====================

Ao terminar, informe:

1. Arquivos alterados.
2. Arquivos criados, se houver.
3. Caminho antigo encontrado.
4. Caminho novo configurado.
5. Como sobrescrever o caminho com `STORAGE_PATH`.
6. Como testar upload no novo diretório.
7. Como migrar arquivos antigos, se script opcional foi criado.
8. Resultado da compilação do backend.
9. Pendências, caso existam.

Execute agora apenas a alteração do diretório de armazenamento para `c_storage/DriveCorporate`.
