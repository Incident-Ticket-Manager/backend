# ITM API

Backend WebApi for Incident Ticket Manager.

Incident Ticket Manager is a simple ticketing system app.

## Run

Ensure that you have Node.js and NPM installed.

Create .env file.

Set : 
- PORT=3000
- SECRET=YOUR_SECRET_TOKEN
- DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}
- DEV=DEV

```
npm run start
```

## Built With

- Node.js
- Express.js
- Sequelize
- Sqlite
- JWT

## Docker

```sh
# Run the container
$ docker run -d \
  -p 3000:3000 \
  -e "SECRET=your-secret" \
  -e "DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}" \
  --name itm-backend thomaslacaze/itm-backend
```
