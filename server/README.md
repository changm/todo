Requires postgres sql - https://github.com/brianc/node-postgres
Requires cors npm.
Requires performance-now

Postgres:
one database named "todo" with schema:
id (unique int) | note (varchar)

Things that could be improved:
1. Use binary data instead of string data to send over the wire.
2. Have to fix up CORS properly.
3. Better responses to the client.
4. Better error handling.
5. Probably better way to handle SQL queries rather than inline in the backend.
6. Use a connection pool instead of a single SQL connection.
7. Better use of routing. Can probably break out the unit tests and benchmark somewhere else by making an http request inside another route.
8. Server side validation of input for SQL injection protection.
9. Probably some way with express and node to set up the parameters to read from SQL outside of node.js. Maybe Docker does this?
