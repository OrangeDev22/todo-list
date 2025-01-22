# How Run Locally (Deprecated) Todo: Update this instructions in the future

Make sure you have npm and docker installed in your computer. Open a terminal and navigate to the "backend" folder and open the ".env" file and uncomment these two lines.

```sh
#Uncomment these two lines for local run 
# DATABASE_URL="postgresql://postgres:123@localhost:5434/todos?schema=public"
# JWT_SECRET="suuper-secret"
```

Then run the following commamnds

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

# Tree Structure

```sh
├───backend
│   ├───prisma
│   │   └───migrations
│   │       ├───20220704203037_init
│   │       ├───20220704214416_update_schemas
│   │       ├───20220708151001_update_tasks_schema
│   │       ├───20220708175806_updateing_schemas
│   │       └───20220708195317_json_tasks_field
│   ├───src
│   │   └───modules
│   │       ├───auth
│   │       │   ├───decorator
│   │       │   ├───dto
│   │       │   ├───guard
│   │       │   └───strategy
│   │       ├───prisma
│   │       ├───task
│   │       │   └───dto
│   │       └───user
│   └───test
└───front-end
    ├───public
    └───src
        ├───assets
        │   └───icons
        ├───Components
        │   ├───Button
        │   ├───Container
        │   ├───DashBoard
        │   ├───Header
        │   └───InputField
        ├───hoc
        ├───pages
        │   ├───HomePage
        │   └───LoginSignup
        ├───state
        │   ├───action-creators
        │   ├───action-types
        │   ├───actions
        │   └───reducers
        ├───tests
        └───utils
```
