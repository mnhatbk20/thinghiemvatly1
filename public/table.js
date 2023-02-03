function createTable(tableData, table_id) {

    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');


    for (let i = 0; i < tableData[0].length; i++) {

        var row = document.createElement('tr');

        var irow = 0;

        tableData.forEach(function (rowData) {

            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(rowData[i]));
            row.appendChild(cell);

            irow++;
        });
        tableBody.appendChild(row);
    }

    table.appendChild(tableBody);
    $(`#${table_id}`).html('')
    $(`#${table_id}`).append(table);
}



function DataRow(fn, Title, stepPoint, length) {
    var rowTable = []
    rowTable.push(Title)
    for (let i = 0; i < length; i++) {
        if (i % stepPoint == 0) {
            rowTable.push(fn(i))
        }
    }
    return rowTable
}

