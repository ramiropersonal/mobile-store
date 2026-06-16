# Mobile Store — ITX Frontend Test

Aplicación SPA para la compra de dispositivos móviles, desarrollada con React y Vite.

---

## Requisitos previos

- **Node.js** 18 o superior
- **npm** 9 o superior

---

## Instalación

```bash
npm install
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm test` | Ejecuta los tests unitarios |
| `npm run lint` | Analiza el código con ESLint |
| `npm run preview` | Previsualiza el build de producción |

---

## Estructura del proyecto

```
src/
├── __tests__/          # Tests unitarios
│   ├── services/       # Tests de cache y API
│   ├── components/     # Tests de componentes
│   ├── pages/          # Tests de páginas
│   └── utils/          # Helpers para tests
├── components/
│   ├── Header/         # Cabecera con breadcrumbs y carrito
│   ├── SearchBar/      # Barra de búsqueda en tiempo real
│   ├── ProductItem/    # Tarjeta de producto en el listado
│   ├── ProductDescription/ # Detalles del producto
│   └── ProductActions/ # Selectores y botón de compra
├── context/
│   └── CartContext.jsx # Estado global del carrito
├── pages/
│   ├── ProductList/    # PLP — Listado de productos
│   └── ProductDetail/  # PDP — Detalle del producto
├── services/
│   ├── cache.js        # Caché en memoria con TTL de 1 hora
│   └── api.js          # Llamadas a la API con caché
└── index.css           # Variables CSS globales y reset
```

---

## Vistas

### PLP — Listado de productos (`/`)
Muestra todos los dispositivos obtenidos de la API. Incluye una barra de búsqueda que filtra en tiempo real por marca y modelo. La cuadrícula es adaptativa: 4 columnas en escritorio, 3 en tableta, 2 en móvil y 1 en pantallas pequeñas.

### PDP — Detalle del producto (`/product/:id`)
Muestra el detalle en dos columnas: imagen a la izquierda y ficha técnica + acciones a la derecha. Incluye selectores de almacenamiento y color, y el botón de añadir al carrito.

---

## Decisiones técnicas

### React sin TypeScript
El enunciado indica preferencia por JavaScript. Se usa React 19 con JSX y ES6+ para mantener simplicidad y cumplir el requisito explícito.

### Vite como bundler
Vite ofrece arranque instantáneo en desarrollo (ESM nativo), hot module replacement y configuración mínima. Funciona igual en macOS, Windows y Linux sin ajustes adicionales.

### React Router DOM v7
Enrutado declarativo en el cliente para implementar la SPA. La navegación de PLP a PDP incluye el nombre del producto en el estado de la ruta (`location.state`), lo que permite al Header mostrar breadcrumbs dinámicos sin un contexto adicional.

### CSS Modules
Se eligió CSS Modules en lugar de una librería externa (Tailwind, styled-components) para:
- Mantener dependencias al mínimo.
- Encapsular estilos por componente sin conflictos de nombres.
- Aprovechar el soporte nativo de Vite sin configuración adicional.

Las variables de diseño (colores, tipografía, sombras) se definen una sola vez en `:root` dentro de `index.css`.

### Caché en memoria (MemoryCache)
El enunciado requiere almacenar las respuestas de la API en el cliente con expiración de 1 hora. Se implementó un `MemoryCache` basado en un `Map` de JavaScript con `timestamp`:

- Sin dependencias externas: no necesita IndexedDB, localStorage ni librerías de caché.
- TTL de 1 hora: cada entrada guarda el valor y el momento de inserción. Al leer, si han pasado más de 3 600 000 ms, la entrada se descarta y se vuelve a pedir al servidor.
- Alcance de sesión: la caché vive mientras dure la pestaña. Al recargar la página, la primera petición siempre va al servidor.

### Contexto React para el carrito
El contador de ítems del carrito se gestiona con `CartContext` (React Context + `useState`). Es el mecanismo correcto para compartir estado global ligero entre componentes no relacionados jerárquicamente (Header y ProductActions) sin añadir Redux.

El valor viene directamente de la respuesta de la API (`POST /api/cart → { count }`) y se actualiza en tiempo real en la cabecera tras cada compra.

### Vitest + Testing Library
Vitest es el framework de tests oficial para proyectos Vite: comparte la misma configuración de transformación, garantizando que producción y tests se ejecuten con las mismas reglas.

`@testing-library/react` testea comportamiento observable (lo que el usuario ve e interactúa) en lugar de detalles internos, produciendo tests más robustos ante refactorizaciones. Los mocks de la API se realizan con `vi.mock()` para aislar los componentes completamente de la red.

---

## API

Base URL: `https://itx-frontend-test.onrender.com`

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/product` | GET | Listado de todos los productos |
| `/api/product/:id` | GET | Detalle de un producto |
| `/api/cart` | POST | Añadir producto al carrito |

Body del POST al carrito:
```json
{ "id": "...", "colorCode": 1000, "storageCode": 2000 }
```

La respuesta devuelve `{ "count": N }`, que actualiza el contador del Header.
