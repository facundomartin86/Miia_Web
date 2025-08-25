# Procesador de Markdown - ChatModule

## Descripción

El ChatModule incluye un procesador de markdown básico que mejora la presentación de las respuestas de la IA, permitiendo formato enriquecido sin dependencias externas.

## Funcionalidades

### Formato de Texto

- **Negrita**: `**texto**` → `<strong>texto</strong>`
- **Cursiva**: `*texto*` → `<em>texto</em>`

### Listas

- **Listas numeradas**: Detecta formato `1. texto` y aplica estilo especial
- **Números resaltados**: Los números aparecen en color cyan (`text-cyan-300`)

### Estructura

- **Saltos de línea**: Preserva líneas vacías con `<br>`
- **Párrafos**: Cada línea se renderiza en un `<div>` separado

## Implementación Técnica

### Función Principal

```typescript
const processMarkdown = (text: string): JSX.Element
```

### Algoritmo

1. **División por líneas**: Split del texto por `\n`
2. **Procesamiento línea por línea**:
   - Líneas vacías → `<br>`
   - Detección de listas numeradas con regex: `/^(\d+)\.\s+(.+)/`
   - Aplicación de formato con regex replace
3. **Renderizado**: Uso de `dangerouslySetInnerHTML` para HTML generado

### Aplicación Selectiva

- Solo se aplica a mensajes de IA (`message.sender === "ai"`)
- Los mensajes de usuario mantienen formato plano

## Estilos CSS

### Listas Numeradas

```css
.font-semibold.text-cyan-300  /* Números */
```

### Contenedores

```css
.mb-1  /* Margen inferior entre líneas */
```

## Seguridad

### dangerouslySetInnerHTML

- **Riesgo**: Potencial XSS si el contenido no es confiable
- **Mitigación**: Solo se aplica a respuestas de IA controladas
- **Alternativa futura**: Considerar biblioteca de markdown sanitizada

## Ejemplos de Uso

### Entrada

```markdown
Aquí tienes algunos lugares para visitar:

1. **Cafayate**: Conocido por sus viñedos
2. **Los Cardones**: Formaciones rocosas únicas
3. **Salinas Grandes**: Famoso por sus salares

¡Espero que te sirvan!
```

### Salida Renderizada

- Números "1.", "2.", "3." en cyan
- "Cafayate", "Los Cardones", "Salinas Grandes" en negrita
- Preservación de estructura de párrafos

## Limitaciones Actuales

1. **Markdown limitado**: Solo negrita, cursiva y listas numeradas
2. **Sin listas con viñetas**: No soporta `- item` o `* item`
3. **Sin enlaces**: No procesa `[texto](url)`
4. **Sin código**: No soporta \`código\` o \`\`\`bloques\`\`\`

## Mejoras Futuras

### Funcionalidades Pendientes

- [ ] Listas con viñetas (`-`, `*`)
- [ ] Enlaces `[texto](url)`
- [ ] Código inline y bloques
- [ ] Encabezados `# Título`
- [ ] Citas `> texto`

### Optimizaciones

- [ ] Biblioteca de markdown completa (marked, markdown-it)
- [ ] Sanitización de HTML
- [ ] Renderizado con componentes React en lugar de HTML

## Archivos Relacionados

- **Implementación**: `src/components/Modules/ChatModule.tsx` (líneas 65-105)
- **Documentación**: `docs/chat-markdown.md`
- **Tests**: Pendiente implementar

## Commits Relacionados

- `feat(chat): implementar procesador de markdown para respuestas de IA`
- Fecha: 2025-08-25
- Hash: `5ede640`
