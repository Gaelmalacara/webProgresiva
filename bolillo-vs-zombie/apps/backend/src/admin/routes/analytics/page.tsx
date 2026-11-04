
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ChartBar } from "@medusajs/icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type AnalyticsSummary = {
  from: string;
  to: string;
  total_events: number;
  events_by_name: Record<string, number>;
  page_views_by_path: Record<string, number>;
};

const AnalyticsPage = () => {
  const { t } = useTranslation();
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      const to = new Date();
      const from = new Date(
        to.getTime() - days * 24 * 60 * 60 * 1000
      );

      const params = new URLSearchParams({
        from: from.toISOString(),
        to: to.toISOString(),
      });

      try {
        const response = await fetch(
          `/admin/analytics?${params}`,
          {
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            t("analytics.loadError", {
              status: response.status,
            })
          );
        }

        const data = (await response.json()) as AnalyticsSummary;
        setSummary(data);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : t("analytics.unknownError")
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnalytics();

    return () => controller.abort();
  }, [days, t]);

  const pageViews = summary?.events_by_name.page_view ?? 0;

  const clicks = Object.entries(
    summary?.events_by_name ?? {}
  )
    .filter(([eventName]) => eventName !== "page_view")
    .reduce((total, [, count]) => total + count, 0);

  const popularPages = Object.entries(
    summary?.page_views_by_path ?? {}
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const maxPageViews = Math.max(
    ...popularPages.map(([, count]) => count),
    1
  );

  return (
    <div className="flex flex-col gap-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            {t("analytics.title")}
          </h1>
          <p className="text-ui-fg-subtle">
            {t("analytics.description")}
          </p>
        </div>

        <label className="flex items-center gap-x-2">
          <span>{t("analytics.period")}</span>

          <select
            className="bg-ui-bg-field border-ui-border-base rounded-md border px-3 py-2"
            value={days}
            onChange={(event) =>
              setDays(Number(event.target.value))
            }
          >
            <option value={7}>
              {t("analytics.lastDays", { count: 7 })}
            </option>
            <option value={30}>
              {t("analytics.lastDays", { count: 30 })}
            </option>
            <option value={90}>
              {t("analytics.lastDays", { count: 90 })}
            </option>
          </select>
        </label>
      </div>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-800">
          {error}
        </div>
      )}

      {isLoading ? (
        <p>{t("analytics.loading")}</p>
      ) : error ? null : (
        <>
          {summary && (
            <p className="text-ui-fg-subtle">
              {t("analytics.range", {
                from: new Date(summary.from).toLocaleDateString("es-MX"),
                to: new Date(summary.to).toLocaleDateString("es-MX"),
              })}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MetricCard
              label={t("analytics.totalEvents")}
              value={summary?.total_events ?? 0}
            />

            <MetricCard
              label={t("analytics.pageViews")}
              value={pageViews}
            />

            <MetricCard
              label={t("analytics.clicks")}
              value={clicks}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <section className="bg-ui-bg-base rounded-lg border border-ui-border-base p-6">
              <h2 className="text-lg font-semibold">
                {t("analytics.eventsTitle")}
              </h2>

              <div className="mt-4 flex flex-col gap-y-3">
                {Object.entries(
                  summary?.events_by_name ?? {}
                ).map(([eventName, count]) => (
                  <div
                    className="flex items-center justify-between gap-x-4 border-b border-ui-border-base pb-2 last:border-0"
                    key={eventName}
                  >
                    <span>
                      {t(`analytics.events.${eventName}`, {
                        defaultValue: eventName,
                      })}
                    </span>

                    <span className="font-semibold">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-ui-bg-base rounded-lg border border-ui-border-base p-6">
              <h2 className="text-lg font-semibold">
                {t("analytics.pagesTitle")}
              </h2>

              {popularPages.length > 0 ? (
                <div className="mt-4 flex flex-col gap-y-4">
                  {popularPages.map(([path, count]) => (
                    <div
                      className="flex flex-col gap-y-1"
                      key={path}
                    >
                      <div className="flex justify-between gap-x-4">
                        <span className="truncate" title={path}>
                          {path}
                        </span>

                        <span className="shrink-0 font-semibold">
                          {count}
                        </span>
                      </div>

                      <div className="bg-ui-bg-subtle h-2 overflow-hidden rounded-full">
                        <div
                          className="bg-ui-bg-interactive h-full rounded-full"
                          style={{
                            width: `${(count / maxPageViews) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-ui-fg-subtle mt-4">
                  {t("analytics.noPageViews")}
                </p>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
};

const MetricCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <section className="bg-ui-bg-base rounded-lg border border-ui-border-base p-6">
    <p className="text-ui-fg-subtle">{label}</p>
    <h2 className="mt-2 text-2xl font-semibold">
      {value.toLocaleString()}
    </h2>
  </section>
);

export const config = defineRouteConfig({
  label: "analytics.title",
  translationNs: "translation",
  icon: ChartBar,
  rank: 7,
});

export default AnalyticsPage;
