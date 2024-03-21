# Atividade 1: Introdução a criação de API com nodes e uso de Middleware

# Sobre o desafio

Nesse desafio, você deverá criar uma aplicação para treinar o que aprendeu até agora no Node.js!

Essa será uma aplicação para gerenciar uma lista de tecnologias de estudos por usuário. Será permitida a criação de um usuário com `name` e `username`, bem como fazer o CRUD ddas tecnologias:

-   Adicionar uma nova tecnologia;
-   Listar todas as tecnologias;
-   Alterar o `title` e `deadline` de uma tecnologia \*\*existente;
-   Marcar uma tecnologia como estudada;
-   Excluir uma tecnologia;

Tudo isso para cada usuário em específico (o `username` será passado pelo header). A seguir veremos com mais detalhes o que e como precisa ser feito 🚀

## Rotas da aplicação

Segue as rotas da API que você deve implementar. Caso de dúvidas entre em contato comigo pelo ZAP (83-999707419) ou classroom.

### POST `/users`

A rota deve receber `name`, e `username` dentro do corpo da requisição. Ao cadastrar um novo usuário, ele deve ser armazenado dentro de um objeto no seguinte formato:

```jsx
{
	id: 'uuid', // precisa ser um uuid
	name: 'Danilo Vieira',
	username: 'danilo',
	technologies: []
}
```

Certifique-se que o ID seja um UUID, e de sempre iniciar a lista `technologies`como um array vazio.
O objeto do usuário deve ser retornado na resposta da requisição.

Você deve permitir que um usuário seja criado e retorne um JSON com o usuário criado. Também é necessário que você retorne a resposta com o código `201`.

Antes de criar um usuário você deve validar se outro usuário com o mesmo `username` já existe. Caso exista, retorne uma resposta com status `400` e um json no seguinte formato:

```jsx
{
    error: "Mensagem do erro";
}
```

A mensagem pode ser de sua escolha, desde que a propriedade seja `error`.

### GET `/technologies`

A rota deve receber, pelo header da requisição, uma propriedade `username` contendo o username do usuário e retornar uma lista com todas as tecnologias desse usuário.

Portanto, para que essa rota lista todas as tecnologias, é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount` e então retornar a lista de todas tecnologias do usuário que está no objeto do usuário conforme foi criado. Caso não exista o usuário. retorna um error com código 404 e mensagem user not exists.

### POST `/technologies`

A rota deve receber `title` e `deadline` dentro do corpo da requisição e, uma propriedade `username` contendo o username do usuário dentro do header da requisição. Ao criar um novo objeto _Technology_, ele deve ser armazenada dentro da lista `technologies` do usuário que está criando esse objeto _Technology_. Cada objeto _Technology_ deverá estar no seguinte formato: . Certifique-se que o ID seja um UUID.

```jsx
{
	id: 'uuid', // precisa ser um uuid
	title: 'Nome da tecnologia',
	studied: false,
	deadline: '2021-02-27T00:00:00.000Z',
	created_at: '2021-02-22T00:00:00.000Z'
}
```

**Observação**: Lembre-se de iniciar a propriedade `studied` sempre como `false` ao criar um _objeto Technology_.

**Dica**: Ao fazer a requisição com o Insomnia ou Postman, preencha a data de `deadline` com o formato `ANO-MÊS-DIA` e ao salvar a essa tecnologia pela rota, faça da seguinte forma:

```jsx
{
	id: 'uuid', // precisa ser um uuid
	title: 'Nome da tecnologia',
	done: false,
	deadline: new Date(deadline),
	created_at: new Date()
}
```

Usar `new Date(deadline)` irá realizar a transformação da string "ANO-MÊS-DIA" (por exemplo "2021-02-25") para uma data válida do JavaScript.
O objeto `technology` deve ser retornado na resposta da requisição.

Portanto, para criar uma nova tecnologia, é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount`, pegar também o `title` e o `deadline` do corpo da requisição e adicionar um novo _objeto Technology_ na lista `technologies` que está no objeto do usuário. Após adicionar o novo _objeto Technology_ na lista, é necessário retornar um status `201` e o json contendo o objeto _Technology criado_.

### PUT `/technologies/:id`

A rota deve receber, pelo header da requisição, uma propriedade `username` contendo o username do usuário e receber as propriedades `title` e `deadline` dentro do corpo. É preciso alterar **apenas** o `title` e o `deadline` da tarefa que possua o `id` igual ao `id` presente nos parâmetros da rota.

Portanto, para atualizar uma nova tecnologia, é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount`, pegar também o `title` e o `deadline` do corpo da requisição e atualizar o _objeto Technology_ na lista `technologies` que está no objeto do usuário. Caso não exista o usuário. retorna um error com código 404 e mensagem user not exists.

você não deve permitir a atualização de uma tecnologia que não existe e retornar uma resposta contendo um status `404` e um json no seguinte formato:

```jsx
{
    error: "Mensagem do erro";
}
```

### PATCH `/technologies/:id/studied`

A rota deve receber, pelo header da requisição, uma propriedade `username` contendo o username do usuário e alterar a propriedade `studied` para `true` na _technology_ que possuir um `id` igual ao `id` presente nos parâmetros da rota.

Portanto, para atualizar uma nova tecnologia, é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount.` Caso não exista o usuário na request. retorna um error com código 404 e mensagem user not exists. você também não deve permitir a mudança da propriedade `studied` de uma tecnologia que não existe e retornar uma resposta contendo um status `404` e um json no seguinte formato:

```jsx
{
    error: "Mensagem do erro";
}
```

### DELETE `/technologies/:id`

A rota deve receber, pelo header da requisição, uma propriedade `username` contendo o username do usuário e excluir a tecnologia que possuir um `id` igual ao `id` presente nos parâmetros da rota.

Portanto, para remover uma tecnologia, é necessário pegar o usuário que foi repassado para o `request` no middleware `checkExistsUserAccount.` Caso não exista o usuário na request. retorna um error com código 404 e mensagem user not exists. Você não deve permitir excluir uma tecnologia que não exista e retornar uma resposta contendo um status `404` e um json no seguinte formato. Caso exista a tecnologia, deve removê-la do banco e retornar uma resposta contendo um status 200 e um json contento todas as tecnologias restantes.

```jsx
{
    error: "Mensagem do erro";
}
```

## **Middleware**

Para completar todas rotas referentes à Tecnologias é necessário antes ter completado o código que falta no middleware `checkExistsUserAccount`. Para isso, você deve pegar o `username` do usuário no header da requisição, verificar se esse usuário existe e então colocar esse usuário dentro da `request` antes de chamar a função `next`. Caso o usuário não seja encontrado, você deve retornar uma resposta contendo status `404` e um json no seguinte formato:

```jsx
{
    error: "Mensagem do erro";
}
```

**Observação:** O username deve ser enviado pelo header em uma propriedade chamada `username`:
