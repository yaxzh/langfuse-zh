import { LockIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { setupTracingRoute } from "@/src/features/setup/setupRoutes";

type ConfigureTracingButtonProps = {
  hasAccess: boolean;
  projectId: string;
};

export function ConfigureTracingButton({
  hasAccess,
  projectId,
}: ConfigureTracingButtonProps) {
  const t = useTranslations("systemUi.setupTracing");

  if (hasAccess) {
    return (
      <Link href={setupTracingRoute(projectId)}>
        <Button>{t("configure")}</Button>
      </Link>
    );
  }

  return (
    <Button disabled>
      <LockIcon className="mr-2 -ml-0.5 h-4 w-4" aria-hidden="true" />
      {t("configure")}
    </Button>
  );
}
