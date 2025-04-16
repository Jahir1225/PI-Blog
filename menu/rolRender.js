document.addEventListener("DOMContentLoaded", () => {
    const role = localStorage.getItem("userRole") || "invitado";
    const name = localStorage.getItem("userName") || "Invitado";
  
    const welcome = document.getElementById("welcomeMessage");
    const menu = document.getElementById("menu");
    const content = document.getElementById("content");
  
    welcome.textContent = `Hola, ${name}`;
  
    if (role === "admin") {
      menu.innerHTML = `
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="../publicar/publicar.html">Publicar Blog</a></li>
          <li><a href="#">Gestionar Usuarios</a></li>
          <li><a href="../login/login.html">Cerrar Sesión</a></li>
        </ul>
      `;
      content.innerHTML = `<h2>Panel de Administración</h2><p>Administra el contenido del sitio.</p>`;
    } else if (role === "usuario") {
      menu.innerHTML = `
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="../blog/blog.html">Ver Blogs</a></li>
          <li><a href="#">Mi Perfil</a></li>
          <li><a href="../login/login.html">Cerrar Sesión</a></li>
        </ul>
      `;
      content.innerHTML = `<h2>Bienvenido usuario</h2><p>Disfruta del contenido disponible para ti.</p>`;
    } else {
      // invitado
      menu.innerHTML = `
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="../login/login.html">Iniciar Sesión</a></li>
          <li><a href="../register/registro.html">Registrarse</a></li>
        </ul>
      `;
      content.innerHTML = `<h2>Bienvenido invitado</h2><p>Inicia sesión para acceder a más funciones.</p>`;
    }
  });
  