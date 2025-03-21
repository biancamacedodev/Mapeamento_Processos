# Mapeamento de Processos

Sistema para mapeamento e gerenciamento de processos empresariais, desenvolvido com Next.js 13+, TypeScript e MySQL.

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - Next.js 13+ (App Router)
  - TypeScript
  - CSS Modules
  - React Hooks

- **Backend:**
  - Next.js API Routes
  - TypeORM
  - MySQL

## 📋 Pré-requisitos
Antes de iniciar o projeto, verifique se você tem as seguintes dependências instaladas:

- [Node.js](https://nodejs.org/) 
- [MySQL](https://www.mysql.com/) 
- npm ou yarn

## 🛠️ Configuração do Ambiente

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd mapeamento-processos
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Diretório principal do Next.js 13+
│   ├── api/               # Rotas da API
│   │   ├── areas/        # Endpoints para áreas
│   │   ├── processos/    # Endpoints para processos
│   │   └── subprocessos/ # Endpoints para subprocessos
│   ├── areas/            # Página de áreas
│   ├── processos/        # Página de processos
│   └── subprocessos/     # Página de subprocessos
├── entities/             # Entidades do TypeORM
├── lib/                  # Configurações e utilitários
└── styles/              # Arquivos CSS
```

### 1. Criar o Banco de Dados

Primeiro, crie o banco de dados no MySQL executando o seguinte comando:

```sql
CREATE DATABASE mapeamento_processos;

## 🗄️ Modelo de Dados

### Área
- Representa uma área da empresa
- Campos:
  - id: identificador único
  - nome: nome da área
  - descricao: descrição opcional da área
  - processos: relação com processos

### Processo
- Representa um processo dentro de uma área
- Campos:
  - id: identificador único
  - nome: nome do processo
  - descricao: descrição do processo
  - areaId: referência à área
  - subprocessos: relação com subprocessos

### Subprocesso
- Representa um subprocesso dentro de um processo
- Campos:
  - id: identificador único
  - nome: nome do subprocesso
  - descricao: descrição do subprocesso
  - processoId: referência ao processo
  - subprocessoPaiId: referência opcional ao subprocesso pai

## 🔄 Funcionalidades

### Gestão de Áreas
- Listagem de áreas
- Criação de novas áreas
- Edição de áreas existentes
- Exclusão de áreas

### Gestão de Processos
- Listagem de processos por área
- Criação de novos processos
- Edição de processos existentes
- Exclusão de processos

### Gestão de Subprocessos
- Listagem de subprocessos por processo
- Criação de novos subprocessos
- Edição de subprocessos existentes
- Exclusão de subprocessos

## 🔒 Segurança

- Validação de dados no servidor
- Sanitização de inputs
- Tratamento de erros
- Confirmação para ações destrutivas

## 🎨 Interface

- Design responsivo
- Feedback visual para ações
- Formulários com validação
- Confirmação antes de excluir
- Loading states
- Mensagens de erro e sucesso

## 📝 API Endpoints

### Áreas
- `GET /api/areas` - Lista todas as áreas
- `POST /api/areas` - Cria uma nova área
- `PUT /api/areas/[id]` - Atualiza uma área
- `DELETE /api/areas/[id]` - Remove uma área

### Processos
- `GET /api/processos` - Lista todos os processos
- `POST /api/processos` - Cria um novo processo
- `PUT /api/processos/[id]` - Atualiza um processo
- `DELETE /api/processos/[id]` - Remove um processo

### Subprocessos
- `GET /api/subprocessos` - Lista todos os subprocessos
- `POST /api/subprocessos` - Cria um novo subprocesso
- `PUT /api/subprocessos/[id]` - Atualiza um subprocesso
- `DELETE /api/subprocessos/[id] - Remove um subprocesso

## Arquitetura Geral do sistema usando Mermaid
https://www.mermaidchart.com/raw/9d80f1d0-f4d2-4a2a-90eb-ddaad0f64981?theme=light&version=v0.1&format=svg

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
