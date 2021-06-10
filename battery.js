window.onload = function () {
    //Collecting the data from the user 

    let batteryPromise = navigator.getBattery();
    batteryPromise.then(batteryCallback);

    let collectDataButton = document.querySelector(".collectDataButton");
    let timer = document.querySelector(".timer");
    let dataOnScreen = document.querySelector(".data");

    function batteryCallback(batteryObject) {
        collectDataButton.addEventListener("click",func)
        function func(){
            collectBatteryData(batteryObject);
        }
    }
    function timerDecrement(){
        min="2";
        sec="0";
        decrement = setInterval(() => {
            if (sec=="0") {
                minNumber=Number(min)
                min=String(--minNumber);
                sec="59";
            } else {
                secNumber=Number(sec);
                sec=String(--secNumber);    
            }
            timer.innerText = min+" : "+sec;
        }, 1000);
        setTimeout(() => {
            clearInterval(decrement);
            timer.hidden=true;
        }, 120000);
    }
    let batteryLevel = [];
    let time = math.range(0,125, 5).toArray();

    function collectBatteryData(batteryObject) {
        if (!batteryObject.charging) {
            alert("Please connect the charger for collecting the Data");
        } else {
            timer.hidden=false;
            timerDecrement();
            collectData = setInterval(function () {
                batteryLevel.push(batteryObject.level);
                // minutes = new Date().getTime();
                // time.push(minutes);
                console.log(batteryLevel);
                console.log(time);
                dataOnScreen.innerText = batteryLevel+"\n"+time;
            }, 5000)
            setTimeout(function(){
                clearInterval(collectData);
                timer.hidden=true;
            },120000)
        }
    }
    //time=slope*100(batteryLevel)+b

    //Prediction logic
    //Using Linear Regression and Stochastic gradient descent from Tensorflow js
    const trainX = [
        3.3,
        4.4,
        5.5,
        6.71,
        6.93,
        4.168,
        9.779,
        6.182,
        7.59,
        2.167,
        7.042,
        10.791,
        5.313,
        7.997,
        5.654,
        9.27,
        3.1
    ];
    const trainY = [
        1.7,
        2.76,
        2.09,
        3.19,
        1.694,
        1.573,
        3.366,
        2.596,
        2.53,
        1.221,
        2.827,
        3.465,
        1.65,
        2.904,
        2.42,
        2.94,
        1.3
    ];

    const m = tf.variable(tf.scalar(Math.random()));
    const b = tf.variable(tf.scalar(Math.random()));

    let equation = document.querySelector(".equation");

    function predict(x) {
        return tf.tidy(function () {
            return m.mul(x).add(b);
        });
    }

    function loss(prediction, labels) {
        //subtracts the two arrays & squares each element of the tensor then finds the mean.
        const error = prediction
            .sub(labels)
            .square()
            .mean();
        return error;
    }

    function train() {
        const learningRate = 0.005;
        const optimizer = tf.train.sgd(learningRate);

        optimizer.minimize(function () {
            const predsYs = predict(tf.tensor1d(trainX));
            console.log(predsYs);
            stepLoss = loss(predsYs, tf.tensor1d(trainY));
            console.log(stepLoss.dataSync()[0]);
            return stepLoss;
        });
        plot();
        equation.innerText = "Y = " + m.dataSync()[0] + "X + " + b.dataSync()[0]
    }
    const predictionsBefore = predict(tf.tensor1d(trainX));
    equation.innerText = "Y = " + m.dataSync()[0] + "X + " + b.dataSync()[0]

    function plot() {
        const px = math.range(0, Math.round(Math.max.apply(null, trainX)) + 2, 0.5).toArray();
        const py = px.map(x => (m.dataSync()[0] * x + b.dataSync()[0]))
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

        Plotly.newPlot('myDiv', data);
    }
    plot();

    let predictTime = document.querySelector(".predictTimeButton");
    predictTime.addEventListener("click", trainWithEpoch);
    function trainWithEpoch(){
        for(let i=0;i<100;i++){
            setTimeout(train,10);
        }
        predictTime.removeEventListener("click", trainWithEpoch);
    }
}