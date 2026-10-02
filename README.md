# The Quack Duck Shop 🦆

Every duck deserves a home. Your shopping cart is a good start.

Welcome to our webshop for rubber ducks with a little extra personality. From superheroes to ducks with hobbies, there is a quack for everyone. Browse the shop and find your perfect duck!

## About the project

We are Linda, Isabell and Oskar, three frontend students learning React. We built The Quack Duck Shop as a school group project to practice components, routing, shared state, fetching data and testing.

This is a demo shop. The checkout saves test orders locally, but no real payments or purchases are made.

## What you can do

- Browse ducks and filter them by category.
- Open a product page to see its details, price and stock status.
- Add ducks to the cart, change quantities and remove products.
- Get feedback when adding a duck or reaching the stock limit.
- Go through checkout with customer details, shipping and a payment method.
- See an order confirmation after placing an order, with the cart cleared.

The checkout also checks the latest stock before saving an order.

## Built with

- React, TypeScript and Vite.
- React Router for navigation and Context for the shopping cart.
- TanStack Query for fetching data and saving orders.
- React Hook Form and Zod for forms and validation.
- Material UI and CSS for the interface and styling.
- JSON Server as a local API, with products and orders in `db.json`.
- Vitest and React Testing Library for tests.

## Run the project locally

You need Node.js and npm installed. Clone this repository and open a terminal in the project folder.

Install the dependencies:

```bash
npm install
```

Start the local API:

```bash
npm run server
```

Keep it running and open a second terminal in the same folder. Start the frontend:

```bash
npm run dev
```

Open the local address shown by Vite in the terminal. The API runs at `http://localhost:3000`. Both terminals need to stay running to use the shop.

Test orders are saved in `db.json`, so placing an order changes that file. Use made-up customer details when testing.

## Tests

Run the tests once:

```bash
npm test -- --run
```

Or use `npm test` to keep the tests running and rerun them when you edit a file.

Our cart tests cover adding products, changing quantities, sale prices, removing products and clearing the cart.

*Built with React, teamwork and a slightly unreasonable amount of ducks. 🦆*
