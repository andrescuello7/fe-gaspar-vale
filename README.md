# Model Green-White v1.0.0

Invitación digital fresca con diseño verde y blanco. Incluye pantalla de bienvenida personalizada, countdown, lista de regalos y más.

## ✨ Características

- 💌 **Pantalla de bienvenida** personalizada por invitado
- ⏰ **Cuenta regresiva** en tiempo real
- 📱 **Diseño responsive** para todos los dispositivos
- 🎨 **Animaciones elegantes** y transiciones suaves
- 📝 **Formulario de confirmación** de asistencia
- 🎁 **Lista de regalos** con CBU/CVU y alias
- 🗺️ **Mapa integrado** con Google Maps
- 👔 **Dress code** y recomendaciones
- ⚙️ **Configuración centralizada** con config.json
- 💾 **Sin dependencias** externas (vanilla JS)

## 🚀 Inicio Rápido

1. **Personaliza config.json**
   ```json
   {
     "couple": {
       "name1": "Nadia",
       "name2": "Pablo"
     },
     "date": {
       "ceremony": "2026-09-20T18:00:00"
     },
     "giftRegistry": {
       "cbu": "1234567890123456789012",
       "alias": "TU.ALIAS.MP"
     }
   }
   ```

2. **Abre index.html** en tu navegador

3. **¡Listo!** Personaliza según necesites

## ⚙️ Configuración (config.json)

Todos los datos del evento se centralizan en `config.json`:

### Información de la Pareja
```json
"couple": {
  "name1": "Nadia",
  "name2": "Pablo"
}
```

### Personalización de Invitados
```json
"guest": {
  "message": "TENEMOS 1 LUGAR RESERVADO PARA VOS.",
  "defaultName": "INVITADO ESPECIAL"
}
```

### Tema y Colores
```json
"theme": {
  "primaryColor": "#2d5f3f",
  "secondaryColor": "#ffffff",
  "accentColor": "#5a9371"
}
```

### Lista de Regalos
```json
"giftRegistry": {
  "cbu": "1234567890123456789012",
  "alias": "TU.ALIAS.MP"
}
```

## 🎨 Personalización Avanzada

### Colores (styles.css)

Personaliza la paleta de colores editando las variables CSS:

```css
:root {
    --color-blanco: #FFFFFF;
    --color-negro: #2e2e2e;
    --color-gris-claro: #f0ebe7;
    --color-dorado: #c2a990;
    --fuente-principal: 'Montserrat', sans-serif;
    --fuente-display: 'Playfair Display', serif;
}
```

### Contenido del Evento (index.html)

Edita directamente en el HTML:
- Fecha y hora del evento
- Lugar del evento
- Información de hospedaje
- Datos bancarios para regalos
- Coordenadas del mapa

## 📋 Cómo Obtener el ID de un Video de YouTube

1. Ve al video en YouTube
2. Copia la URL (ejemplo: `https://www.youtube.com/watch?v=X-l02InC-_s`)
3. El ID es la parte después de `v=` → `X-l02InC-_s`

## 🗺️ Cómo Cambiar la Ubicación del Mapa

1. Ve a Google Maps
2. Busca tu ubicación
3. Haz clic derecho en el marcador
4. Selecciona "¿Qué hay aquí?"
5. Copia las coordenadas (ejemplo: `-26.823897, -65.330029`)
6. Actualiza en el HTML la URL del iframe:
   ```html
   src="https://maps.google.com/maps?q=TU_LATITUD,TU_LONGITUD&z=15..."
   ```

## 🎨 Añadir Tu Foto de Pareja

Reemplaza la sección de imagen placeholder en `index.html`:

```html
<section class="image-section">
    <img src="tu-imagen.jpg" alt="Foto de pareja" style="width: 100%; height: auto;">
</section>
```

O actualiza el CSS en `.image-placeholder` para usar una imagen de fondo:

```css
.image-placeholder {
    background-image: url('tu-imagen.jpg');
    background-size: cover;
    background-position: center;
}
```

## 📱 Características Responsive

La invitación se adapta automáticamente a:
- 📱 Móviles (< 480px)
- 📱 Tablets (480px - 768px)
- 💻 Desktop (> 768px)

## 🔧 Funcionalidades Adicionales

### Compartir en Redes Sociales

Puedes agregar botones de compartir usando las funciones incluidas:

```javascript
shareOnSocial('whatsapp');  // WhatsApp
shareOnSocial('facebook');  // Facebook
shareOnSocial('twitter');   // Twitter
```

### Agregar al Calendario

```javascript
addToCalendar();  // Descarga archivo .ics
```

## 📦 Estructura de Archivos

```
model-green-white/
├── index.html           # Estructura HTML principal
├── lista-regalos.html   # Página de lista de regalos
├── styles.css           # Estilos y diseño
├── script.js            # Funcionalidad JavaScript
├── config.json          # Configuración centralizada ⭐
├── .template            # Guía de personalización
├── README.md            # Esta documentación
└── assets/              # Recursos e imágenes
```

## 🔧 Recursos Compartidos

Este template utiliza recursos desde `/shared`:
- `reset.css` - Reset CSS estándar
- `utils.css` - Clases de utilidad
- `utils.js` - Funciones comunes

Ver [documentación completa](../shared/README.md).

## 🎁 Lista de Regalos

Este template incluye una página dedicada (`lista-regalos.html`) con:
- CBU/CVU para transferencias
- Alias de Mercado Pago
- Botón para copiar datos
- Diseño consistente con la invitación principal

## 🌐 Publicar en Internet

### Opciones Gratuitas:

1. **GitHub Pages**
   - Sube los archivos a un repositorio de GitHub
   - Activa GitHub Pages en Settings
   - Tu sitio estará en `usuario.github.io/repositorio`

2. **Netlify / Vercel**
   - Arrastra y suelta tu carpeta
   - Obtén una URL gratuita

3. **Google Firebase**
   - Usa Firebase Hosting
   - Comando: `firebase deploy`

## 💡 Consejos de Uso

1. **Prueba en múltiples dispositivos** antes de compartir
2. **Comprime las imágenes** para carga más rápida
3. **Prueba la música** en diferentes navegadores
4. **Revisa todas las fechas** y horarios
5. **Verifica los enlaces** del mapa y redes sociales

## 🔒 Privacidad

- No se recopilan datos sin tu consentimiento
- El formulario puede conectarse a:
  - Google Forms
  - EmailJS
  - Tu propia API
  - Cualquier servicio de backend

## 🐛 Solución de Problemas

### La música no se reproduce
Libre para uso personal. Ver [LICENSE](../LICENSE) para más detalles.

## 📝 Versiones

### v1.0.0 (2026-02-11)
- ✨ Release inicial con config.json
- ✅ Pantalla de bienvenida personalizada
- ✅ Countdown dinámico
- ✅ Lista de regalos integrada
- ✅ Diseño responsive
- ✅ Formulario de confirmación

## 👥 Autores

- Andres Cuello
- Benja Tacconi
- Algunos navegadores bloquean autoplay
- El usuario debe interactuar primero (hacer clic en "INGRESAR")

### El countdown no funciona
- Verifica el formato de fecha en `CONFIG.eventDate`
- Debe ser: `YYYY-MM-DDTHH:MM:SS`

### El mapa no carga
- Verifica las coordenadas
- Asegúrate de tener conexión a internet

## 🆘 Soporte

Si tienes problemas o preguntas:
1. Revisa la consola del navegador (F12)
2. Verifica que todos los archivos estén en la misma carpeta
3. Asegúrate de tener conexión a internet para las fuentes y APIs externas

## 📄 Licencia

Este proyecto es de uso libre para invitaciones personales. No redistribuir con fines comerciales.

## 🎉 Créditos

Desarrollado con ❤️ para hacer tu día especial aún más memorable.

---

**¡Felicidades por tu boda!** 💍✨
# templates-invitations
