"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const catButtons = document.querySelectorAll(".cat-btn");
    const categoryBlocks = document.querySelectorAll(".category-block");

    function setActiveButton(activeBtn) {
        catButtons.forEach((btn) => btn.classList.toggle("is-active", btn === activeBtn));
    }

    function applyFilter(filter) {
        categoryBlocks.forEach((block) => {
            const cat = block.dataset.category;
            block.hidden = filter !== "all" && cat !== filter;
        });
    }

    catButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;
            setActiveButton(btn);
            applyFilter(filter);
        });
    });

    const form = document.getElementById("calc-form");
    const lengthInput = document.getElementById("length");
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");

    const errorEls = {
        length: document.getElementById("length-error"),
        width: document.getElementById("width-error"),
        height: document.getElementById("height-error"),
    };

    const modalBackdrop = document.getElementById("result-modal");
    const modalText = document.getElementById("modal-text");
    const modalClose = document.getElementById("modal-close");

    function setError(input, msg) {
        errorEls[input.id].textContent = msg;
        input.setAttribute("aria-invalid", "true");
    }

    function clearError(input) {
        errorEls[input.id].textContent = "";
        input.removeAttribute("aria-invalid");
    }

    [lengthInput, widthInput, heightInput].forEach((inp) => {
        inp.addEventListener("input", () => clearError(inp));
    });

    function openModal(volume) {
        modalText.innerHTML = `Maximum <strong>${volume}</strong> cm<sup>3</sup> térkitöltőre lenne szükséged.`;
        modalBackdrop.hidden = false;
        modalClose.focus();
    }

    function closeModal() {
        modalBackdrop.hidden = true;
    }

    modalClose.addEventListener("click", closeModal);
    modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modalBackdrop.hidden) closeModal();
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let firstInvalid = null;

        const inputs = [lengthInput, widthInput, heightInput];
        const values = {};

        for (const input of inputs) {
            const raw = input.value.trim();

            if (raw === "") {
                setError(input, "Kötelező mező.");
                if (!firstInvalid) firstInvalid = input;
                continue;
            }

            const num = parseFloat(raw);

            if (!Number.isFinite(num)) {
                setError(input, "Csak szám adható meg.");
                if (!firstInvalid) firstInvalid = input;
                continue;
            }

            if (num <= 0) {
                setError(input, "A szám nem lehet 0 vagy negatív.");
                if (!firstInvalid) firstInvalid = input;
                continue;
            }

            clearError(input);
            values[input.id] = num;
        }

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        const volume = values.length * values.width * values.height;
        const pretty = Number.isInteger(volume) ? String(volume) : volume.toFixed(2);

        openModal(pretty);
        form.reset()
    });
});
