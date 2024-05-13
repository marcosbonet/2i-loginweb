### Backend de 2i-loginweb

Este es el backend para la aplicación 2i-loginweb, que proporciona servicios de registro, inicio de sesión y gestión de perfiles de usuario.

## Instalación

1. Clona este repositorio en tu máquina local:

git clone https://github.com/marcosbonet/2i-loginweb

2. Instala las dependencias utilizando npm:

   npm install

## Configuración

1.  Asegúrate de tener una base de datos PostgreSQL configurada y funcionando en tu entorno local.

2.  Crea un archivo .env en la raíz del proyecto y define las siguientes variables de entorno, con el fin de poder testear la app

    DB_USER=postgres
    DB_HOST=localhost
    DB_PASSWORD=postgres
    DB_NAME=logindatabase
    DB_PORT=5432
    TOKEN_SECRET=token

Asegúrate de reemplazar usuario y contraseña con tus credenciales de PostgreSQL, y secreto_para_jwt con una cadena aleatoria para la generación de tokens JWT, si se quiere probar con un usuario propio.

## Uso

1.  Inicia el servidor:

    npm run dev

    Esto iniciará el servidor en el puerto 3000 por defecto.

2.  Realiza las siguientes operaciones:
    - Registro de usuario: Envía una solicitud POST a /register con los datos del usuario en el cuerpo de la solicitud.
    - Inicio de sesión: Envía una solicitud POST a /signin con las credenciales de usuario en el cuerpo de la solicitud.
    - Obtención de perfil de usuario: Envía una solicitud GET a /profile con el token de autenticación en la cabecera de la solicitud.

## Dependencias

    @hapi/joi: Para la validación de datos.
    bcrypt: Para el hashing de contraseñas.
    cors: Para la configuración de los encabezados CORS.
    dotenv: Para la carga de variables de entorno desde archivos .env.
    express: Para el manejo de rutas y solicitudes HTTP.
    jsonwebtoken: Para la generación y verificación de tokens JWT.
    morgan: Para el registro de solicitudes HTTP.
    pg: Para la conexión y consulta a la base de datos PostgreSQL.
    typescript: Para el desarrollo con TypeScript.
