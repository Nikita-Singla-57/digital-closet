let editingOutfitId = null;

document.addEventListener("DOMContentLoaded", () => {

    loadOutfits();

    setupOutfitModal();

    const createOutfitBtn =
        document.getElementById("createOutfitBtn");

    const cancelOutfitBtn =
        document.getElementById("cancelOutfitBtn");

    const saveOutfitBtn =
        document.getElementById("saveOutfitBtn");


    createOutfitBtn.addEventListener(
        "click",
        openOutfitBuilder
    );

    cancelOutfitBtn.addEventListener(
        "click",
        closeOutfitBuilder
    );

    saveOutfitBtn.addEventListener(
        "click",
        saveOutfit
    );

});


function openOutfitBuilder() {

    const builder =
        document.getElementById("outfitBuilder");

    builder.hidden = false;

    loadClothingForOutfit();

    builder.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


function closeOutfitBuilder() {

    const builder =
        document.getElementById("outfitBuilder");

    builder.hidden = true;

    editingOutfitId = null;

    document.getElementById("outfitName").value = "";

    document.getElementById("saveOutfitBtn").textContent =
        "Save Outfit";

}


function loadClothingForOutfit() {

    const items = getClothingItems();

    const container =
        document.getElementById("outfitItemsContainer");

    container.innerHTML = "";


    if (items.length === 0) {

        container.innerHTML = `
            <p>
                Your wardrobe is empty.
                Add some clothing first.
            </p>
        `;

        return;
    }


    items.forEach(item => {

        const card =
            createOutfitSelectionCard(item);

        container.appendChild(card);

    });

}


function createOutfitSelectionCard(item) {

    const card =
        document.createElement("div");

    card.className = "outfit-selection-card";

    card.dataset.id = item.id;


    card.innerHTML = `
        <div class="outfit-selection-image">

            ${
                item.image
                    ? `<img
                        src="${item.image}"
                        alt="${item.name}"
                    >`
                    : `<span>👕</span>`
            }

        </div>

        <div class="outfit-selection-info">

            <h4>
                ${item.name}
            </h4>

            <p>
                ${item.category}
            </p>

        </div>
    `;


    card.addEventListener("click", () => {

        card.classList.toggle("selected");

    });


    return card;
}

function saveOutfit() {

    const outfitName =
        document.getElementById("outfitName").value.trim();


    if (!outfitName) {

        alert("Please enter an outfit name.");

        return;
    }


    const selectedCards =
        document.querySelectorAll(
            ".outfit-selection-card.selected"
        );


    if (selectedCards.length === 0) {

        alert("Please select at least one clothing item.");

        return;
    }


    const selectedItems =
        Array.from(selectedCards).map(card =>
            Number(card.dataset.id)
        );


    if (editingOutfitId !== null) {

        const updatedOutfit = {

            id: editingOutfitId,

            name: outfitName,

            items: selectedItems

        };


        updateOutfit(updatedOutfit);

    } else {

        const outfit = {

            id: Date.now(),

            name: outfitName,

            items: selectedItems

        };


        saveOutfitToStorage(outfit);

    }


    editingOutfitId = null;

    document.getElementById("outfitName").value = "";

    document.getElementById("saveOutfitBtn").textContent =
        "Save Outfit";

    closeOutfitBuilder();

    loadOutfits();

}

function loadOutfits() {

    const outfits = getOutfits();

    const container =
        document.getElementById("outfitsContainer");

    container.innerHTML = "";

    if (outfits.length === 0) {

        showEmptyOutfits(container);

        return;
    }

    outfits.forEach(outfit => {

        const card =
            createOutfitCard(outfit);

        container.appendChild(card);

    });

    setupOutfitActions();

}

function showEmptyOutfits(container) {

    container.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                👗
            </div>

            <h3>
                No outfits yet
            </h3>

            <p>
                Create your first outfit
                using your wardrobe.
            </p>

            <button
                class="primary-btn"
                id="emptyCreateOutfitBtn"
                type="button"
            >
                + Create Outfit
            </button>

        </div>
    `;

    document
        .getElementById("emptyCreateOutfitBtn")
        .addEventListener(
            "click",
            openOutfitBuilder
        );

}

function createOutfitCard(outfit) {

    const card =
        document.createElement("div");

    card.className = "outfit-card";


    const clothingItems =
        getClothingItems();


    const selectedItems =
        outfit.items
            .map(id =>
                clothingItems.find(item => item.id === id)
            )
            .filter(item => item);


    const images = selectedItems
        .slice(0, 4)
        .map(item => {

            if (item.image) {

                return `
                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >
                `;

            }

            return `
                <div class="outfit-placeholder">
                    👕
                </div>
            `;

        })
        .join("");


    card.innerHTML = `

        <div class="outfit-card-images">

            ${images}

        </div>


        <div class="outfit-card-info">

            <h3>
                ${outfit.name}
            </h3>

            <p>
                ${selectedItems.length} items
            </p>

        </div>


        <div class="outfit-card-actions">

            <button
                type="button"
                class="edit-outfit-btn"
                data-id="${outfit.id}"
            >
                Edit
            </button>

            <button
                type="button"
                class="delete-outfit-btn"
                data-id="${outfit.id}"
            >
                Delete
            </button>

        </div>

    `;

    card.addEventListener("click", () => {
        openOutfitDetails(outfit.id);
    });

    return card;

}

function setupOutfitActions() {

    const deleteButtons =
        document.querySelectorAll(".delete-outfit-btn");

    const editButtons =
        document.querySelectorAll(".edit-outfit-btn");


    deleteButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const id =
                Number(button.dataset.id);

            deleteOutfit(id);

            loadOutfits();

        });

    });


    editButtons.forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const id =
                Number(button.dataset.id);

            editOutfit(id);

        });

    });

}

function editOutfit(id) {

    const outfits = getOutfits();

    const outfit = outfits.find(
        outfit => outfit.id === id
    );

    if (!outfit) {
        return;
    }


    editingOutfitId = id;


    const builder =
        document.getElementById("outfitBuilder");

    const outfitName =
        document.getElementById("outfitName");

    const saveButton =
        document.getElementById("saveOutfitBtn");


    builder.hidden = false;

    outfitName.value = outfit.name;

    saveButton.textContent = "Update Outfit";


    loadClothingForOutfit();


    outfit.items.forEach(itemId => {

        const card =
            document.querySelector(
                `.outfit-selection-card[data-id="${itemId}"]`
            );

        if (card) {
            card.classList.add("selected");
        }

    });


    builder.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}

function openOutfitDetails(id) {

    const outfits = getOutfits();

    const outfit = outfits.find(
        outfit => outfit.id === id
    );

    if (!outfit) {
        return;
    }

    const clothingItems = getClothingItems();

    const selectedItems = outfit.items
        .map(itemId =>
            clothingItems.find(item => item.id === itemId)
        )
        .filter(item => item);


    document.getElementById("modalOutfitName").textContent =
        outfit.name;


    const container =
        document.getElementById("modalOutfitItems");

    container.innerHTML = "";


    selectedItems.forEach(item => {

        const itemElement =
            document.createElement("div");

        itemElement.className =
            "modal-outfit-item";


        itemElement.innerHTML = `
            <div class="modal-outfit-item-image">

                ${
                    item.image
                        ? `<img
                            src="${item.image}"
                            alt="${item.name}"
                        >`
                        : `<span>👕</span>`
                }

            </div>

            <div class="modal-outfit-item-info">

                <h4>
                    ${item.name}
                </h4>

                <p>
                    ${item.category} · ${item.color}
                </p>

            </div>
        `;


        container.appendChild(itemElement);

    });


    const modal =
        document.getElementById("outfitModal");

    modal.hidden = false;

}

function setupOutfitModal() {

    const modal =
        document.getElementById("outfitModal");

    const closeButton =
        document.getElementById("closeOutfitModal");


    closeButton.addEventListener("click", () => {

        modal.hidden = true;

    });


    modal.addEventListener("click", event => {

        if (event.target === modal) {
            modal.hidden = true;
        }

    });

}