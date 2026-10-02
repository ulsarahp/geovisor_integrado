# geovisor_integrado

Repositorio estático con una versión integrada del geovisor CONANP, preparada para publicar en GitHub Pages o cualquier servidor web estático.

## Descripción

Este repositorio incluye:

- encabezado institucional
- panel lateral con capas y resultados
- mapa interactivo con Leaflet
- búsqueda por nombre
- dashboard con KPI y gráficos
- tema claro/oscuro
- capa de leyenda
- filtros y análisis básicos

## Estructura

```text
index.html
assets/
├── css/
│   └── geovisor.css
├── js/
│   └── geovisor.js
```

## Ejecución

Se puede abrir con un servidor local simple, por ejemplo:

```bash
python -m http.server 8000
```

Luego abrir en el navegador:

```text
http://localhost:8000
```

## Nota

Esta versión está diseñada para un despliegue estático y funcional, manteniendo la identidad visual y la lógica principal del geovisor original.
