function Draw(rangeX, rangeY, dataX, dataY, title, titleX, titleY, id) {
    var data

    var trace = {
        x: dataX,
        y: dataY,
        type: 'line',

    }

    var layout = {
        autosize: true,

        xaxis: {
            title: {
                text: titleX,
                font: {
                    size: 18,
                }
            },


            range: rangeX,

        },
        yaxis: {
            title: {
                text: titleY,
                font: {
                    size: 18,
                }
            },
            range: rangeY
        }
    };

    data = [trace]
    Plotly.plot(id, data, layout);
}

