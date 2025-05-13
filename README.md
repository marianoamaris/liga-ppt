# Liga PPT - App de Gestión y Visualización

¡Bienvenido a la app oficial de la **Liga PPT**! Esta aplicación permite gestionar, visualizar y navegar de forma interactiva por la información de la liga de fútbol PPT, incluyendo clasificaciones, goleadores, arqueros, historia y un reglamento oficial navegable.

---

## 🚩 **¿Qué es Liga PPT?**

Una plataforma web para:

- Seguir el avance y la historia de la Liga PPT.
- Consultar tablas de posiciones, goleadores y arqueros destacados.
- Visualizar brackets y finales de cada edición.
- Navegar y consultar el **reglamento oficial** de la liga de forma interactiva.

---

## 🧭 **Navegación y Estructura**

- **Sidebar principal:** Navegación global por secciones (Información, Clasificación, Historia, Reglamento, etc.).
- **Clasificación:** Visualización de tablas, jornadas, goleadores y arqueros con efectos visuales y métricas.
- **Reglamento:** Visor interactivo con menú lateral propio, navegación por anclas y scroll automático a cada sección/subsección.
- **Historia:** Sección para la historia y datos destacados de la liga.
- **Login:** Acceso para administradores/capitanes (en desarrollo).

---

## 🏗️ **Estructura de Carpetas**

```
/src
  components/
    common/         # Componentes reutilizables (Sidebar, Card, etc.)
    sections/       # Secciones principales (Clasificación, Info, Historia...)
    reglamento/     # Componentes del visor de reglamento interactivo
  pages/            # Páginas principales (Home, ReglamentoPage, etc.)
  constants/        # Datos de ligas, colores, configuración
  utils/            # Utilidades y helpers
```

---

## ✨ **Principales Features**

- **Clasificación de ligas:** Tablas, jornadas, goleadores y arqueros con medallas, promedios y colores de equipo.
- **Reglamento interactivo:** Menú lateral navegable, scroll automático, anclas HTML y diseño responsivo.
- **Sidebar global:** Acceso rápido a todas las secciones de la app.
- **Visuales modernos:** Tailwind CSS, animaciones y diseño limpio.
- **Modularidad:** Componentes desacoplados y fáciles de mantener.

---

## 🚀 **Instalación y uso**

1. Clona el repositorio:
   ```sh
   git clone <url-del-repo>
   cd liga-ppt
   ```
2. Instala dependencias:
   ```sh
   npm install
   ```
3. Inicia la app en modo desarrollo:
   ```sh
   npm run dev
   ```
4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

---

## 🛠️ **Tecnologías usadas**

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilos)
- **React Router** (navegación)
- **React Icons** (iconografía)

---

## 🤝 **Contribuir**

1. Haz un fork del repo y crea una rama para tu feature/fix.
2. Haz tus cambios y abre un Pull Request.
3. ¡Toda ayuda es bienvenida para mejorar la app y el reglamento!

---

## 📄 **Licencia**

MIT

---

**Desarrollado para la comunidad de la Liga PPT ⚽️**
