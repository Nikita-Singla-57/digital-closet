let currentCategory = "All";
let currentSearch = "";

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadClothingItems();

        setupSearch();

        setupCategoryFilters();

    }
);


function loadClothingItems() {

    const container =
        document.getElementById("clothingContainer");


    if (!container) {
        return;
    }


    const items =
        getClothingItems();


    updateStatistics(items);


    const filteredItems =
        filterClothingItems(items);


    if (filteredItems.length === 0) {

        showNoResults(container);

        return;

    }


    container.innerHTML = "";


    filteredItems.forEach(item => {

        const card =
            createClothingCard(item);

        container.appendChild(card);

    });


    setupCardActions();

}

function filterClothingItems(items) {

    return items.filter(item => {

        const matchesCategory =
            currentCategory === "All" ||
            item.category === currentCategory;


        const searchText =
            currentSearch.toLowerCase();


        const matchesSearch =
            item.name
                .toLowerCase()
                .includes(searchText) ||

            item.category
                .toLowerCase()
                .includes(searchText) ||

            item.color
                .toLowerCase()
                .includes(searchText) ||

            item.season
                .toLowerCase()
                .includes(searchText) ||

            item.occasion
                .toLowerCase()
                .includes(searchText);


        return (
            matchesCategory &&
            matchesSearch
        );

    });

}


function updateStatistics(items) {

    const totalItems =
        document.getElementById("totalItems");

    const totalFavorites =
        document.getElementById("totalFavorites");

    const totalOutfits =
        document.getElementById("totalOutfits");


    if (totalItems) {

        totalItems.textContent =
            items.length;

    }


    if (totalFavorites) {

        const favoriteCount =
            items.filter(
                item => item.favorite
            ).length;

        totalFavorites.textContent =
            favoriteCount;

    }


    if (totalOutfits) {

        totalOutfits.textContent = "0";

    }

}

function createClothingCard(item) {

    const card = document.createElement("article");

    card.className = "clothing-card";

    card.innerHTML = `
    
        <div class="clothing-image">

            ${
                item.image
                ? `
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >
                `
                : `
                    <span>👕</span>
                `
            }

        </div>


        <div class="clothing-info">

            <div class="clothing-title">

                <h3>
                    ${item.name}
                </h3>

                ${
                    item.favorite
                    ? `<span class="favorite-icon">♥</span>`
                    : ""
                }

            </div>


            <p class="clothing-category">
                ${item.category}
            </p>


            <div class="clothing-details">

                <span>
                    ${item.color}
                </span>

                <span>
                    ${item.season}
                </span>

            </div>


            <div class="card-actions">

                <button
                    class="edit-btn"
                    data-id="${item.id}"
                    type="button"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${item.id}"
                    type="button"
                >
                    Delete
                </button>

            </div>

        </div>

    `;

    return card;
}

function setupCardActions() {

    const editButtons =
        document.querySelectorAll(".edit-btn");

    const deleteButtons =
        document.querySelectorAll(".delete-btn");


    /* EDIT */

    editButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    button.dataset.id;

                window.location.href =
                    `add-item.html?id=${id}`;

            }
        );

    });


    /* DELETE */

    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const id =
                    Number(button.dataset.id);

                deleteClothingItem(id);

                loadClothingItems();

            }
        );

    });

}


function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        event => {

            currentSearch =
                event.target.value.trim();

            loadClothingItems();

        }
    );

}

function setupCategoryFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category;


                filterButtons.forEach(
                    btn => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                loadClothingItems();

            }
        );

    });

}

function showNoResults(container) {

    container.innerHTML = `

        <div class="empty-state">

            <div class="empty-icon">
                🔍
            </div>

            <h3>
                No clothing found
            </h3>

            <p>
                Try a different search or category.
            </p>

            <button
                class="secondary-btn"
                id="clearFiltersBtn"
                type="button"
            >
                Clear Filters
            </button>

        </div>

    `;


    const clearButton =
        document.getElementById(
            "clearFiltersBtn"
        );


    clearButton.addEventListener(
        "click",
        clearFilters
    );

}

function clearFilters() {

    currentCategory = "All";

    currentSearch = "";


    const searchInput =
        document.getElementById("searchInput");


    if (searchInput) {

        searchInput.value = "";

    }


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.classList.remove(
            "active"
        );


        if (
            button.dataset.category === "All"
        ) {

            button.classList.add(
                "active"
            );

        }

    });


    loadClothingItems();

}