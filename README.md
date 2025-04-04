# Git Checkout Helper 🚀

![Version](https://img.shields.io/badge/version-1.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ¿Qué hace esta extensión?
**Git Checkout Helper** es una herramienta para desarrolladores que trabajan con múltiples ramas en Git.  
Automatiza la generación de comandos `git checkout <rama> -- <archivos>` para copiar archivos modificados/nuevos desde una rama a otra, **sin necesidad de formatear manualmente las rutas**.


![Demo](https://i.ibb.co/2P4q4wD/git-checkout-helper-demo.gif)

---

## Características ✨

- **Parseo automático** de la salida de `git status` o `git diff`.
- **Soporte para rutas con espacios** (se añaden comillas automáticamente).
- **Interfaz intuitiva** para ingresar la rama y pegar la lista de archivos.
- **Atajo de teclado** (ej: `Ctrl+Alt+C` / `Cmd+Alt+C`).
- **Copiado al portapapeles** con un solo clic.

---

## Casos de uso 🛠️

1. **Migrar cambios específicos** entre ramas sin mergear todo el código.
2. **Rescatar archivos** de una rama en la que no quieres hacer merge.
3. **Evitar errores manuales** al escribir comandos largos con múltiples rutas.

---

## Cómo usarlo 📝

### Paso 1: Obtén la lista de archivos

Ejecuta en tu terminal:

```bash
git status --porcelain
# o
git diff --name-status
```

### Paso 2: Genera el comando

1. Abre la extensión con el atajo `Ctrl+Alt+C` (Windows/Linux) o `Cmd+Alt+C` (Mac).
2. Ingresa la **rama de origen** (ej: `feature/nueva-funcionalidad`).
3. Pega la salida de `git status`:
   ```
   modified:   src/app/file1.ts
   new file:   src/app/file2.html
   ```
4. ¡Copiar el comando generado y ejecútalo en tu terminal!

---

## Instalación 📥

### Opción 1: VS Code Marketplace

Pronto disponible (requiere publicar la extensión).

### Opción 2: Manual (VSIX)

1. Descarga el archivo `.vsix` desde [Releases](https://github.com/tu-usuario/git-checkout-helper/releases).
2. En VS Code, ve a **Extensions** > **Install from VSIX**.

---

## Atajos de teclado ⌨️

| Acción               | Windows/Linux | macOS       |
| -------------------- | ------------- | ----------- |
| Abrir la herramienta | `Ctrl+Alt+C`  | `Cmd+Alt+C` |

---

## Contribuir 🤝

1. Fork este repositorio.
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`).
3. Envía un Pull Request.

---

## Créditos 🎖️

Creado por **[Hernán A. Glomba]** ([@dighitalsoluciones](https://github.com/dighitalsoluciones)).  
Licencia: [MIT](LICENSE).

---

## ¿Por qué esta herramienta? 💡

Git es poderoso, pero comandos como:

```bash
git checkout rama-origen -- "ruta/con espacio/file1.ts" "ruta/file2.html"
```

son propensos a errores. Esta extensión **elimina la fricción** al generar el comando listo para usar.

---

¡Espero que te sea útil! 🚀  
**¿Tienes sugerencias?** ¡Abre un issue!

---

## Generador de Historial 📜

- Crea registros de cambios en formato:

FRONTEND: 27/03/25 15:25 HS
COMMIT: Style: Cambio de logo
modified: src/app/logo.png

- Ideal para documentación interna de proyectos.
