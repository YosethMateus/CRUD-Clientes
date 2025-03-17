
*/
Descripción

Esta vista permite la gestión de clientes mediante un formulario para agregar nuevos clientes, una tabla para listar los clientes existentes y otro formulario para editar la información de un cliente seleccionado.

Estructura del Documento

1. head
Contiene la configuración inicial del documento:
Codificación UTF-8: Para soportar caracteres especiales.
Título de la página: "Gestión de Clientes".
Enlace al archivo de estilos CSS: ../public/css/styles.css.

2. body
El cuerpo de la página está compuesto por tres secciones principales:

Sección 1: Formulario de Creación de Clientes
Ubicado dentro de un div con la clase card, incluye:
Un encabezado (h2) con el título "Gestión de Clientes".
Un formulario (form) con el identificador clienteForm, que permite agregar nuevos clientes con los siguientes campos:
name (Nombre)
email (Correo)
city (Ciudad)
telephone (Teléfono)
Un botón para enviar el formulario (<button type="submit">Agregar Cliente</button>).

Sección 2: Listado de Clientes
Ubicada dentro de otro div con la clase card, incluye:
Un encabezado (h2) con el título "Listado de Clientes".
Una tabla (table) con:
Un encabezado (thead) con los títulos de las columnas (ID, Nombre, Correo, Ciudad, Teléfono, Opciones).
Un cuerpo (tbody) con el identificador tablaClientes, donde se insertarán dinámicamente los clientes obtenidos desde la API.

Sección 3: Formulario de Edición de Clientes
Oculto por defecto (style="display: none;"), se muestra cuando se edita un cliente. Contiene:
Un formulario (form) para editar los datos del cliente con los mismos campos que el formulario de creación.
Un botón para guardar los cambios (<button type="submit">Editar Cliente</button>).
Un botón para volver a la lista (<button onclick="back()">Volver</button>).

3. Inclusión de JavaScript

Se carga el archivo app.js, que contiene la lógica de la aplicación, mediante:

<script src="../public/js/app.js"></script>

Funcionamiento

Al cargar la página, se obtiene la lista de clientes desde la API y se muestra en la tabla.
Para agregar un cliente, se llena el formulario y se envían los datos mediante una petición POST.
Para editar un cliente, se hace clic en el botón de edición, se rellenan los campos y se guardan los cambios mediante una petición PUT.
Para eliminar un cliente, se hace clic en el botón de eliminación y se envía una petición DELETE.
Para volver al listado después de editar, se hace clic en el botón "Volver", que oculta el formulario de edición y muestra la lista de clientes nuevamente.


//archivo app.js

//Este archivo maneja la interacción del frontend con la API REST para gestionar clientes.
//Incluye funciones para crear, obtener, editar, actualizar y eliminar clientes.

// Cuando el DOM esté completamente cargado, inicializamos los eventos del formulario
document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("clienteForm");

// Evento para manejar el envío del formulario de creación de cliente
form.addEventListener("submit", async(event) => {
    event.preventDefault(); // Evita que el formulario recargue la página
    
    const formData = new FormData(form); // Recoge los datos del formulario

    try {
        const response = await fetch("../api-rest/create_client.php", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error al crear cliente");
        }

        form.reset(); // Limpia el formulario tras el envío
        alert("Cliente creado correctamente");
        obtenerClientes(); // Refresca la lista de clientes

    } catch (error) {
        console.error(error);
        alert("No se pudo crear el cliente");
    }
});

});

// Función para obtener la lista de clientes y actualizar la tabla en la interfaz
async function obtenerClientes() {
try {
const response = await fetch("../api-rest/get_all_client.php"); // Llamada a la API
if (!response.ok) {
throw new Error("No se pudo obtener la lista de clientes");
}

    const clientes = await response.json();
    const tabla = document.getElementById("tablaClientes");
    tabla.innerHTML = ""; // Limpia la tabla antes de agregar nuevos datos

    clientes.forEach(cliente => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${cliente.id}</td>
            <td>${cliente.name}</td>
            <td>${cliente.email}</td>
            <td>${cliente.city}</td>
            <td>${cliente.telephone}</td>
            <td>
                <button onclick="editCliente(${cliente.id}, '${cliente.name}', '${cliente.email}', '${cliente.city}', '${cliente.telephone}')">✏️ Editar</button>
                <button onclick="eliminarCliente(${cliente.id})">🗑️ Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
} catch (error) {
    console.error(error);
    alert("Error al obtener la lista de clientes");
}

}

// Llama a obtenerClientes cuando la página se carga
document.addEventListener("DOMContentLoaded", obtenerClientes);

// Función para mostrar los datos del cliente en el formulario de edición
async function editCliente(id, name, email, city, telephone) {
document.getElementById("editId").value = id;
document.getElementById("editName").value = name;
document.getElementById("editEmail").value = email;
document.getElementById("editCity").value = city;
document.getElementById("editTelephone").value = telephone;

document.getElementById("listTittle").innerHTML = `<h2>Editar Cliente: ${name}</h2>`;
document.getElementById("clientList").style.display = "none";
document.getElementById("formEdit").style.display = "block";

}

// Función para actualizar un cliente
async function updateCliente(event) {
event.preventDefault();

const id = document.getElementById("editId").value;
const name = document.getElementById("editName").value;
const email = document.getElementById("editEmail").value;
const city = document.getElementById("editCity").value;
const telephone = document.getElementById("editTelephone").value;

const updatedClient = { id, name, email, city, telephone };

try {
    const response = await fetch("../api-rest/update_client.php", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClient),
    });

    if (!response.ok) {
        throw new Error("Error al actualizar cliente");
    }

    alert("Cliente actualizado correctamente");
    back(); // Oculta el formulario de edición
    obtenerClientes(); // Recarga la lista
} catch (error) {
    console.error(error);
    alert("No se pudo actualizar el cliente");
}

}

// Función para eliminar un cliente
async function eliminarCliente(id) {
try {
const response = await fetch(../api-rest/delete_client.php?id=${id}, {
method: "DELETE",
});

    if (!response.ok) {
        throw new Error("Error al eliminar cliente");
    }
    
    alert("Cliente eliminado correctamente");
    obtenerClientes(); // Recarga la tabla
} catch (error) {
    console.error(error);
    alert("No se pudo eliminar el cliente");
}

}

// Función para regresar a la lista de clientes y ocultar el formulario de edición
async function back() {
document.getElementById("listTittle").innerHTML = <h2>Listado de Clientes</h2>;
document.getElementById("clientList").style.display = "block";
document.getElementById("formEdit").style.display = "none";
}

//estilos 
1. Estilos Generales de la Tarjeta (.card)

.card {
    align-content: center;
    text-align: center;
    border: 1px solid #0c2f40;
    border-radius: 5px;
    width: 70%;
    margin: auto;
}

Explicación:
align-content: center; → Centra el contenido dentro de la tarjeta.
text-align: center; → Asegura que el texto dentro de la tarjeta esté centrado.
border: 1px solid #0c2f40; → Agrega un borde de 1px con color azul oscuro.
border-radius: 5px; → Aplica esquinas redondeadas a la tarjeta.
width: 70%; → Define que la tarjeta ocupará el 70% del ancho de su contenedor padre.
margin: auto; → Centra la tarjeta horizontalmente en la pantalla.

2. Cabecera de la Tarjeta (.card-header)

.card-header {
    width: 100%;
    align-content: center;
    text-align: center;
    border-radius: 5px;
    background-color: #2ab1f5;
    color: aliceblue;
}

Explicación:
width: 100%; → Ocupa el ancho completo de la tarjeta.
align-content: center; text-align: center; → Centra el contenido y el texto dentro de la cabecera.
border-radius: 5px; → Redondea las esquinas de la cabecera.
background-color: #2ab1f5; → Fondo de color azul claro.
color: aliceblue; → Texto en color blanco para contrastar con el fondo.

3. Cuerpo de la Tarjeta (.card-body)

.card-body {
    width: 90%;
    align-content: center;
    justify-content: center;
    margin: 5%;
    text-align: center;
}

Explicación:
width: 90%; → Reduce ligeramente el ancho del contenido interno para mejor estética.
align-content: center; justify-content: center; → Centra los elementos dentro del card-body.
margin: 5%; → Agrega un margen del 5% alrededor del contenido.
text-align: center; → Centra el texto dentro del cuerpo de la tarjeta.

4. Estilos de la Tabla (table)

table {
    width: 80%;
    margin: auto;
}

Explicación:
width: 80%; → La tabla ocupa el 80% del ancho disponible.
margin: auto; → Centra la tabla horizontalmente.

5. Estilos de las Celdas de la Tabla (table td)

table td {
    padding: 10px;
}

Explicación:
padding: 10px; → Agrega un relleno interno de 10px a cada celda de la tabla para mejorar la legibilidad.

6. Contenedor de la Lista de Clientes (#clientList)

#clientList {
    max-height: 200px;
    overflow-y: auto;
}

Explicación:
max-height: 200px; → Limita la altura del contenedor a 200px para evitar que crezca demasiado.
overflow-y: auto; → Agrega un scroll vertical si el contenido excede la altura máxima establecida.

7. Encabezado de la Tabla (thead th)

thead th {
    position: sticky;
    top: 0;
    background-color: #2ab1f5;
    color: white;
    padding: 10px;
    border-bottom: 1px solid #0c2f40;
    z-index: 100;
}

Explicación:
position: sticky; → Fija la cabecera de la tabla en la parte superior cuando se hace scroll.
top: 0; → Define que el encabezado permanecerá en la parte superior.
background-color: #2ab1f5; → Fondo azul claro para diferenciarlo del resto de la tabla.
color: white; → Texto en color blanco para mejor contraste.
padding: 10px; → Agrega espaciado dentro de cada celda del encabezado.
border-bottom: 1px solid #0c2f40; → Agrega una línea divisoria azul oscuro en la parte inferior.
z-index: 100; → Asegura que el encabezado quede por encima de otros elementos cuando se desplaza la tabla.
