# Birthday Reminder

## Detail

This birthday reminder using `node-cron` to check schedule and make queue.
For Queue & Worker using `bullmq` and redis.
The Application using TypeORM & Express.

## Endpoint

### Create User

```curl
curl --location --request POST 'http://localhost:3000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "a",
    "lastName": "li",
    "email": "ghozali@bjak.id",
    "dob": "1992-07-20",
    "city": "Cirebon"
}'
```

### Delete User

```curl
curl --location --request DELETE 'http://localhost:3000/user/1'
```

## Requirements to run this project:

1. Docker Compose (to run postgresql and redis)
2. Google Maps API Key (to get location and timezone)

## Steps to run this project:

1. Copy `.env.example` to `.env` file and modify the values. Please check the `docker-compose.yml` file.
2. Run `npm i` command
3. Run `docker compose up -d` command
4. Run `npm run dev` command for development
5. Run `npm run build` then `npm start` command for production
