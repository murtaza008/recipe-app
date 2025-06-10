const searchBtn = document.querySelector(".searchBtn");
const searchBox = document.querySelector(".searchBox");
const recipeContainer = document.querySelector(".recipe-container");
const recipeCloseBtn = document.querySelector(".recipe-closeBtn");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeDetails = document.querySelector(".recipe-details");

// Show loading state
const showLoading = () => {
    recipeContainer.innerHTML = `
        <div class="loading">
            <h2>Fetching Recipes...</h2>
            <div class="loading-spinner"></div>
        </div>
    `;
};

// Show error state
const showError = (message) => {
    recipeContainer.innerHTML = `
        <div class="error">
            <h2>Oops! Something went wrong</h2>
            <p>${message}</p>
        </div>
    `;
};

// Handle search
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (searchInput) {
        fetchRecipe(searchInput);
    } else {
        showError("Please enter a recipe name to search");
    }
});

// Fetch recipes from API
const fetchRecipe = async (query) => {
    try {
        showLoading();
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const response = await data.json();

        if (!response.meals) {
            showError("No recipes found. Try a different search term.");
            return;
        }

        recipeContainer.innerHTML = "";
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p><strong>${meal.strArea}</strong> Cuisine</p>
                <p>Category: ${meal.strCategory}</p>
            `;

            const btn = document.createElement("button");
            btn.textContent = "View Recipe";
            recipeDiv.appendChild(btn);

            btn.addEventListener("click", () => {
                openRecipePopup(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } catch (error) {
        showError("Failed to fetch recipes. Please try again later.");
        console.error("Error fetching recipes:", error);
    }
};

// Open recipe popup
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <div class="recipe-info">
            <p><strong>Cuisine:</strong> ${meal.strArea}</p>
            <p><strong>Category:</strong> ${meal.strCategory}</p>
        </div>
        <h3>Ingredients</h3>
        <ul>${fetchIngredients(meal)}</ul>
        <div class="instructions">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
        </div>
        ${meal.strYoutube ? `
            <div class="video-link">
                <a href="${meal.strYoutube}" target="_blank" class="youtube-btn">
                    Watch on YouTube
                </a>
            </div>
        ` : ''}
    `;
    recipeDetails.classList.add("active");
};

// Fetch ingredients
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
};

// Close recipe popup
recipeCloseBtn.addEventListener("click", () => {
    recipeDetails.classList.remove("active");
});

// Close popup when clicking outside
recipeDetails.addEventListener("click", (e) => {
    if (e.target === recipeDetails) {
        recipeDetails.classList.remove("active");
    }
});

// Handle Enter key in search
searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchBtn.click();
    }
});