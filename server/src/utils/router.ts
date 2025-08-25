// Router simple por heurísticas para elegir modelo de Ollama según el tema
export type ModelChoice = {
  model: string;
  reason: string;
};

export function chooseModelByHeuristic(text: string): ModelChoice {
  const t = text.toLowerCase();
  // Código / programación
  if (
    /(\bcode\b|\bcódigo\b|typescript|javascript|python|error\b|stack trace|compile|framework|react|node|api)/.test(
      t,
    )
  ) {
    return { model: "qwen2.5-coder:7b", reason: "consulta técnica/código" };
  }
  // Razonamiento paso a paso / problemas
  if (
    /(razonar|explica|pasos|por qué|why|solve|problema|matem|algoritmo)/.test(t)
  ) {
    return { model: "deepseek-r1:7b", reason: "razonamiento paso a paso" };
  }
  // Datos/tablas
  if (/(tabla|csv|dataset|datos|estadística|sql)/.test(t)) {
    return {
      model: "qwen2.5:7b-instruct",
      reason: "manipulación/explicación de datos",
    };
  }
  // General/español (usar un modelo disponible en el sistema)
  return { model: "qwen2.5:14b-instruct", reason: "consulta general" };
}
