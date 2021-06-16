window.onload = function () {
    let equation = document.querySelector(".equation");

    //Collecting the data from the user 
    let batteryPromise = navigator.getBattery();
    batteryPromise.then(batteryCallback);

    let collectDataButton = document.querySelector(".collectDataButton");
    let timer = document.querySelector(".timer");
    let dataOnScreen = document.querySelector(".data");

    function batteryCallback(batteryObject) {
        collectDataButton.addEventListener("click", func)
        function func() {
            collectBatteryData(batteryObject);
        }
    }

    function timerDecrement() {
        min = "2";
        sec = "0";
        decrement = setInterval(() => {
            if (sec == "0") {
                minNumber = Number(min)
                min = String(--minNumber);
                sec = "59";
            } else {
                secNumber = Number(sec);
                sec = String(--secNumber);
            }
            timer.innerText = min + " : " + sec;
        }, 1000);
        setTimeout(() => {
            clearInterval(decrement);
            timer.hidden = true;
        }, 121000);
    }
    let batteryLevel = [];
    let time = math.range(0, 125, 5).toArray();

    function collectBatteryData(batteryObject) {
        if (!batteryObject.charging) {
            alert("Please connect the charger for collecting the Data");
        } else {
            timer.hidden = false;
            timerDecrement();
            batteryLevel.push(batteryObject.level);
            collectData = setInterval(function () {
                batteryLevel.push(batteryObject.level);
                // minutes = new Date().getTime();
                // time.push(minutes);
                console.log(batteryLevel);
                console.log(time);
                dataOnScreen.innerText = batteryLevel + "\n" + time;
            }, 5000)
            setTimeout(function () {
                clearInterval(collectData);
                timer.hidden = true;
            }, 121000)
        }
    }
    //time=slope*100(batteryLevel)+b

    const trainX = batteryLevel;
    // const trainX = [0.55, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.56, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.57, 0.58];
    const trainY = time;
    // console.log(trainY);
    //Prediction logic

    let m = 0;
    let b = 0;

    function linearRegression() {
        // y=mx+b;
        let XX = [];
        for (let i = 0; i < trainX.length; i++) {
            XX[i] = [trainX[i], 1];
        }
        // console.log(XX);
        // Linear regression using OLS(Ordinary Least Squares)
        let theta = math.multiply(math.inv(math.multiply(math.transpose(XX), XX)), math.multiply(math.transpose(XX), trainY))

        m = theta[0];
        b = theta[1];
        console.log(m, b);
        equation.innerText = "Y = " + m + "x + " + b
    }

    function plot() {
        const px = [Math.min.apply(null, trainX), Math.max.apply(null, trainX)];
        const py = px.map(x => (m * x + b));
        console.log(px, py)

        var trace1 = {
            x: trainX,
            y: trainY,
            mode: 'markers',
            type: 'scatter'
        };

        var trace2 = {
            x: px,
            y: py,
            mode: 'lines',
            type: 'scatter'
        }

        var data = [trace1, trace2];
        // console.log(data);
        Plotly.newPlot('myDiv', data);
    }
    plot();

    let predictTime = document.querySelector(".predictTimeButton");
    predictTime.addEventListener("click", train);
    function train() {
        linearRegression();
        predictTime.removeEventListener("click", trainWithEpoch);
    }
}