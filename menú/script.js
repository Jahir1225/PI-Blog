// BUSCADOR DE CONTENIDO

//Ejecutando funciones
document.getElementById("icon-search").addEventListener("click", mostrar_buscador);
document.getElementById("cover-ctn-search").addEventListener("click", ocultar_buscador); 



// Declarando variables 
bars_search = document.getElementById("ctn-bars-search");
cover_ctn_search = document.getElementById("cover-ctn-search");
inputSearch = document.getElementById("inputSearch");
box_search = document.getElementById("box-search");

//Funcion para mostrar el buscador 

function mostrar_buscador(){
    bars_search.style.top="5rem";
    cover_ctn_search.style.display="block";
    inputSearch.focus();

    if (inputSearch.value === ""){
        box_search.style.display ="none";
    }
}

//Funcion para ocultar el buscador

function ocultar_buscador(){
    bars_search.style.top="-10rem";
    cover_ctn_search.style.display="none";
    inputSearch.value="";
    inputSearch.value ="";
    box_search.style.display="none";
}


// Creando filtrado de busqueda 

document.getElementById("inputSearch").addEventListener("keyup", buscador_interno);

function buscador_interno() {
    let filter = inputSearch.value.toLowerCase();
    let results = [];

    // Josue-Coincidir la entrada con el contenido de <p> y los títulos obtenidos dinámicamente
    blogContent.forEach(blog => {
        if (blog.title.toLowerCase().includes(filter) || blog.content.includes(filter)) {
            results.push(blog);
        }
    });

    // Josue- limpiar previos resultados
    box_search.innerHTML = "";

    //Josue- Mostrar resultados coincidentes.
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

    //josue- Ocultar sugerencias si la entrada está vacía.
    if (inputSearch.value === "") {
        box_search.style.display = "none";
    }
}

//"josue- Array de metadatos de blog con enlaces y títulos"
const blogMetadata = [
    { link: "../posts/blog1/blog1.html", title: "Ecosistemas terrestres" },
    { link: "../posts/blog2/blog2.html", title: "Los campos" },
    { link: "../posts/blog3/blog3.html", title: "Ecosistemas en lagos" },
    { link: "../posts/blog4/blog4.html", title: "Habitats de animales" },

];

// Josue- Funcion para añadir las <p> de los blogs en la barra de busqueda
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

// Josue-Inicializar el contenido del blog dinámicamente.
let blogContent = [];
fetchBlogContent().then(content => blogContent = content);

document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.querySelector(".posts");
    let scrollAmount = 0;

    function autoScroll() {
        const postWidth = postsContainer.querySelector(".post").offsetWidth + 20; // Ancho del post + gap
        scrollAmount += postWidth;

        // Si llega al final, vuelve al inicio
        if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
            scrollAmount = 0;
        }

        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth", // Movimiento más fluido
        });
    }

    // Ejecutar el desplazamiento automáticamente cada 1 segundo
    setInterval(autoScroll, 3500);
});

document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.querySelector(".posts");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const postWidth = postsContainer.querySelector(".post").offsetWidth + 20; // Ancho del post + gap

    let scrollAmount = 0;
    const scrollSpeed = 1; // Velocidad del desplazamiento automático

    // Función para desplazamiento automático
    function autoScroll() {
        scrollAmount += scrollSpeed;

        if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
            scrollAmount = 0;
        }

        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });

        requestAnimationFrame(autoScroll);
    }

    // Función para desplazarse hacia la izquierda
    leftArrow.addEventListener("click", function () {
        scrollAmount -= postWidth;
        if (scrollAmount < 0) {
            scrollAmount = 0; // Evitar desplazamiento negativo
        }
        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    });

    // Función para desplazarse hacia la derecha
    rightArrow.addEventListener("click", function () {
        scrollAmount += postWidth;
        if (scrollAmount >= postsContainer.scrollWidth - postsContainer.offsetWidth) {
            scrollAmount = postsContainer.scrollWidth - postsContainer.offsetWidth; // Evitar exceder el límite
        }
        postsContainer.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
        });
    });

    // Iniciar desplazamiento automático
    autoScroll();
});

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('carousel-posts');
    try {
        const response = await fetch('http://localhost:3001/api/posts');
        const { success, posts } = await response.json();

        if (success) {
            container.innerHTML = posts.slice(0, 5).map(post => `
                <div class="post">
                    <div class="ctn-img">
                        <img src="${post.imageUrl || '../img/default.jpg'}" alt="Post image">
                    </div>
                    <h2>${(post.content || '').replace(/<[^>]+>/g, '').slice(0, 40)}...</h2>
                    <span>${new Date(post.created_at).toLocaleDateString()}</span>
                    <ul class="ctn-tags">
                        <li>Post</li>
                        <li>Blog</li>
                    </ul>
                    <a href="#"><button>Leer más</button></a>
                </div>
            `).join('');
        }
    } catch (err) {
        console.error("❌ Error cargando posts en carrusel:", err);
    }
});