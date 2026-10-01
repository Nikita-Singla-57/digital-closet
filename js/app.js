document.addEventListener(
    "DOMContentLoaded",
    loadClothingItems
);


function loadClothingItems() {

    const container =
        document.getElementById("clothingContainer");

    if (!container) {
        return;
    }

    const items = getClothingItems();

    updateStatistics(items);

    if (items.length === 0) {
        showEmptyState(container);
        return;
    }

    container.innerHTML = "";

    items.forEach(item => {

        const card =
            createClothingCard(item);

        container.appendChild(card);

    });

    setupCardActions();
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