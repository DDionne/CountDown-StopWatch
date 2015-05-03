var targetDate = new Date();
var currentDate = new Date();
var intervalID = "";
var countdownStarted = false;
var stopWatch = {

	stopWatchStarted: false,
	stopWatchIntervalID: "",
	startWatchDate : 0,
	lapDate : 0,
	lapElapsedTime : 0,
	currentElapsed : 0,
	elapsedMilliseconds : 0,
	lapNumber : 0

}

/* parses the input from the user into a date, then starts the countdown */
function setDate() 
{

	var dateTimeString = document.getElementById('datetimeEntry').value;
	var valueArray = dateTimeString.split('-');
	tempDate = new Date(valueArray[0], valueArray[1]-1, valueArray[2], valueArray[3], valueArray[4], valueArray[5], 0);
	if(isNaN(tempDate.getTime()))
	{
		alert("Please enter a valid date");
		return;
	}
	targetDate = tempDate;
	if(!countdownStarted)
	{
		intervalID = setInterval(countdown, 50);
	}
}

function countdown() 
{
	currentDate = new Date();
	var diff = timeDiff(targetDate, currentDate);
	var timeArray = measureTime(diff);
	var result = document.getElementById("timeDisplay").innerHTML = timerOutput(timeArray);
}

/* if the stopwatch is running, stop it and change the button labels
   if the stopwatch is stopped, start it, lap if it was previously running */
function toggleStopWatch()
{
	if(!stopWatch.stopWatchStarted)
	{
		stopWatch.startWatchDate = new Date();
		stopWatch.lapDate = new Date();
		stopWatch.stopWatchStarted = true;
		document.getElementById('lap_clear').value="Lap";
		document.getElementById('stopWatchAction').value="Stop StopWatch";
		stopWatch.stopWatchIntervalID = setInterval(countUp, 50);
		if(stopWatch.elapsedMilliseconds != 0)
		{
			lap();
		}
	}else{
		stopWatch.stopWatchStarted = false;
		stopWatch.elapsedMilliseconds += stopWatch.currentElapsed;
		stopWatch.currentElapsed = 0;
		document.getElementById('lap_clear').value="Clear";
		document.getElementById('stopWatchAction').value = "Start StopWatch";
		clearInterval(stopWatch.stopWatchIntervalID);
	}
}

/* When started: output the lap to the page, then reset the stopWatch 
   When stopped: Clear the current stopWatch and all laps 			 */
function lapClearFunction()
{
	if(stopWatch.stopWatchStarted)
	{
		lap();
	}else{
		stopWatch.lapNumber = 0;
		stopWatch.elapsedMilliseconds = 0;
		stopWatch.lapElapsedTime = 0;
		var temp = timerOutput(measureTime(0));
		document.getElementById("stopWatchDisplay").innerHTML = temp;
		document.getElementById("lapTimeDisplay").innerHTML = temp;
		document.getElementById("laps").innerHTML = "<tr><th>Lab #</th><th>Total Time</th><th>Lap Time</th></tr>";
	}

}

/* output the current lap, then reset the lap counter */
function lap()
{	
	stopWatch.lapNumber++;
	var newLap = document.createElement('tr');
	var totalTime = stopWatch.currentElapsed + stopWatch.elapsedMilliseconds;
	newLap.innerHTML = "<td>" + stopWatch.lapNumber + "</td><td>" + timerOutput(measureTime(totalTime)) + "</td><td>" + timerOutput(measureTime(stopWatch.lapElapsedTime)) + "</td>";
	document.getElementById("laps").appendChild(newLap);
	stopWatch.lapElapsedTime = 0;
	stopWatch.lapDate = new Date();
}

/* tick the stopwatch */
function countUp()
{

	var currentDate = new Date();
	var diff = timeDiff(currentDate, stopWatch.startWatchDate);
	stopWatch.currentElapsed = diff;
	
	var lapDiff = timeDiff(currentDate, stopWatch.lapDate);
	stopWatch.lapElapsedTime = lapDiff;
	var totalMillis = stopWatch.currentElapsed + stopWatch.elapsedMilliseconds;
	document.getElementById('stopWatchDisplay').innerHTML = timerOutput(measureTime(totalMillis));	
	document.getElementById('lapTimeDisplay').innerHTML = timerOutput(measureTime(stopWatch.lapElapsedTime));
}

/* calculates the difference between 2 dates in milliseconds */
function timeDiff(date1, date2) 
{
	var milliSecondsDiff = date1.getTime() - date2.getTime();
	if(milliSecondsDiff < 0)
	{
		return 0;
	}
	return milliSecondsDiff;
}

/* takes an array formatted like [hours, minutes, seconds, milliseconds] 
	and returns it as a string (ex: 00:00:00:000)						*/
function timerOutput(timeArray)
{
	var output = timeArray.join(':');
	return output;
}

/* converts the time in milliseconds, to hours:minutes:seconds:milliseconds */
function measureTime(millis)
{
	var hours = Math.floor(millis/3600000);
	var minutes = Math.floor(millis/60000) - (hours*60);
	var seconds = Math.floor(millis/1000) - (minutes*60) - (hours*3600);
	var milliseconds = millis - (seconds*1000) - (minutes*60000) - (hours*3600000)
	minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = seconds < 10 ? "0" + seconds : seconds;
	if(milliseconds < 10)
	{
		milliseconds = "00" + milliseconds;
	} else if(milliseconds < 100){
		milliseconds = "0" + milliseconds;
	}
	return [hours,minutes,seconds,milliseconds];
}
