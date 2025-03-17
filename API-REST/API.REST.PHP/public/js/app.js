document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("clienteForm");

    form.addEventListener("submit", async(event) => {
        // frenamos el formulario
        event.preventDefault();

        // obtenemos datos del formulario
        const formData = new FormData(form);

        try {
            // enviamos la peticion
            const response = await fetch("../api-rest/create_client.php", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al crear cliente");
            }

            // se limpia la tabla
            form.reset();
            alert("Cliente creado correctamente");

            obtenerClientes();

        } catch (error) {
            console.error(error);
            alert("No se pudo crear el cliente");
        }
    });
});

async function obtenerClientes() {
    try {
        // 1) Llamamos a la API
        const response = await fetch("../api-rest/get_all_client.php");
        if (!response.ok) {
            throw new Error("No se pudo obtener la lista de clientes");
        }

        const clientes = await response.json();

        const tabla = document.getElementById("tablaClientes");
        tabla.innerHTML = "";

        clientes.forEach(cliente => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                    <td>${cliente.id}</td>
                    <td>${cliente.name}</td>
                    <td>${cliente.email}</td>
                    <td>${cliente.city}</td>
                    <td>${cliente.telephone}</td>
                    <td>
                    <button 
                      onclick="editCliente(${cliente.id}, '${cliente.name}', '${cliente.email}', '${cliente.city}', '${cliente.telephone}')">
                      ✏️ Editar
                    </button>
                      <button onclick="eliminarCliente(${cliente.id})"> 🗑️ Eliminar</button>
                    </td>
                   `;
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
        alert("Error al obtener la lista de clientes");
    }
}

// Para que cargue la tabla apenas abra la página
document.addEventListener("DOMContentLoaded", obtenerClientes);

async function editCliente(id, name, email, city, telephone) {

    // Rellenamos los inputs
    document.getElementById("editId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editCity").value = city;
    document.getElementById("editTelephone").value = telephone;

    // Mostramos el div de edición
    document.getElementById("listTittle").innerHTML = `<h2>Editar Cliente: ${name}</h2>`;
    document.getElementById("clientList").style.display = "none";
    document.getElementById("formEdit").style.display = "block";

}

async function updateCliente(event) {
    event.preventDefault();

    const id = document.getElementById("editId").value;
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;
    const city = document.getElementById("editCity").value;
    const telephone = document.getElementById("editTelephone").value;

    // Creamos un objeto con los datos a actualizar
    const updatedClient = { id, name, email, city, telephone };

    try {
        const response = await fetch("../api-rest/update_client.php", {
            method: "PUT", // <-- Usamos PUT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedClient), // <-- Mandamos JSON
        });

        if (!response.ok) {
            throw new Error("Error al actualizar cliente");
        }

        alert("Cliente actualizado correctamente");
        back(); // Oculta el form de edición y muestra la lista
        obtenerClientes(); // Refresca la tabla
    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el cliente");
    }
}

async function eliminarCliente(id) {
    try {
        const response = await fetch(`../api-rest/delete_client.php?id=${id}
    `, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Error al eliminar cliente");
        }
        alert("Cliente eliminado correctamente");
        obtenerClientes(); // Vuelve a cargar la tabla
    } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el cliente");
    }
}

async function back() {
    document.getElementById("listTittle").innerHTML = `<h2>Listado de Clientes</h2>`;
    document.getElementById("clientList").style.display = "block";
    document.getElementById("formEdit").style.display = "none";
}