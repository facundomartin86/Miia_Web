# Prompt de guía para MiiA (Mi Inteligencia Artificial)

Este documento captura el prompt de especificación para el desarrollo de MiiA. Servirá como referencia viva para evolución y control de cumplimiento.

---

## Prompt original

Quiero que diseñes y desarrolles una IA personal de desarrollo especializada llamada MiiA (Mi Inteligencia Artificial).

Requisitos principales:
Independencia
No debe depender exclusivamente de nubes o servicios externos.
Puede usar modelos externos gratuitos (ej. HuggingFace, GPT4All, Ollama, OpenAI free tier, etc.) al inicio, pero siempre debe priorizar:
Memoria local (almacenar y reutilizar lo aprendido).
Evolucionar hacia el uso de modelos locales propios.
Su arquitectura debe permitir que, con el tiempo, MiiA vaya independizándose de los externos.
Comunicación
Debe funcionar como app web (accesible desde cualquier dispositivo).
Login sencillo para que solo yo pueda usarla.
Comunicación por:
Chat escrito.
Voz bidireccional (entrada y salida), con voces naturales que puedan mejorar con el tiempo.
Debe poder mostrar resultados en pantalla y resaltar o marcar zonas relevantes (ej. en un sitio web o un documento).
Capacidades
Resolver dudas, problemas y tareas de programación, automatización y administración.
Navegador interno:
Para navegar conmigo (ej. ver un video juntos, revisar un sitio).
Para que MiiA pueda aprender navegando por la web, extrayendo información y guardándola en su memoria.
Defenderse ante intentos de hackeo, con un módulo de seguridad.
Poder pedirme ayuda en cosas que no pueda resolver sola (ej. CAPTCHAs).
Aprender de sus errores y mejorar su lógica de razonamiento.
Mejorar su propio código:
Leer, analizar y proponer cambios en su código fuente.
Guardar propuestas en un repositorio local.
Simular mejoras y aplicarlas bajo mi supervisión.
Con el tiempo, generar nuevas apps o herramientas autónomas.
Tecnología
Frontend web: React + Tailwind (futurista, claro, minimalista, no muy oscuro).
Backend: Node.js o Python (modular, con APIs claras).
Base de datos: PostgreSQL o SQLite (para memoria).
IA: integración inicial con modelos externos gratuitos + arquitectura lista para modelos locales.
Seguridad: login personal, cifrado local de memoria, firewalls básicos.
Extensibilidad: diseño modular para que se puedan agregar capacidades sin rehacer todo.
Estilo visual
Estética futurista pero clara (nada muy oscuro).
Logo e iconos ya disponibles (los voy a proporcionar).
Ventanas intuitivas: chat principal, panel de memoria, navegador integrado, configuraciones de voz.

Objetivo final:
Construir a MiiA, una IA personal que:
Empiece usando modelos externos gratuitos.
Aprenda a navegar, razonar y programar mejor con el tiempo.
Guarde todo en memoria local para no depender de terceros.
Evolucione hasta ser 100% autónoma en lógica, aprendizaje y desarrollo.

---

## Notas de versión

- Guardado por primera vez: 2025-08-23
- Estado: versión inicial importada sin cambios.

## Instrucciones de actualización

- Propón cambios en este archivo mediante PRs internos.
- Mantén un registro breve de cambios en "Notas de versión".
