document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const userName = document.querySelector('input[name="userName"]').value.trim();
    const userEmail = document.querySelector('input[name="userEmail"]').value.trim();
    const userPassword = document.querySelector('input[name="userPassword"]').value.trim();

    if (!userName || !userEmail || !userPassword) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, userEmail, userPassword })
        });

        const result = await response.json();
        alert(result.message);

        if (result.success) {
            window.location.href = "C:\Users\Brandom\Documents\Trabajos_html\PI-Blog-main-v2\menú"; // Redirigir al usuario después del registro
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("No se pudo conectar con el servidor.");
    }
});
