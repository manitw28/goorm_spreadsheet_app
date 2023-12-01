const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",];

const exportBtn = document.querySelector("#export-btn");

class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        this.isHeader = isHeader
        this.disabled = disabled
        this.data = data
        this.row = row
        this.rowName = rowName
        this.column = column
        this.columnName = columnName
        this.active = active
    };
};


// when a file will be exported, given by time.
let today = new Date();

let year = today.getFullYear();
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let day = ('0' + today.getDate()).slice(-2);
let hours = ('0' + today.getHours()).slice(-2);
let minutes = ('0' + today.getMinutes()).slice(-2);
let seconds = ('0' + today.getSeconds()).slice(-2);

let timeString = year+month+day+hours+minutes+seconds;
// it will be used in exportBtn.onclick - a.download



exportBtn.onclick = function (e) {
    let csv = "";
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i===0) continue;
        csv += spreadsheet[i].filter((item) => !item.isHeader).map((item) => item.data).join(",") + "\r\n";
    }

    const csvObj = new Blob([csv]);
    const csvUrl = URL.createObjectURL(csvObj);
    console.log("csv", csvUrl);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = "Spreadsheet File Name"+timeString+".csv";
    a.click();
}

// *** function 호출 순서
// initSpreadsheet - drawSheet - createCellEl - handleCellClick - clearHeaderActiveStates & getElFromRowCol
// initSpreadsheet - drawSheet - createCellEl - handleOnChange


initSpreadsheet();


// spreadsheet initializing
function initSpreadsheet() {
    // for (let i = 0; i < ROWS ; i++) { 
    for (let i = 0; i < COLS ; i++) { // i < COLS ???
        let spreadsheetRow = [];

        for (let j = 0; j < COLS; j++) {
            // spreadsheetRow.push(i + "-" + j)
            // const cellData = i + "-" + j;
            let cellData = "";
            let isHeader = false;
            let disabled = false;

            // 모든 row 첫 번째 컬럼에 숫자 넣기
            if (j === 0) {
                cellData = i;
                isHeader = true;
                disabled = true;
            }

            // 첫 번째 Row의 컬럼들에 숫자 넣기
            // if (i === 0) {
            //     cellData = j;
            // }

            // 첫 번째 Row의 숫자들을 알파벳으로
            if (i === 0) {
                isHeader = true;
                disabled = true;
                cellData = alphabets[j-1];
            }

            // 첫 번째 row의 컬럼은 "";
            // if (cellData <= 0) {
            //     cellData = "";
            // }

            // cellData가 undefined면 "";
            if (!cellData) {
                cellData = "";
            }

            const rowName = i;
            const columnName = alphabets[j - 1];

            // const cell = new Cell(false, false, "", i, j, i, j, false)
            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false); //  강사님 draw.io 파일에는 i, j가 한 개 생략되었다.
            // const cell = new Cell(false, false, cellData, i, j, i, j, false)
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }

    drawSheet();
    console.log("spreadsheet", spreadsheet)
};


// creating cell elements
function createCellEl(cell) {
    const cellEl = document.createElement("input");
    cellEl.className = "cell";
    cellEl.id = "cell_" + cell.row + cell.column;
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled;

    if (cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell);

    cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

    return cellEl;
};


// handling on changes
function handleOnChange (data, cell) {
    cell.data = data;
}


// handling clicks on cell
function handleCellClick(cell) {
    clearHeaderActiveStates();
    const columnHeader = spreadsheet[0][cell.column];
    const rowHeader = spreadsheet[cell.row][0];

    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

    columnHeaderEl.classList.add("active");
    rowHeaderEl.classList.add("active");

    document.querySelector("#cell-status").innerHTML = cell.columnName + "" + cell.rowName;

    // console.log('clicked cell', cell);
    // console.log('columnHeader', columnHeader);
    // console.log('rowHeader', rowHeader);
};


// drawing sheet
function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";
        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
};


// getting elements from rows and columns
function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
};


// clearing states "active" of header
function clearHeaderActiveStates() {
    const headers = document.querySelectorAll(".header");

    headers.forEach((header) => {
        header.classList.remove("active");
    });
}