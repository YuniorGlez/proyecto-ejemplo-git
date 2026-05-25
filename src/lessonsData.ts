import { Lesson } from "./types";

export const initialLessons: Lesson[] = [
  {
    id: "init",
    title: "1. Inicializar tu Proyecto: El Ojo de Git",
    shortTitle: "Inicializar (git init)",
    intro: "Tu computadora no vigila tus carpetas por defecto. Tienes que invitar a Git a tu proyecto.",
    concept: "Imagínate abrir un diario de bitácora. El primer día escribes '¡Aquí inicia la expedición!'. En Git, para que comience a registrar los cambios de tus archivos, ejecutas `git init`. Esto crea una carpeta invisible `.git` que será el cerebro del sistema.",
    interactiveGoal: "Inicializa tu repositorio en el simulador para despertar a Git. Escribe 'git init' o haz clic en el botón de Inicialización.",
    targetCommand: "git init",
    completed: false,
    contentMarkdown: `### ¿Qué hace exactamente \`git init\`?
Crea la base de datos de control de versiones local en tu carpeta actual. A partir de este momento, todos tus archivos tendrán un estado:
- **Sin seguimiento (Untracked):** Archivos que Git aún no vigila.
- **Modificados (Modified):** Archivos con cambios nuevos.
- **Preparados (Staged):** Archivos listos para guardarse en la historia.
- **Confirmados (Committed):** Archivos grabados de forma permanente en un checkpoint.`
  },
  {
    id: "add",
    title: "2. Staging Area: La Sala de Empaque",
    shortTitle: "Preparar (git add)",
    intro: "Antes de enviar un correo certificado con 5 cartas, las reúnes todas ordenadamente sobre una mesa.",
    concept: "En Git, el **Staging Area** (o Área de Preparación) es esa mesa de trabajo. Si modificas 3 archivos pero solo 1 está listo para presentarse, lo llevas a la mesa de preparación con `git add nombre_archivo`. Esto te da control milimétrico sobre qué incluir en tu próximo guardado sin meter ruido innecesario.",
    interactiveGoal: "Crea o edita un archivo haciendo clic en '+ Nuevo archivo' o 'Modificar' en tu Directorio de Trabajo. Luego, pulsa 'git add' o escribe el comando correspondiente para trasladar tus cambios a la mesa de preparación.",
    targetCommand: "git add",
    completed: false,
    contentMarkdown: `### El flujo de la mesa de preparación:
1. Creas un archivo nuevo (ej. \`index.html\`). Aparecerá de color **Humo** (Sin seguimiento).
2. Modificas un archivo existente. Quedará de color **Amarillo** (Modificado).
3. Utilizas \`git add index.html\` (o \`git add .\` para preparar todos los cambios a la vez).
4. El archivo pasará a color **Verde brillante** indicando que está listo en Staging.`
  },
  {
    id: "commit",
    title: "3. El Commit: Tu Foto Instantánea",
    shortTitle: "Guardar (git commit)",
    intro: "Un 'commit' es un punto de restauración indestructible en el tiempo.",
    concept: "Cuando estás conforme con los archivos que colocaste en el Staging Area (la mesa de preparación), cierras la caja y la sellas. Al hacer `git commit -m 'Mi mensaje'`, grabas una versión permanente en la historia del repositorio. Si en tres meses rompes tu código, ¡puedes regresar a este commit exacto con un solo click!",
    interactiveGoal: "Escribe un mensaje de confirmación claro y descriptivo (ej. 'Crear página de bienvenida') y ejecuta 'git commit' para consolidar tu primer checkpoint histórico.",
    targetCommand: "git commit",
    completed: false,
    contentMarkdown: `### Buenas prácticas para tus mensajes de Commit:
- **Escribe en presente e imperativo:** ej. \`Añadir botón de registro\` en lugar de \`botón añadido\` o \`agregué un botón\`.
- **Sé conciso pero descriptivo:** Evita poner mensajes vacíos o confusos como \`cambios\`, \`fix\`, o \`asdadsad\`. Piensa que tu 'yo del futuro' o tus compañeros necesitan saber qué cambió.`
  },
  {
    id: "push",
    title: "4. Sincronizar con la Nube: Conectar a GitHub",
    shortTitle: "Subir (git push)",
    intro: "El repositorio en tu computadora está genial, pero ¿qué pasa si se vierte café sobre tu teclado?",
    concept: "Para evitar tragedias y permitir que otras personas colaboren contigo, necesitas subir tu historia de checkpoints locales a una plataforma en la nube (ej. GitHub, GitLab, Bitbucket). Tus repositorios locales viajan seguros mediante \`git push\`, asegurando que siempre tengas un respaldo remoto vivo.",
    interactiveGoal: "Ejecuta 'git push' para copiar de forma interactiva tus commits al servidor simulado en GitHub y verlos iluminarse.",
    targetCommand: "git push",
    completed: false,
    contentMarkdown: `### Conceptos del trabajo remoto:
- **Remoto (Remote):** El portal en internet que aloja la copia compartida (ej. GitHub). Generalmente Git le da el nombre clave de \`origin\`.
- **git push:** Sube tus commits locales al servidor remoto.
- **git pull:** El hermano opuesto. Descarga los commits que subieron tus colegas en la nube y los combina en tu computadora.`
  },
  {
    id: "branch",
    title: "5. Ramas: Multiversos de Código",
    shortTitle: "Ramas (git branch)",
    intro: "Nunca trabajes directamente sobre el plano maestro si quieres experimentar de forma segura.",
    concept: "Las ramas o **Branches** te permiten dividir el camino en líneas temporales alternas. La rama principal predeterminada se llama \`main\`. Si quieres probar un diseño oscuro muy loco sin arruinar el diseño claro funcional, creas una rama alternativa (ej. \`feature-diseño-oscuro\`). Trabajas de forma aislada e independiente en ella. Si te gusta, la vuelves a soldar a la rama maestra mediante un \`merge\` (fusión).",
    interactiveGoal: "Crea tu propia rama con el comando 'git checkout -b desarrollo' o mediante la barra de control de ramas para entender cómo se bifurca la historia.",
    targetCommand: "git checkout",
    completed: false,
    contentMarkdown: `### Comandos básicos de ramas:
- \`git branch\`: Te lista todas las ramas existentes en tu computadora.
- \`git checkout -b mi-rama-nueva\`: Crea una rama y salta a ella de inmediato.
- \`git checkout main\`: Vuelve a cambiar tu enfoque a la rama principal.`
  }
];
