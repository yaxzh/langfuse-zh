import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { getMessages } from "@/src/features/i18n/messages";
import { MANAGED_TEMPLATES_CATALOG } from "@/src/features/evals/v2/constants/managedTemplatesCatalog";
import { EvaluatorRecommendedCard } from "@/src/features/evals/v2/components/EvaluatorGalleryView/components/EvaluatorGallerySection/components/EvaluatorRecommendedCard/EvaluatorRecommendedCard";
import { EvaluatorTemplateRow } from "./EvaluatorTemplateRow";

describe("EvaluatorTemplateRow", () => {
  it("localizes managed template metadata without changing project template names", () => {
    const managedTemplate = MANAGED_TEMPLATES_CATALOG.templates.find(
      ({ key }) => key === "user-disagreement",
    );

    expect(managedTemplate).toBeDefined();

    render(
      <NextIntlClientProvider locale="zh-CN" messages={getMessages("zh-CN")}>
        <EvaluatorTemplateRow
          template={{ source: "managed", ...managedTemplate! }}
          onSelect={vi.fn()}
        />
        <EvaluatorRecommendedCard
          template={{ source: "managed", ...managedTemplate! }}
          onSelect={vi.fn()}
        />
        <EvaluatorTemplateRow
          template={{
            source: "custom",
            id: "custom-evaluator",
            name: "Customer disagreement evaluator",
            description: "Customer description",
            type: "LLM_AS_JUDGE",
            updatedAt: new Date("2026-09-06T00:00:00.000Z"),
            version: 1,
          }}
          onSelect={vi.fn()}
        />
      </NextIntlClientProvider>,
    );

    expect(screen.getAllByText("检测用户异议")).toHaveLength(2);
    expect(
      screen.getAllByText("检测用户是否认为助手出错或正在朝错误方向推进。"),
    ).toHaveLength(2);
    expect(screen.getByText("Customer disagreement evaluator")).toBeVisible();
    expect(
      screen.queryByText("Detect User Disagreement"),
    ).not.toBeInTheDocument();
  });
});
