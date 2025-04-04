// Evento para mostrar el menú
document.getElementById('icon-menu').addEventListener('click', function() {
    document.querySelector('.menu').classList.toggle('show-lateral');
});

// Eventos del buscador
document.getElementById("icon-search").addEventListener("click", mostrar_buscador);
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador);

// Declaración de variables del buscador
let bars_search = document.getElementById("ctn-bars-search");
let cover_ctn_search = document.getElementById("cover-ctn-search");
let inputSearch = document.getElementById("inputSearch");
let box_search = document.getElementById("box-search");

// Función para mostrar el buscador
function mostrar_buscador(){
    bars_search.style.top="5rem";
    cover_ctn_search.style.display="block";
    inputSearch.focus();

    if (inputSearch.value === ""){
        box_search.style.display ="none";
    }
}

// Función para ocultar el buscador
function ocultar_buscador(){
    bars_search.style.top="-10rem";
    cover_ctn_search.style.display="none";
    inputSearch.value="";
    box_search.style.display="none";
}

// Array of blog metadata with links and titles
const blogMetadata = [
    { link: "../blog1/blog1.html", title: "Ecosistemas terrestres" },
    { link: "../blog2/blog2.html", title: "Los campos" },
    { link: "../blog3/blog3.html", title: "Ecosistemas en lagos" },
    { link: "../blog4/blog4.html", title: "Habitats de animales" },
    // Add more blogs as needed
];

// Function to fetch and extract <p> content from blogs
async function fetchBlogContent() {
    const blogContent = [];

    for (const blog of blogMetadata) {
        try {
            const response = await fetch(blog.link);
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, "text/html");
            const paragraphs = Array.from(doc.querySelectorAll("p"));
            const content = paragraphs.map(p => p.textContent).join(" ");
            blogContent.push({ ...blog, content: content.toLowerCase() });
        } catch (error) {
            console.error(`Error fetching blog content from ${blog.link}:`, error);
        }
    }

    return blogContent;
}

// Initialize blog content dynamically
let blogContent = [];
fetchBlogContent().then(content => blogContent = content);

// Función para el filtrado de búsqueda
document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno() {
    let filter = inputSearch.value.toLowerCase();
    let results = [];

    // Match input with dynamically fetched <p> content
    blogContent.forEach(blog => {
        if (blog.content.includes(filter)) {
            results.push(blog);
        }
    });

    // Clear previous results
    box_search.innerHTML = "";

    // Display matched results
    if (results.length > 0) {
        results.forEach(blog => {
            let li = document.createElement("li");
            li.innerHTML = `<a href="${blog.link}"><i class="fa-solid fa-magnifying-glass"></i>${blog.title}</a>`;
            box_search.appendChild(li);
        });
        box_search.style.display = "block";
    } else {
        box_search.style.display = "none";
    }

    // Hide suggestions if input is empty
    if (inputSearch.value === "") {
        box_search.style.display = "none";
    }
}
