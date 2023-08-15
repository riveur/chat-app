# Chat App with Next.js & Socket.io

## 1. Setup

- Install the client dependencies:

```console
> cd client && yarn install
```

- Install the server dependencies:

```console
> cd server && yarn install
```

## 2. Usage

- To run in developement mode, you can use `yarn dev` or `npm run dev` to run the server and the client

**INFORMATION:**

You may find cors origin issues with the websocket, make sure the origin is using the client url :

```javascript
// in /server/src/server.ts file

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // make sure it's match with client
        methods: ['GET', 'POST']
    }
});
```