const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost', // или IP-адрес вашего сервера OpenServer
    user: 'root', // имя пользователя базы данных
    password: '', // пароль пользователя базы данных
    database: 'app', // название вашей базы данных
  });

  connection.connect((err) => {
    if (err) {
      console.error('Ошибка подключения: ' + err.stack);
      return;
    }
    console.log('Подключено к базе данных. ID соединения: ' + connection.threadId);
  });
  
  module.exports = connection;