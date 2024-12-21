const baseUrl = 'http://localhost:3000/api/recipes';

let recipesData = []; // Для хранения всех рецептов

// Функция для загрузки рецептов
async function fetchRecipes() {
    const response = await fetch(baseUrl);
    recipesData = await response.json();
    displayRecipes(recipesData);
}

// Функция для отображения рецептов
function displayRecipes(recipes) {
    const recipesDiv = document.getElementById('recipes');
    recipesDiv.innerHTML = ''; // Очищаем контейнер для рецептов
    
    recipes.forEach(recipe => {
        const recipeDiv = document.createElement('div');
        recipeDiv.innerHTML = `
            <h3><i>${recipe.name}</i></h3>
            <p><strong>Описание:</strong> ${recipe.description}</p>
            <p><strong>Ингредиенты:</strong> ${recipe.ingredient_list}</p>
            <p><strong>Время подготовки:</strong> ${recipe.preparation_time} минут</p>
            <p><strong>Время готовки:</strong> ${recipe.cooking_time} минут</p>
            <button onclick="editRecipe(${recipe.id})">Редактировать</button>
            <button onclick="deleteRecipe(${recipe.id})">Удалить</button>
            <hr>
        `;
        recipesDiv.appendChild(recipeDiv);
    });
}

// Функция для редактирования рецепта
function editRecipe(id) {
    const recipe = recipesData.find(r => r.id === id);
    document.getElementById('name').value = recipe.name;
    document.getElementById('description').value = recipe.description;
    document.getElementById('ingredient_list').value = recipe.ingredient_list;
    document.getElementById('preparation_time').value = recipe.preparation_time;
    document.getElementById('cooking_time').value = recipe.cooking_time;

    // Удалить старые данные, чтобы при сохранении они не создавали новый рецепт
    document.getElementById('recipeForm').setAttribute('data-id', id);
}

// Обновление и добавление рецепта
document.getElementById('recipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('recipeForm').getAttribute('data-id');
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const ingredient_list = document.getElementById('ingredient_list').value.split(',').map(ingredient => ingredient.trim());
    const preparation_time = parseInt(document.getElementById('preparation_time').value, 10);
    const cooking_time = parseInt(document.getElementById('cooking_time').value, 10);

    const newRecipe = {
        name,
        description,
        ingredient_list: ingredient_list.join(", "),
        preparation_time,
        cooking_time
    };

    if (id) {
        const response = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        });
        
        if (response.ok) {
            alert('Рецепт обновлен!');
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    } else {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        });
        
        if (response.ok) {
            alert('Рецепт добавлен!');
        } else {
            const errorData = await response.json();
            alert(`Ошибка: ${errorData.error}`);
        }
    }

    fetchRecipes();
    document.getElementById('recipeForm').reset();
    document.getElementById('recipeForm').removeAttribute('data-id');
});

// Функция удаления рецепта
async function deleteRecipe(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        alert('Рецепт удалён!');
        fetchRecipes(); // Обновляем список рецептов
    }
}

// Функция фильтрации
function filterRecipes() {
    const filterValue = document.getElementById('filter').value.toLowerCase();
    const filteredRecipes = recipesData.filter(recipe => recipe.name.toLowerCase().includes(filterValue));
    displayRecipes(filteredRecipes);
}

fetch('http://localhost:3000/api/server-info')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });

// Загрузка информации об операционной системе при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fetchRecipes(); // существующая функция
});
