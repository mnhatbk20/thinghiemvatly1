
var maxLength = 0;


var dataX1 = []
var dataX2 = []
var dataX3 = []

var dataY1 = []
var dataY2 = []
var dataY3 = []

var expectedX = []
var expectedY = []

var delayESP = 1
var stepV = 5
var stepA = 5
var stepPoint = 10
var a = 0
var v0 = 0
var cof = []

var dataRaw = []
var dataTempS=[]

var startTime
var endTime


function round(m, n) {
	return Math.round((m + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n);
}


function CalculateData_S() {
	dataX1 = []
	dataY1 = []
	dataTempS=[]

	dataRaw.forEach(function (item, index) {
		if ((index >= startTime) && (index <= endTime)) {
			dataTempS.push(item - dataRaw[startTime])
		}
	})

	dataTempS.forEach(function (item, index) {
		dataX1.push(index * delayESP)
	})

	var kalmanFilter = new KalmanFilter({ R: 0.5, Q: 3 });
	dataY1 = dataTempS.map(function (v) {
		return kalmanFilter.filter(v);
	});


};

function CalculateData_V() {
	dataY2 = []
	dataX2 = []


	var vTemp = []
	var dataRg = []
	var segment = 50
	var n_segment = Math.floor(dataTempS.length / segment)
	var T = 0
	var v
	for (let i = 0; i < n_segment; i++) {
		for (let t = T; t < (T + segment); t++) {
			dataRg.push([dataX1[t], dataTempS[t]])
		}
		v = regression.polynomial(dataRg, { order: 1, precision: 10 }).equation[0]
		for (let t = 0; t < segment; t++) {
			vTemp.push(v)
		}
		T = T + segment
		dataRg = []
	}

	for (let t = dataTempS.length - segment; t < dataTempS.length; t++) {
		dataRg.push([dataX1[t], dataRaw[t]])
	}
	v = regression.polynomial(dataRg, { order: 1, precision: 10 }).equation[0]
	for (let t = 0; t < dataTempS.length - T; t++) {
		vTemp.push(v)
	}

	var kalmanFilter = new KalmanFilter({ R: 0.002, Q: 3 });
	dataY2 = vTemp.map(function (v) {
		return kalmanFilter.filter(v);
	});

	dataX2 = dataX1

};

function CalculateData_A() {
	dataX3 = []
	dataY3 = []
	
	var aTemp = []
	var dataRg = []
	var segment = 300
	var n_segment = Math.floor(dataTempS.length / segment)
	var T = 0
	var a
	for (let i = 0; i < n_segment; i++) {
		for (let t = T; t < (T + segment); t++) {

			dataRg.push([dataX1[t], dataTempS[t]])

		}
		a = 2 * regression.polynomial(dataRg, { order: 2, precision: 10 }).equation[0]
		for (let t = 0; t < segment; t++) {
			aTemp.push(a * 1000)
		}
		T = T + segment
		dataRg = []
	}

	for (let t = dataTempS.length - segment; t < dataTempS.length; t++) {
		dataRg.push([dataX1[t], dataTempS[t]])
	}
	a = 2 * regression.polynomial(dataRg, { order: 2, precision: 10 }).equation[0]
	for (let t = 0; t < dataTempS.length - T; t++) {
		aTemp.push(a * 1000)
	}

	var kalmanFilter = new KalmanFilter({ R: 0.0001, Q: 3 });
	dataY3 = aTemp.map(function (v) {

		return kalmanFilter.filter(v);
	});

	dataX3 = dataX1

};

function  CalcCof(){
	var dataRg = []
	for (let t = 0; t < dataY1.length; t++) {
		dataRg.push([t * delayESP, dataY1[t]])
	}
	var cofV = regression.polynomial(dataRg, { order: 2, precision: 10 })
	// m,s
	v0 = cofV.equation[1]
	a = cofV.equation[0] * 1000 * 2
}

