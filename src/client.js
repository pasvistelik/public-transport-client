﻿require("babel-core/register");
require("babel-polyfill");

import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import OptimalRoutesCollection from 'public-transport-find-optimal-ways/lib/optimalRoutesCollection';
import DataProvider from './dataProvider';
import ApiConfig from './config';
var apiPublicTransportServer = ApiConfig.apiPublicTransportServer;
import PointsHistoryStorage from './pointsHistoryStorage';

//console.log('test123');
//console.log(navigator);
if ('serviceWorker' in navigator) {
  console.log('ServiceWorker was finded in navigator.');
  var registration = runtime.register();
  
  registration.then(async function(obj) {
    //console.log(obj);
    console.log('ServiceWorker registered.');
    //console.log(registration);
    //console.log(navigator.serviceWorker);

    await (async function(){
        await navigator.serviceWorker.getRegistration();
        //await navigator.serviceWorker.getRegistrations();
        await navigator.serviceWorker.ready.then(function(obj){
            console.log(obj);
            console.log(navigator.serviceWorker.controller);
        }).then(function(obj){
            console.log(obj);
            console.log("Checking serviceWorker.controller result: " + (navigator.serviceWorker.controller != null));

            var controller = navigator.serviceWorker.controller;
            
            console.log('Try find navigator.serviceWorker.controller...');
            if (controller != null) {
                console.log("navigator.serviceWorker.controller was finded.")
        
                controller.postMessage("no-kill-sw");
                setInterval(function(){
                    controller.postMessage("no-kill-sw");
                }, ApiConfig.clientVsSwNoKillingMessageInterval);
                navigator.serviceWorker.addEventListener('message', function(event) {
                    if(event.data === 'no-kill-sw-accepted') {
                        console.log('Client: SW call no-kill-sw-accepted.')
                        AppClient.canUseSW = true;
                    }
                    else if(event.data.requestType === 'optimalWayResult'){
                        handleOptimalWayResult(event.data);
                    }
                    //console.log(22222)
                    //console.log(event.data.message);
                    //console.log(event.data);
                });
                setTimeout(async function(){
                    if(!AppClient.canUseSW){
                        controller.postMessage("sw-not-answered");
                        console.log('Client: SW not answered.');
                        console.log("AppClient.isNeedCountingOnServer = " + AppClient.isNeedCountingOnServer);
                        if (navigator.onLine === undefined || navigator.onLine === false || !JSON.parse(AppClient.isNeedCountingOnServer)){
                            DataProvider.loadDataAndInitialize();
                        }
                        else {
                            DataProvider.loadDataOnly();
                        }
                    }
                    else {
                        controller.postMessage("can-use-sw-accepted");
                    }
                }, 100);
            }
            else {
                console.log("navigator.serviceWorker.controller is null.")
                console.log("AppClient.isNeedCountingOnServer = " + AppClient.isNeedCountingOnServer);
                if (navigator.onLine === undefined || navigator.onLine === false || !JSON.parse(AppClient.isNeedCountingOnServer)){
                    DataProvider.loadDataAndInitialize();
                }
                else {
                    DataProvider.loadDataOnly();
                }
            }

        });
    })();

    //...
  })
}
else {
    console.log('ServiceWorker not finded in navigator.');
    console.log("AppClient.isNeedCountingOnServer = " + AppClient.isNeedCountingOnServer);
    if (navigator.onLine === undefined || navigator.onLine === false || !JSON.parse(AppClient.isNeedCountingOnServer)){
        DataProvider.loadDataAndInitialize();
    }
    else {
        DataProvider.loadDataOnly();
    }
}




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class AppClient {
    /*static isStartFinalPointsSelected() {
        return AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null;
    }
    static countWayButtonClicked = false;
    static isCountWayButtonClicked() {
        return AppClient.countWayButtonClicked;
    }*/

    static canUseSW = false;


    static get isNeedCountingOnServer(){
        var value = localStorage["isNeedCountingOnServer"];
        return (value == null) ? JSON.parse(localStorage["isNeedCountingOnServer"] = false) : JSON.parse(value);
    }
    static set isNeedCountingOnServer(value){
        if (value === JSON.stringify(true) || value === JSON.stringify(false)) localStorage["isNeedCountingOnServer"] = JSON.stringify(value);
    }

    static startOptimalRoutePoint = null;
    static finalOptimalRoutePoint = null;
    static myCurrentFindedPosition = null;

    static findedOptimalWays = null;

    static get totalTimePercentValue(){
        var value = localStorage["totalTimePercentValue"];
        return (value == null) ? (localStorage["totalTimePercentValue"] = 100) : value;
    }
    static set totalTimePercentValue(value){
        if (value >= 0 && value <= 100) localStorage["totalTimePercentValue"] = value;
    }
    static get totalGoingTimePercentValue(){
        var value = localStorage["totalGoingTimePercentValue"];
        return (value == null) ? (localStorage["totalGoingTimePercentValue"] = 100) : value;
    }
    static set totalGoingTimePercentValue(value){
        if (value >= 0 && value <= 100) localStorage["totalGoingTimePercentValue"] = value;
    }
    static get totalTransportChangingCountPercentValue(){
        var value = localStorage["totalTransportChangingCountPercentValue"];
        return (value == null) ? (localStorage["totalTransportChangingCountPercentValue"] = 100) : value;
    }
    static set totalTransportChangingCountPercentValue(value){
        if (value >= 0 && value <= 100) localStorage["totalTransportChangingCountPercentValue"] = value;
    }
    static get totalWaitingTimePercentValue(){
        var value = localStorage["totalWaitingTimePercentValue"];
        return (value == null) ? (localStorage["totalWaitingTimePercentValue"] = 100) : value;
    }
    static set totalWaitingTimePercentValue(value){
        if (value >= 0 && value <= 100) localStorage["totalWaitingTimePercentValue"] = value;
    }
    static get riskPercentValue(){
        var value = localStorage["riskPercentValue"];
        return (value == null) ? (localStorage["riskPercentValue"] = 100) : value;
    }
    static set riskPercentValue(value){
        if (value >= 0 && value <= 100) localStorage["riskPercentValue"] = value;
    }

    static minimalTimeSeconds = 0;
    static minimalGoingTimeSeconds = 0;
    static minimalTransportChangingCount = 0;
    static minimalWaitingTimeSeconds = 0;
    //static minimalRiskTimeSeconds = 0;

    static fromPosition = null;
    static toPosition = null;
    static myStartTime = 0;
    static types = ["bus", "trolleybus"];

    static get goingSpeed(){
        var value = localStorage["goingSpeed"];
        return (value == null) ? (localStorage["goingSpeed"] = 5) : value;
    }
    static set goingSpeed(value){
        if (value > 0) localStorage["goingSpeed"] = value;
    }
    static get dopTimeMinutes(){
        var value = localStorage["dopTimeMinutes"];
        return (value == null) ? (localStorage["dopTimeMinutes"] = 0.5) : value;
    }
    static set dopTimeMinutes(value){
        //if (value >= 0) 
        localStorage["dopTimeMinutes"] = value;
    }


    // Find optimal ways between two points. The start time, reserved time, going speed and transport types are known.
    static async findWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var findedOptimalWays = null;
        if (JSON.parse(AppClient.isNeedCountingOnServer)) {
            try { // Пробуем получить оптимальные пути с сервера.
                findedOptimalWays = await getCountedOnServerWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);
            } catch (e) { // Иначе выполняем все расчеты на клиенте.
                //console.log(e);
                try {
                    findedOptimalWays = await getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);
                }
                catch(ex){
                    console.log(ex);
                }
            }
        }
        else {
            try {
                findedOptimalWays = await getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);
            }
            catch(ex){
                console.log(ex);
            }
        }
    
        if (findedOptimalWays != null && findedOptimalWays.length !== 0) {
            AppClient.findedOptimalWays = findedOptimalWays;

            AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalTimeSeconds);
            AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalGoingTimeSeconds);
            AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[0].totalTransportChangingCount);
            AppClient.minimalWaitingTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalWaitingTime);
            //AppClient.minimalRiskTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].minimalWaitingTime);
            for (let i = 1; i < AppClient.findedOptimalWays.length; i++) {
                if (parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) < AppClient.minimalTimeSeconds) AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds);
                if (parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) < AppClient.minimalGoingTimeSeconds) AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds);
                if (parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) < AppClient.minimalTransportChangingCount) AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount);
                if (parseFloat(AppClient.findedOptimalWays[i].totalWaitingTime) < AppClient.minimalWaitingTimeSeconds) AppClient.minimalWaitingTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalWaitingTime);
                //if (parseFloat(AppClient.findedOptimalWays[i].minimalWaitingTime) < AppClient.minimalRiskTimeSeconds) AppClient.minimalRiskTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].minimalWaitingTime);
            }
            if (AppClient.minimalTransportChangingCount < 1) AppClient.minimalTransportChangingCount = 1;
        }
        return findedOptimalWays;
    
    }

    // Sort the finded ways with the importance of each criterion.
    static customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue, totalWaitingTimePercentValue, riskPercentValue) {
        if (AppClient.findedOptimalWays != null) {
            AppClient.totalTimePercentValue = totalTimePercentValue;
            AppClient.totalGoingTimePercentValue = totalGoingTimePercentValue;
            AppClient.totalTransportChangingCountPercentValue = totalTransportChangingCountPercentValue;
            AppClient.totalWaitingTimePercentValue = totalWaitingTimePercentValue;
            AppClient.riskPercentValue = riskPercentValue;

            let sortedArr = [];
            let newSortedFindedWays = [];

            let tmpTransportChangingCountEffictivity = 0;
            let max_rank = 0;
            let index = -1;
            for (let j = 0; j < AppClient.findedOptimalWays.length/* && j < 3*/; j++) {
                max_rank = 0;//!!!
                index = -1;
                for (let i = 0; i < AppClient.findedOptimalWays.length; i++) {
                    if (sortedArr.indexOf(i) === -1) {
                        tmpTransportChangingCountEffictivity = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) === 0 ? 1 : (AppClient.minimalTransportChangingCount / parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount));
                        
                        let totalTimeRank = AppClient.minimalTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) * totalTimePercentValue;
                        let totalGoingTimeRank = AppClient.minimalGoingTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) * totalGoingTimePercentValue;
                        let totalTransportChangingCountRank = tmpTransportChangingCountEffictivity * totalTransportChangingCountPercentValue;
                        //let totalWaitingTimeRank = AppClient.minimalWaitingTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalWaitingTime) * totalWaitingTimePercentValue;
                        let totalWaitingTimeRank = (1 - parseFloat(AppClient.findedOptimalWays[i].totalWaitingTime) / parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds)) * totalWaitingTimePercentValue;
                        let totalRiskRank = parseFloat(AppClient.findedOptimalWays[i].riskEffectivity) * riskPercentValue;

                        var tmp_rank = totalTimeRank + totalGoingTimeRank + totalTransportChangingCountRank + totalWaitingTimeRank + totalRiskRank;
                        if (tmp_rank >= max_rank) {
                            max_rank = tmp_rank;
                            index = i;
                        }
                    }
                }
                if (index !== -1) {
                    sortedArr.push(index);
                }
            }
            for (let i = 0, n = sortedArr.length, sortedIndex = sortedArr[0]; i < n; sortedIndex = sortedArr[++i]) {
                newSortedFindedWays.push(AppClient.findedOptimalWays[sortedIndex]);
            }
            AppClient.findedOptimalWays = newSortedFindedWays;

            //console.log("Customized with params: "+AppClient.totalTimePercentValue+", "+AppClient.totalGoingTimePercentValue+", "+AppClient.totalTransportChangingCountPercentValue+", "+AppClient.totalWaitingTimePercentValue+", "+AppClient.riskPercentValue);

            return AppClient.findedOptimalWays;
        }
        else {
            throw new Error('Can`t customize optimal ways, because it`s not finded yet.');
        }
    }

    static async findCurrentDestinationCoords() {
        if (navigator.geolocation) {
            async function getCurrentPosition() {
                var promise = new Promise(function (resolve, reject) {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 60000,
                        enableHighAccuracy: true,
                        maximumAge: Infinity
                    });
                });
                return await promise;
            }

            var position = await getCurrentPosition();
            if (position === undefined || position == null) return null;

            var findedLat = parseFloat(position.coords.latitude.toFixed(4));
            var findedLng = parseFloat(position.coords.longitude.toFixed(4));

            localStorage["lastCnownPositionCoords"] = findedLat + "," + findedLng;

            let coords = {lat: findedLat, lng: findedLng};
            var lastCnownPositionCoordsDescription = await AppClient.getDesinationDescription(coords);
            if (lastCnownPositionCoordsDescription == null) {
                let searchingPoint = await PointsHistoryStorage.tryFindByCoords(coords);
                if (searchingPoint != null) {
                    lastCnownPositionCoordsDescription = searchingPoint.description;
                }
                else {
                    lastCnownPositionCoordsDescription = "[" + findedLat + ", " + findedLng + "]";
                }
            }
            localStorage["lastCnownPositionCoordsDescription"] = lastCnownPositionCoordsDescription;

            var resultCoords = { lat: findedLat, lng: findedLng };

            return resultCoords;
        }
        console.log("navigator.geolocation not supported.");
        return null;
    }

    static async findPointsByOsmGeocodingApi(strReq) {
        try {
            const data = await getJsonFromUrl("https://nominatim.openstreetmap.org/search?q=" + strReq + "&format=json");
            if (data != null && data.length !== 0) {
                let resultPoints = [];
                for (let i = 0, n = data.length, currentPoint = data[0]; i < n; currentPoint = data[++i]) {
                    resultPoints.push({
                        coords: { lat: parseFloat(currentPoint.lat), lng: parseFloat(currentPoint.lon)},
                        description: currentPoint.display_name
                    });
                }
                PointsHistoryStorage.tryPush(resultPoints[0]);
                return resultPoints;
            }
            return null;
        } catch (e) {
            return null;
        }
    }
    static async getDesinationDescription(coords) {
        try {
            const findedPoints = await AppClient.findPointsByOsmGeocodingApi(coords.lat + "," + coords.lng);
            if (findedPoints != null) {
                return findedPoints[0].description;
            }
            return null;
        } catch (e) {
            return null;
        }
    }

}

function strToCoords(str) {
    if (str === undefined || str == null) return undefined;
    var tmp = str.split(',');
    var myLat = parseFloat(tmp[0]);
    var myLng = parseFloat(tmp[1]);
    if (myLat >= -90 && myLat <= 90 && myLng >= -180 && myLng <= 180) return { lat: myLat, lng: myLng };
    else return undefined;
}
function strToSeconds(str) {
    if (str === undefined || str == null) return undefined;
    var tmp = str.split(':');
    var hours = parseInt(tmp[0], 10);
    var minutes = parseInt(tmp[1], 10);
    var seconds = 0;
    if (tmp[2]) seconds = parseInt(tmp[2], 10);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60 && seconds >= 0 && seconds < 60) return 3600 * hours + 60 * minutes + seconds;
    else return undefined;
}

async function getJsonFromUrl(strReq) {
    var response = await fetch(strReq);
    return await response.json();
}

async function getCountedOnServerWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
    var paramsStr = "?from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
        
    var data = await getJsonFromUrl(apiPublicTransportServer + "optimalRoute" + paramsStr);
    
    AppClient.findedOptimalWays = data;
    
    console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes.");
    return data;
}

async function getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
    console.log("Start local counting...");

    //await DataProvider.loadDataAndInitialize();

    var startOptimalRoutePoint = strToCoords(fromPositionStr);
    var finalOptimalRoutePoint = strToCoords(toPositionStr);
    var myStartTime = strToSeconds(myStartTimeStr);

    if (startOptimalRoutePoint === undefined || finalOptimalRoutePoint === undefined || myStartTime === undefined) return null;

    var types = null;
    if (typesStr !== undefined) types = typesStr.split(',');
    if (types === undefined || types == null) types = ["bus", "trolleybus"];

    var startInitializingMoment = Date.now();

    var params = {
        startOptimalRoutePoint: startOptimalRoutePoint,
        finalOptimalRoutePoint: finalOptimalRoutePoint,
        startTime: myStartTime,
        transportTypes: types,
        goingSpeed: parseFloat(my_speed), 
        dopTimeMinutes: parseFloat(my_dopTimeMinutes)
    };
    try {
        if(AppClient.canUseSW !== true || navigator.serviceWorker ==null || navigator.serviceWorker.controller==null) throw new Error();
        console.log('Start counting in SW.');
        AppClient.findedOptimalWays = await getOptimalRoutesCollectionFromSw(params);
        if(AppClient.findedOptimalWays == null) throw new Error();
    } catch (e){
        console.log(e);
        try{
            console.log('Start counting without using SW.');
            await DataProvider.loadDataAndInitialize();
            var res = new OptimalRoutesCollection(
                DataProvider.getAllStations(), 
                params.startOptimalRoutePoint, 
                params.finalOptimalRoutePoint, 
                params.startTime,
                params.transportTypes,
                params.goingSpeed,
                params.dopTimeMinutes
            );
            //console.log(res);
            AppClient.findedOptimalWays = res.getOptimalWays();
            //console.log(AppClient.findedOptimalWays);
        }
        catch (ex){
            console.log(ex);
        }
    }
    
    if(AppClient.findedOptimalWays != null) console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");

    return AppClient.findedOptimalWays;
}

var myResolve;//, myReject;
async function getOptimalRoutesCollectionFromSw(params) { 
    let promise = new Promise(function (resolve, reject) { 
        myResolve = resolve;
        //myReject = reject;
                        
        /*request.onerror = function(event) {
            reject(event.target.error);
        }
        request.onsuccess = function(event) {
            resolve(event.target.result);
        }*/
        navigator.serviceWorker.controller.postMessage({
            requestType: 'optimalWay',
            params: params
        }); 
    });
    
    //console.log(promise);
    return await promise;
}
function handleOptimalWayResult(data){
    myResolve(data.result);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default AppClient;