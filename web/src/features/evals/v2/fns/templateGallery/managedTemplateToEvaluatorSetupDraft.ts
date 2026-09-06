import type {
  EvaluatorSetupDraft,
  ManagedTemplate,
} from "@/src/features/evals/v2/types/templateGallery";

export function managedTemplateToEvaluatorSetupDraft(
  template: ManagedTemplate,
  localizedMetadata?: Pick<EvaluatorSetupDraft, "name" | "description">,
): EvaluatorSetupDraft {
  const definition =
    template.evaluator.type === "LLM_AS_JUDGE"
      ? {
          type: template.evaluator.type,
          promptMessages: template.evaluator.promptMessages,
          provider: null,
          model: null,
          modelParams: null,
          vars: template.evaluator.variables.map(({ name }) => name),
          variableMapping: template.evaluator.variables.map(
            ({ name, defaultMapping }) => ({
              templateVariable: name,
              selectedColumnId: defaultMapping.field,
              jsonSelector: null,
            }),
          ),
          outputDefinition: template.evaluator.outputDefinition,
        }
      : {
          type: template.evaluator.type,
          sourceCode: template.evaluator.source,
          sourceCodeLanguage: template.evaluator.language,
        };

  return {
    name: localizedMetadata?.name ?? template.name,
    description: localizedMetadata?.description ?? template.description,
    definition,
  };
}
