# ReactJS project structure with Typescript

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

- Setup visual studio code with Prettier extension(https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Available Scripts

Please check package.json file to view all available scripts

## Features List

- Setup stylesheet scss, redux, ...
- Login social network(facebook, google, twitter)

## Naming Convention

- Kebab case with file that not rendering jsx element, folder.
- Camel case with file that rendering jsx element.
- Add prefix 'I' with interface, 'T' with type, 'E' with enum. Add suffix Props with interface/type of props.
  Example: IUser, TStudent, EColors, IUserProps.
- SCSS className: follow by BEM. Example, in `LoginPage.tsx`, wrapper className is `LoginPage`, other element will be `LoginPage__header`, `LoginPage__header-logo`,... see example in src/components/button/Button.tsx
