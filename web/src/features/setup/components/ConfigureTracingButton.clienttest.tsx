import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import systemUiMessages from "@/src/features/i18n/messages/zh-CN/systemUi.json";
import { ConfigureTracingButton } from "./ConfigureTracingButton";

const renderChinese = (element: React.ReactNode) =>
  render(
    <NextIntlClientProvider
      locale="zh-CN"
      messages={{ systemUi: systemUiMessages }}
    >
      {element}
    </NextIntlClientProvider>,
  );

describe("ConfigureTracingButton", () => {
  it("localizes the link for users with tracing setup access", () => {
    renderChinese(<ConfigureTracingButton hasAccess projectId="project-id" />);

    expect(screen.getByRole("link", { name: "配置追踪" })).toHaveAttribute(
      "href",
      "/project/project-id/traces/setup",
    );
  });

  it("localizes and disables the action when tracing setup access is denied", () => {
    renderChinese(
      <ConfigureTracingButton hasAccess={false} projectId="project-id" />,
    );

    expect(screen.getByRole("button", { name: "配置追踪" })).toBeDisabled();
  });
});
