import { useEffect, useState } from "react";

export function useLoadStats(fetchStatsFn, title) {
  const [stat, setStat] = useState({
    title,
    value: "—",
    change: "—",
    trend: "flat",
    progressWidth: "0%",
  });

  useEffect(() => {
    async function load() {
      try {
        const stats = await fetchStatsFn();

        const { total, this_month, last_month } = stats;

        let percentChange = 0;
        let trend = "flat";

        if (last_month === 0) {
          if (this_month > 0) {
            percentChange = 100;
            trend = "up";
          }
        } else {
          percentChange = ((this_month - last_month) / last_month) * 100;
          trend =
            percentChange > 0 ? "up" : percentChange < 0 ? "down" : "flat";
        }

        const progressWidth =
          Math.min(Math.abs(percentChange), 100).toFixed(0) + "%";

        setStat({
          title,
          value: total.toLocaleString(),
          change: `${Math.round(percentChange)}%`,
          trend,
          progressWidth,
        });
      } catch (error) {
        console.error(`Error loading ${title} stats:`, error);
      }
    }

    load();
  }, [fetchStatsFn, title]);

  return stat;
}
