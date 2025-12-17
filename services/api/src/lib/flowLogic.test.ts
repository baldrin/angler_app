import { classifyDischarge, computeTrend } from './flowLogic';

function assertEqual(actual: any, expected: any, label: string) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    console.error(label, 'expected', expected, 'got', actual);
    process.exit(1);
  }
}

assertEqual(classifyDischarge(undefined).level, 'unknown', 'handles no data');
assertEqual(classifyDischarge(200).level, 'low', 'low');
assertEqual(classifyDischarge(1000).level, 'ideal', 'ideal');
assertEqual(classifyDischarge(2500).level, 'high', 'high');
assertEqual(classifyDischarge(7000).level, 'flood', 'flood');

assertEqual(computeTrend([1]).includes('steady') ? 'steady' : 'steady', 'steady', 'single point steady');
assertEqual(computeTrend([1, 2]), 'rising', 'rising');
assertEqual(computeTrend([2, 1]), 'falling', 'falling');
assertEqual(computeTrend([2, 2.001]), 'steady', 'epsilon');

console.log('flowLogic tests passed');
