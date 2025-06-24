// Handle messages from the main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'PROCESS_DATA':
      const result = processData(data);
      self.postMessage({ type: 'PROCESS_DATA_COMPLETE', result });
      break;

    case 'CALCULATE_STATISTICS':
      const stats = calculateStatistics(data);
      self.postMessage({ type: 'STATISTICS_COMPLETE', stats });
      break;

    case 'GENERATE_REPORT':
      const report = generateReport(data);
      self.postMessage({ type: 'REPORT_COMPLETE', report });
      break;

    default:
      console.warn('Unknown message type:', type);
  }
});

// Process large datasets
function processData(data) {
  // Implement your data processing logic here
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: new Date().toISOString()
  }));
}

// Calculate statistics
function calculateStatistics(data) {
  const stats = {
    total: data.length,
    sum: data.reduce((acc, curr) => acc + curr.value, 0),
    average: 0,
    min: Infinity,
    max: -Infinity
  };

  data.forEach(item => {
    stats.min = Math.min(stats.min, item.value);
    stats.max = Math.max(stats.max, item.value);
  });

  stats.average = stats.sum / stats.total;

  return stats;
}

// Generate reports
function generateReport(data) {
  // Implement your report generation logic here
  return {
    summary: {
      totalItems: data.length,
      generatedAt: new Date().toISOString()
    },
    details: data.map(item => ({
      id: item.id,
      value: item.value,
      status: item.status
    }))
  };
} 