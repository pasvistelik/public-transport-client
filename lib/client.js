'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var getJsonFromUrl = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(strReq) {
        var response;
        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        _context6.next = 2;
                        return fetch(strReq);

                    case 2:
                        response = _context6.sent;
                        _context6.next = 5;
                        return response.json();

                    case 5:
                        return _context6.abrupt('return', _context6.sent);

                    case 6:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, this);
    }));

    return function getJsonFromUrl(_x9) {
        return _ref6.apply(this, arguments);
    };
}();

var getCountedOnServerWays = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var paramsStr, data;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        paramsStr = "?from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
                        _context7.next = 3;
                        return getJsonFromUrl(apiPublicTransportServer + "optimalRoute" + paramsStr);

                    case 3:
                        data = _context7.sent;


                        AppClient.findedOptimalWays = data;

                        console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes.");
                        return _context7.abrupt('return', data);

                    case 7:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function getCountedOnServerWays(_x10, _x11, _x12, _x13, _x14, _x15) {
        return _ref7.apply(this, arguments);
    };
}();

var getCountedOnClientWays = function () {
    var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, startInitializingMoment, params, res;
        return _regenerator2.default.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        console.log("Start local counting...");

                        //await DataProvider.loadDataAndInitialize();

                        startOptimalRoutePoint = strToCoords(fromPositionStr);
                        finalOptimalRoutePoint = strToCoords(toPositionStr);
                        myStartTime = strToSeconds(myStartTimeStr);

                        if (!(startOptimalRoutePoint === undefined || finalOptimalRoutePoint === undefined || myStartTime === undefined)) {
                            _context8.next = 6;
                            break;
                        }

                        return _context8.abrupt('return', null);

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
                        _context8.prev = 11;
                        _context8.next = 14;
                        return getOptimalRoutesCollectionFromSw(params);

                    case 14:
                        AppClient.findedOptimalWays = _context8.sent;

                        if (!(AppClient.findedOptimalWays == null)) {
                            _context8.next = 17;
                            break;
                        }

                        throw new Error();

                    case 17:
                        _context8.next = 28;
                        break;

                    case 19:
                        _context8.prev = 19;
                        _context8.t0 = _context8['catch'](11);

                        console.log('Start counting without using SW.');
                        _context8.next = 24;
                        return _dataProvider2.default.loadDataAndInitialize();

                    case 24:
                        res = new _optimalRoutesCollection2.default(_dataProvider2.default.getAllStations(), params.startOptimalRoutePoint, params.finalOptimalRoutePoint, params.startTime, params.transportTypes, params.goingSpeed, params.dopTimeMinutes);

                        console.log(res);
                        AppClient.findedOptimalWays = res.getOptimalWays();
                        console.log(AppClient.findedOptimalWays);

                    case 28:

                        console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");

                        return _context8.abrupt('return', AppClient.findedOptimalWays);

                    case 30:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, this, [[11, 19]]);
    }));

    return function getCountedOnClientWays(_x16, _x17, _x18, _x19, _x20, _x21) {
        return _ref8.apply(this, arguments);
    };
}();

//, myReject;
var getOptimalRoutesCollectionFromSw = function () {
    var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(params) {
        var promise;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
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
                        });

                        navigator.serviceWorker.controller.postMessage({
                            requestType: 'optimalWay',
                            params: params
                        });
                        //console.log(promise);
                        _context9.next = 4;
                        return promise;

                    case 4:
                        return _context9.abrupt('return', _context9.sent);

                    case 5:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function getOptimalRoutesCollectionFromSw(_x22) {
        return _ref9.apply(this, arguments);
    };
}();

var _runtime = require('serviceworker-webpack-plugin/lib/runtime');

var _runtime2 = _interopRequireDefault(_runtime);

var _optimalRoutesCollection = require('public-transport-find-optimal-ways/lib/optimalRoutesCollection');

var _optimalRoutesCollection2 = _interopRequireDefault(_optimalRoutesCollection);

var _dataProvider = require('./dataProvider');

var _dataProvider2 = _interopRequireDefault(_dataProvider);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _pointsHistoryStorage = require('./pointsHistoryStorage');

var _pointsHistoryStorage2 = _interopRequireDefault(_pointsHistoryStorage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiPublicTransportServer = _config2.default.apiPublicTransportServer;


//console.log('test123');
//console.log(navigator);
if ('serviceWorker' in navigator) {
    console.log('ServiceWorker was finded in navigator.');
    var registration = _runtime2.default.register();

    registration.then(function () {
        console.log('ServiceWorker registered.');
        //console.log(registration);
        //console.log(navigator.serviceWorker);

        var controller = navigator.serviceWorker.controller;
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
        } else {}
    });
} else {
    console.log('ServiceWorker not finded in navigator.');
}

//import './install-service-worker.js';

/*if (navigator.onLine === undefined || navigator.onLine === false){
    DataProvider.loadDataAndInitialize();
}
else {
    DataProvider.loadDataOnly();
}*/

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var AppClient = function () {
    function AppClient() {
        (0, _classCallCheck3.default)(this, AppClient);
    }

    (0, _createClass3.default)(AppClient, null, [{
        key: 'findWays',


        // Find optimal ways between two points. The start time, reserved time, going speed and transport types are known.
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
                var findedOptimalWays, i;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                findedOptimalWays = null;
                                _context.prev = 1;
                                _context.next = 4;
                                return getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);

                            case 4:
                                findedOptimalWays = _context.sent;

                            case 5:
                                _context.prev = 5;

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
                                return _context.abrupt('return', findedOptimalWays);

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[1,, 5, 9]]);
            }));

            function findWays(_x, _x2, _x3, _x4, _x5, _x6) {
                return _ref.apply(this, arguments);
            }

            return findWays;
        }()

        // Sort the finded ways with the importance of each criterion.

        /*static totalTimePercent = 1;
        static totalGoingTimePercent = 1;
        static totalTransportChangingCountPercent = 1;*/

        /*static isStartFinalPointsSelected() {
            return AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null;
        }
        static countWayButtonClicked = false;
        static isCountWayButtonClicked() {
            return AppClient.countWayButtonClicked;
        }*/

    }, {
        key: 'customizeFindedOptimalWaysStart',
        value: function customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue) {
            if (AppClient.findedOptimalWays != null) {
                /*AppClient.totalTimePercent = totalTimePercentValue;
                AppClient.totalGoingTimePercent = totalGoingTimePercentValue;
                AppClient.totalTransportChangingCountPercent = totalTransportChangingCountPercentValue;*/

                var sortedArr = [];
                var newSortedFindedWays = [];

                var tmpTransportChangingCountEffictivity = 0;
                var max_rank = 0;
                var index = -1;
                for (var j = 0; j < AppClient.findedOptimalWays.length /* && j < 3*/; j++) {
                    max_rank = 0; //!!!
                    index = -1;
                    for (var i = 0; i < AppClient.findedOptimalWays.length; i++) {
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
                for (var _i = 0, n = sortedArr.length, sortedIndex = sortedArr[0]; _i < n; sortedIndex = sortedArr[++_i]) {
                    newSortedFindedWays.push(AppClient.findedOptimalWays[sortedIndex]);
                }
                AppClient.findedOptimalWays = newSortedFindedWays;

                return AppClient.findedOptimalWays;
            } else {
                throw new Error('Can`t customize optimal ways, because it`s not finded yet.');
            }
        }
    }, {
        key: 'findCurrentDestinationCoords',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
                var getCurrentPosition, position, findedLat, findedLng, coords, lastCnownPositionCoordsDescription, searchingPoint, resultCoords;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!navigator.geolocation) {
                                    _context3.next = 22;
                                    break;
                                }

                                getCurrentPosition = function () {
                                    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                                        var promise;
                                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                                            while (1) {
                                                switch (_context2.prev = _context2.next) {
                                                    case 0:
                                                        promise = new Promise(function (resolve, reject) {
                                                            navigator.geolocation.getCurrentPosition(resolve, reject);
                                                        });
                                                        _context2.next = 3;
                                                        return promise;

                                                    case 3:
                                                        return _context2.abrupt('return', _context2.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context2.stop();
                                                }
                                            }
                                        }, _callee2, this);
                                    }));

                                    return function getCurrentPosition() {
                                        return _ref3.apply(this, arguments);
                                    };
                                }();

                                _context3.next = 4;
                                return getCurrentPosition();

                            case 4:
                                position = _context3.sent;

                                if (!(position === undefined || position == null)) {
                                    _context3.next = 7;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 7:
                                findedLat = parseFloat(position.coords.latitude.toFixed(4));
                                findedLng = parseFloat(position.coords.longitude.toFixed(4));


                                localStorage["lastCnownPositionCoords"] = findedLat + "," + findedLng;

                                coords = { lat: findedLat, lng: findedLng };
                                _context3.next = 13;
                                return AppClient.getDesinationDescription(coords);

                            case 13:
                                lastCnownPositionCoordsDescription = _context3.sent;

                                if (!(lastCnownPositionCoordsDescription == null)) {
                                    _context3.next = 19;
                                    break;
                                }

                                _context3.next = 17;
                                return _pointsHistoryStorage2.default.tryFindByCoords(coords);

                            case 17:
                                searchingPoint = _context3.sent;

                                if (searchingPoint != null) {
                                    lastCnownPositionCoordsDescription = searchingPoint.description;
                                } else {
                                    lastCnownPositionCoordsDescription = "[" + findedLat + ", " + findedLng + "]";
                                }

                            case 19:
                                localStorage["lastCnownPositionCoordsDescription"] = lastCnownPositionCoordsDescription;

                                resultCoords = { lat: findedLat, lng: findedLng };
                                return _context3.abrupt('return', resultCoords);

                            case 22:
                                return _context3.abrupt('return', null);

                            case 23:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function findCurrentDestinationCoords() {
                return _ref2.apply(this, arguments);
            }

            return findCurrentDestinationCoords;
        }()
    }, {
        key: 'findPointsByOsmGeocodingApi',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(strReq) {
                var data, resultPoints, i, n, currentPoint;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.prev = 0;
                                _context4.next = 3;
                                return getJsonFromUrl("https://nominatim.openstreetmap.org/search?q=" + strReq + "&format=json");

                            case 3:
                                data = _context4.sent;

                                if (!(data != null && data.length !== 0)) {
                                    _context4.next = 9;
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
                                return _context4.abrupt('return', resultPoints);

                            case 9:
                                return _context4.abrupt('return', null);

                            case 12:
                                _context4.prev = 12;
                                _context4.t0 = _context4['catch'](0);
                                return _context4.abrupt('return', null);

                            case 15:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[0, 12]]);
            }));

            function findPointsByOsmGeocodingApi(_x7) {
                return _ref4.apply(this, arguments);
            }

            return findPointsByOsmGeocodingApi;
        }()
    }, {
        key: 'getDesinationDescription',
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(coords) {
                var findedPoints;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                _context5.next = 3;
                                return AppClient.findPointsByOsmGeocodingApi(coords.lat + "," + coords.lng);

                            case 3:
                                findedPoints = _context5.sent;

                                if (!(findedPoints != null)) {
                                    _context5.next = 6;
                                    break;
                                }

                                return _context5.abrupt('return', findedPoints[0].description);

                            case 6:
                                return _context5.abrupt('return', null);

                            case 9:
                                _context5.prev = 9;
                                _context5.t0 = _context5['catch'](0);
                                return _context5.abrupt('return', null);

                            case 12:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 9]]);
            }));

            function getDesinationDescription(_x8) {
                return _ref5.apply(this, arguments);
            }

            return getDesinationDescription;
        }()
    }]);
    return AppClient;
}();

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
AppClient.my_speed = 5;
AppClient.my_dopTimeMinutes = 2;


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