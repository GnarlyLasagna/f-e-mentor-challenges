const hamburgerBtn = document.querySelector("#hamburger-toggle");
const hamburgerIcon = document.querySelector("#hamburger");
const body = document.querySelector("body");
const form = document.querySelector("form");
const firstName = document.querySelector("#name");
const email = document.querySelector("#email");
const message = document.querySelector("#message");
const success = document.querySelector('.contact__success')
const fields = [firstName, email, message];
const ZOOM_LEVEL = 14;

const hamburgerImgSource = {
    false: "./assets/shared/mobile/icon-hamburger.svg",
    true: "./assets/shared/mobile/icon-close.svg",
};

function handleHam() {
    hamburgerIcon.classList.toggle("open");
    body.classList.toggle("open");
    let isOpen = hamburgerIcon.classList.contains("open");

    hamburgerIcon.src = hamburgerImgSource[isOpen];
}

function validateField(field) {
    let errorMessage = field.nextElementSibling.nextElementSibling;

    if (!field.value) {
        errorMessage.classList.add("error");
        return;
    }
    errorMessage.classList.remove("error");
}

function validateEmail() {
    let errorMessage = email.nextElementSibling.nextElementSibling;
    let invalidEmailMessage = errorMessage.nextElementSibling;
    errorMessage.classList.remove("error");

    let mailRegex =
        /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (mailRegex.test(email.value)) {
        invalidEmailMessage.classList.remove("error");
        errorMessage.classList.remove("error");
        return true;
    }

    invalidEmailMessage.classList.add("error");
    return false;
}

function removeErrors(field) {
    let errorMessage = field.nextElementSibling.nextElementSibling;
    let invalidEmailMessage = errorMessage.nextElementSibling;
    errorMessage.classList.remove("error");
    invalidEmailMessage?.classList.remove("error");
}

function handleSubmit(e) {
    e.preventDefault();
    let isReadyToSubmit = email.value && firstName.value && message.value && validateEmail();

    fields.forEach((field) => validateField(field));

    if (email.value) {
        validateEmail();
    }

    if (isReadyToSubmit) {
        success.classList.add('success')
        setTimeout(() => success.classList.remove("success"), 2400);
        form.reset()
    }
}

if (body.classList.contains("locations-body")) {
    const countries = [
        {
            name: "canada",
            id: "canada-map",
            coordinates: [43.6478, -79.37712],
        },
        {
            name: "australia",
            id: "australia-map",
            coordinates: [-30.329531, 149.788193],
        },
        {
            name: "uk",
            id: "uk-map",
            coordinates: [40.514278, -107.547401],
        },
    ];
    const createMapLayer = (map) => {
        return L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1,
                accessToken:
                    "pk.eyJ1IjoiamV1cmltb3JlbCIsImEiOiJja3RnOHFhZXcwZnVvMm9wZnQ1eWpxNzl5In0.9qTve39y7gvSgB7mK-7Myg",
            }
        ).addTo(map);
    };

    function createMapMarker(map, coordinates) {
        return L.marker(coordinates).addTo(map);
    }

    function createMap({ id, coordinates }) {
        let map = L.map(id).setView(coordinates, ZOOM_LEVEL);
        createMapLayer(map);
        createMapMarker(map, coordinates);
    }

    countries.forEach((country) => createMap(country));
}

hamburgerBtn?.addEventListener("click", handleHam);
form?.addEventListener("submit", handleSubmit);
fields.forEach((field) =>
    field?.addEventListener("focus", (event) => removeErrors(event.target))
);
