export function normalizePublisherMetrics(metrics: any[] | null | undefined) {
  if (!metrics || !Array.isArray(metrics)) {
    return {
      da: null,
      dr: null,
      authorityScore: null,
      spamScore: null,
      organicTraffic: null,
      backlinks: null
    };
  }

  const getMetric = (type: string) => {
    const metric = metrics.find(m => m.metric_type === type);
    return metric && metric.value !== null && metric.value !== undefined ? Number(metric.value) : null;
  };

  return {
    da: getMetric('DA'),
    dr: getMetric('DR'),
    authorityScore: getMetric('SEMRUSH_AUTHORITY'),
    spamScore: getMetric('SPAM_SCORE'),
    organicTraffic: getMetric('ORGANIC_TRAFFIC') ?? getMetric('SEMRUSH_TRAFFIC') ?? getMetric('TRAFFIC'),
    backlinks: getMetric('BACKLINKS') ?? getMetric('TOTAL_BACKLINKS')
  };
}
