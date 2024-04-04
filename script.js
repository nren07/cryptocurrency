document.addEventListener("DOMContentLoaded", function () {
  fetchData();
//   fetchDataFromThen();
});

const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";
const apiUrl =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

//
async function fetchData() {
  try {
    const response = await fetch(corsProxyUrl + apiUrl, {
      headers: {
        "Origin": "http://127.0.0.1:5500",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    
    try{
        const data = await response.json();
        populateTable(data);
    } 
    catch(error){
        console.log("can't fetch data from api");
    }
  } catch (error) {

    console.error("Error fetching data:", error);
  }
}

// function fetchDataFromThen() {
//     fetch(corsProxyUrl + apiUrl, {
//         headers: {
//             "Origin": "http://127.0.0.1:5500",
//             "X-Requested-With": "XMLHttpRequest",
//         },
//     })
//     .then((response) => {
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }
//         return response.json();
//     })
//     .then((data) => {
//         populateTable(data);
//     })
//     .catch((error) => {
//         console.error("Error fetching data:", error);
//     });
// }

function populateTable(data) {
  const tableBody = document.getElementById("cryptoTableBody");
  tableBody.innerHTML = "";
  data.forEach((item) => {
    const row = document.createElement("tr");
    const imageCell = createImageCell(item.image);
    row.appendChild(imageCell);
    const nameCell = createTableCell(item.name);
    nameCell.className = "nameCell";
    const symbolCell = createTableCell(item.symbol);
    const priceCell = createTableCell(formatNumber(item.current_price));
    const volumeCell = createTableCell(formatNumber(item.total_volume));
    const perChangeCell = createTableCell(
      `${item.price_change_percentage_24h} %`
    );
    const marketCapCell = createTableCell(
      `Mkt Cap: ${formatNumber(item.market_cap)}`
    );

    row.appendChild(nameCell);
    row.appendChild(symbolCell);
    row.appendChild(priceCell);
    row.appendChild(volumeCell);
    row.appendChild(perChangeCell);
    row.appendChild(marketCapCell);

    tableBody.appendChild(row);
  });
}
function createImageCell(imageUrl) {
  const cell = document.createElement("td");
  const image = document.createElement("img");
  image.src = imageUrl;
  image.alt = "Crypto Image";
  cell.appendChild(image);
  return cell;
}
function createTableCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

function formatNumber(number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
}

function sortData(sortType) {
  const tableBody = document.getElementById("cryptoTableBody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  rows.sort((a, b) => {
    const aValue = getCellValue(a, sortType);
    const bValue = getCellValue(b, sortType);
    return aValue - bValue;
  });

  tableBody.innerHTML = "";
  rows.forEach((row) => tableBody.appendChild(row));
}

function getCellValue(row, sortType) {
  const cellIndex = sortType === "marketCap" ? 6 : 5;
  const cellValue = row.getElementsByTagName("td")[cellIndex].textContent;
  return parseFloat(cellValue.replace(/[^0-9.-]+/g, ""));
}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value.toLowerCase();
  const tableBody = document.getElementById("cryptoTableBody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  rows.forEach((row) => {
    const name = row.getElementsByTagName("td")[0].textContent.toLowerCase();
    const symbol = row.getElementsByTagName("td")[1].textContent.toLowerCase();
    row.style.display =
      name.includes(searchTerm) || symbol.includes(searchTerm) ? "" : "none";
  });
});
