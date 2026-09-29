const clothingForm =
    document.getElementById("clothingForm");


if (clothingForm) {

    clothingForm.addEventListener(
        "submit",
        handleFormSubmit
    );

}


function handleFormSubmit(event) {

    event.preventDefault();


    const name =
        document.getElementById("clothingName").value.trim();

    const category =
        document.getElementById("category").value;

    const color =
        document.getElementById("color").value.trim();

    const season =
        document.getElementById("season").value;

    const occasion =
        document.getElementById("occasion").value;

    const size =
        document.getElementById("size").value;

    const favorite =
        document.getElementById("favorite").checked;


    if (
        !name ||
        !category ||
        !color ||
        !season ||
        !occasion ||
        !size
    ) {

        alert("Please fill in all required fields.");

        return;
    }


    const clothingItem = {

        id: Date.now(),

        name: name,

        category: category,

        color: color,

        season: season,

        occasion: occasion,

        size: size,

        favorite: favorite,

        image: ""

    };


    addClothingItem(clothingItem);


    window.location.href = "index.html";

}