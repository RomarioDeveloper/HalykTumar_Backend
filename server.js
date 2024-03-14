const express = require('express');
const pool = require('./db/database');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;


app.use(bodyParser.json());
app.use(cors());

//Получение всех постов из базы данных
app.get('/posts', async (req, res) => {
    pool.query('SELECT * FROM posts', (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ message: "All posts successfully retrieved", posts: results });
    });
});

// Добавление нового поста в базу данных
app.post('/posts', async (req, res) => {
    const { id, user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address } = req.body;

    // Basic validation
    if (!user_id || !department_id || !title || !appeal || !description || !date || !status || !address) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert new post into the database
    const result = await pool.query('INSERT INTO posts (user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address]);
    const post_id = result.insertId;

    res.status(201).json({ message: "Post successfully added", post_id: post_id });
});

// Удаление по ID
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;

    // Delete post from the database
    const result = await pool.query('DELETE FROM posts WHERE id = ?', [id]);

    res.status(200).json({ message: "Post successfully deleted" });
});

// Редактирование поста
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address } = req.body;

    // Update post in the database
    const result = await pool.query('UPDATE posts SET user_id = ?, department_id = ?, title = ?, appeal = ?, description = ?, date = ?, image_one = ?, image_two = ?, image_three = ?, image_four = ?, video = ?, status = ?, place = ?, address = ? WHERE id = ?', [user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address, id]);
    // console.log(result);
    res.status(200).json({ message: "Post successfully updated" });
});

//Получение отчетов по place


//Регистрация нового пользователя
app.post('/register', async (req, res) => {
    const { department_id, email, password, name, role, ban, place, image, phone, birthday, points } = req.body;
    

    // Basic validation
    if (!department_id || !email || !password || !name | !place || !role ) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert new user into the database
    const result = await pool.query('INSERT INTO users ( department_id, email, password, name, place, role, ban) VALUES (?, ?, ?, ?, ?, ?)', [department_id, email, password, name, place, role]);
    const user_id = result.insertId;

    res.status(201).json({ message: "User successfully registered", user_id: user_id });
});

//Получение всех пользователей из базы данных
app.get('/users', async (req, res) => {
    pool.query('SELECT * FROM users', (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ message: "All users successfully retrieved", users: results });
    });
});

//Авторизация пользователя
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Find user in the database
    const result = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);

    if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User successfully logged in", user: result[0] });
});


//Редактирование пользователя
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { department_id, email, password, name, role, ban, place, image, phone, birthday, points } = req.body;
    
    // Update user in the database
    const result = await pool.query('UPDATE users SET department_id = ?, email = ?, password = ?, name = ?, role = ?, ban = ?, place = ?, image = ?, phone = ?, birthday = ?, points = ? WHERE id = ?', [department_id, email, password, name, role, ban, place, image, phone, birthday, points, id]);

    res.status(200).json({ message: "User successfully updated" });
});


//Получение баллов у пользователя
app.get('/points/:id', async (req, res) => {
    const { id } = req.params;

    pool.query('SELECT points FROM users WHERE id = ?', [id], (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ message: "User points successfully retrieved", points: results[0].points });
    });
});

//Добавление роли админа пользователю 
app.put('/admin/:id', async (req, res) => {
    const { id } = req.params;

    // Update user in the database
    const result = await pool.query('UPDATE users SET role = "admin" WHERE id = ?', [id]);

    res.status(200).json({ message: "User successfully updated to admin" });
});

//Добавление баллов пользователю за создание поста 10 баллов когда отдел выполнит обращение +90 баллов 
app.put('/points/:id', async (req, res) => {
    const { id } = req.params;

    // Update user in the database
    const result = await pool.query('UPDATE users SET points = points + 10 WHERE id = ?', [id]);

    res.status(200).json({ message: "User successfully updated" });
});


//status posts в необработанное , в работе, на проверке выполнено 
app.put('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Update user in the database
    const result = await pool.query('UPDATE posts SET status = ? WHERE id = ?', [status, id]);

    res.status(200).json({ message: "Post status successfully updated" });
});

//Создание отчета по id к определенному посту
app.post('/reports/:id', async (req, res) => {
    const { id } = req.params; // Получаем post_id из параметров URL
    const { user_id, comments, image, date, grade } = req.body.report;

    // Базовая валидация
    if (!user_id || !comments || !image || !date || !grade) {
        return res.status(400).json({ message: "Отсутствуют обязательные поля" });
    }

    // Вставка нового отчета в базу данных
    try {
        const result = await pool.query(
            'INSERT INTO reports (user_id, post_id, comments, image, date, grade) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, id, comments, image, date, grade]
        );
        const report_id = result.insertId; // Получаем ID вставленного отчета

        res.status(201).json({ message: "Отчет успешно добавлен", report_id: report_id });
    } catch (error) {
        // Обработка ошибок
        console.error("Ошибка при вставке отчета:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
});



//Обращение к техподдержке
app.post('/supports', async (req, res) => {
    const { id, user_id ,text } = req.body;

    // Basic validation
    if (!id || !user_id || !text ) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert new post into the database
    const result = await pool.query('INSERT INTO supports (id, user_id, text) VALUES (?, ?, ?)', [id, user_id, text]);
    const support_id = result.insertId;

    res.status(201).json({ message: "Support successfully added", support_id: support_id });
}
);

//Получение всех обращений из базы данных
app.get('/supports', async (req, res) => {
    pool.query('SELECT * FROM supports', (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ message: "All supports successfully retrieved", supports: results });
    });
});

//Удаление обращения по ID
app.delete('/supports/:id', async (req, res) => {
    const { id } = req.params;

    // Delete post from the database
    const result = await pool.query('DELETE FROM supports WHERE id = ?', [id]);

    res.status(200).json({ message: "Support successfully deleted" });
});

//Редактирование обращения
app.put('/supports/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, text } = req.body;

    // Update post in the database
    const result = await pool.query('UPDATE supports SET user_id = ?, text = ? WHERE id = ?', [user_id, text, id]);

    res.status(200).json({ message: "Support successfully updated" });
});


//Пожелания к приложению
app.post('/wishes', async (req, res) => {
    const { id, user_id ,grade, wish } = req.body;

    // Basic validation
    if (!id || !user_id || !grade || !wish) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert new post into the database
    const result = await pool.query('INSERT INTO wishes (id, user_id, grade, wish) VALUES (?, ?, ?, ?)', [id, user_id, grade, wish]);
    const wish_id = result.insertId;

    res.status(201).json({ message: "Wish successfully added", wish_id: wish_id });
}
);

//Получение всех пожеланий из базы данных
app.get('/wishes', async (req, res) => {
    pool.query('SELECT * FROM wishes', (error, results, fields) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ message: "All wishes successfully retrieved", wishes: results });
    });
});

//Удаление пожелания по ID
app.delete('/wishes/:id', async (req, res) => {
    const { id } = req.params;

    // Delete post from the database
    const result = await pool.query('DELETE FROM wishes WHERE id = ?', [id]);

    res.status(200).json({ message: "Wish successfully deleted" });
});



// Run the server in 3000 port  //  Запуск сервера на 3000 порту
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});