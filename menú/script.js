document.addEventListener("DOMContentLoaded", () => {
    const barsSearch = document.getElementById("ctn-bars-search");
    const coverSearch = document.getElementById("cover-ctn-search");
    const inputSearch = document.getElementById("inputSearch");
    const boxSearch = document.getElementById("box-search");
    const items = boxSearch.getElementsByTagName("li");

    // Crear un datalist para autocompletar
    const dataList = document.createElement("datalist");
    dataList.id = "search-suggestions";
    document.body.appendChild(dataList);
    inputSearch.setAttribute("list", "search-suggestions");

    document.getElementById('icon-menu').addEventListener('click', () => {
        document.querySelector('.menu').classList.toggle('show-lateral');
    });

    function normalizeText(text) {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
            .toLowerCase(); // Convierte a minúsculas para mejor comparación
    }

    function searchHandler() {
        const filter = normalizeText(inputSearch.value.trim());
        let found = false;
        let suggestions = [];
        const fragment = document.createDocumentFragment();

        for (let li of items) {
            let link = li.querySelector("a");
            let textValue = normalizeText(link.textContent || link.innerText);

            if (textValue.includes(filter) && filter !== "") {
                li.style.display = "block";
                highlightMatch(link, filter);
                found = true;
                suggestions.push(link.textContent);
            } else {
                li.style.display = "none";
                link.innerHTML = link.textContent;
            }
        }

        boxSearch.style.display = found ? "block" : "none";
        updateDataList(suggestions, fragment);
    }

    function highlightMatch(element, query) {
        let text = element.textContent;
        let regex = new RegExp(`(${query})`, "gi");
        element.innerHTML = text.replace(regex, `<span style="background-color: yellow;">$1</span>`);
    }

    function updateDataList(suggestions, fragment) {
        dataList.innerHTML = ""; // Limpiar opciones previas
        suggestions.forEach(text => {
            let option = document.createElement("option");
            option.value = text;
            fragment.appendChild(option);
        });
        dataList.appendChild(fragment);
    }

    let debounceTimer;
    inputSearch.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(searchHandler, 200);
    });

    document.getElementById("icon-search").addEventListener("click", () => {
        barsSearch.style.top = "5rem";
        coverSearch.style.display = "block";
        inputSearch.focus();
    });

    coverSearch.addEventListener("click", () => {
        barsSearch.style.top = "-10rem";
        coverSearch.style.display = "none";
        inputSearch.value = "";
        boxSearch.style.display = "none";
    });

    // Cierra la búsqueda al hacer clic en un resultado
    boxSearch.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            barsSearch.style.top = "-10rem";
            coverSearch.style.display = "none";
            inputSearch.value = "";
            boxSearch.style.display = "none";
        }
    });
});
