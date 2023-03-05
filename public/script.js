
var state
var isHasData
const aNoise = 4
const MaxMotor = 10500

function ShowEq() {

	$(".eq").show();

	var StrA
	var StrB
	var StrC

	cof[0] = 0.5 * a
	cof[1] = v0
	cof[2] = 0
	StrA = cof[0].toFixed(2) != 0 ? `${(cof[0].toFixed(3).toString())} t^2` : ''
	StrB = cof[1].toFixed(2) != 0 ? ` + ${(cof[1].toFixed(3).toString())} t` : ''
	StrC = cof[2].toFixed(2) != 0 ? ` + ${(cof[2].toFixed(3).toString())}` : ''

	if ((StrA == '') && (StrB == '') && (StrC == '')) {
		$('.eq #eq_s').text("\\(0.0\\)")
	} else {
		$('.eq #eq_s').text(`\\(${StrA + StrB + StrC}\\)`)
	}


	MathJax.typeset()


}

function Delay(ms) {
	var start = Date.now(),
		now = start;
	while (now - start < ms) {
		now = Date.now();
	}
}

function RestorePosition() {
	db.ref().update({ 'motor2/steps': 2300 })
	db.ref().update({ 'motor2/dir': 1 })
	db.ref().update({ 'motor2/run': 1 })

	Delay(100)
	var once = false;
	back()
	function back() {
		firebase.database().ref('motor2/run').on('value', (snapshot) => {
			let data = snapshot.val();
			if (data == 0) {
				if (!once) {
					once = true
					db.ref().update({ 'motor2/steps': 2300 })
					db.ref().update({ 'motor2/dir': 0 })
					db.ref().update({ 'motor2/run': 1 })
				}
			}
		});
	}
}

function InitRangeBar(){
	firebase.database().ref('/motor1/pos').once('value').then((snapshot) => {
		let posCurrent = snapshot.val();
		let tiltCurrent = posCurrent
		$("#range-tilt").asRange('set', tiltCurrent / MaxMotor * 100);
	})
}

function Init() {



	$(".eq").hide();

	$("#start").show()
	$("#reset").hide();
	$("#stop").hide()

	$("#range-tilt").asRange({
		step: 1,
		range: false,
		min: 0,
		max: 100,
		tip: true,

	});



	InitRangeBar()
	$("#range-tilt-ok").click(function () {
		firebase.database().ref('/motor1/pos').once('value').then((snapshot) => {
			var posCurrent = snapshot.val();
			var tiltCurrent = $("#range-tilt").asRange('val') * MaxMotor / 100;
			var posTarget = tiltCurrent;
			var diff = posTarget - posCurrent


			if (diff < 0) {
				db.ref().update({ 'motor1/run': 1 })
				db.ref().update({ 'motor1/steps': Math.abs(diff) })
				db.ref().update({ 'motor1/dir': 0 })

			}
			if (diff > 0) {
				db.ref().update({ 'motor1/run': 1 })
				db.ref().update({ 'motor1/steps': Math.abs(diff) })
				db.ref().update({ 'motor1/dir': 1 })
			}
		})
	})


	firebase.database().ref('/motor1/run').on('value', (snapshot) => {
		let run = snapshot.val();
		if (run == 1) {
			$("#range-tilt-ok").addClass("disabled")
		} else {
			$("#range-tilt-ok").removeClass("disabled")
			InitRangeBar()
		}
	})

	firebase.database().ref('/motor2/run').on('value', (snapshot) => {
		let run = snapshot.val();
		if (run == 1) {
			$("#restore-btn").addClass("disabled")
		} else {
			$("#restore-btn").removeClass("disabled")
		}
	})

	$("#sync-btn").click(function () {
		db.ref().update({ 'motor1/pos': 0 })
		db.ref().update({ 'motor2/pos': 0 })
	})



	$("#restore-btn").click(function () {
		RestorePosition()
	});



	$("#start").click(function () {
		$("#start").hide()
		$("#reset").hide();
		$("#stop").show()

		db.ref().update({ 'state': 1 })
	});


	$("#stop").click(function () {
		$("#start").hide()
		$("#reset").show();
		$("#stop").hide()

		db.ref().update({ 'state': 0 })
		// RestorePosition()

		// getDoneMOCK();

	});

	$("#reset").click(function () {
		isHasData = false
		$(".eq").hide();
		$("#start").show()
		$("#reset").hide();
		$("#stop").hide()

		$('.nav-data').addClass('hide')
		$('.detail-info-item').addClass('hide')
	});

	$("#back").click(function () {
		DashboardFirst()
	})

	var doneEvent = firebase.database().ref('done');
	doneEvent.on('value', (snapshot) => {
		let done = snapshot.val();
		if (done == 1) {
			getDone();
		}
	});

	isHasData = false
	DashboardFirst();
	ActiveNavMeaseType()

}

function DashboardFirst() {
	state = 0
	$(".nav-meas-item").addClass('active')
	$('.monitor').addClass('hide')
	$(".nav-data").addClass("hide")
	$('.detail-info-item').addClass('hide')
}

function ActiveNavMeaseType() {
	$(".nav-meas-item").each(function (index) {
		$(this).click(function (e) {
			e.preventDefault();
			state = index + 1

			$('.monitor').removeClass('hide')

			$(".nav-meas-item").removeClass('active')
			$(".nav-meas-item").eq(index).addClass('active')

			if (isHasData) {
				$(".nav-data").removeClass("hide")
				$('.detail-info-item').addClass('hide')
				$('.detail-info-item').eq(index).removeClass('hide')
				ActiveNavDataType()
				Relayout()
			}

			if (state == 3) {
				$("#nav-data-table").addClass("hide")
			} else {
				$("#nav-data-table").removeClass("hide")
			}

		});
	});

}
function ActiveNavDataType() {
	$(".nav-data-item").each(function (index) {
		$(this).click(function (e) {

			e.preventDefault();
			$(".nav-data-item").removeClass('active')
			$(".nav-data-item").eq(index).addClass('active')

			$('.detail-info-item-child').addClass('hide')
			$(`.${$(this).attr("data-name")}`).removeClass('hide')
			Relayout()

		});
	});
}


Init();

function Relayout() {
	var update1 = {
		'xaxis.range': [0, (dataX1.length - 1) * delayESP],   // updates the xaxis range
	};
	Plotly.relayout('chart1', update1)
	var update2 = {
		'xaxis.range': [0, (dataX2.length - 1) * delayESP],   // updates the xaxis range
	};
	Plotly.relayout('chart2', update2)
	var update3 = {
		'xaxis.range': [0, (dataX3.length - 1) * delayESP],   // updates the xaxis range
	};
	Plotly.relayout('chart3', update3)
}


function drawFull() {


	CalculateData_S();
	CalculateData_V();
	CalculateData_A();

	CalcCof();


	if (chart1.data !== undefined) {
		while (chart1.data.length > 0) {
			Plotly.deleteTraces(chart1, [0]);
		}
	}
	if (chart2.data !== undefined) {
		while (chart2.data.length > 0) {
			Plotly.deleteTraces(chart2, [0]);
		}
	}
	if (chart3.data !== undefined) {
		while (chart3.data.length > 0) {
			Plotly.deleteTraces(chart3, [0]);
		}
	}

	Draw([0, (dataX1.length - 1) * delayESP], [0, 1000], dataX1, dataY1, '', 'Thời gian (ms)', 'Tọa độ (mm)', 'chart1')
	Draw([0, (dataX2.length - 1) * delayESP], [0, 2], dataX2, dataY2, '', 'Thời gian (ms)', 'Vận tốc (m/s)', 'chart2')
	Draw([0, (dataX3.length - 1) * delayESP], [-2, 2], dataX3, dataY3, '', 'Thời gian (ms)', 'Gia tốc (m/s^2', 'chart3')


	var dataTable1 = []
	dataTable1.push(DataRow(function (i) { return (i * delayESP).toString() }, "Thời gian (ms)", stepPoint, dataY1.length))
	dataTable1.push(DataRow(function (i) { return round(dataY1[i], 2) }, "Tọa độ (mm)", stepPoint, dataY1.length))
	createTable(dataTable1, 'table1');

	var dataTable2 = []
	dataTable2.push(DataRow(function (i) { return (i * delayESP).toString() }, "Thời gian (ms)", stepPoint, dataY2.length))
	dataTable2.push(DataRow(function (i) { return round(dataY2[i], 2) }, "Vận tốc (m/s)", stepPoint, dataY2.length))
	createTable(dataTable2, 'table2');

	ShowEq()

	expectedX = []
	expectedY = []
	for (let t = 0; t < dataX1.length; t++) {
		t = t * delayESP
		expectedY.push(cof[0] * t * t / 1000 + cof[1] * t)
		expectedX.push(t)
	}
	Draw([0, (expectedX.length - 1) * delayESP], [0, 1000], expectedX, expectedY, '', 'Thời gian (ms)', 'Tọa độ (mm)', 'chart1')

	Relayout()

}

function getDone() {

	$('.detail-info-item').addClass('hide')
	$('.detail-info-item').eq(state - 1).removeClass('hide')

	$('.detail-info-item-child').addClass('hide')
	$(`.chart-item`).removeClass('hide')

	$(".nav-data-item").removeClass('active')
	$(".nav-data-item").eq(1).addClass('active')

	$(".nav-data").removeClass("hide")

	ActiveNavDataType()


	$("#start").hide()
	$("#reset").show();
	$("#stop").hide()

	firebase.database().ref('/data').once('value').then((snapshot) => {

		let data = snapshot.val();
		isHasData = true

		console.log(data)
		dataRaw = data.split(",")
		console.log(dataRaw)

		maxLength = dataRaw.length

		$('#max-time').text(`${maxLength}`)
		$('.select-time-item input').attr('max', `${maxLength}`)
		$('.select-time-item input[name=endTime]').attr('value', `${maxLength}`)

		startTime = parseInt($('#startTime').val())
		endTime = maxLength
		drawFull()


		$('#submit').click(function (e) {
			e.preventDefault();

			startTime = parseInt($('#startTime').val())
			endTime = parseInt($('#endTime').val())
			drawFull()
		});


	});
}

function getDoneMOCK() {
	$('.detail-info-item').addClass('hide')
	$('.detail-info-item').eq(state - 1).removeClass('hide')

	$('.detail-info-item-child').addClass('hide')
	$(`.chart-item`).removeClass('hide')

	$(".nav-data-item").removeClass('active')
	$(".nav-data-item").eq(1).addClass('active')

	$(".nav-data").removeClass("hide")

	ActiveNavDataType()


	$("#start").hide()
	$("#reset").show();
	$("#stop").hide()

	dataRaw = []

	for (let t = 0; t < 1500; t++) {
		var varSign = [-1, 1]
		var noise = varSign[Math.floor(Math.random() * 2)] * Math.random() * aNoise
		dataRaw.push(t * t * 0.0005 + noise)
	}

	maxLength = dataRaw.length * delayESP

	isHasData = true

	$('#max-time').text(`${maxLength}`)
	$('.select-time-item input').attr('max', `${maxLength}`)
	$('.select-time-item input[name=endTime]').attr('value', `${maxLength}`)

	startTime = parseInt($('#startTime').val())
	endTime = maxLength
	drawFull()


	$('#submit').click(function (e) {
		e.preventDefault();

		startTime = parseInt($('#startTime').val())
		endTime = parseInt($('#endTime').val())
		drawFull()
	});


}

