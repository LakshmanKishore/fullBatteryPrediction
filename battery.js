window.onload = function () {
    let equation = document.querySelector(".equation");
    let timeLeftDisplay = document.querySelector(".timeLeftDisplay");
    let timeLeft = document.querySelector(".timeLeft");
    let collectDataButton = document.querySelector(".collectDataButton");
    let timerDisplay = document.querySelector(".timerDisplay");
    let timer = document.querySelector(".timer");
    let predictTimeButton = document.querySelector(".predictTimeButton");
    let heading = document.querySelector(".heading");
    let instruction = document.querySelector(".instruction");
    let predictInstruction = document.querySelector(".predictInstruction");
    // let dataDisplay = document.querySelector(".data");

    //Collecting the data from the user 

    let batteryPromise = navigator.getBattery();
    batteryPromise.then(batteryCallback);


    function batteryCallback(batteryObject) {
        collectDataButton.addEventListener("click", func)
        function func() {
            collectDataButton.hidden = true;
            instruction.hidden = true;
            heading.innerText = "Collecting the Data . . .";
            collectBatteryData(batteryObject);
            collectDataButton.removeEventListener("click", func);
        }
    }

    //This runs when user clicks on Collect Data button.
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
            timerDisplay.hidden = false;
            timerDecrement();
            batteryLevel.push(batteryObject.level * 100);
            collectData = setInterval(function () {
                batteryLevel.push(batteryObject.level * 100);
                // minutes = new Date().getTime();
                // time.push(minutes);
                // console.log(batteryLevel);
                // console.log(time);
                // dataDisplay.innerText = batteryLevel + "\n" + time;
            }, 5000);
            setTimeout(function () {
                clearInterval(collectData);
                timerDisplay.hidden = true;
                predictInstruction.hidden = false;
                predictTimeButton.hidden = false;
                heading.innerText = "Prediction";
            }, 121000);
        }
    }
    //time=slope*100(batteryLevel)+b

    const trainX = batteryLevel;
    // const trainX = [4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8];
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
        let theta = math.multiply(math.inv(math.multiply(math.transpose(XX), XX)), math.multiply(math.transpose(XX), trainY));

        m = theta[0];
        b = theta[1];
        // console.log(m, b);
        // equation.innerText = "Y = " + m + "x + " + b;
        timeLeftDisplay.hidden = false;
        let timeSeconds = m * 100 + b;
        let hours = 0;
        let minutes = 0;
        hours = Math.floor(timeSeconds / 60 / 60);
        minutes = Math.floor(timeSeconds / 60) - (hours * 60);
        timeLeft.innerHTML = `<b> ${hours} hours ${minutes} minutes </b>`;
    }

    function plot() {
        const px = [Math.min.apply(null, trainX), Math.max.apply(null, trainX)];
        const py = px.map(x => (m * x + b));
        // console.log(px, py)

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
        };

        var data = [trace1, trace2];
        // console.log(data);
        Plotly.newPlot('myDiv', data, {
            xaxis: { zeroline: false, title: 'Battery Percentage' },
            yaxis: { zeroline: false, title: 'Time Intervals' }
        });
    }

    predictTimeButton.addEventListener("click", train);
    function train() {
        heading.innerText = "Prediction Results";
        predictInstruction.hidden = true;
        predictTimeButton.hidden = true;
        //To check if all the data in trainX is same.
        let check = new Set(batteryLevel);
        if (check.size == 1) {
            predictInstruction.hidden = false;
            predictInstruction.innerHTML = "Something went wrong. <br> OR <br> Your device is too slow in charging. <br> My Model cannot predict the time. Sorry :("
            predictTimeButton.removeEventListener("click", train);
            return;
        }
        linearRegression();
        plot();
        predictTimeButton.removeEventListener("click", train);
    }
}