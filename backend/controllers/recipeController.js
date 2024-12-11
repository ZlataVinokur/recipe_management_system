const db = require('../db/database');

// Получить список рецептов
exports.getRecipes = (req, res) => {
    const query = "SELECT * FROM recipes";
    db.all(query, [], (err, recipes) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(recipes);
    });
    
};

// Получить единичный рецепт
exports.getRecipe = (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM recipes WHERE id = ?";
    db.get(query, [id], (err, recipe) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!recipe) {
            return res.status(404).json({ message: 'Рецепт не найден' });
        }
        res.json(recipe);
    });
};

// Функция для создания рецепта
exports.createRecipe = (req, res) => {
    const { name, description, ingredient_list, preparation_time, cooking_time } = req.body;

    // Проверка на отсутствие обязательных данных
    if (!name || !description || !ingredient_list) {
        return res.status(400).json({ error: "Имя, описание и список ингредиентов обязательны." });
    }

    const queryCheck = `SELECT * FROM recipes WHERE name = ?`;
    db.get(queryCheck, [name], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Ошибка базы данных." });
        }
        // Проверка на конфликт имен
        if (row) {
            return res.status(409).json({ error: "Рецепт с таким именем уже существует." });
        }

        const queryInsert = `INSERT INTO recipes (name, description, ingredient_list, preparation_time, cooking_time) VALUES (?, ?, ?, ?, ?)`;
        db.run(queryInsert, [name, description, ingredient_list, preparation_time, cooking_time], function(err) {
            if (err) {
                return res.status(500).json({ error: "Ошибка при создании рецепта." });
            }
            res.status(201).json({
                message: "Рецепт успешно создан!",
                id: this.lastID
            });
        });
    });
};

// Обновление рецепта
exports.updateRecipe = (req, res) => {
    const id = req.params.id;
    const { name, description, ingredient_list, preparation_time, cooking_time } = req.body;

    const query = `UPDATE recipes SET name = ?, description = ?, ingredient_list = ?, preparation_time = ?, cooking_time = ? WHERE id = ?`;

    db.run(query, [name, description, ingredient_list, preparation_time, cooking_time, id], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Рецепт обновлен!", id: id });
    });
};

// Удаление рецепта
exports.deleteRecipe = (req, res) => {
    const id = req.params.id;

    const query = `DELETE FROM recipes WHERE id = ?`;
    db.run(query, id, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Рецепт удален!", id: id });
    });
};