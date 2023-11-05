
# BE_testing_round

## Installation
Assuming you’ve already installed Node.js, git, Mysql server
Next, clone this project with following command
```js
git clone https://github.com/phoangtuan97/BE_testing_round.git'
```

Then, install some neccesary packages for the project
```js
npm install
```

Finally, create a '.env' file at the same level as package.json
For instance,  '.env' file looks like
```js
PORT= your server's port
SECRET_ACCESS_TOKEN = your secret key
SECRET_REFRESH_TOKEN = your secret key
DATABASE_NAME=example
HOST= your host
PORT_DB_MYSQL= your running port of mysql server 
USER= your username
```

## Notes
- You can generate your secret key in '.env' file with the following command
```js
node
require('crypto').randomBytes(64).toString('hex')
```
- DATABASE_NAME in '.env' file is must matched with DB name created in mysql server

