export type Classification = {
  label: string;
  level: 'low' | 'ideal' | 'high' | 'flood' | 'unknown';
  kayakAdvice?: string;
};

export function classifyDischarge(discharge?: number): Classification {
  if (discharge === undefined || discharge === null || Number.isNaN(discharge)) {
    return { label: 'No Data', level: 'unknown' };
  }
  if (discharge < 500) return { label: 'Low & Clear', level: 'low', kayakAdvice: 'Skinny water, stealth.' };
  if (discharge < 2000) return { label: 'Ideal', level: 'ideal', kayakAdvice: 'Great conditions.' };
  if (discharge < 5000) return { label: 'High but Fishable', level: 'high', kayakAdvice: 'Watch footing, heavier rigs.' };
  return { label: 'Blown Out', level: 'flood', kayakAdvice: 'Unsafe flows.' };
}

export function computeTrend(values: number[]): 'rising' | 'falling' | 'steady' {
  if (values.length < 2) return 'steady';
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  const epsilon = Math.max(Math.abs(last), Math.abs(prev)) * 0.001 + 0.01;
  if (last > prev + epsilon) return 'rising';
  if (last < prev - epsilon) return 'falling';
  return 'steady';
}
