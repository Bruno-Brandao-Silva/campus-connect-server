# Sua Aplicação

Bem-vindo à documentação da API da sua aplicação. Abaixo estão detalhes sobre as rotas disponíveis, os métodos HTTP permitidos e uma breve descrição do que cada rota realiza.

## Autenticação

### `POST /auth/login`

- **Descrição**: Rota para autenticar um usuário.
- **Método HTTP**: POST
- **Body**: 
  - `academicRegistration` (string): Matrícula acadêmica do usuário.
  - `password` (string): Senha do usuário.

## Usuários

### `GET /users`

- **Descrição**: Obter informações do usuário autenticado.
- **Método HTTP**: GET
- **Autenticação**: Token JWT necessário.

### `GET /users/:id`

- **Descrição**: Obter informações de um usuário específico.
- **Método HTTP**: GET
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `id` (string): ID do usuário.

### `PATCH /users`

- **Descrição**: Atualizar informações do usuário autenticado.
- **Método HTTP**: PATCH
- **Autenticação**: Token JWT necessário.
- **Body**: Campos a serem atualizados.

### `DELETE /users`

- **Descrição**: Excluir a conta do usuário autenticado.
- **Método HTTP**: DELETE
- **Autenticação**: Token JWT necessário.

### `GET /users/search/:query`

- **Descrição**: Buscar usuários por nome, username, academicSchedule, entryYear e entryPeriod.
- **Método HTTP**: GET
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `query` (string): Termo de busca.

### `PATCH /users/follow/:id`

- **Descrição**: Seguir um usuário.
- **Método HTTP**: PATCH
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `id` (string): ID do usuário a ser seguido.

### `PATCH /users/unfollow/:id`

- **Descrição**: Deixar de seguir um usuário.
- **Método HTTP**: PATCH
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `id` (string): ID do usuário a ser deixado de seguir.

## Arquivos

### `POST /files`

- **Descrição**: Fazer upload de arquivos.
- **Método HTTP**: POST
- **Autenticação**: Token JWT necessário.
- **Requisição**: Multipart/form-data com o arquivo.

### `GET /files/:id`

- **Descrição**: Baixar um arquivo por ID.
- **Método HTTP**: GET
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `id` (string): ID do arquivo.

### `DELETE /files/:id`

- **Descrição**: Excluir um arquivo por ID.
- **Método HTTP**: DELETE
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `id` (string): ID do arquivo.

## Posts

### `POST /posts`

- **Descrição**: Criar um novo post.
- **Método HTTP**: POST
- **Autenticação**: Token JWT necessário.
- **Body**: Campos do post.

### `GET /posts`

- **Descrição**: Obter todos os posts.
- **Método HTTP**: GET
- **Autenticação**: Token JWT necessário.

### `GET /posts/:userId`

- **Descrição**: Obter os posts de um usuário específico.
- **Método HTTP**: GET
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `userId` (string): ID do usuário.

### `PATCH /posts/:postId/like`

- **Descrição**: Curtir um post.
- **Método HTTP**: PATCH
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `postId` (string): ID do post.

### `PATCH /posts/:postId/unlike`

- **Descrição**: Não curtir um post.
- **Método HTTP**: PATCH
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `postId` (string): ID do post.

### `DELETE /posts/:postId`

- **Descrição**: Excluir um post.
- **Método HTTP**: DELETE
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `postId` (string): ID do post.

### `PATCH /posts/:postId/comment`

- **Descrição**: Comentar em um post.
- **Método HTTP**: PATCH
- **Autenticação**: Token JWT necessário.
- **Parâmetros URL**: `postId` (string): ID do post.
- **Body**: Conteúdo do comentário.
