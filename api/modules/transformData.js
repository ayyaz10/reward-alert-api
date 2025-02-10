const transformData = (sheetData) => {
  const headers = sheetData[0]; // Extract headers (first row)
  return sheetData.slice(1).map((row) => {
    let obj = {};
    headers.forEach((key, index) => {
      obj[key.split(" ").join("")] = row[index]; // Assign each column value to its respective key
    });
    return obj;
  });
};

export default transformData;
