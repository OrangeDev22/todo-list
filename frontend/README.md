# How Run Locally

Make sure you have npm and docker installed in your computer. Open a terminal and navigate to the "backend" folder then run the following commamnds

```sh
npm install
docker compose up dev-db -d
npx prisma migrate dev
```

Then navigate back to the repository folder and then to the "front-end" folder. In the terminal run the command

```sh
npm install
```

All you have to do now is just run the app with

```sh
npm start
```

You can also try the live [live demo](https://todo-list-orange.netlify.app/) here
