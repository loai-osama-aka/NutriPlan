/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */



import {

    searchMeals,
    getAllCat,
    getMealById,
    filterMealByCategory,
    filterMealByArea,
    searchProducts,
    getProductByBarCode,
    analyzeRecipe,
    getAreas
} from "./api/mealdb.js";

const searchmeal = await searchMeals("beef")
console.log("search", searchmeal.results);


const area = await getAreas()
console.log("area", area);

const productData = await searchProducts("nutella")
console.log("productData", productData);
const productByBarCode = await getProductByBarCode("3017620422003")
console.log("productByBarCode", productByBarCode);

/*********************النقل بين الصفحات********************/
const navLinks = document.querySelectorAll(".nav-link");

// كل السكاشن
const sections = {
    meals: [

        "search-filters-section",
        "meal-categories-section",
        "all-recipes-section"
    ],
    products: ["products-section"],
    foodlog: ["foodlog-section"]
};

const headerContent = {
    meals: {
        title: "Meals & Recipes",
        subtitle: "Discover delicious and nutritious recipes tailored for you"
    },
    products: {
        title: "Products Scanner",
        subtitle: "Search packaged foods by name or barcode"
    },
    foodlog: {
        title: "Food Log",
        subtitle: "Track your daily nutrition and food intake"
    }
};
const headerDiv = document.getElementById("header-content");

navLinks.forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();

        const page = link.dataset.page;

        hideAllSections();
        showSections(sections[page]);
        setActiveLink(link);


        if (headerContent[page]) {
            headerDiv.innerHTML = `
        <h1 class="text-2xl font-bold text-gray-900">
          ${headerContent[page].title}
        </h1>
        <p class="text-sm text-gray-500 mt-1">
          ${headerContent[page].subtitle}
        </p>
      `;
        }
    });
});


// helper function
function hideAllSections() {
    document.querySelectorAll("section").forEach(sec => {
        sec.classList.add("hidden");
        
    });

   
}

    // helper function
    function showSections(sectionIds) {

        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove("hidden");
        });
    }

    // Active link styling
    function setActiveLink(activeLink) {
        navLinks.forEach(link => {
            link.classList.remove("bg-emerald-50", "text-emerald-700");
            link.classList.add("text-gray-600");
        });

        activeLink.classList.add("bg-emerald-50", "text-emerald-700");
        activeLink.classList.remove("text-gray-600");
    }

    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            const page = link.dataset.page;

            hideAllSections();
            showSections(sections[page]);
            setActiveLink(link);

        });
    });



    /*****************************************/

    // المتغيرات الرئيسية
    let allMeals = [];
    const recipesGrid = document.getElementById("recipes-grid");
    const recipesCount = document.getElementById("recipes-count");
    const categoriesGrid = document.getElementById("categories-grid");
    const searchInput = document.getElementById("search-input");
    const gridViewBtn = document.getElementById("grid-view-btn");
    const listViewBtn = document.getElementById("list-view-btn");
    const body = document.body;
    const openBtn = document.getElementById("header-menu-btn");
    const closeBtn = document.getElementById("sidebar-close-btn");
    const overlay = document.getElementById("sidebar-overlay");

    //  Initialize app
    async function initHomePage() {

        const data = await searchMeals();
        allMeals = data.results;

        console.log('All meals:', allMeals);

        showMeal(allMeals);

        const catData = await getAllCat();
        console.log('catdata', catData.results);

        const categories = catData.results.map(c => c.name); // extract names
        renderCategories(categories);
        console.log('Categories', catData);


        const areaData = await getAreas();
        const areas = Array.from(new Set(areaData.results.map(a => a.name)))
        console.log("area::", areas);

        renderAreas(areas);



    }


    // Render Meals
    function showMeal(meal) {
        let cartoona = '';
        for (const element of meal) {
            cartoona += `
        <div class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group" data-meal-id="${element.id}">
          <div class="relative h-48 overflow-hidden">
            <img
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src="${element.thumbnail}"
              alt="${element.name}"
              loading="lazy"
            />
            <div class="absolute bottom-3 left-3 flex gap-2">
              <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                <i class="fa-solid text-emerald-600 fa-tag"></i> ${element.category}
              </span>
              <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-lg">
                <i class="fa-solid fa-globe text-blue-500 mr-1"></i> ${element.area}
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
              ${element.name}
            </h3>
            <p class="text-xs text-gray-600 mb-3 line-clamp-2">
              ${element.instructions}
            </p>
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-gray-900">
                <i class="fa-solid fa-utensils mr-1 text-emerald-600"></i>
                ${element.category}
              </span>
              <span class="font-semibold text-gray-500">
                <i class="fa-solid fa-globe text-blue-500 mr-1"></i> ${element.area}
              </span>
            </div>
          </div>
        </div>
      `;
        }
        recipesGrid.innerHTML = cartoona;
        recipesCount.textContent = `Showing ${meal.length} recipes`;
    }


    //Render Categories 
    // Category styles mapping
    const categoryStylesMap = {
        Beef: {
            card: "from-red-50 to-rose-50 border border-red-200 hover:border-red-400",
            icon: "from-red-400 to-rose-500",
            fa: "fa-drumstick-bite"
        },
        Chicken: {
            card: "from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-400",
            icon: "from-amber-400 to-orange-500",
            fa: "fa-drumstick-bite"
        },
        Dessert: {
            card: "from-pink-50 to-rose-50 border border-pink-200 hover:border-pink-400",
            icon: "from-pink-400 to-rose-500",
            fa: "fa-cake-candles"
        },
        Lamb: {
            card: "from-orange-50 to-amber-50 border border-orange-200 hover:border-orange-400",
            icon: "from-orange-400 to-amber-500",
            fa: "fa-drumstick-bite"
        },
        Miscellaneous: {
            card: "from-slate-50 to-gray-50 border border-slate-200 hover:border-slate-400",
            icon: "from-slate-400 to-gray-500",
            fa: "fa-bowl-rice"
        },
        Pasta: {
            card: "from-yellow-50 to-amber-50 border border-yellow-200 hover:border-yellow-400",
            icon: "from-yellow-400 to-amber-500",
            fa: "fa-bowl-food"
        },
        Pork: {
            card: "from-rose-50 to-red-50 border border-rose-200 hover:border-rose-400",
            icon: "from-rose-400 to-red-500",
            fa: "fa-bacon"
        },
        Seafood: {
            card: "from-cyan-50 to-blue-50 border border-cyan-200 hover:border-cyan-400",
            icon: "from-cyan-400 to-blue-500",
            fa: "fa-fish"
        },
        Side: {
            card: "from-green-50 to-emerald-50 border border-green-200 hover:border-green-400",
            icon: "from-green-400 to-emerald-500",
            fa: "fa-bowl-rice"
        },
        Starter: {
            card: "from-teal-50 to-cyan-50 border border-teal-200 hover:border-teal-400",
            icon: "from-teal-400 to-cyan-500",
            fa: "fa-burger"
        },
        Vegan: {
            card: "from-emerald-50 to-green-50 border border-emerald-200 hover:border-emerald-400",
            icon: "from-emerald-400 to-green-500",
            fa: "fa-seedling"
        },
        Vegetarian: {
            card: "from-lime-50 to-green-50 border border-lime-200 hover:border-lime-400",
            icon: "from-lime-400 to-green-500",
            fa: "fa-leaf"
        },
        Breakfast: {
            card: "from-orange-50 to-yellow-50 border border-orange-200 hover:border-orange-400",
            icon: "from-orange-400 to-yellow-500",
            fa: "fa-bread-slice"
        },
        Goat: {
            card: "from-green-50 to-emerald-50 border border-green-200 hover:border-green-400",
            icon: "from-green-400 to-emerald-500 ",
            fa: "fa-drumstick-bite"
        }
    };

    function renderCategories(categories) {
        let cartoona = "";

        categories.forEach((category) => {
            const style = categoryStylesMap[category];

            cartoona += `
      <div class="category-card bg-gradient-to-br ${style.card} rounded-xl p-3 cursor-pointer transition-all group" data-category="${category}">
        <div class="flex items-center gap-2.5">
          <div class="text-white w-9 h-9 bg-gradient-to-br ${style.icon} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <i class="fa-solid ${style.fa}"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">${category}</h3>
          </div>
        </div>
      </div>
    `;
        });

        categoriesGrid.innerHTML = cartoona;
    }




    // Render Areas 
    const areaContainer = document.querySelector("#search-filters-section .flex.items-center.gap-3");

    function renderAreas(areas) {
        let cartoona = `
    <button
      class="px-4 py-2 bg-emerald-600 text-white rounded-full font-medium text-sm whitespace-nowrap hover:bg-emerald-700 transition-all area-btn"
      data-area="all"
    >
      All Recipes
    </button>
  `;

        for (const area of areas) {
            cartoona += `
      <button
        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all area-btn"
        data-area="${area}"
      >
        ${area}
      </button>
    `;
        }

        areaContainer.innerHTML = cartoona;
    }


    areaContainer.addEventListener("click", async (e) => {
        if (!e.target.classList.contains("area-btn")) return;

        const clickedBtn = e.target;
        const area = clickedBtn.dataset.area;

        // reset buttons
        document.querySelectorAll(".area-btn").forEach(btn => {
            btn.classList.remove("bg-emerald-600", "text-white", "hover:bg-emerald-700");
            btn.classList.add("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
        });

        // activate clicked
        clickedBtn.classList.remove("bg-gray-100", "text-gray-700", "hover:bg-gray-200");
        clickedBtn.classList.add("bg-emerald-600", "text-white", "hover:bg-emerald-700");

        if (area === "all") {
            showMeal(allMeals); // show all recipes
        } else {
            const data = await filterMealByArea(area);
            showMeal(data.results);
        }
    });



    openBtn.addEventListener("click", () => {
        body.classList.add("sidebar-open");
        overlay.style.display = "flex"
    });

    function closeSidebar() {
        body.classList.remove("sidebar-open");
        overlay.style.display = "none"

    }
    document.addEventListener("keyup", (e) => {
        if (e.code == "Escape") { closeSidebar() }

    })
    closeBtn.addEventListener("click", closeSidebar);
    overlay.addEventListener("click", closeSidebar);


    //  Event Listeners
    // Search
    searchInput.addEventListener("input", async (e) => {
        const query = e.target.value.trim();
        const data = await searchMeals(query);
        const meals = data.results;
        showMeal(meals);
    });

    // Filter by Category
    categoriesGrid.addEventListener("click", async (e) => {
        const cat = e.target.closest(".category-card")?.dataset.category;
        if (!cat) return;
        const data = await filterMealByCategory(cat);
        showMeal(data.results);
    });



    // the view toggle

    function setGridView() {
        // layout
        recipesGrid.classList.remove("grid-cols-2", "gap-4");
        recipesGrid.classList.add("grid-cols-4", "gap-5");

        // buttons UI
        gridViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
        listViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");

        gridViewBtn.querySelector("i").classList.replace("text-gray-500", "text-gray-700");
        listViewBtn.querySelector("i").classList.replace("text-gray-700", "text-gray-500");
    }

    function setListView() {
        // layout
        recipesGrid.classList.remove("grid-cols-4", "gap-5");
        recipesGrid.classList.add("grid-cols-2", "gap-4");

        // buttons UI
        listViewBtn.classList.add("bg-white", "rounded-md", "shadow-sm");
        gridViewBtn.classList.remove("bg-white", "rounded-md", "shadow-sm");

        listViewBtn.querySelector("i").classList.replace("text-gray-500", "text-gray-700");
        gridViewBtn.querySelector("i").classList.replace("text-gray-700", "text-gray-500");
    }
    gridViewBtn.addEventListener("click", setGridView);
    listViewBtn.addEventListener("click", setListView);


    initHomePage();


    /********************NEXT SECTION: MEAL DETAILS***************/
    // Sections
    const searchFiltersSection = document.getElementById("search-filters-section");
    const mealCategoriesSection = document.getElementById("meal-categories-section");
    const mealsSection = document.getElementById("all-recipes-section");
    const mealDetailsSection = document.getElementById("meal-details");
    const logBtn = document.getElementById("log-meal-btn");
    // Back button
    const backBtn = document.getElementById("back-to-meals-btn");

    backBtn.addEventListener("click", () => {
        // Hide meal details
        mealDetailsSection.classList.add("hidden");

        // Show the main sections again
        searchFiltersSection.classList.remove("hidden");
        mealCategoriesSection.classList.remove("hidden");
        mealsSection.classList.remove("hidden");

    });



    // لما تضغط على وجبة
    recipesGrid.addEventListener("click", async (e) => {
        const card = e.target.closest(".recipe-card");
        if (!card) return;

        const mealId = card.dataset.mealId;

        // 1. جلب تفاصيل الوجبة
        const mealData = await getMealById(mealId);
        console.log('meal', mealData.result);
        const meal = mealData.result;
        const ingredients = mapMealIngredients(meal);
        // 3. Analyze API (بطريقتك)
        const analyzeResponse = await analyzeRecipe(meal.name, ingredients);
        const analyzedData = analyzeResponse.data
        const nutrition = analyzedData.perServing
        const totals = analyzedData.totals
        const mealName = mealData.result.name;
        console.log('meal', mealName);





        function mapMealIngredients(meal) {
            return meal.ingredients.map(item => {
                if (!item.measure) return item.ingredient;
                return `${item.measure} ${item.ingredient}`;
            });
        }



        showMealDetails(meal, nutrition, totals);

        // Toggle sections
        searchFiltersSection.classList.add("hidden");
        mealCategoriesSection.classList.add("hidden");
        mealsSection.classList.add("hidden");
        mealDetailsSection.classList.remove("hidden");

    });






    function showMealDetails(meal, nutrition, totals) {
        let cartoona = '';

        // Hero Section

        cartoona += `

    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
    <div class="relative h-80 md:h-96">
    <img src="${meal.thumbnail}" alt="${meal.name}" class="w-full h-full object-cover" />
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
    <div class="absolute bottom-0 left-0 right-0 p-8">
      <div class="flex items-center gap-3 mb-3">
        <!-- Category -->
        <span class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">${meal.category}</span>
        <!-- Area -->
        <span class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">${meal.area}</span>
        <!-- Tags / Optional: first ingredient as tag -->
        ${meal.ingredients[0] ? `<span class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full">${meal.ingredients[0].ingredient}</span>` : ''}
      </div>

      <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
        <span id="hero-name">${meal.name}</span>
      </h1>

      <div class="flex items-center gap-6 text-white/90">
        <!-- Cooking Time -->
        <span class="flex items-center gap-2">
          <i class="fa-solid fa-clock"></i>
          <span id="hero-time">30 min</span>
        </span>
        <!-- Servings -->
        <span class="flex items-center gap-2">
          <i class="fa-solid fa-utensils"></i>
          <span id="hero-servings">4 servings</span>
        </span>
        <!-- Calories -->
        <span class="flex items-center gap-2">
          <i class="fa-solid fa-fire"></i>
          <span id="hero-calories">
            ${nutrition?.calories != null ? nutrition.calories + " cal/serving" : "N/A"}
           </span>

        </span>
      </div>
    </div>
  </div>
</div>
`;
        //action button
        cartoona += `
        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-8">
        <button id="log-meal-btn"
            class="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
            data-meal-id="${meal.id}">
            <i class="fa-solid fa-clipboard-list"></i>
            <span>Log This Meal</span>
        </button>
        </div>
        `;


        // Ingredients
        cartoona += `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div class="lg:col-span-2 space-y-8">
<div class="bg-white rounded-2xl shadow-lg p-6 ">
  <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <i class="fa-solid fa-list-check text-emerald-600"></i>
    Ingredients
    <span class="text-sm font-normal text-gray-500 ml-auto">${meal.ingredients.length} items</span>
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
`;

        for (const ing of meal.ingredients) {
            cartoona += `
  <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors">
    <input type="checkbox" class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300" />
    <span class="text-gray-700">
      <span class="font-medium text-gray-900">${ing.measure}</span> ${ing.ingredient}
    </span>
  </div>
  `;
        }

        cartoona += `</div></div>`;

        // Instructions
        cartoona += `
<div class="bg-white rounded-2xl shadow-lg p-6 ">
  <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <i class="fa-solid fa-shoe-prints text-emerald-600"></i>
    Instructions
  </h2>
  <div class="space-y-4">
`;

        for (let i = 0; i < meal.instructions.length; i++) {
            cartoona += `
  <div class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
    <div class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
      ${i + 1}
    </div>
    <p class="text-gray-700 leading-relaxed pt-2">
      ${meal.instructions[i]}
    </p>
  </div>
  `;
        }

        cartoona += `</div></div>`;

        // Video Section
        cartoona += `
<div class="bg-white rounded-2xl shadow-lg p-6 ">
  <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <i class="fa-solid fa-video text-red-500"></i>
    Video Tutorial
  </h2>
  <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
    <iframe src="${meal.youtube.replace("watch?v=", "embed/")}" 
      class="absolute inset-0 w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  </div>
</div>
`;


        cartoona += `</div>`;


        // Nutrition Column
        if (nutrition) {
            cartoona += `
  <div class="space-y-6">
    <!-- Nutrition Facts -->
    <div class="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <i class="fa-solid fa-chart-pie text-emerald-600"></i>
        Nutrition Facts
      </h2>

      <div id="nutrition-facts-container">
        <p class="text-sm text-gray-500 mb-4">Per serving</p>

        <!-- Calories -->
        <div class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
          <p class="text-sm text-gray-600">Calories per serving</p>
          <p class="text-4xl font-bold text-emerald-600" id="nf-calories">${nutrition.calories}</p>
          <p class="text-xs text-gray-500 mt-1">Total: <span class="nf-total-calories">${totals.calories}</span> cal</p>
        </div>

        <!-- Macros -->
        <div class="space-y-4">
          ${renderMacro("Protein", nutrition.protein, "emerald", 50)}
          ${renderMacro("Carbs", nutrition.carbs, "blue", 300)}
          ${renderMacro("Fat", nutrition.fat, "purple", 70)}
          ${renderMacro("Fiber", nutrition.fiber, "orange", 30)}
          ${renderMacro("Sugar", nutrition.sugar, "pink", 50)}
        </div>

      

      </div>
    </div>
  </div>
  `;
        }
        cartoona += `</div>`;


        mealDetailsSection.querySelector(".max-w-7xl").innerHTML = cartoona;
    }

    // دالة لرندر كل Macro مع الـ progress bar
    function renderMacro(label, value, color, max) {
        const percent = Math.min((value / max) * 100, 100).toFixed(0);
        return `
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-${color}-500"></div>
        <span class="text-gray-700">${label}</span>
      </div>
      <span class="font-bold text-gray-900">${value}g</span>
    </div>
    <div class="w-full bg-gray-100 rounded-full h-2">
      <div class="bg-${color}-500 h-2 rounded-full" style="width: ${percent}%"></div>
    </div>
    `;
    }



    /**************************NEXT SECTION:FOOD LOG***************************/
    const caloriesBar = document.getElementById("calories-bar");
    const caloriesText = document.getElementById("calories-text");

    const proteinBar = document.getElementById("protein-bar");
    const proteinText = document.getElementById("protein-text");

    const carbsBar = document.getElementById("carbs-bar");
    const carbsText = document.getElementById("carbs-text");

    const fatBar = document.getElementById("fat-bar");
    const fatText = document.getElementById("fat-text");
    const maxValues = {
        calories: 2500,
        protein: 50,
        carbs: 250,
        fat: 60
    };


    const list = document.getElementById("logged-items-list");
    const clearFoodLog = document.getElementById("clear-foodlog")
    const countEl = document.querySelector(".logged-items");
    const productScanner = document.querySelector(".product-scanner")
    const logmeal = document.querySelector(".log-meal")
    let foodLog = [];

    if (localStorage.getItem("foodLog") != null) {
        foodLog = JSON.parse(localStorage.getItem("foodLog"));
        renderWeeklyOverview();
        renderFoodLog();
    }


    document.addEventListener("click", async (e) => {
        const btn = e.target.closest("#log-meal-btn");
        if (!btn) return;

        const mealId = btn.dataset.mealId;

        const mealData = await getMealById(mealId);
        const meal = mealData.result;

        const ingredients = meal.ingredients.map(item =>
            `${item.measure} ${item.ingredient}`
        );

        const analyzeResponse = await analyzeRecipe(meal.name, ingredients);
        const analyzedData = analyzeResponse.data;

        baseNutritionPerServing = {
            calories: analyzedData.perServing.calories,
            protein: analyzedData.perServing.protein,
            carbs: analyzedData.perServing.carbs,
            fat: analyzedData.perServing.fat,
        };

        currentMealForLogging = meal;
        currentServings = 1;

        openLogMealModal(meal, baseNutritionPerServing);
    });

    function openLogMealModal(meal, nutrition) {
        const modal = document.getElementById("log-meal-modal");
        modal.classList.remove("hidden");

        modal.querySelector("img").src = meal.thumbnail;
        modal.querySelector("p.text-gray-500").textContent = meal.name;

        document.getElementById("meal-servings").value = 1;

        updateModalNutrition();
    }

    function updateModalNutrition() {
        document.getElementById("modal-calories").textContent =
            Math.round(baseNutritionPerServing.calories * currentServings);

        document.getElementById("modal-protein").textContent =
            Math.round(baseNutritionPerServing.protein * currentServings) + "g";

        document.getElementById("modal-carbs").textContent =
            Math.round(baseNutritionPerServing.carbs * currentServings) + "g";

        document.getElementById("modal-fat").textContent =
            Math.round(baseNutritionPerServing.fat * currentServings) + "g";
    }

    document.getElementById("increase-servings").addEventListener("click", () => {
        if (currentServings < 10) {
            currentServings += 0.5;
            document.getElementById("meal-servings").value = currentServings;
            updateModalNutrition();
        }
    });

    document.getElementById("decrease-servings").addEventListener("click", () => {
        if (currentServings > 0.5) {
            currentServings -= 0.5;
            document.getElementById("meal-servings").value = currentServings;
            updateModalNutrition();
        }
    });

    document.getElementById("confirm-log-meal").addEventListener("click", () => {
        const mealItem = {
            id: currentMealForLogging.id,
            name: currentMealForLogging.name,
            image: currentMealForLogging.thumbnail,
            nutrition: {
                calories: baseNutritionPerServing.calories * currentServings,
                protein: baseNutritionPerServing.protein * currentServings,
                carbs: baseNutritionPerServing.carbs * currentServings,
                fat: baseNutritionPerServing.fat * currentServings,
            },
            servings: currentServings,
            time: new Date().toISOString()
        };

        foodLog.push(mealItem);
        renderWeeklyOverview();
        localStorage.setItem("foodLog", JSON.stringify(foodLog));

        renderFoodLog();
        updateNutritionBars();
        closeLogMealModal();
        renderWeeklyOverview();
        Swal.fire({
            icon: "success",
            title: "Meal Logged!",
            text: `${currentMealForLogging.name} (${currentServings} ${currentServings > 1 ? "servings" : "serving"}) has been added to your daily log.`,
            timer: 2000,
            showConfirmButton: false
        });
    });

    document.getElementById("cancel-log-meal").addEventListener("click", closeLogMealModal);

    function closeLogMealModal() {
        document.getElementById("log-meal-modal").classList.add("hidden");
    }



    function renderFoodLog() {

        if (countEl) {
            countEl.innerHTML = `Logged Items (${foodLog.length})`;
        }
        if (foodLog.length === 0) {
            list.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
        <p class="font-medium">No meals logged today</p>
        <p class="text-sm">Add meals from the Meals page</p>
      </div>
    `;
            if (clearFoodLog) clearFoodLog.style.display = "none";
            if (countEl) countEl.innerHTML = `Logged Items (0)`;
            return;
        }
        if (clearFoodLog) clearFoodLog.style.display = "block";

        list.innerHTML = foodLog
            .map((item, index) => {
                return `
<div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
  <div class="flex items-center gap-4">
    <img src="${item.image}" alt="${item.name}"
      class="w-14 h-14 rounded-xl object-cover">
    <div>
      <p class="font-semibold text-gray-900">${item.name}</p>
      <p class="text-sm text-gray-500">
        1 serving
        <span class="mx-1">•</span>
        <span class="${item.type == "product" ? "text-blue-600" : "text-emerald-600"}">${item.type == "product" ? "product" : "Recipe"}</span>
      </p>
      <p class="text-xs text-gray-400 mt-1">
        ${new Date(item.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
    </div>
  </div>

  <div class="flex items-center gap-4">
    <div class="text-right">
      <p class="text-lg font-bold text-emerald-600">
        ${item.nutrition.calories}
      </p>
      <p class="text-xs text-gray-500">kcal</p>
    </div>

    <div class="hidden md:flex gap-2 text-xs text-gray-500">
      <span class="px-2 py-1 bg-blue-50 rounded">${item.nutrition.protein}g P</span>
      <span class="px-2 py-1 bg-blue-50 rounded">${item.nutrition.carbs}g C</span>
      <span class="px-2 py-1 bg-blue-50 rounded">${item.nutrition.fat}g F</span>
    </div>

    <button
      class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2"
      data-index="${index}">
      <i class="fa-solid fa-trash-can"></i>
    </button>
  </div>
</div>
`;
            })
            .join("");
        updateNutritionBars();

    }


    function buildWeeklySummary() {
        const summary = {};

        foodLog.forEach(item => {
            const dateKey = new Date(item.time).toDateString();

            if (!summary[dateKey]) {
                summary[dateKey] = {
                    calories: 0,
                    count: 0
                };
            }

            summary[dateKey].calories += item.nutrition.calories || 0;
            summary[dateKey].count += 1;
        });

        return summary;
    }


    function renderWeeklyOverview() {
        const container = document.getElementById("weekly-overview");


        const summary = buildWeeklySummary();
        container.innerHTML = "";

        for (let i = 6; i >= 0; i--) {
            const day = new Date();
            day.setDate(day.getDate() - i);

            const key = day.toDateString();
            const data = summary[key] || { calories: 0, count: 0 };
            const isToday = key === new Date().toDateString();

            container.innerHTML += `
      <div class="text-center ${isToday ? "bg-indigo-100 rounded-xl" : ""}">
        <p class="text-xs text-gray-500 mb-1">
          ${day.toLocaleDateString("en-US", { weekday: "short" })}
        </p>
        <p class="text-sm font-medium text-gray-900">${day.getDate()}</p>

        <div class="mt-2 ${data.calories ? "text-emerald-600" : "text-gray-300"
                }">
          <p class="text-lg font-bold">${data.calories}</p>
          <p class="text-xs">kcal</p>
        </div>

        ${data.count
                    ? `<p class="text-xs text-gray-400 mt-1">${data.count} items</p>`
                    : ""
                }
      </div>
    `;
        }
    }


    function updateBarColor(barElement, percent) {
        if (percent >= 100) {
            barElement.classList.remove("bg-emerald-500", "bg-blue-500");
            barElement.classList.add("bg-red-500");
        } else {
            barElement.classList.remove("bg-red-500");
            barElement.classList.add("bg-emerald-500"); // أو اللون الأساسي بتاعك
        }
    }

    function updateNutritionBars() {
        // جمع كل العناصر من foodLog
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        foodLog.forEach(item => {
            totalCalories += item.nutrition.calories;
            totalProtein += item.nutrition.protein;
            totalCarbs += item.nutrition.carbs;
            totalFat += item.nutrition.fat;
        });

        // حساب النسبة المئوية لكل bar
        const caloriesPercent = Math.min((totalCalories / maxValues.calories) * 100, 100);
        const proteinPercent = Math.min((totalProtein / maxValues.protein) * 100, 100);
        const carbsPercent = Math.min((totalCarbs / maxValues.carbs) * 100, 100);
        const fatPercent = Math.min((totalFat / maxValues.fat) * 100, 100);

        // تحديث الـ bars
        caloriesBar.style.width = `${caloriesPercent}%`;
        caloriesText.textContent = `${totalCalories} / ${maxValues.calories} kcal`;
        updateBarColor(caloriesBar, caloriesPercent);
        proteinBar.style.width = `${proteinPercent}%`;
        proteinText.textContent = `${totalProtein} / ${maxValues.protein} g`;
        updateBarColor(proteinBar, proteinPercent);
        carbsBar.style.width = `${carbsPercent}%`;
        carbsText.textContent = `${totalCarbs} / ${maxValues.carbs} g`;
        updateBarColor(carbsBar, carbsPercent);
        fatBar.style.width = `${fatPercent}%`;
        fatText.textContent = `${Math.floor(totalFat)} / ${maxValues.fat} g`;
        updateBarColor(fatBar, fatPercent);
    }

    // log modal for number of servings
    let currentMealForLogging = null; // نخزن الوجبة الحالية
    let baseNutritionPerServing = null; // القيم الأساسية per serving
    let currentServings = 1;


    // delete button
    document.addEventListener("click", (e) => {
        const btn = e.target.closest(".remove-foodlog-item");
        if (!btn) return;

        const index = btn.dataset.index;
        foodLog.splice(index, 1);
        renderFoodLog();
        updateNutritionBars();
        renderWeeklyOverview();
        localStorage.setItem("foodLog", JSON.stringify(foodLog));

    });
    // delete all
    clearFoodLog.addEventListener("click", () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                foodLog = [];
                localStorage.setItem("foodLog", JSON.stringify(foodLog));
                renderFoodLog();
                updateNutritionBars();


                Swal.fire({
                    title: "Deleted!",
                    text: "Your Food Log has been deleted.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });

    logmeal.addEventListener("click", () => {
        hideAllSections();
        showSections(sections["meals"]); // يطلع كل السكشنات المتعلقة بالوجبات
        const mealsLink = document.querySelector('.nav-link[data-page="meals"]');
        if (mealsLink) setActiveLink(mealsLink);
    });

    // لما تضغط على Product Scanner
    productScanner.addEventListener("click", () => {
        hideAllSections();
        showSections(sections["products"]); // يطلع سكشن المنتجات
        const productsLink = document.querySelector('.nav-link[data-page="products"]');
        if (productsLink) setActiveLink(productsLink);
    });


    function updateFoodLogDate() {
        const dateEl = document.getElementById("foodlog-date");
        if (!dateEl) return;

        const today = new Date();

        const formattedDate = today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric"
        });

        dateEl.textContent = formattedDate;
    }

    //  أول ما الصفحة تفتح يعمل تاريخ اليوم
    updateFoodLogDate();



    /**********************SECTION:PRODUCT SCANNER******************************/


    const productsGrid = document.getElementById("products-grid");
    const productsCount = document.getElementById("products-count");
    const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");
    const searchProductBtn = document.getElementById("search-product-btn");
    const productSearchInput = document.getElementById("product-search-input");
    const barcodeInput = document.getElementById("barcode-input");
    const gradButtons = document.querySelectorAll(".nutri-score-filter");
    const categoryButtons = document.querySelectorAll(".product-category-btn");

    let allProducts = [];      // كل المنتجات اللي جت من API
    let activeGrade = "";      // "", a, b, c, d, e
    let activeCategory = "";   // snacks, beverages, etc

    // ======================= Nutri-Score Filter =======================
    gradButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            activeGrade = btn.dataset.grade; 
            setActiveGradeUI(btn);
            applyFilters();
        });
    });

    function setActiveGradeUI(activeBtn) {
        gradButtons.forEach(btn => {
            btn.classList.remove("bg-emerald-600", "text-white");
            btn.classList.add("bg-gray-100", "text-gray-700");
        });
        activeBtn.classList.add("bg-emerald-600", "text-white");
    }

    // ======================= Category Filter =======================
    categoryButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            activeCategory = btn.dataset.productcategory; // small "c"
            setActiveCategoryUI(btn);

            // جلب المنتجات حسب الكاتيجوري من API
            const data = await searchProducts(activeCategory);
            allProducts = data.results || [];
            renderProducts(allProducts)
        });
    });

    function setActiveCategoryUI(activeBtn) {
        categoryButtons.forEach(btn => btn.classList.remove("ring-2", "ring-emerald-500"));
        activeBtn.classList.add("ring-2", "ring-emerald-500");
    }

    // ======================= Apply Filters =======================
    function applyFilters() {
        let filtered = [...allProducts];

        // Nutri-Score filter
        if (activeGrade) {
            filtered = filtered.filter(p => p.nutritionGrade?.toLowerCase() === activeGrade);
        }



        renderProducts(filtered);
    }

    //nutriscore colors change
    function getNutriScoreColor(grade) {
        switch (grade?.toLowerCase()) {
            case "a": return "bg-green-500";
            case "b": return "bg-lime-500";
            case "c": return "bg-yellow-500";
            case "d": return "bg-orange-500";
            case "e": return "bg-red-500";
            default: return "bg-gray-400"; // unknown or missing
        }
    }

    // ======================= Render Products =======================
    function createProductCard(product) {
        const { barcode, name, brand, image, nutritionGrade, novaGroup, nutrients } = product;

        return `
    <div class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
         data-barcode="${barcode}">
      <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        ${image ? `<img src="${image}" alt="${name}" class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />`
                : `<i class="fa-solid fa-box text-5xl text-gray-300"></i>`}

        ${nutritionGrade ? `<div class="absolute top-2 left-2 ${getNutriScoreColor(nutritionGrade)} text-white text-xs font-bold px-2 py-1 rounded uppercase">
                Nutri-Score ${nutritionGrade}
              </div>` : ""}

        ${novaGroup ? `<div class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                ${novaGroup}
              </div>` : ""}
      </div>

      <div class="p-4">
        <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
          ${brand || "Unknown brand"}
        </p>

        <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
          ${name}
        </h3>

        <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>
            <i class="fa-solid fa-fire mr-1"></i>
            ${nutrients.calories} kcal / 100g
          </span>
        </div>

        <div class="grid grid-cols-4 gap-1 text-center">
          <div class="bg-emerald-50 rounded p-1.5">
            <p class="text-xs font-bold text-emerald-700">${nutrients.protein}g</p>
            <p class="text-[10px] text-gray-500">Protein</p>
          </div>
          <div class="bg-blue-50 rounded p-1.5">
            <p class="text-xs font-bold text-blue-700">${nutrients.carbs}g</p>
            <p class="text-[10px] text-gray-500">Carbs</p>
          </div>
          <div class="bg-purple-50 rounded p-1.5">
            <p class="text-xs font-bold text-purple-700">${nutrients.fat}g</p>
            <p class="text-[10px] text-gray-500">Fat</p>
          </div>
          <div class="bg-orange-50 rounded p-1.5">
            <p class="text-xs font-bold text-orange-700">${nutrients.sugar}g</p>
            <p class="text-[10px] text-gray-500">Sugar</p>
          </div>
        </div>
      </div>
    </div>
  `;
    }

    function renderProducts(products = []) {
        productsGrid.innerHTML = "";

        if (!products.length) {
            productsGrid.innerHTML = `
      <div class="col-span-full text-center text-gray-500 py-10">
        <i class="fa-solid fa-magnifying-glass text-4xl mb-3"></i>
        <p>No products found</p>
      </div>
    `;
            productsCount.textContent = "0 products found";
            return;
        }

        products.forEach(product => {
            productsGrid.innerHTML += createProductCard(product);
        });

        productsCount.textContent = `${products.length} products found`;
        // ========= إضافة click listener لكل منتج =========
        const productCards = productsGrid.querySelectorAll(".product-card");
        productCards.forEach(card => {
            card.addEventListener("click", () => {
                const barcode = card.dataset.barcode;
                const clickedProduct = products.find(p => p.barcode == barcode);
                if (clickedProduct) {
                    showProductModal(clickedProduct);
                }
            });
        });
    }

    // ========= إضافة click listener لكل منتج =========
    const productCards = productsGrid.querySelectorAll(".product-card");
    productCards.forEach(card => {
        card.addEventListener("click", () => {
            const barcode = card.dataset.barcode;
            const clickedProduct = products.find(p => p.barcode == barcode);
            if (clickedProduct) {
                showProductModal(clickedProduct);
            }
        });
    });

    // ======================= Barcode Lookup =======================
    lookupBarcodeBtn.addEventListener("click", async () => {
        const barcode = barcodeInput.value.trim();


        const data = await getProductByBarCode(barcode);

        if (data?.result) {
            allProducts = [data.result];
            applyFilters();
        } else {
            renderProducts([]);
        }
    });

    // ======================= Search by Name =======================
    searchProductBtn.addEventListener("click", async () => {
        const query = productSearchInput.value.trim();
        if (!query) return;

        const data = await searchProducts(query);
        allProducts = data.results;
        applyFilters();
    });

    // Search on Enter key
    productSearchInput.addEventListener("keyup", async (e) => {
        if (e.key === "Enter") {
            const query = productSearchInput.value.trim();
            if (!query) return;

            const data = await searchProducts(query);
            allProducts = data.results;
            applyFilters();
        }
    });

    // عناصر المودال
    const productModal = document.getElementById("product-detail-modal");

    // عناصر داخل المودال
    const modalImage = productModal.querySelector(".modal-image");
    const modalBrand = productModal.querySelector(".modal-brand");
    const modalName = productModal.querySelector(".modal-name");
    const nutriNovaContainer = productModal.querySelector(".nutri-nova-container");
    const nutritionFactsContainer = productModal.querySelector("#nutrition-facts-container");
    const modalIngredients = productModal.querySelector(".modal-ingredients");
    let selectedProductForLog = null;

    // فتح المودال
    function showProductModal(product) {
        // الصورة والاسم والبراند والوزن
        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalBrand.textContent = product.brand || "Unknown Brand";
        modalName.textContent = product.name;
        selectedProductForLog = product;


        // Nutri-Score & NOVA
        const nutriGrade = product.nutritionGrade ? product.nutritionGrade.toUpperCase() : "UNKNOWN";
        const nutriColorMap = { A: "#4ade80", B: "#84cc16", C: "#fecb02", D: "#f97316", E: "#ef4444", UNKNOWN: "#9ca3af" };
        const nutriTextMap = { A: "Excellent", B: "Good", C: "Average", D: "Poor", E: "Bad", UNKNOWN: "Unknown" };
        const novaGroup = product.novaGroup || "-";
        const novaName = getNOVAName(novaGroup);

        nutriNovaContainer.innerHTML = `
        <!-- Nutri-Score -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${nutriColorMap[nutriGrade]}20">
            <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${nutriColorMap[nutriGrade]}">
                ${nutriGrade}
            </span>
            <div>
                <p class="text-xs font-bold" style="color: ${nutriColorMap[nutriGrade]}">Nutri-Score</p>
                <p class="text-[10px] text-gray-600">${nutriTextMap[nutriGrade]}</p>
            </div>
        </div>

        <!-- NOVA -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: #ee810020">
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: #ee8100">
                ${novaGroup}
            </span>
            <div>
                <p class="text-xs font-bold" style="color: #ee8100">NOVA</p>
                <p class="text-[10px] text-gray-600">${novaName}</p>
            </div>
        </div>
    `;

        // Nutrition Facts
        const nutrients = product.nutrients;
        const proteinPercent = nutrients.protein ? Math.min((nutrients.protein / 50) * 100, 100) : 0;
        const carbsPercent = nutrients.carbs ? Math.min((nutrients.carbs / 100) * 100, 100) : 0;
        const fatPercent = nutrients.fat ? Math.min((nutrients.fat / 70) * 100, 100) : 0;
        const sugarPercent = nutrients.sugar ? Math.min((nutrients.sugar / 50) * 100, 100) : 0;

        nutritionFactsContainer.innerHTML = `
        <div class="text-center mb-4 pb-4 border-b border-emerald-200">
            <p class="text-4xl font-bold text-gray-900">${nutrients.calories}</p>
            <p class="text-sm text-gray-500">Calories</p>
        </div>
        <div class="grid grid-cols-4 gap-4">
            ${renderMacroBar("Protein", nutrients.protein, proteinPercent, "emerald")}
            ${renderMacroBar("Carbs", nutrients.carbs, carbsPercent, "blue")}
            ${renderMacroBar("Fat", nutrients.fat, fatPercent, "purple")}
            ${renderMacroBar("Sugar", nutrients.sugar, sugarPercent, "orange")}
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
            <div class="text-center">
                <p class="text-sm font-semibold text-gray-900">${nutrients.sodium}g</p>
                <p class="text-xs text-gray-500">sodium</p>
            </div>
            <div class="text-center">
                <p class="text-sm font-semibold text-gray-900">${nutrients.fiber}g</p>
                <p class="text-xs text-gray-500">Fiber</p>
            </div>
        </div>
    `;

        // Ingredients
        modalIngredients.innerHTML = `
            <div class="bg-gray-50 rounded-xl p-5 mb-6">
                    <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i class="text-gray-600" data-fa-i2svg=""><svg class="svg-inline--fa fa-list" data-prefix="fas" data-icon="list" role="img" viewBox="0 0 512 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z"></path></svg></i>
                        Ingredients
                    </h3>
                    <p class="text-sm text-gray-600 leading-relaxed">${product.name}</p>
                </div>
    
    `;

        // إظهار المودال
        productModal.classList.remove("hidden");
    }

    // Nutri Helper
    function getNOVAName(group) {
        switch (group) {
            case 1: return "Unprocessed";
            case 2: return "Processed";
            case 3: return "Processed";
            case 4: return "Ultra-Processed";
            default: return "Unknown";
        }
    }

    // Macro Progress Bar Renderer
    function renderMacroBar(name, value, percent, color) {
        return `
    <div class="text-center">
        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div class="bg-${color}-500 h-2 rounded-full" style="width:${percent}%"></div>
        </div>
        <p class="text-lg font-bold text-${color}-600">${value || "0"}g</p>
        <p class="text-xs text-gray-500">${name}</p>
    </div>
    `;
    }


    const logProductBtn = document.getElementById("log-product-btn");

    logProductBtn.addEventListener("click", () => {
        if (!selectedProductForLog) return;

        const product = selectedProductForLog;

        // نحسب القيم (كلها per 100g)
        const nutrition = {
            calories: product.nutrients.calories ?? 0,
            protein: product.nutrients.protein ?? 0,
            carbs: product.nutrients.carbs ?? 0,
            fat: product.nutrients.fat ?? 0,
        };

        const productItem = {
            id: product.barcode,
            name: product.name,
            image: product.image,
            nutrition,
            time: new Date().toISOString(),
            type: "product"
        };

        // localStorage
        const storedLog = JSON.parse(localStorage.getItem("foodLog")) || [];
        storedLog.push(productItem);
        localStorage.setItem("foodLog", JSON.stringify(storedLog));

        // تحديث الواجهة
        foodLog = storedLog;
        renderFoodLog();
        updateNutritionBars();
        renderWeeklyOverview();
        // SweetAlert
        Swal.fire({
            icon: "success",
            title: "Food Logged!",
            text: `${product.name} has been added to your daily log.`,
            timer: 1500,
            showConfirmButton: false
        });

        // اقفل المودال
        productModal.classList.add("hidden");
    });



    // غلق المودال
    productModal.querySelectorAll(".close-product-modal").forEach(btn => {
        btn.addEventListener("click", () => productModal.classList.add("hidden"));
    });
