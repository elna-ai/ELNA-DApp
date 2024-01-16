# ELNA DApp  

Welcome to the ELNA DApp repository. This repository houses the user interface for ELNA, a revolutionary platform for creating customizable AI assistants powered by niche data supplied by users. Our mission is to make advanced conversational AI accessible for personalized use cases while leveraging the decentralized attributes of the Internet Computer.

## Table of Contents
- [ELNA DApp  ](#elna-dapp )
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Getting Started](#getting-started)
  - [Notes](#notes)

## Overview

ELNA DApp   is a critical component of the ELNA platform. It provides users with an intuitive and visually engaging interface to:

- Upload and manage data for custom chatbot creation.
- Configure and customize AI chatbots based on specific needs.
- Interact with chatbots seamlessly, using conversational prompts.

The DApp   connects with various backend components, orchestrating the AI interactions, and ensuring a user-friendly experience.

## Getting Started

To get started with the ELNA DApp  , follow these steps:

1. **Clone the Repository**:
```sh
git clone git@github.com:elna-live/ELNA-DApp- .git
```

2. Setup project

Make sure that [Node.js](https://nodejs.org/en/) `>= 16` and [`dfx`](https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove) `>= 0.14` are installed on your system.

Run the following commands in a new, empty project directory:

```sh
dfx start --clean --background # Run dfx in the background
npm run setup # Install packages, deploy canisters, and generate type bindings
npm start # Start the development server
```

When ready, run `dfx deploy --network ic` to deploy your application to the Internet Computer.

## Notes

- Prettify code by running  `npm run format`.
- Reduce the latency of update calls by passing the `--emulator` flag to `dfx start`.
- Install a Motoko package by running `npx ic-mops add <package-name>`. Here is a [list of available packages](https://mops.one/).
- Split your frontend and backend console output by running `npm run frontend` and `npm run backend` in separate terminals.
