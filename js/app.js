let currentCategory = "All";
let currentSearch = "";
let currentSort = "newest";
let showFavoritesOnly = false;
let showArchivedOnly = false;

document.addEventListener("DOMContentLoaded", () => {
    loadClothingItems();
    setupSearch();
    setupCategoryFilters();
    setupSorting();
    setupFavorites();

    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    if (view === "archived") {
        showArchivedOnly = true;
        showFavoritesOnly = false;

        document.getElementById("wardrobeLink")
            .classList.remove("active");

        document.getElementById("favoritesLink")
            .classList.remove("active");

        document.getElementById("archivedLink")
            .classList.add("active");

        loadClothingItems();
    }

    if (view === "favorites") {
        showFavoritesOnly = true;

        document.getElementById("wardrobeLink").classList.remove("active");
        document.getElementById("favoritesLink").classList.add("active");

        loadClothingItems();

        setTimeout(() => {
            document.getElementById("clothingContainer").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);
    }

    if (view === "wardrobe") {
        showFavoritesOnly = false;

        document.getElementById("favoritesLink").classList.remove("active");
        document.getElementById("wardrobeLink").classList.add("active");

        loadClothingItems();

        setTimeout(() => {
            document.getElementById("clothingContainer").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);
    }

});

function loadClothingItems() {
    const items = getClothingItems();

    updateStatistics(items);

    let filteredItems = filterClothingItems(items);

    filteredItems = sortClothingItems(filteredItems);

    const container = document.getElementById("clothingContainer");

    container.innerHTML = "";

    if (filteredItems.length === 0) {
        showNoResults(container);
        return;
    }

    filteredItems.forEach(item => {
        const card = createClothingCard(item);
        container.appendChild(card);
    });

    setupCardActions();
}

function setupFavorites() {

    const favoritesLink =
        document.getElementById("favoritesLink");

    const wardrobeLink =
        document.getElementById("wardrobeLink");

    const archivedLink =
        document.getElementById("archivedLink");

    favoritesLink.addEventListener("click", event => {

        event.preventDefault();

        showFavoritesOnly = true;
        showArchivedOnly = false;

        favoritesLink.classList.add("active");
        wardrobeLink.classList.remove("active");

        loadClothingItems();

        setTimeout(() => {
            document.getElementById("clothingContainer").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 50);

    });


    wardrobeLink.addEventListener("click", event => {

        event.preventDefault();

        showFavoritesOnly = false;
        showArchivedOnly = false;

        wardrobeLink.classList.add("active");
        favoritesLink.classList.remove("active");

        loadClothingItems();

        document.getElementById("wardrobeSection").scrollIntoView({
            behavior: "smooth"
        });

    });

    archivedLink.addEventListener("click", event => {
        event.preventDefault();

        showArchivedOnly = true;
        showFavoritesOnly = false;

        archivedLink.classList.add("active");
        document.getElementById("favoritesLink")
            .classList.remove("active");
        document.getElementById("wardrobeLink")
            .classList.remove("active");

        loadClothingItems();

        document.getElementById("wardrobeSection")
            .scrollIntoView({ behavior: "smooth" });
    });

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

        const matchesFavorites =
            !showFavoritesOnly || item.favorite === true;

        const isArchived = item.status === "archived";

        const matchesArchive =
            showArchivedOnly ? isArchived : !isArchived;

        return (
            matchesCategory &&
            matchesSearch &&
            matchesFavorites &&
            matchesArchive
        );

    });

}

function sortClothingItems(items) {
    const sortedItems = [...items];

    switch (currentSort) {

        case "newest":
            sortedItems.sort((a, b) => b.id - a.id);
            break;

        case "oldest":
            sortedItems.sort((a, b) => a.id - b.id);
            break;

        case "name-asc":
            sortedItems.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        case "name-desc":
            sortedItems.sort((a, b) =>
                b.name.localeCompare(a.name)
            );
            break;
    }

    return sortedItems;
}

function setupSorting() {
    const sortSelect = document.getElementById("sortSelect");

    sortSelect.addEventListener("change", () => {
        currentSort = sortSelect.value;

        loadClothingItems();
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
    const card = document.createElement("div");
    card.className = "clothing-card";

    card.innerHTML = `
        <div class="clothing-image">
            ${
                item.image
                    ? `<img src="${item.image}" alt="${item.name}">`
                    : `<span>👕</span>`
            }
        </div>

        <div class="clothing-info">
            <div class="clothing-title-row">
                <h3 class="clothing-title">${item.name}</h3>

                <button 
                    class="favorite-icon ${item.favorite ? "active" : ""}"
                    data-id="${item.id}"
                    type="button"
                    title="${item.favorite ? "Remove from favorites" : "Add to favorites"}"
                >
                    ${item.favorite ? "❤️" : "♡"}
                </button>
            </div>

            <p class="clothing-category">${item.category}</p>

            <div class="clothing-details">
                <span>${item.color}</span>
                <span>${item.season}</span>
                <span>${item.occasion}</span>
            </div>

            <div class="card-actions">
                <a href="add-item.html?id=${item.id}" class="edit-btn">
                    Edit
                </a>

                ${
                    item.status === "archived"
                        ? `<button
                                class="restore-btn"
                                data-id="${item.id}"
                                type="button"
                            >
                                Restore
                            </button>`
                        : `<button
                                class="archive-btn"
                                data-id="${item.id}"
                                type="button"
                            >
                                Archive
                            </button>`
                }

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
    const archiveButtons =
        document.querySelectorAll(".archive-btn");

    const restoreButtons =
        document.querySelectorAll(".restore-btn");
    const editButtons = document.querySelectorAll(".edit-btn");
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const favoriteButtons = document.querySelectorAll(".favorite-icon");

    editButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Edit is handled by the link itself
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            deleteClothingItem(id);
            loadClothingItems();
        });
    });

    favoriteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            toggleFavorite(id);
        });
    });

    archiveButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            const confirmed = confirm(
                "Move this item to your archived wardrobe?"
            );

            if (!confirmed) return;

            archiveClothingItem(id);
            loadClothingItems();
        });
    });

    restoreButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            restoreClothingItem(id);
            loadClothingItems();
        });
    });
}

function toggleFavorite(id) {
    const items = getClothingItems();

    const updatedItems = items.map(item => {
        if (item.id === id) {
            return {
                ...item,
                favorite: !item.favorite
            };
        }

        return item;
    });

    saveClothingItems(updatedItems);

    loadClothingItems();
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

    showFavoritesOnly = false;

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

