const express = require('express');
const pool = require('./db/database');
const app = express();
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

//Регистрация нового пользователя
app.post('/register', async (req, res) => {
    const { department_id, email, password, name, role, ban, place, image, phone, birthday, points } = req.body;

    // Basic validation
    if (!department_id || !email || !password || !name | !place) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Insert new user into the database
    const result = await pool.query('INSERT INTO users ( department_id, email, password, name, place) VALUES (?, ?, ?, ?, ?)', [department_id, email, password, name, place]);
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


// Run the server in 3000 port  //  Запуск сервера на 3000 порту
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});