import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";

import { getMessages } from "@/src/features/i18n/messages";
import { useEvalTemplate } from "./useEvalTemplate";

vi.mock("@/src/utils/api", () => ({
  api: {
    evalsV2: {
      get: {
        useQuery: () => ({ data: undefined, isPending: false }),
      },
    },
  },
}));

describe("useEvalTemplate", () => {
  it("prefills localized metadata for the user disagreement template", () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale="zh-CN" messages={getMessages("zh-CN")}>
        {children}
      </NextIntlClientProvider>
    );

    const { result } = renderHook(
      () =>
        useEvalTemplate({
          projectId: "project-id",
          templateKey: "user-disagreement",
          evaluatorId: null,
          enabled: true,
        }),
      { wrapper },
    );

    expect(result.current.draft).toMatchObject({
      name: "检测用户异议",
      description: "检测用户是否认为助手出错或正在朝错误方向推进。",
      definition: {
        type: "LLM_AS_JUDGE",
        vars: ["conversation_history", "last_user_message"],
      },
    });
  });
});
