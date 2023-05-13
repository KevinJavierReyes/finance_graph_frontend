async function requestExpensesData() {
  const response = await fetch(
    "https://vnxfdcuyu5.execute-api.us-east-1.amazonaws.com/dev/api/expenses",
    {
      method: "GET",
    }
  );
  const data = await response.json();
  return data;
}

const nameMonth = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

async function toExpensesDataForPieGoogle(database, items) {
  let months = items.map((item) => {
    return item.Date ? new Date(item.Date).getMonth() : "";
  });
  months = [...new Set(months)];
  const types = database.properties.Type.select.options.map(
    (option) => option.name
  );

  const pies = {};
  months.map((month) => {
    const pie = [["Category", "Amount"]];
    types.map((type) => {
      const amount = items
        .filter((item) => {
          return (
            item.Date &&
            new Date(item.Date).getMonth() == month &&
            item.Type == type
          );
        })
        .map((item) => item.Amount)
        .reduce((a, b) => a + b, 0);
      pie.push([type, amount]);
    });

    pies[`${month}`] = pie;
  });
  return {
    pies,
  };
}

async function toExpensesDataForAreaGoogle(database, items) {
  let months = items.map((item) => {
    return item.Date ? new Date(item.Date).getMonth() : "";
  });
  months = [...new Set(months)];
  const types = database.properties.Type.select.options.map(
    (option) => option.name
  );

  const area = [["Month", "Income", "Expenses"]];
  months.map((month) => {
    const amount = items
      .filter((item) => {
        return item.Date && new Date(item.Date).getMonth() == month;
      })
      .map((item) => item.Amount)
      .reduce((a, b) => a + b, 0);
    area.push([nameMonth[month], 0, amount]);
  });
  return {
    data: area,
  };
}

async function toExpensesDataForComboGoogle(database, items) {
  let months = items.map((item) => {
    return item.Date ? new Date(item.Date).getMonth() : "";
  });
  months = [...new Set(months)];
  const types = database.properties.Type.select.options.map(
    (option) => option.name
  );

  var data = [["Month", ...types]];
  months.map((month) => {
    const row = [nameMonth[month]];
    types.map((type) => {
      const amount = items
        .filter((item) => {
          return (
            item.Date &&
            new Date(item.Date).getMonth() == month &&
            item.Type == type
          );
        })
        .map((item) => item.Amount)
        .reduce((a, b) => a + b, 0);
      row.push(amount);
    });
    data.push(row);
  });
  return {
    data,
  };
}
