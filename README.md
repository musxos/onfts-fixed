# Dyna Swap

## Scripts

The following script are available to run.

### npm install

run `npm install` to install the dependencies. if it failed type `npm install --legacy-peer-deps`.

### npm run dev

run `npm run dev` to run server in development mode.

### npm run build

run `npm run build` to to create compiled files.

## Configuration

The following environment variables are required to connect with databae and moralis api.

### Databae configuration

Create a mongodb cluster on the mongodb server and add a database. add the URI of the database in .env file.

```

DB_URI="mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.cnmbib5.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority"

```

The following configurations are required in order to access the pages for managing contract whitling:

- Select the created database in mongodb
- Create a new collection named `users`
- Insert a new collection

Schema for the user collection. Note that the wallet is the metamask wallet address or any other evm EOA (externally owned account).

```JavaScript
{
  wallet: '0x00000000'
}
```

### Moralis configuration

Create a new project on [moralis.io](https://moralis.io). ON successful creation of the project, it will provide you the API key. Add the API key with to your .env/environment variables configuration as follow:

```
NEXT_PUBLIC_MORALIS_API_KEY="<YOUR_MORALIS_API_KEY>"
```

## APIs url configuration
Update APIs url in [constants.js](./utils/constants.js).
```JavaScript
export const APIs_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "<BASE_URL_OF_YOUR_WEBSITE"
    : "http://localhost:3000";
```

## Deployment

[vercel.com](https://vercel.com/) can be used to deploy the project.

### Setps

- Clone and creatre a new repository on github
- Go to the vercel dashboard and click `Add new...` and select `Project`
- choose Git provider (where the repository is located)
- Select repository (after that you will be redirected to the configurations page)
- on configurations page Select the `Environment Variables` dropdown.
- Add the environment variables dessribed in Configuration sectoin above the (Readm.md)

For more about the deployment check out the the following links:

- https://nextjs.org/docs/deployment
- https://www.netlify.com/blog/2020/11/30/how-to-deploy-next.js-sites-to-netlify/
- https://www.mitrais.com/news-updates/how-to-deploy-next-js-with-vercel/
- https://coderrocketfuel.com/article/how-to-deploy-a-next-js-website-to-a-digital-ocean-server
- https://docs.digitalocean.com/tutorials/app-nextjs-deploy
