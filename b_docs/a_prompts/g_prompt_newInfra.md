Você é um agente de desenvolvimento atuando dentro da minha IDE.

Existe um arquivo chamado `spec.md` na raiz do projeto. Leia esse arquivo inteiro antes de criar ou alterar qualquer arquivo.

Sua tarefa agora NÃO é recriar o projeto inteiro.

Sua tarefa é criar scripts shell para facilitar a execução local do sistema Drive Corporativo no Linux Debian dentro do WSL.

O objetivo é permitir que eu suba rapidamente:

1. Banco de dados MySQL.
2. Backend Spring Boot.
3. Frontend React/Vite.
4. Diretório de storage local.

Use Docker apenas para o banco de dados MySQL, caso seja necessário ou mais prático.

Não conteinerize backend e frontend neste momento.

====================================================================
OBJETIVO PRINCIPAL
==================

Criar um script principal:

```txt
scripts/dev-start.sh
```

Esse script deve:

1. Validar se está sendo executado na raiz do projeto.
2. Criar diretórios necessários.
3. Subir ou validar o MySQL.
4. Criar o banco `drive_corporativo`, se necessário.
5. Subir o backend Spring Boot.
6. Subir o frontend React/Vite.
7. Exibir no terminal as URLs de acesso.
8. Salvar logs em arquivos.
9. Salvar PIDs dos processos backend e frontend.
10. Permitir execução simples com:

```bash
bash scripts/dev-start.sh
```

Também crie um script para parar o ambiente:

```txt
scripts/dev-stop.sh
```

Esse script deve:

1. Parar backend.
2. Parar frontend.
3. Opcionalmente manter o banco MySQL rodando.
4. Ter uma opção para parar também o container MySQL, se usado.

Também crie um script de status:

```txt
scripts/dev-status.sh
```

Esse script deve mostrar:

1. Status do MySQL.
2. Status do backend.
3. Status do frontend.
4. Portas esperadas.
5. Caminhos dos logs.

====================================================================
ESTRUTURA ESPERADA
==================

Criar a seguinte estrutura, se ainda não existir:

```txt
scripts
├── dev-start.sh
├── dev-stop.sh
└── dev-status.sh

.logs
├── backend.log
├── frontend.log
└── mysql.log

.pids
├── backend.pid
└── frontend.pid

storage
└── drive-corporativo
```

Não versionar necessariamente `.logs` e `.pids`, mas criar os diretórios localmente.

Se existir `.gitignore`, adicionar:

```txt
.logs/
.pids/
storage/drive-corporativo/
```

Atenção: não apagar arquivos do storage.

====================================================================
REGRAS GERAIS
=============

Antes de alterar qualquer coisa:

1. Leia `spec.md`.
2. Analise a estrutura atual do projeto.
3. Verifique se existem diretórios `backend` e `frontend`.
4. Verifique se existe `backend/pom.xml`.
5. Verifique se existe `frontend/package.json`.
6. Preserve tudo que já existe.
7. Não altere regra de negócio.
8. Não altere telas.
9. Não altere endpoints.
10. Não altere autenticação.
11. Não altere entidades.
12. Não crie dashboard.
13. Não recrie o projeto.
14. Não remova arquivos existentes.
15. Não apague banco de dados automaticamente.
16. Não apague arquivos do storage.

A tarefa é apenas criar automação de execução local.

====================================================================
TECNOLOGIAS ESPERADAS
=====================

Backend:

```txt
Java
Spring Boot
Maven
```

Frontend:

```txt
Node.js
npm
React
Vite
```

Banco:

```txt
MySQL
```

Ambiente:

```txt
Linux Debian dentro do WSL
```

Docker:

```txt
Pode ser usado somente para subir o MySQL.
```

====================================================================
CONFIGURAÇÕES PADRÃO
====================

Use as seguintes configurações padrão:

Banco:

```txt
database: drive_corporativo
host: localhost
port: 3306
username: root
password: root
```

Container Docker do MySQL:

```txt
container name: drive-corporativo-mysql
image: mysql:8.0
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: drive_corporativo
port: 3306:3306
```

Backend:

```txt
porta esperada: 8080
diretório: backend
comando: mvn spring-boot:run
log: .logs/backend.log
pid: .pids/backend.pid
```

Frontend:

```txt
porta esperada: 5173
diretório: frontend
comando: npm run dev -- --host 0.0.0.0
log: .logs/frontend.log
pid: .pids/frontend.pid
```

Storage:

```txt
storage/drive-corporativo
```

====================================================================
IMPORTANTE SOBRE DOCKER
=======================

O script deve funcionar mesmo que o comando abaixo não esteja disponível:

```bash
docker compose
```

Não dependa obrigatoriamente de Docker Compose.

Preferencialmente, use `docker run` para subir o MySQL.

O script deve verificar se o Docker existe com:

```bash
docker --version
```

Se Docker existir, usar container MySQL.

Se Docker não existir, tentar usar MySQL local já instalado.

Se nem Docker nem MySQL local estiverem disponíveis, exibir erro claro com instruções de instalação.

Não instalar Docker automaticamente.

Não instalar MySQL automaticamente sem confirmação.

Apenas exibir instruções.

====================================================================
SCRIPT dev-start.sh
===================

O script `scripts/dev-start.sh` deve executar a seguinte lógica:

1. Ativar modo seguro:

```bash
set -e
```

2. Validar que está na raiz do projeto:

Verificar se existem:

```txt
spec.md
backend
frontend
```

Se não existirem, exibir erro:

```txt
Execute este script a partir da raiz do projeto.
```

3. Criar diretórios:

```bash
mkdir -p .logs
mkdir -p .pids
mkdir -p storage/drive-corporativo
```

4. Verificar dependências:

Obrigatórias:

```txt
java
mvn
node
npm
```

Banco:

```txt
docker ou mysql local
```

Se Java, Maven, Node ou npm não existirem, exibir erro claro informando a dependência ausente.

5. Subir MySQL.

Regra:

Primeiro, verificar se a porta 3306 já está respondendo.

Se MySQL já estiver disponível em `localhost:3306`, não subir container.

Se MySQL não estiver disponível e Docker existir, subir container:

```bash
docker run --name drive-corporativo-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=drive_corporativo \
  -p 3306:3306 \
  -d mysql:8.0
```

Se o container já existir, iniciar com:

```bash
docker start drive-corporativo-mysql
```

6. Aguardar MySQL ficar pronto.

Fazer loop de espera, tentando conectar por até 60 segundos.

Pode usar:

```bash
docker exec drive-corporativo-mysql mysqladmin ping -uroot -proot
```

Ou, se usando MySQL local:

```bash
mysqladmin ping -h localhost -uroot -proot
```

Se não ficar pronto, exibir erro claro.

7. Garantir criação do banco:

Executar:

```sql
CREATE DATABASE IF NOT EXISTS drive_corporativo;
```

8. Subir backend.

Antes de subir, verificar se já existe processo com PID em:

```txt
.pids/backend.pid
```

Se existir e o processo estiver vivo, não subir outro backend.

Se não existir, executar:

```bash
cd backend
nohup mvn spring-boot:run > ../.logs/backend.log 2>&1 &
echo $! > ../.pids/backend.pid
```

9. Aguardar backend responder.

Aguardar até 60 segundos.

Testar:

```bash
curl -s http://localhost:8080
```

Se `/` não existir, aceitar qualquer resposta HTTP como sinal de que a porta está aberta.

Se não responder, avisar que o backend pode ainda estar inicializando e indicar o log:

```txt
.logs/backend.log
```

10. Instalar dependências do frontend se necessário.

Se `frontend/node_modules` não existir, executar:

```bash
cd frontend
npm install
```

11. Subir frontend.

Antes de subir, verificar se já existe processo com PID em:

```txt
.pids/frontend.pid
```

Se existir e o processo estiver vivo, não subir outro frontend.

Se não existir, executar:

```bash
cd frontend
nohup npm run dev -- --host 0.0.0.0 > ../.logs/frontend.log 2>&1 &
echo $! > ../.pids/frontend.pid
```

12. Exibir resumo final:

```txt
Ambiente iniciado.

Banco MySQL:
Host: localhost
Porta: 3306
Database: drive_corporativo
Usuário: root
Senha: root

Backend:
http://localhost:8080
Log: .logs/backend.log

Frontend:
http://localhost:5173
Log: .logs/frontend.log

Storage:
storage/drive-corporativo
```

====================================================================
SCRIPT dev-stop.sh
==================

Criar `scripts/dev-stop.sh`.

Esse script deve:

1. Parar backend usando `.pids/backend.pid`.
2. Parar frontend usando `.pids/frontend.pid`.
3. Remover arquivos PID após parar processos.
4. Não parar MySQL por padrão.
5. Aceitar argumento opcional:

```bash
bash scripts/dev-stop.sh --with-db
```

Se `--with-db` for informado:

1. Verificar se existe container `drive-corporativo-mysql`.
2. Parar o container com:

```bash
docker stop drive-corporativo-mysql
```

Não remover o container.

Não apagar volume.

Não apagar banco.

Não apagar arquivos do storage.

Exibir mensagem final:

```txt
Ambiente parado.
```

====================================================================
SCRIPT dev-status.sh
====================

Criar `scripts/dev-status.sh`.

Esse script deve exibir:

1. Se backend está rodando.
2. Se frontend está rodando.
3. Se MySQL está acessível.
4. Se o container MySQL existe.
5. Se o container MySQL está rodando.
6. URLs esperadas.
7. Caminhos de log.

Exemplo de saída:

```txt
Status do ambiente Drive Corporativo

MySQL: rodando em localhost:3306
Container MySQL: drive-corporativo-mysql rodando

Backend: rodando
PID: 12345
URL: http://localhost:8080
Log: .logs/backend.log

Frontend: rodando
PID: 67890
URL: http://localhost:5173
Log: .logs/frontend.log
```

====================================================================
AJUSTE NO README
================

Atualize o `README.md` principal para incluir uma seção:

```txt
Execução rápida no Debian/WSL
```

Essa seção deve explicar:

1. Pré-requisitos.
2. Como dar permissão aos scripts.
3. Como subir o ambiente.
4. Como verificar status.
5. Como parar ambiente.
6. Como parar ambiente com banco.
7. Onde ver logs.

Comandos obrigatórios no README:

```bash
chmod +x scripts/dev-start.sh scripts/dev-stop.sh scripts/dev-status.sh
```

```bash
bash scripts/dev-start.sh
```

```bash
bash scripts/dev-status.sh
```

```bash
bash scripts/dev-stop.sh
```

```bash
bash scripts/dev-stop.sh --with-db
```

====================================================================
REGRAS DE SEGURANÇA DOS SCRIPTS
===============================

1. Não usar `sudo` dentro dos scripts.
2. Não apagar banco automaticamente.
3. Não apagar storage automaticamente.
4. Não remover container MySQL automaticamente.
5. Não executar comandos destrutivos como `rm -rf storage`.
6. Não sobrescrever arquivos de configuração sem necessidade.
7. Não expor senha fora do contexto local de desenvolvimento.
8. Deixar claro que as credenciais `root/root` são apenas para desenvolvimento local.

====================================================================
COMPATIBILIDADE COM WSL
=======================

Considerar que o projeto roda em Debian dentro do WSL.

O frontend deve subir com:

```bash
npm run dev -- --host 0.0.0.0
```

para facilitar acesso pelo navegador.

Não usar systemd.

Não criar serviço Linux.

Não depender de `service mysql start`.

Não depender de `systemctl`.

====================================================================
CRITÉRIOS DE ACEITE
===================

A tarefa será considerada concluída quando:

1. `scripts/dev-start.sh` existir.
2. `scripts/dev-stop.sh` existir.
3. `scripts/dev-status.sh` existir.
4. Os scripts tiverem comentários mínimos explicando as etapas.
5. O script criar `.logs`, `.pids` e `storage/drive-corporativo`.
6. O script subir ou validar MySQL.
7. O script criar o banco `drive_corporativo`, se necessário.
8. O script subir o backend.
9. O script subir o frontend.
10. O script evitar subir backend duplicado.
11. O script evitar subir frontend duplicado.
12. O script não apagar banco.
13. O script não apagar arquivos do storage.
14. O script funcionar sem Docker Compose.
15. O README explicar como usar os scripts.
16. Nenhuma regra de negócio do sistema ser alterada.
17. Nenhuma tela ser alterada.
18. Nenhum endpoint ser alterado.

====================================================================
ORDEM DE EXECUÇÃO
=================

Execute nesta ordem:

1. Leia `spec.md`.
2. Analise a estrutura atual do projeto.
3. Verifique diretórios `backend` e `frontend`.
4. Crie diretório `scripts`, se não existir.
5. Crie `scripts/dev-start.sh`.
6. Crie `scripts/dev-stop.sh`.
7. Crie `scripts/dev-status.sh`.
8. Ajuste permissões se possível.
9. Atualize `.gitignore`, se existir.
10. Atualize `README.md`.
11. Não altere código backend.
12. Não altere código frontend.
13. Entregue resumo final.

====================================================================
RESUMO FINAL ESPERADO
=====================

Ao terminar, informe:

1. Arquivos criados.
2. Arquivos alterados.
3. Como iniciar o sistema.
4. Como parar o sistema.
5. Como verificar status.
6. Como acessar backend.
7. Como acessar frontend.
8. Como acessar logs.
9. Observações para Debian/WSL.
10. Pendências, caso existam.

Execute agora apenas a criação dos scripts de execução local.
