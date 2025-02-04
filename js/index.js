const colors = ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"]
const borderColors = ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)", "rgba(255, 206, 86, 0.5)", "rgba(75, 192, 192, 0.5)", "rgba(153, 102, 255, 0.5)"]

document.addEventListener('DOMContentLoaded', async ()=> {
    await main()
    console.log("main running")
})

// Getting some data
async function getData()
{
    console.log("getting data..")
    let datas = await fetch('./data.json');
    datas = await datas.json();
    return datas;
}

//Main function
async function main()
{
    let datas = await getData();
    drawChart(datas);
    drawTable(datas);
}

// Draw chart function
function drawChart(datas)
{
    let labels = datas.find(item => item['device'] === 'sensor1')['data'].map(item=>item['timestamp']);
    let datasets = datas.map((item, idx) => {
        let obj = {
            label: item.device_name,
            data: item['data'].map(item=>item['acp']),
            borderColor: borderColors[idx],
            backgroundColor: colors[idx],
        }
        return obj;
    })
    new Chart("myChart", {
        type:"line",
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time"
                    },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Data"
                    }
                }
            }
        }
    })
}

//Draw Table
function drawTable(datas)
{
    let devicesObj = datas.map(item => {
        let obj = {
            "name": item['device_name'],
            "average": average(item['data'].map(data => data['acp'])).toFixed(2)
        }
        return obj;
    })
    new DataTable("#myTable", {
        data: devicesObj,
        columns: [
            {data: 'name', orderable: false, title: 'Sensor name'},
            {data: 'average'}
        ],
        order: [[1, 'desc']]
    })
}


// average function
function average(array)
{
    let total = 0;
    array.forEach(element => {
        total += parseFloat(element)
    });
    return total / array.length
}