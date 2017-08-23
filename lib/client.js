"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getJsonFromUrl = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(strReq) {
        var response;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
                case 0:
                    _context7.next = 2;
                    return fetch(strReq);

                case 2:
                    response = _context7.sent;
                    _context7.next = 5;
                    return response.json();

                case 5:
                    return _context7.abrupt("return", _context7.sent);

                case 6:
                case "end":
                    return _context7.stop();
            }
        }, _callee7, this);
    }));

    return function getJsonFromUrl(_x) {
        return _ref3.apply(this, arguments);
    };
})();

let getCountedOnServerWays = (() => {
    var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var paramsStr, data;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
                case 0:
                    paramsStr = "?from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
                    _context8.next = 3;
                    return getJsonFromUrl(apiPublicTransportServer + "optimalRoute" + paramsStr);

                case 3:
                    data = _context8.sent;


                    AppClient.findedOptimalWays = data;

                    console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes.");
                    return _context8.abrupt("return", data);

                case 7:
                case "end":
                    return _context8.stop();
            }
        }, _callee8, this);
    }));

    return function getCountedOnServerWays(_x2, _x3, _x4, _x5, _x6, _x7) {
        return _ref4.apply(this, arguments);
    };
})();

let getCountedOnClientWays = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, startInitializingMoment, params, res;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) switch (_context9.prev = _context9.next) {
                case 0:
                    console.log("Start local counting...");

                    //await DataProvider.loadDataAndInitialize();

                    startOptimalRoutePoint = strToCoords(fromPositionStr);
                    finalOptimalRoutePoint = strToCoords(toPositionStr);
                    myStartTime = strToSeconds(myStartTimeStr);

                    if (!(startOptimalRoutePoint === undefined || finalOptimalRoutePoint === undefined || myStartTime === undefined)) {
                        _context9.next = 6;
                        break;
                    }

                    return _context9.abrupt("return", null);

                case 6:
                    types = null;

                    if (typesStr !== undefined) types = typesStr.split(',');
                    if (types === undefined || types == null) types = ["bus", "trolleybus"];

                    startInitializingMoment = Date.now();
                    params = {
                        startOptimalRoutePoint: startOptimalRoutePoint,
                        finalOptimalRoutePoint: finalOptimalRoutePoint,
                        startTime: myStartTime,
                        transportTypes: types,
                        goingSpeed: parseFloat(my_speed),
                        dopTimeMinutes: parseFloat(my_dopTimeMinutes)
                    };
                    _context9.prev = 11;
                    _context9.next = 14;
                    return getOptimalRoutesCollectionFromSw(params);

                case 14:
                    AppClient.findedOptimalWays = _context9.sent;

                    if (!(AppClient.findedOptimalWays == null)) {
                        _context9.next = 17;
                        break;
                    }

                    throw new Error();

                case 17:
                    _context9.next = 35;
                    break;

                case 19:
                    _context9.prev = 19;
                    _context9.t0 = _context9["catch"](11);

                    console.log(_context9.t0);
                    _context9.prev = 22;

                    console.log('Start counting without using SW.');
                    _context9.next = 26;
                    return _dataProvider2.default.loadDataAndInitialize();

                case 26:
                    res = new _optimalRoutesCollection2.default(_dataProvider2.default.getAllStations(), params.startOptimalRoutePoint, params.finalOptimalRoutePoint, params.startTime, params.transportTypes, params.goingSpeed, params.dopTimeMinutes);

                    console.log(res);
                    AppClient.findedOptimalWays = res.getOptimalWays();
                    console.log(AppClient.findedOptimalWays);
                    _context9.next = 35;
                    break;

                case 32:
                    _context9.prev = 32;
                    _context9.t1 = _context9["catch"](22);

                    console.log(_context9.t1);

                case 35:

                    if (AppClient.findedOptimalWays != null) console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");

                    return _context9.abrupt("return", AppClient.findedOptimalWays);

                case 37:
                case "end":
                    return _context9.stop();
            }
        }, _callee9, this, [[11, 19], [22, 32]]);
    }));

    return function getCountedOnClientWays(_x8, _x9, _x10, _x11, _x12, _x13) {
        return _ref5.apply(this, arguments);
    };
})();

//, myReject;
let getOptimalRoutesCollectionFromSw = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(params) {
        var promise;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) switch (_context10.prev = _context10.next) {
                case 0:
                    promise = new Promise(function (resolve, reject) {
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

                    _context10.next = 3;
                    return promise;

                case 3:
                    return _context10.abrupt("return", _context10.sent);

                case 4:
                case "end":
                    return _context10.stop();
            }
        }, _callee10, this);
    }));

    return function getOptimalRoutesCollectionFromSw(_x14) {
        return _ref6.apply(this, arguments);
    };
})();

var _runtime = require("serviceworker-webpack-plugin/lib/runtime");

var _runtime2 = _interopRequireDefault(_runtime);

var _optimalRoutesCollection = require("public-transport-find-optimal-ways/lib/optimalRoutesCollection");

var _optimalRoutesCollection2 = _interopRequireDefault(_optimalRoutesCollection);

var _dataProvider = require("./dataProvider");

var _dataProvider2 = _interopRequireDefault(_dataProvider);

var _config = require("./config");

var _config2 = _interopRequireDefault(_config);

var _pointsHistoryStorage = require("./pointsHistoryStorage");

var _pointsHistoryStorage2 = _interopRequireDefault(_pointsHistoryStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("babel-core/register");
require("babel-polyfill");

var apiPublicTransportServer = _config2.default.apiPublicTransportServer;


//console.log('test123');
//console.log(navigator);
if ('serviceWorker' in navigator) {
    console.log('ServiceWorker was finded in navigator.');
    const registration = _runtime2.default.register();

    registration.then((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var controller;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
                case 0:
                    console.log('ServiceWorker registered.');
                    //console.log(registration);
                    //console.log(navigator.serviceWorker);

                    _context.next = 3;
                    return navigator.serviceWorker.ready;

                case 3:
                    _context.next = 5;
                    return navigator.serviceWorker.getRegistration();

                case 5:
                    controller = navigator.serviceWorker.controller;


                    if (controller != null) {
                        controller.postMessage("no-kill-sw");
                        setInterval(function () {
                            controller.postMessage("no-kill-sw");
                        }, _config2.default.clientVsSwNoKillingMessageInterval);
                        navigator.serviceWorker.addEventListener('message', function (event) {
                            if (event.data === 'no-kill-sw-accepted') {
                                //console.log('Client: SW call no-kill-sw-accepted.')
                            } else if (event.data.requestType === 'optimalWayResult') {
                                handleOptimalWayResult(event.data);
                            }
                            //console.log(22222)
                            //console.log(event.data.message);
                            //console.log(event.data);
                        });
                    } else {
                        console.log("navigator.serviceWorker.controller is null.");
                    }

                case 7:
                case "end":
                    return _context.stop();
            }
        }, _callee, this);
    })));
} else {
    console.log('ServiceWorker not finded in navigator.');
}

//import './install-service-worker.js';

if (navigator.onLine === undefined || navigator.onLine === false) {
    _dataProvider2.default.loadDataAndInitialize();
} else {
    _dataProvider2.default.loadDataOnly();
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

    static get totalTimePercentValue() {
        var value = localStorage["totalTimePercentValue"];
        return value == null ? localStorage["totalTimePercentValue"] = 1 : value;
    }
    static set totalTimePercentValue(value) {
        if (value >= 0 && value <= 1) localStorage["totalTimePercentValue"] = value;
    }
    static get totalGoingTimePercentValue() {
        var value = localStorage["totalGoingTimePercentValue"];
        return value == null ? localStorage["totalGoingTimePercentValue"] = 1 : value;
    }
    static set totalGoingTimePercentValue(value) {
        if (value >= 0 && value <= 1) localStorage["totalGoingTimePercentValue"] = value;
    }
    static get totalTransportChangingCountPercentValue() {
        var value = localStorage["totalTransportChangingCountPercentValue"];
        return value == null ? localStorage["totalTransportChangingCountPercentValue"] = 1 : value;
    }
    static set totalTransportChangingCountPercentValue(value) {
        if (value >= 0 && value <= 1) localStorage["totalTransportChangingCountPercentValue"] = value;
    }

    static get goingSpeed() {
        var value = localStorage["goingSpeed"];
        return value == null ? localStorage["goingSpeed"] = 5 : value;
    }
    static set goingSpeed(value) {
        if (value > 0) localStorage["goingSpeed"] = value;
    }
    static get dopTimeMinutes() {
        var value = localStorage["dopTimeMinutes"];
        return value == null ? localStorage["dopTimeMinutes"] = 3 : value;
    }
    static set dopTimeMinutes(value) {
        if (value >= 0) localStorage["dopTimeMinutes"] = value;
    }

    // Find optimal ways between two points. The start time, reserved time, going speed and transport types are known.
    static findWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            var findedOptimalWays, i;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                    case 0:
                        findedOptimalWays = null;
                        _context2.prev = 1;
                        _context2.next = 4;
                        return getCountedOnServerWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);

                    case 4:
                        findedOptimalWays = _context2.sent;
                        _context2.next = 18;
                        break;

                    case 7:
                        _context2.prev = 7;
                        _context2.t0 = _context2["catch"](1);
                        _context2.prev = 9;
                        _context2.next = 12;
                        return getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);

                    case 12:
                        findedOptimalWays = _context2.sent;
                        _context2.next = 18;
                        break;

                    case 15:
                        _context2.prev = 15;
                        _context2.t1 = _context2["catch"](9);

                        console.log(_context2.t1);

                    case 18:
                        _context2.prev = 18;

                        if (findedOptimalWays != null && findedOptimalWays.length !== 0) {
                            AppClient.findedOptimalWays = findedOptimalWays;

                            AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalTimeSeconds);
                            AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalGoingTimeSeconds);
                            AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[0].totalTransportChangingCount);
                            for (i = 1; i < AppClient.findedOptimalWays.length; i++) {
                                if (parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) < AppClient.minimalTimeSeconds) AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds);
                                if (parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) < AppClient.minimalGoingTimeSeconds) AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds);
                                if (parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) < AppClient.minimalTransportChangingCount) AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount);
                            }
                            if (AppClient.minimalTransportChangingCount < 1) AppClient.minimalTransportChangingCount = 1;
                        }
                        return _context2.abrupt("return", findedOptimalWays);

                    case 22:
                    case "end":
                        return _context2.stop();
                }
            }, _callee2, _this, [[1, 7, 18, 22], [9, 15]]);
        }))();
    }

    // Sort the finded ways with the importance of each criterion.
    static customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue) {
        if (AppClient.findedOptimalWays != null) {
            AppClient.totalTimePercentValue = totalTimePercentValue;
            AppClient.totalGoingTimePercentValue = totalGoingTimePercentValue;
            AppClient.totalTransportChangingCountPercentValue = totalTransportChangingCountPercentValue;

            let sortedArr = [];
            let newSortedFindedWays = [];

            let tmpTransportChangingCountEffictivity = 0;
            let max_rank = 0;
            let index = -1;
            for (let j = 0; j < AppClient.findedOptimalWays.length /* && j < 3*/; j++) {
                max_rank = 0; //!!!
                index = -1;
                for (let i = 0; i < AppClient.findedOptimalWays.length; i++) {
                    if (sortedArr.indexOf(i) === -1) {
                        tmpTransportChangingCountEffictivity = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) === 0 ? 1 : AppClient.minimalTransportChangingCount / parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount);
                        var tmp_rank = AppClient.minimalTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) * totalTimePercentValue + AppClient.minimalGoingTimeSeconds / parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) * totalGoingTimePercentValue + tmpTransportChangingCountEffictivity * totalTransportChangingCountPercentValue;
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

            return AppClient.findedOptimalWays;
        } else {
            throw new Error('Can`t customize optimal ways, because it`s not finded yet.');
        }
    }

    static findCurrentDestinationCoords() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var _ref2, getCurrentPosition, position, findedLat, findedLng, coords, lastCnownPositionCoordsDescription, searchingPoint, resultCoords;

            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                    case 0:
                        if (!navigator.geolocation) {
                            _context4.next = 22;
                            break;
                        }

                        getCurrentPosition = (() => {
                            _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                                var promise;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) switch (_context3.prev = _context3.next) {
                                        case 0:
                                            promise = new Promise(function (resolve, reject) {
                                                navigator.geolocation.getCurrentPosition(resolve, reject, {
                                                    timeout: 60000,
                                                    enableHighAccuracy: true,
                                                    maximumAge: Infinity
                                                });
                                            });
                                            _context3.next = 3;
                                            return promise;

                                        case 3:
                                            return _context3.abrupt("return", _context3.sent);

                                        case 4:
                                        case "end":
                                            return _context3.stop();
                                    }
                                }, _callee3, this);
                            }));
                            return function getCurrentPosition() {
                                return _ref2.apply(this, arguments);
                            };
                        })();

                        _context4.next = 4;
                        return getCurrentPosition();

                    case 4:
                        position = _context4.sent;

                        if (!(position === undefined || position == null)) {
                            _context4.next = 7;
                            break;
                        }

                        return _context4.abrupt("return", null);

                    case 7:
                        findedLat = parseFloat(position.coords.latitude.toFixed(4));
                        findedLng = parseFloat(position.coords.longitude.toFixed(4));


                        localStorage["lastCnownPositionCoords"] = findedLat + "," + findedLng;

                        coords = { lat: findedLat, lng: findedLng };
                        _context4.next = 13;
                        return AppClient.getDesinationDescription(coords);

                    case 13:
                        lastCnownPositionCoordsDescription = _context4.sent;

                        if (!(lastCnownPositionCoordsDescription == null)) {
                            _context4.next = 19;
                            break;
                        }

                        _context4.next = 17;
                        return _pointsHistoryStorage2.default.tryFindByCoords(coords);

                    case 17:
                        searchingPoint = _context4.sent;

                        if (searchingPoint != null) {
                            lastCnownPositionCoordsDescription = searchingPoint.description;
                        } else {
                            lastCnownPositionCoordsDescription = "[" + findedLat + ", " + findedLng + "]";
                        }

                    case 19:
                        localStorage["lastCnownPositionCoordsDescription"] = lastCnownPositionCoordsDescription;

                        resultCoords = { lat: findedLat, lng: findedLng };
                        return _context4.abrupt("return", resultCoords);

                    case 22:
                        console.log("navigator.geolocation not supported.");
                        return _context4.abrupt("return", null);

                    case 24:
                    case "end":
                        return _context4.stop();
                }
            }, _callee4, _this2);
        }))();
    }

    static findPointsByOsmGeocodingApi(strReq) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var data, resultPoints, i, n, currentPoint;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;
                        _context5.next = 3;
                        return getJsonFromUrl("https://nominatim.openstreetmap.org/search?q=" + strReq + "&format=json");

                    case 3:
                        data = _context5.sent;

                        if (!(data != null && data.length !== 0)) {
                            _context5.next = 9;
                            break;
                        }

                        resultPoints = [];

                        for (i = 0, n = data.length, currentPoint = data[0]; i < n; currentPoint = data[++i]) {
                            resultPoints.push({
                                coords: { lat: parseFloat(currentPoint.lat), lng: parseFloat(currentPoint.lon) },
                                description: currentPoint.display_name
                            });
                        }
                        _pointsHistoryStorage2.default.tryPush(resultPoints[0]);
                        return _context5.abrupt("return", resultPoints);

                    case 9:
                        return _context5.abrupt("return", null);

                    case 12:
                        _context5.prev = 12;
                        _context5.t0 = _context5["catch"](0);
                        return _context5.abrupt("return", null);

                    case 15:
                    case "end":
                        return _context5.stop();
                }
            }, _callee5, _this3, [[0, 12]]);
        }))();
    }
    static getDesinationDescription(coords) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            var findedPoints;
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.prev = 0;
                        _context6.next = 3;
                        return AppClient.findPointsByOsmGeocodingApi(coords.lat + "," + coords.lng);

                    case 3:
                        findedPoints = _context6.sent;

                        if (!(findedPoints != null)) {
                            _context6.next = 6;
                            break;
                        }

                        return _context6.abrupt("return", findedPoints[0].description);

                    case 6:
                        return _context6.abrupt("return", null);

                    case 9:
                        _context6.prev = 9;
                        _context6.t0 = _context6["catch"](0);
                        return _context6.abrupt("return", null);

                    case 12:
                    case "end":
                        return _context6.stop();
                }
            }, _callee6, _this4, [[0, 9]]);
        }))();
    }

}

AppClient.startOptimalRoutePoint = null;
AppClient.finalOptimalRoutePoint = null;
AppClient.myCurrentFindedPosition = null;
AppClient.findedOptimalWays = null;
AppClient.minimalTimeSeconds = 0;
AppClient.minimalGoingTimeSeconds = 0;
AppClient.minimalTransportChangingCount = 0;
AppClient.fromPosition = null;
AppClient.toPosition = null;
AppClient.myStartTime = 0;
AppClient.types = ["bus", "trolleybus"];
function strToCoords(str) {
    if (str === undefined || str == null) return undefined;
    var tmp = str.split(',');
    var myLat = parseFloat(tmp[0]);
    var myLng = parseFloat(tmp[1]);
    if (myLat >= -90 && myLat <= 90 && myLng >= -180 && myLng <= 180) return { lat: myLat, lng: myLng };else return undefined;
}
function strToSeconds(str) {
    if (str === undefined || str == null) return undefined;
    var tmp = str.split(':');
    var hours = parseInt(tmp[0], 10);
    var minutes = parseInt(tmp[1], 10);
    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) return 3600 * hours + 60 * minutes;else return undefined;
}

var myResolve;
function handleOptimalWayResult(data) {
    myResolve(data.result);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.default = AppClient;