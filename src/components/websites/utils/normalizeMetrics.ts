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
    if (!metric || metric.value === null || metric.value === undefined) return null;
    
    // Some string values might be "N/A" or "null" in the db
    const numValue = Number(metric.value);
    return isNaN(numValue) ? null : numValue;
  };

  return {
    da: getMetric('DA'),
    dr: getMetric('DR'),
    authorityScore: getMetric('SEMRUSH_AUTHORITY') ?? getMetric('SEMRUSH_SCORE') ?? getMetric('AUTHORITY_SCORE'),
    spamScore: getMetric('SPAM_SCORE'),
    organicTraffic: getMetric('ORGANIC_TRAFFIC') ?? getMetric('SEMRUSH_TRAFFIC') ?? getMetric('AHREFS_TRAFFIC') ?? getMetric('TRAFFIC'),
    backlinks: getMetric('BACKLINKS') ?? getMetric('TOTAL_BACKLINKS')
  };
}
