const express = require('express');
const pool = require('./db/database');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;


app.use(bodyParser.json());

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

app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address } = req.body;

    // Update post in the database
    const result = await pool.query('UPDATE posts SET user_id = ?, department_id = ?, title = ?, appeal = ?, description = ?, date = ?, image_one = ?, image_two = ?, image_three = ?, image_four = ?, video = ?, status = ?, place = ?, address = ? WHERE id = ?', [user_id, department_id, title, appeal, description, date, image_one, image_two, image_three, image_four, video, status, place, address, id]);
    // console.log(result);
    res.status(200).json({ message: "Post successfully updated" });
});

// Run the server in 3000 port  //  Запуск сервера на 3000 порту
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
