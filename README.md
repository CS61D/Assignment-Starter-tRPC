# Assignment Starter tRPC

[Assignment Spec](https://61d.org/docs/Assignments/trpc)
[Finished Solution](https://voting.61d.org/)

## Setup
Create environment variables, install dependencies, and setup local sqlite database

```bash
cp .env.example .env # Copy the example environment variables
touch ./src/server/db/db.sqlite # Create a sqlite database
bun install # Install dependencies
bun db:push # Apply the schema to the database
```
