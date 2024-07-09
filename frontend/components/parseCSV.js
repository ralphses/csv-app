import Papa from 'papaparse';

export const parseCSV = (csvData) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data;
        const columns = Object.keys(data[0]);
        const summary = columns.reduce((acc, column) => {
          const values = data.map(row => row[column]);
          const numericValues = values.filter(value => typeof value === 'number');
          const mean = numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length;
          const median = numericValues.sort((a, b) => a - b)[Math.floor(numericValues.length / 2)];
          const mode = numericValues.sort((a, b) =>
            numericValues.filter(v => v === a).length - numericValues.filter(v => v === b).length
          ).pop();
          acc[column] = { mean, median, mode };
          return acc;
        }, {});
        resolve({ data, summary });
      },
      error: (error) => reject(error),
    });
  });
};
