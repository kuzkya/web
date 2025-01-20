const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Создаем приложение Express
const app = express();
const port = 5000; 

app.use(cors());
app.use(express.json()); 

// Подключение к базе данных
const db = mysql.createConnection({
    host: 'localhost',       // Хост базы данных
    user: 'root',            // Имя пользователя базы данных
    password: 'root',    // Пароль пользователя базы данных
    database: 'Port' // Название базы данных
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно!');
});

// Маршрут для проверки работы сервера
app.get('/', (req, res) => {
    res.send('Сервер работает!');
});

// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------

// Получение всех рейсов
app.get('/trips', (req, res) => {
    const sql = `
        SELECT 
            t.id AS trip_id,
            d.name AS destination_name,
            d.id AS destination_id,
            f.name AS ferry_name,
            f.car_capacity AS max_cars,
            f.cargo_capacity AS max_cargos,
            f.id AS ferry_id,
            c.id AS cargo_id,
            c.name AS cargo_name,
            c.is_cargo,
            vt.size AS size,
            vt.name AS cargo_type,
            ti.id AS trip_item_id
        FROM Trips t
        LEFT JOIN Destinations d ON t.destination_id = d.id
        LEFT JOIN Ferries f ON t.ferry_id = f.id
        LEFT JOIN Trip_Items ti ON t.id = ti.trip_id
        LEFT JOIN Cargos c ON ti.cargo_id = c.id
        LEFT JOIN Cargo_types vt ON c.type_id = vt.id
        ORDER BY t.id, ti.id;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при выполнении запроса:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных', details: err });
        }

        const trips = {};

        results.forEach(row => {
            const { trip_id, destination_name, destination_id, ferry_name, max_cars, max_cargos, ferry_id, cargo_id, cargo_name, is_cargo, size, cargo_type } = row;
            
            // Если рейс еще не добавлен в объект, создаем его с пустым массивом cargo_vehicles
            if (!trips[trip_id]) {
                trips[trip_id] = {
                    trip_id,
                    destination_name,
                    destination_id,
                    ferry_id,
                    ferry_name,
                    max_cars,
                    max_cargos,
                    cargos: []
                };
            }

            // Добавляем груз или автомобиль к рейсу
            if (cargo_id) {
                trips[trip_id].cargos.push({
                    cargo_id,
                    cargo_name,
                    is_cargo,
                    size,
                    cargo_type
                });
            }
        });

        // Преобразуем объект trips в массив для ответа
        const response = Object.values(trips);

        res.json(response); 
    });
});

// Добавление рейса
app.post('/trips/add', (req, res) => {
    const { destination_id, ferry_id } = req.body;

    if (!destination_id || !ferry_id) {
        return res.status(400).json({ error: 'Недостаточно данных' });
    }

    const sql = `
        INSERT INTO Trips (destination_id, ferry_id)
        VALUES (?, ?)
    `;

    db.query(sql, [destination_id, ferry_id], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении рейса:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении рейса', details: err });
        }

        res.status(201).json({ message: 'Рейс успешно добавлен', trip_id: result.insertId });
    });
});

// Удаление рейса и связанных грузов
app.delete('/trips/delete/:id', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Необходимо указать id' });
    }

    // SQL-запрос для получения всех грузов, связанных с данным рейсом
    const getCargoIdsSql = `
        SELECT cargo_id FROM Trip_Items WHERE trip_id = ?
    `;

    // SQL-запрос для удаления всех записей из Trip_Items, связанных с данным рейсом
    const deleteTripItemsSql = `
        DELETE FROM Trip_Items WHERE trip_id = ?
    `;

    // SQL-запрос для удаления самих грузов из таблицы Cargos
    const deleteCargosSql = `
        DELETE FROM Cargos WHERE id IN (?)
    `;

    // SQL-запрос для удаления самого рейса
    const deleteTripSql = `
        DELETE FROM Trips WHERE id = ?
    `;

    // Получаем все грузовые ID, связанные с рейсом
    db.query(getCargoIdsSql, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при получении грузов рейса:', err);
            return res.status(500).json({ error: 'Ошибка при получении грузов рейса', details: err });
        }

        const cargoIds = results.map(row => row.cargo_id);

        // Удаляем связи из Trip_Items
        db.query(deleteTripItemsSql, [id], (err) => {
            if (err) {
                console.error('Ошибка при удалении элементов рейса:', err);
                return res.status(500).json({ error: 'Ошибка при удалении элементов рейса', details: err });
            }

            // Удаляем грузы, если они существуют
            if (cargoIds.length > 0) {
                db.query(deleteCargosSql, [cargoIds], (err) => {
                    if (err) {
                        console.error('Ошибка при удалении грузов:', err);
                        return res.status(500).json({ error: 'Ошибка при удалении грузов', details: err });
                    }

                    // Удаляем сам рейс
                    db.query(deleteTripSql, [id], (err) => {
                        if (err) {
                            console.error('Ошибка при удалении рейса:', err);
                            return res.status(500).json({ error: 'Ошибка при удалении рейса', details: err });
                        }

                        res.status(200).json({ message: 'Рейс и связанные грузы успешно удалены' });
                    });
                });
            } else {
                // Если нет грузов, удаляем только рейс
                db.query(deleteTripSql, [id], (err) => {
                    if (err) {
                        console.error('Ошибка при удалении рейса:', err);
                        return res.status(500).json({ error: 'Ошибка при удалении рейса', details: err });
                    }

                    res.status(200).json({ message: 'Рейс успешно удален (грузы отсутствовали)' });
                });
            }
        });
    });
});

// Обновление данных о рейсе
app.put('/trips/update/:id', (req, res) => {
    const { id } = req.params;
    const { destination_id, ferry_id } = req.body;

    if (!destination_id || !ferry_id) {
        return res.status(400).json({ error: 'Необходимо указать destination_id и ferry_id' });
    }

    const sql = `
        UPDATE Trips 
        SET destination_id = ?, ferry_id = ? 
        WHERE id = ?
    `;

    db.query(sql, [destination_id, ferry_id, id], (err, result) => {
        if (err) {
            console.error('Ошибка при обновлении рейса:', err);
            return res.status(500).json({ error: 'Ошибка при обновлении рейса', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Рейс не найден' });
        }

        res.status(200).json({ message: 'Рейс успешно обновлен' });
    });
});

// Получение всех пунктов назначения
app.get('/destinations', (req, res) => {
    const sql = `SELECT * FROM Destinations`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении данных о пунктах назначения:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных о пунктах назначения', details: err });
        }

        res.status(200).json(results);
    });
});

// Добавление пункта назначения
app.post('/destinations/add', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Необходимо указать название пункта назначения' });
    }

    const sql = `
        INSERT INTO Destinations (name) 
        VALUES (?)
    `;

    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении пункта назначения:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении пункта назначения', details: err });
        }

        res.status(201).json({ message: 'Пункт назначения успешно добавлен', destination_id: result.insertId });
    });
});

// Получение всех судов
app.get('/ferries', (req, res) => {
    const sql = `SELECT * FROM Ferries`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении данных о паромах:', err);
            return res.status(500).json({ error: 'Ошибка при получении данных о паромах', details: err });
        }

        res.status(200).json(results);
    });
});

// Получение всех типов грузов
app.get('/cargo-types', (req, res) => {
    const sql = `SELECT * FROM cargo_types`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Ошибка при получении типов грузов:', err);
            return res.status(500).json({ error: 'Ошибка при получении типов грузов', details: err });
        }

        res.status(200).json(results);
    });
});

// Добавление груза
app.post('/cargos/add', (req, res) => {
    const { name, type_id, trip_id } = req.body;

    if (!name || type_id === undefined || trip_id === undefined) {
        return res.status(400).json({ error: 'Все поля должны быть заполнены' });
    }

    let is_cargo;
    is_cargo = type_id === "4" ? 1 : 0;

    // Вставка в таблицу Cargos
    const sqlInsertCargo = `INSERT INTO Cargos (name, type_id, is_cargo) VALUES (?, ?, ?)`;

    db.query(sqlInsertCargo, [name, type_id, is_cargo], (err, result) => {
        if (err) {
            console.error('Ошибка при добавлении груза:', err);
            return res.status(500).json({ error: 'Ошибка при добавлении груза', details: err });
        }

        const cargo_id = result.insertId;

        // Вставка связи между грузом и рейсом в таблицу trip_items
        const sqlInsertTripItem = `INSERT INTO trip_items (trip_id, cargo_id) VALUES (?, ?)`;
        
        db.query(sqlInsertTripItem, [trip_id, cargo_id], (err, result) => {
            if (err) {
                console.error('Ошибка при добавлении связи с рейсом:', err);
                return res.status(500).json({ error: 'Ошибка при добавлении связи с рейсом', details: err });
            }

            res.status(201).json({ message: 'Груз и связь с рейсом успешно добавлены', cargo_id });
        });
    });
});

// Перемещение груза между рейсами
app.put('/cargos/move/:id', (req, res) => {
    const { id } = req.params;
    const { trip_id } = req.body;

    if (!id || !trip_id) {
        return res.status(400).json({ error: 'Необходимо передать id и trip_id' });
    }

    const checkCargoQuery = 'SELECT * FROM Cargos WHERE id = ?';
    db.query(checkCargoQuery, [id], (err, results) => {
        if (err) {
            console.error('Ошибка при проверке груза:', err);
            return res.status(500).json({ error: 'Ошибка при проверке груза', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Груз не найден' });
        }

        const checkTripQuery = 'SELECT * FROM Trips WHERE id = ?';
        db.query(checkTripQuery, [trip_id], (err, results) => {
            if (err) {
                console.error('Ошибка при проверке рейса:', err);
                return res.status(500).json({ error: 'Ошибка при проверке рейса', details: err });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Рейс не найден' });
            }

            const updateQuery = 'UPDATE Trip_Items SET trip_id = ? WHERE cargo_id = ?';
            db.query(updateQuery, [trip_id, id], (err, result) => {
                if (err) {
                    console.error('Ошибка при перемещении груза:', err);
                    return res.status(500).json({ error: 'Ошибка при перемещении груза', details: err });
                }

                if (result.affectedRows === 0) {
                    return res.status(400).json({ error: 'Груз не был перемещен (возможно, уже находится на этом рейсе)' });
                }

                res.status(200).json({ message: 'Груз успешно перемещен', id });
            });
        });
    });
});

// Удаление груза
app.delete('/cargos/delete/:id', (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Необходимо передать cargo_id' });
    }

    const deleteTripItemQuery = 'DELETE FROM Trip_Items WHERE cargo_id = ?';
    db.query(deleteTripItemQuery, [id], (err, result) => {
        if (err) {
            console.error('Ошибка при удалении связи с рейсом:', err);
            return res.status(500).json({ error: 'Ошибка при удалении связи с рейсом', details: err });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Груз не найден на рейсе' });
        }

        const deleteCargoQuery = 'DELETE FROM Cargos WHERE id = ?';
        db.query(deleteCargoQuery, [id], (err, result) => {
            if (err) {
                console.error('Ошибка при удалении груза:', err);
                return res.status(500).json({ error: 'Ошибка при удалении груза', details: err });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Груз не найден' });
            }

            res.status(200).json({ message: 'Груз успешно удален', cargo_id: id });
        });
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});