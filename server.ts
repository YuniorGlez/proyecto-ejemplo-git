import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely so it doesn't crash on startup if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set yet in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint that powers our Smart AI Git Tutor
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Falta el mensaje del usuario (prompt)." });
    }

    let ai;
    try {
      ai = getAiClient();
    } catch (keyErr: any) {
      // Graceful error handling for missing keys (offline / demonstration mode fallback)
      console.warn("Gemini Client initialization failed:", keyErr.message);
      
      // Providing a beautiful simulated responses when key is missing, maintaining top quality
      const lower = prompt.toLowerCase();
      let responseText = "¡Hola! Soy tu Tutor de Git en modo local.\n\nActualmente, la clave de la API (GEMINI_API_KEY) no está configurada, por lo que estoy respondiendo en modo sin conexión con explicaciones predefinidas. ";
      
      if (lower.includes("conflict") || lower.includes("merge")) {
        responseText += "\n\n### Un conflicto de fusión (Merge Conflict) explicado:\nOcurre cuando dos personas modifican las mismas líneas del mismo archivo en ramas distintas y Git no sabe cuál conservar.\n\n**¿Cómo resolverlo?**\n1. Abre el archivo en conflicto (verás marcas como `<<<<<<< HEAD` y `>>>>>>> branch`).\n2. Edita el archivo para dejar la versión final.\n3. Guarda, añade con `git add [archivo]` y realiza un `git commit`.";
      } else if (lower.includes("commit")) {
        responseText += "\n\n### ¿Qué es un Commit?\nUn commit es un **punto de guardado** de tu proyecto. Imagínalo como una foto instantánea o un checkpoint en un videojuego. Guarda el estado exacto de tus archivos para que puedas volver a él en cualquier momento.";
      } else if (lower.includes("push") || lower.includes("pull")) {
        responseText += "\n\n### push vs pull:\n*   **git push:** Sube tus fotos locales (commits) al repositorio remoto (ej. GitHub) para compartirlos.\n*   **git pull:** Trae los cambios del repositorio remoto a tu máquina local y los fusiona de inmediato.";
      } else if (lower.includes("staging") || lower.includes("add")) {
        responseText += "\n\n### ¿Qué es Staging Area (Área de selección)?\nEs una pre-sala o sala de empaque. Antes de sellar tu caja (commit), pones los objetos que quieres guardar en ella usando `git add`. Esto te permite elegir qué cambios van en cada commit de forma selectiva.";
      } else {
        responseText += `\n\nAquí tienes un resumen básico para tu consulta "${prompt}":\n\n*   **¿Quieres crear un repositorio?** Usa \`git init\`.\n*   **¿Quieres ver tus cambios actuales?** Usa \`git status\`.\n*   **¿Deseas enviar tus cambios locales a la nube?** Usa \`git push\`.\n\n*Consejo: Para recibir una tutoría interactiva detallada y personalizada para cualquier concepto, activa tu GEMINI_API_KEY en el menú de Secrets.*`;
      }
      return res.json({ text: responseText, isMock: true });
    }

    // Prepare system instructions for our Git Tutor
    const systemInstruction = 
      "Eres 'Giti', un mentor y tutor de Git interactivo, simpático y paciente que explica conceptos de control de versiones a desarrolladores principiantes. " +
      "Tus explicaciones deben usar analogías sencillas de la vida diaria (como un estudio de fotografía, una empresa de paquetería, una cocina, salas de empaque, copias de seguridad de juegos, etc.). " +
      "Organiza tus respuestas con títulos limpios en Markdown, listas y fragmentos de comando bien formateados. " +
      "Mantén siempre un tono alentador, divertido y en español. Si el usuario te hace preguntas técnicas, responde con ejemplos de consola interactivos.";

    // Convert history format to Gemini chats or construct a conversation prompt
    // Let's use the chats constructor if we want, or a unified prompt
    const chatPromptParts: string[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        const roleName = msg.role === 'user' ? 'Usuario' : 'Tutor';
        chatPromptParts.push(`${roleName}: ${msg.content}`);
      });
    }
    chatPromptParts.push(`Usuario: ${prompt}`);
    const unifiedPrompt = chatPromptParts.join("\n");

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: unifiedPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "No obtuve una respuesta clara del tutor. ¡Por favor, intenta de nuevo!";
    return res.json({ text: replyText, isMock: false });

  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return res.status(500).json({ error: error.message || "Ocurrió un error inesperado al consultar al Tutor." });
  }
});

// Setup Vite development server middleware or production static files serving
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap();
