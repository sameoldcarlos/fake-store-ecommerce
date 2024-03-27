# GoodBuy store

Autor: [Carlos Alves](https://github.com/sameoldcarlos)

A GoodBuy store é uma aplicação ilustrativa de um e-commerce, desenvolvida puramente com o objetivo de testar minhas habilidades com desenvolvimento frontend.

## Funcionalidades implementadas

A tabela abaixo detalha algumas features implementadas de acordo com os requisitos do teste.

| Funcionalidade                                        | Implementada? |
|-------------------------------------------------------|---------------|
| Listar todos os produtos                              | ✔️ Sim         |
| Filtrar por categoria                                 | ✔️ Sim         |
| Busca por título do produto                           | ✔️ Sim         |
| Modal para adicionar no carrinho                      | ✔️ Sim         |
| Indicador de itens no ícone do carrinho               | ✔️ Sim         |
| Remover item do carrinho quando a quantidade for zero | ✔️ Sim         |
| Calcular subtotal no checkout                         | ✔️ Sim         |
| Redirecionar para 404 ao acessar rota não existente   | ✔️ Sim         |
| Carrossel de produtos na home                         | ✔️ Sim         |


## Tecnologias Utilizadas

* Vue.js
* Sass
* Bootstrap
* IndexedDB
* [js-cookie](https://github.com/js-cookie/js-cookie)
* Pinia

O gerenciador de pacotes utilizado no processo de desenvolvimento foi o NPM, utilizando a versão 16.15.0 do node.
Abaixo, deixo alguns comandos para que a aplicação seja executada em ambiente local.

### Instalação das dependências e configuração do projeto

```sh
npm install
```

#### Compilar e executar para desenvolvimento

```sh
npm run dev
```

#### Compilar para produção

```sh
npm run build
```
