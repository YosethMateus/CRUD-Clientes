<?php
    require_once('../includes/Client.class.php');

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        // recibimos el JSON
        $data = json_decode(file_get_contents("php://input"));
    
        // Validaamos que los campos existan
        if (!empty($data->id) && !empty($data->name) &&!empty($data->email) && !empty($data->city) && !empty($data->telephone)) {
            
            Client::update_client($data->id, $data->email, $data->name, $data->city, $data->telephone);
    
            // Respuesta de éxito
            http_response_code(200);
        } else {
            http_response_code(400);
            echo "Faltan datos para actualizar";
        }
    } else {
        http_response_code(405); // Método no permitido
        echo "Método no permitido";
        }

?>