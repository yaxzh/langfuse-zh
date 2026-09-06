import { useTranslations } from "next-intl";

import type { GalleryTemplate } from "@/src/features/evals/v2/types/templateGallery";

const MANAGED_TEMPLATE_MESSAGE_KEYS_BY_KEY = {
  "user-disagreement": "userDisagreement",
} as const;

export function useManagedTemplateLocalization(
  template: GalleryTemplate | null,
) {
  const t = useTranslations(
    "evaluationAnalytics.evaluations.gallery.managedTemplates",
  );
  const messageKey =
    template?.source === "managed"
      ? MANAGED_TEMPLATE_MESSAGE_KEYS_BY_KEY[
          template.key as keyof typeof MANAGED_TEMPLATE_MESSAGE_KEYS_BY_KEY
        ]
      : undefined;

  return messageKey
    ? {
        name: t(`${messageKey}.name`),
        description: t(`${messageKey}.description`),
      }
    : undefined;
}
