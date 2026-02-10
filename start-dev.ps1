$env:NODE_ENV="development"
if (-not $env:REPL_ID) { $env:REPL_ID="dev-user" }
# Start server with .env loading support
node --env-file=.env --import tsx server/index.ts
