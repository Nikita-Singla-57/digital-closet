const clothingForm =
    document.getElementById("clothingForm");


const urlParams =
    new URLSearchParams(window.location.search);


const editId =
    urlParams.get("id");


let imageData = "";


/* =========================
   PAGE MODE
========================= */

if (editId) {

    loadItemForEditing();

}


/* =========================
   FORM SUBMIT
========================= */

if (clothingForm) {

    clothingForm.addEventListener(
        "submit",
        handleFormSubmit
    );

}


/* =========================
   LOAD ITEM FOR EDIT
========================= */

function loadItemForEditing() {

    const items =
        getClothingItems();


    const item =
        items.find(
            item => item.id === Number(editId)
        );


    if (!item) {

        alert("Clothing item not found.");

        window.location.href = "index.html";

        return;
    }


    document.getElementById("formTitle")
        .textContent = "Edit Clothing";


    document.getElementById("formDescription")
        .textContent =
        "Update the details of your clothing item.";


    document.getElementById("submitBtn")
        .textContent = "Save Changes";


    document.getElementById("clothingName")
        .value = item.name;


    document.getElementById("category")
        .value = item.category;


    document.getElementById("color")
        .value = item.color;


    document.getElementById("season")
        .value = item.season;


    document.getElementById("occasion")
        .value = item.occasion;


    document.getElementById("size")
        .value = item.size;


    document.getElementById("favorite")
        .checked = item.favorite;


    imageData = item.image || "";

}


/* =========================
   FORM SUBMISSION
========================= */

function handleFormSubmit(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("clothingName")
            .value
            .trim();


    const category =
        document.getElementById("category")
            .value;


    const color =
        document
            .getElementById("color")
            .value
            .trim();


    const season =
        document.getElementById("season")
            .value;


    const occasion =
        document.getElementById("occasion")
            .value;


    const size =
        document.getElementById("size")
            .value;


    const favorite =
        document.getElementById("favorite")
            .checked;


    /* Validation */

    if (
        !name ||
        !category ||
        !color ||
        !season ||
        !occasion ||
        !size
    ) {

        alert(
            "Please fill in all required fields."
        );

        return;
    }


    /* EDIT */

    if (editId) {

        updateExistingItem({

            id: Number(editId),

            name: name,

            category: category,

            color: color,

            season: season,

            occasion: occasion,

            size: size,

            favorite: favorite,

            image: imageData

        });


        window.location.href =
            "index.html";

        return;
    }


    /* CREATE */

    const clothingItem = {

        id: Date.now(),

        name: name,

        category: category,

        color: color,

        season: season,

        occasion: occasion,

        size: size,

        favorite: favorite,

        image: imageData

    };


    addClothingItem(
        clothingItem
    );


    window.location.href =
        "index.html";

}


/* =========================
   UPDATE ITEM
========================= */

function updateExistingItem(updatedItem) {

    const items =
        getClothingItems();


    const updatedItems =
        items.map(item => {

            if (
                item.id === updatedItem.id
            ) {

                return updatedItem;

            }

            return item;

        });


    saveClothingItems(
        updatedItems
    );

}