# Refund API

API REST para cadastro de usuários e gerenciamento de solicitações de reembolso, desenvolvida com Node.js, TypeScript, Express, Prisma e SQLite.

## Funcionalidades

- Cadastro de usuários com perfis `employee` e `manager`
- Autenticação com JWT
- Controle de acesso por perfil
- Criação e consulta de solicitações de reembolso
- Upload de comprovantes com validação de formato e tamanho
- Paginação e busca de reembolsos por nome do solicitante
- Banco de dados SQLite

## Tecnologias

- Node.js
- TypeScript
- Express 5
- Prisma 7
- SQLite
- JSON Web Token
- bcrypt
- Zod
- Multer
- CORS

## Pré-requisitos

- Node.js
- npm

## Instalação

```bash
git clone https://github.com/seu-usuario/refund_api.git
cd refund_api
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.example .env
```

Configure o arquivo `.env`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=uma-chave-secreta-forte
```

- `DATABASE_URL`: URL do banco SQLite usado pela aplicação.
- `JWT_SECRET`: chave utilizada para assinar e validar tokens JWT.

## Banco de dados

Gere o Prisma Client e aplique as migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Para desenvolvimento, você também pode criar ou atualizar o banco com:

```bash
npx prisma migrate dev
```

Para visualizar os dados:

```bash
npm run studio
```

## Executando a API

```bash
npm run dev
```

A API será iniciada em `http://localhost:3333`.

## Estrutura do projeto

```text
src/
├── config/          # Configurações de autenticação e upload
├── controllers/     # Regras das rotas
├── database/        # Instância do Prisma
├── middlewares/     # Autenticação, autorização e tratamento de erros
├── providers/       # Armazenamento dos arquivos
├── routes/          # Definição das rotas
├── types/           # Extensões de tipos
└── utils/           # Utilidades da aplicação
prisma/
├── schema.prisma
└── migrations/
tmp/uploads/         # Comprovantes armazenados
```

## Rotas

Rotas públicas:

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/users` | Cadastra um usuário |
| `POST` | `/sessions` | Autentica um usuário e retorna o token JWT |

Rotas privadas: o header `Authorization: Bearer <token>` é obrigatório.

| Método | Rota | Perfil permitido | Descrição |
| --- | --- | --- | --- |
| `POST` | `/uploads` | `employee` | Envia um comprovante |
| `POST` | `/refunds` | `employee` | Cria uma solicitação de reembolso |
| `GET` | `/refunds` | `manager` | Lista reembolsos com paginação |
| `GET` | `/refunds/:id` | `employee` ou `manager` | Busca um reembolso pelo ID |
| `GET` | `/uploads/:filename` | Público | Acessa um arquivo enviado |

## Exemplos de requisições

### Criar usuário

```http
POST /users
Content-Type: application/json

{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "Senha@123",
  "role": "employee"
}
```

A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula e um caractere especial.

### Autenticar

```http
POST /sessions
Content-Type: application/json

{
  "email": "maria@email.com",
  "password": "Senha@123"
}
```

A resposta contém o token JWT e os dados do usuário sem a senha:

```json
{
  "token": "<jwt>",
  "userWithoutPassword": {
    "id": "<uuid>",
    "name": "Maria Silva",
    "email": "maria@email.com",
    "role": "employee"
  }
}
```

### Enviar comprovante

```http
POST /uploads
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
```

Envie o arquivo no campo `file`. Formatos aceitos: JPEG e PNG. Tamanho máximo: 3 MB.

Resposta:

```json
{
  "filename": "arquivo-enviado.ext"
}
```

### Criar reembolso

```http
POST /refunds
Authorization: Bearer <jwt>
Content-Type: application/json

{
  "name": "Almoço com cliente",
  "category": "food",
  "amount": 85.5,
  "filename": "arquivo-enviado.ext"
}
```

Categorias disponíveis:

- `food`
- `others`
- `services`
- `transport`
- `accommodation`

### Listar reembolsos

```http
GET /refunds?page=1&perPage=10&name=Maria
Authorization: Bearer <jwt>
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run studio` | Abre o Prisma Studio |

## Autor

Vítor R. Cavicchiolli
