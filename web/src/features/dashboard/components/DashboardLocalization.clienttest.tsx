import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import chineseMessages from "@/src/features/i18n/messages/zh-CN/playgroundDashboard.json";
import systemUiMessages from "@/src/features/i18n/messages/zh-CN/systemUi.json";
import evaluationAnalyticsMessages from "@/src/features/i18n/messages/zh-CN/evaluationAnalytics.json";
import { DashboardTable } from "./DashboardTable";
import { EditDialogDashboardContent } from "./EditDialogDashboardContent";
import { HomeDashboardSelect } from "./HomeDashboardSelect";
import { DashboardWidget } from "@/src/features/widgets/components/DashboardWidget";

vi.mock("@/src/utils/api", () => ({
  api: {
    useUtils: () => ({ dashboard: { invalidate: vi.fn() } }),
    dashboard: {
      updateDashboardMetadata: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
      cloneDashboard: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
      allDashboards: {
        useQuery: () => ({
          data: {
            dashboards: [
              {
                id: "langfuse-home-dashboard",
                name: "Langfuse Home",
                description: "Home dashboard description",
                owner: "LANGFUSE",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
              {
                id: "managed-cost-dashboard-from-installation",
                name: "Langfuse Cost Dashboard",
                description: "Cost dashboard description",
                owner: "LANGFUSE",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
              {
                id: "managed-latency-dashboard-from-installation",
                name: "Langfuse Latency Dashboard",
                description: "Latency dashboard description",
                owner: "LANGFUSE",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
              {
                id: "managed-usage-dashboard-from-installation",
                name: "Langfuse Usage Management",
                description: "Usage dashboard description",
                owner: "LANGFUSE",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
              {
                id: "cmtdm68000006ad07dzdb73zw",
                name: "Langfuse Agent Dashboard",
                description:
                  "Monitor agent tool usage: total tool calls, most-called tools, tool errors and latency, and observation type breakdowns.",
                owner: "LANGFUSE",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
              {
                id: "project-view",
                name: "Customer dashboard",
                description: "Customer dashboard description",
                owner: "PROJECT",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
              {
                id: "langfuse-view",
                name: "Langfuse dashboard",
                description: "Langfuse dashboard description",
                owner: "LANGFUSE",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
                updatedAt: new Date("2026-01-01T00:00:00.000Z"),
              },
            ],
          },
          isPending: false,
          isError: false,
          isSuccess: true,
        }),
      },
    },
    dashboardWidgets: {
      get: {
        useQuery: ({ widgetId }: { widgetId: string }) => {
          const managedWidgetMetadata: Record<
            string,
            { name: string; description: string }
          > = {
            cmtdm68000001ad076tqc9kr4: {
              name: "Total Tool Calls",
              description:
                "Total number of tool calls across observations, including parallel tool calls within a single observation",
            },
            cmtdm68000002ad076rurfiln: {
              name: "Total Tool Calls (over time)",
              description:
                "Tool call volume over time, including parallel tool calls within a single observation",
            },
            cmtdm68000003ad07afj8ag4o: {
              name: "Top 20 Called Tools",
              description:
                "Invocations per tool, including repeated calls within one observation, limited to the top 20",
            },
            cmtdm68000007ad07terrbytl: {
              name: "Tool Errors by Tool",
              description:
                "Failed tool executions (ERROR level) per tool, limited to the top 20",
            },
            cmtdm68000008ad07p95bytl0: {
              name: "P 95 Tool Latency by Tool",
              description:
                "P95 execution latency of TOOL observations per tool, limited to the top 20",
            },
            cmtdm68000009ad07p95ts0tl: {
              name: "P 95 Tool Latency by Tool (over time)",
              description:
                "P95 execution latency of TOOL observations over time, one series per tool",
            },
            cmtdm68000004ad07qwlf51rv: {
              name: "Observations by Type",
              description:
                "Distribution of observations by type, e.g. agents, tools, generations, and spans",
            },
            cmtdm68000005ad07q12mamip: {
              name: "P 95 Latency by Observation Type",
              description: "P95 latency segmented by observation type",
            },
          };
          const metadata = managedWidgetMetadata[widgetId] ?? {
            name: "Total costs",
            description: "Total cost across all use cases",
          };

          return {
            data: {
              id: widgetId,
              ...metadata,
              owner: "LANGFUSE",
              view: "observations",
              dimensions: [],
              metrics: [{ measure: "totalCost", agg: "sum" }],
              filters: [],
              chartType: "NUMBER",
              chartConfig: { type: "NUMBER" },
              minVersion: 1,
            },
            isPending: false,
          };
        },
      },
      copyToProject: {
        useMutation: () => ({ mutate: vi.fn(), isPending: false }),
      },
    },
  },
}));

vi.mock("@/src/features/rbac/utils/checkProjectAccess", () => ({
  useHasProjectAccess: () => true,
}));

vi.mock("@/src/hooks/useProjectIdFromURL", () => ({
  default: () => "project-id",
}));

vi.mock("@/src/features/orderBy/hooks/useOrderByState", () => ({
  useOrderByState: () => [null, vi.fn()],
}));

vi.mock("use-query-params", () => ({
  NumberParam: {},
  withDefault: () => ({}),
  useQueryParams: () => [{ pageIndex: 0, pageSize: 50 }, vi.fn()],
}));

vi.mock("@/src/features/navigate-detail-pages/context", () => ({
  useDetailPageLists: () => ({ setDetailPageList: vi.fn() }),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn(), query: {} }),
}));

vi.mock("@/src/features/posthog-analytics/usePostHogClientCapture", () => ({
  usePostHogClientCapture: () => vi.fn(),
}));

vi.mock("@/src/features/events/hooks/useV4Beta", () => ({
  useV4Beta: () => ({ isBetaEnabled: false }),
}));

vi.mock("@/src/features/dashboard/hooks/useDashboardQueryScheduler", () => ({
  useScheduledDashboardExecuteQuery: () => ({
    data: [{ sum_totalCost: 12 }],
    isPending: false,
    isError: false,
    error: null,
    progress: null,
  }),
}));

vi.mock("@/src/features/widgets/hooks/useWidgetQueryErrorCapture", () => ({
  useCaptureWidgetHighCardinalityError: vi.fn(),
}));

vi.mock("@/src/features/widgets/chart-library/Chart", () => ({
  Chart: ({ data }: { data: Array<{ dimension?: string }> }) => (
    <div data-testid="chart">
      {data.map((item, index) => (
        <span key={index}>{item.dimension}</span>
      ))}
    </div>
  ),
}));

vi.mock("@/src/components/table/data-table", () => ({
  DataTable: ({
    data,
  }: {
    data: {
      data?: Array<{ id: string; name: string; description: string }>;
    };
  }) => (
    <div>
      {data.data?.map((dashboard) => (
        <div key={dashboard.id}>
          <span>{dashboard.name}</span>
          <span>{dashboard.description}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("@/src/components/ui/dialog", () => ({
  DialogController: ({
    children,
  }: {
    children: (control: { openDialog: () => void }) => React.ReactNode;
  }) => <>{children({ openDialog: vi.fn() })}</>,
  Dialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}));

vi.mock("@/src/components/ui/combobox", () => ({
  Combobox: ({
    options,
    searchPlaceholder,
    emptyText,
  }: {
    options: Array<{
      heading: string;
      options: Array<{ label: string; badge?: string }>;
    }>;
    searchPlaceholder: string;
    emptyText: string;
  }) => (
    <div>
      <input placeholder={searchPlaceholder} />
      <span>{emptyText}</span>
      {options.map((group) => (
        <section key={group.heading}>
          <h3>{group.heading}</h3>
          {group.options.map((option) => (
            <div key={option.label}>
              {option.label}
              {option.badge ? <span>{option.badge}</span> : null}
            </div>
          ))}
        </section>
      ))}
    </div>
  ),
}));

const renderChinese = (element: React.ReactNode) =>
  render(
    <NextIntlClientProvider
      locale="zh-CN"
      messages={{
        playgroundDashboard: chineseMessages,
        systemUi: systemUiMessages,
        evaluationAnalytics: evaluationAnalyticsMessages,
      }}
    >
      {element}
    </NextIntlClientProvider>,
  );

describe("dashboard localization", () => {
  it("localizes the edit dashboard dialog", () => {
    renderChinese(
      <EditDialogDashboardContent
        closeDialog={vi.fn()}
        projectId="project-id"
        dashboardId="dashboard-id"
        initialName="Customer dashboard"
        initialDescription="Customer description"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "编辑仪表盘" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("名称")).toHaveValue("Customer dashboard");
    expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "保存更改" }),
    ).toBeInTheDocument();
  });

  it("localizes managed dashboard options and preserves project names", () => {
    renderChinese(
      <HomeDashboardSelect
        projectId="project-id"
        value="project-view"
        defaultDashboardId="project-view"
        onValueChange={vi.fn()}
        currentDashboardName="Customer dashboard"
        currentDashboardOwner="PROJECT"
      />,
    );

    expect(screen.getByText("此项目")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 维护")).toBeInTheDocument();
    expect(screen.getByText("Customer dashboard")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 首页")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 成本仪表盘")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 延迟仪表盘")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 用量管理")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 智能体仪表盘")).toBeInTheDocument();
    expect(screen.getByText("默认")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("搜索仪表盘...")).toBeInTheDocument();
  });

  it("localizes every Langfuse-managed dashboard in the dashboard table", () => {
    renderChinese(<DashboardTable />);

    expect(screen.getByText("Langfuse 首页")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 成本仪表盘")).toBeInTheDocument();
    expect(screen.getByText("查看你的 LLM 成本。")).toBeInTheDocument();
    expect(screen.getByText("Langfuse 延迟仪表盘")).toBeInTheDocument();
    expect(
      screen.getByText("监控链路和生成的延迟指标，以优化性能。"),
    ).toBeInTheDocument();
    expect(screen.getByText("Langfuse 用量管理")).toBeInTheDocument();
    expect(
      screen.getByText("跟踪链路、观测和评分的用量指标，以管理资源分配。"),
    ).toBeInTheDocument();
    expect(screen.getByText("Langfuse 智能体仪表盘")).toBeInTheDocument();
    expect(
      screen.getByText(
        "监控智能体工具使用情况：工具调用总数、调用最多的工具、工具错误与延迟，以及观测类型分布。",
      ),
    ).toBeInTheDocument();
  });

  it("localizes Langfuse-managed widget metadata", () => {
    renderChinese(
      <DashboardWidget
        projectId="project-id"
        dashboardId="dashboard-id"
        placement={{
          id: "placement-id",
          widgetId: "managed-cost-widget-from-installation",
          x: 0,
          y: 0,
          x_size: 4,
          y_size: 4,
          type: "widget",
        }}
        dateRange={undefined}
        filterState={[]}
        onDeleteWidget={vi.fn()}
        dashboardOwner="LANGFUSE"
        readPath="v3"
        readOnly
      />,
    );

    expect(screen.getByText("总成本")).toBeInTheDocument();
    expect(screen.getByText("所有用例的总成本")).toBeInTheDocument();
    expect(screen.getByText("总和成本")).toBeInTheDocument();
  });

  it("localizes every widget in the Langfuse agent dashboard", () => {
    const widgets = [
      {
        id: "cmtdm68000001ad076tqc9kr4",
        name: "工具调用总次数",
        description: "所有观测中的工具调用总次数，包括单次观测内的并行工具调用",
      },
      {
        id: "cmtdm68000002ad076rurfiln",
        name: "工具调用次数趋势",
        description: "工具调用次数随时间的变化，包括单次观测内的并行工具调用",
      },
      {
        id: "cmtdm68000003ad07afj8ag4o",
        name: "调用次数最多的 20 个工具",
        description:
          "每个工具的调用次数，包括单次观测内的重复调用，仅显示前 20 个",
      },
      {
        id: "cmtdm68000007ad07terrbytl",
        name: "各工具的错误次数",
        description: "每个工具的失败执行次数（ERROR 级别），仅显示前 20 个",
      },
      {
        id: "cmtdm68000008ad07p95bytl0",
        name: "按工具划分的 P95 延迟",
        description: "每个工具的 TOOL 观测 P95 执行延迟，仅显示前 20 个",
      },
      {
        id: "cmtdm68000009ad07p95ts0tl",
        name: "按工具划分的 P95 延迟趋势",
        description: "TOOL 观测的 P95 执行延迟随时间的变化，每个工具一条序列",
      },
      {
        id: "cmtdm68000004ad07qwlf51rv",
        name: "按类型划分的观测数量",
        description: "按类型展示观测分布，例如智能体、工具、生成和跨度",
      },
      {
        id: "cmtdm68000005ad07q12mamip",
        name: "按观测类型划分的 P95 延迟",
        description: "按观测类型划分的 P95 延迟",
      },
    ];

    renderChinese(
      <>
        {widgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            projectId="project-id"
            dashboardId="dashboard-id"
            placement={{
              id: `placement-${widget.id}`,
              widgetId: widget.id,
              x: 0,
              y: 0,
              x_size: 4,
              y_size: 4,
              type: "widget",
            }}
            dateRange={undefined}
            filterState={[]}
            onDeleteWidget={vi.fn()}
            dashboardOwner="LANGFUSE"
            readPath="v3"
            readOnly
          />
        ))}
      </>,
    );

    for (const widget of widgets) {
      expect(screen.getAllByText(widget.name).length).toBeGreaterThan(0);
      expect(screen.getAllByText(widget.description).length).toBeGreaterThan(0);
    }
  });
});
