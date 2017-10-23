"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var getJsonFromUrl = function () {
    var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(strReq) {
        var response;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return fetch(strReq);

                    case 2:
                        response = _context9.sent;
                        _context9.next = 5;
                        return response.json();

                    case 5:
                        return _context9.abrupt("return", _context9.sent);

                    case 6:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function getJsonFromUrl(_x10) {
        return _ref9.apply(this, arguments);
    };
}();

var getCountedOnServerWays = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var paramsStr, data;
        return _regenerator2.default.wrap(function _callee10$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        paramsStr = "?from=" + fromPositionStr + "&to=" + toPositionStr + "&startTime=" + myStartTimeStr + "&dopTimeMinutes=" + my_dopTimeMinutes + "&goingSpeed=" + my_speed + "&transportTypes=" + typesStr;
                        _context10.next = 3;
                        return getJsonFromUrl(apiPublicTransportServer + "optimalRoute" + paramsStr);

                    case 3:
                        data = _context10.sent;


                        AppClient.findedOptimalWays = data;

                        console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes.");
                        return _context10.abrupt("return", data);

                    case 7:
                    case "end":
                        return _context10.stop();
                }
            }
        }, _callee10, this);
    }));

    return function getCountedOnServerWays(_x11, _x12, _x13, _x14, _x15, _x16) {
        return _ref10.apply(this, arguments);
    };
}();

var getCountedOnClientWays = function () {
    var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
        var startOptimalRoutePoint, finalOptimalRoutePoint, myStartTime, types, startInitializingMoment, params, res;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        console.log("Start local counting...");

                        //await DataProvider.loadDataAndInitialize();

                        startOptimalRoutePoint = strToCoords(fromPositionStr);
                        finalOptimalRoutePoint = strToCoords(toPositionStr);
                        myStartTime = strToSeconds(myStartTimeStr);

                        if (!(startOptimalRoutePoint === undefined || finalOptimalRoutePoint === undefined || myStartTime === undefined)) {
                            _context11.next = 6;
                            break;
                        }

                        return _context11.abrupt("return", null);

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
                        _context11.prev = 11;

                        if (!(AppClient.canUseSW !== true || navigator.serviceWorker == null || navigator.serviceWorker.controller == null)) {
                            _context11.next = 14;
                            break;
                        }

                        throw new Error();

                    case 14:
                        console.log('Start counting in SW.');
                        _context11.next = 17;
                        return getOptimalRoutesCollectionFromSw(params);

                    case 17:
                        AppClient.findedOptimalWays = _context11.sent;

                        if (!(AppClient.findedOptimalWays == null)) {
                            _context11.next = 20;
                            break;
                        }

                        throw new Error();

                    case 20:
                        _context11.next = 38;
                        break;

                    case 22:
                        _context11.prev = 22;
                        _context11.t0 = _context11["catch"](11);

                        console.log(_context11.t0);
                        _context11.prev = 25;

                        console.log('Start counting without using SW.');
                        _context11.next = 29;
                        return _dataProvider2.default.loadDataAndInitialize();

                    case 29:
                        res = new _optimalRoutesCollection2.default(_dataProvider2.default.getAllStations(), params.startOptimalRoutePoint, params.finalOptimalRoutePoint, params.startTime, params.transportTypes, params.goingSpeed, params.dopTimeMinutes);

                        console.log(res);
                        AppClient.findedOptimalWays = res.getOptimalWays();
                        console.log(AppClient.findedOptimalWays);
                        _context11.next = 38;
                        break;

                    case 35:
                        _context11.prev = 35;
                        _context11.t1 = _context11["catch"](25);

                        console.log(_context11.t1);

                    case 38:

                        if (AppClient.findedOptimalWays != null) console.log("Finded " + AppClient.findedOptimalWays.length + " optimal routes. Time = " + (Date.now() - startInitializingMoment) + " ms.");

                        return _context11.abrupt("return", AppClient.findedOptimalWays);

                    case 40:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, this, [[11, 22], [25, 35]]);
    }));

    return function getCountedOnClientWays(_x17, _x18, _x19, _x20, _x21, _x22) {
        return _ref11.apply(this, arguments);
    };
}();

//, myReject;
var getOptimalRoutesCollectionFromSw = function () {
    var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(params) {
        var promise;
        return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
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

                        _context12.next = 3;
                        return promise;

                    case 3:
                        return _context12.abrupt("return", _context12.sent);

                    case 4:
                    case "end":
                        return _context12.stop();
                }
            }
        }, _callee12, this);
    }));

    return function getOptimalRoutesCollectionFromSw(_x23) {
        return _ref12.apply(this, arguments);
    };
}();

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
    var registration = _runtime2.default.register();

    registration.then(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(obj) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            //console.log(obj);
                            console.log('ServiceWorker registered.');
                            //console.log(registration);
                            //console.log(navigator.serviceWorker);

                            _context3.next = 3;
                            return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.next = 2;
                                                return navigator.serviceWorker.getRegistration();

                                            case 2:
                                                _context2.next = 4;
                                                return navigator.serviceWorker.ready.then(function (obj) {
                                                    console.log(obj);
                                                    console.log(navigator.serviceWorker.controller);
                                                }).then(function (obj) {
                                                    console.log(obj);
                                                    console.log("Checking serviceWorker.controller result: " + (navigator.serviceWorker.controller != null));

                                                    var controller = navigator.serviceWorker.controller;

                                                    console.log('Try find navigator.serviceWorker.controller...');
                                                    if (controller != null) {
                                                        console.log("navigator.serviceWorker.controller was finded.");

                                                        controller.postMessage("no-kill-sw");
                                                        setInterval(function () {
                                                            controller.postMessage("no-kill-sw");
                                                        }, _config2.default.clientVsSwNoKillingMessageInterval);
                                                        navigator.serviceWorker.addEventListener('message', function (event) {
                                                            if (event.data === 'no-kill-sw-accepted') {
                                                                console.log('Client: SW call no-kill-sw-accepted.');
                                                                AppClient.canUseSW = true;
                                                            } else if (event.data.requestType === 'optimalWayResult') {
                                                                handleOptimalWayResult(event.data);
                                                            }
                                                            //console.log(22222)
                                                            //console.log(event.data.message);
                                                            //console.log(event.data);
                                                        });
                                                        setTimeout((0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                                            return _regenerator2.default.wrap(function _callee$(_context) {
                                                                while (1) {
                                                                    switch (_context.prev = _context.next) {
                                                                        case 0:
                                                                            if (!AppClient.canUseSW) {
                                                                                controller.postMessage("sw-not-answered");
                                                                                console.log('Client: SW not answered.');
                                                                                console.log("AppClient.isNeedCountingOnServer = " + AppClient.isNeedCountingOnServer);
                                                                                if (navigator.onLine === undefined || navigator.onLine === false || !JSON.parse(AppClient.isNeedCountingOnServer)) {
                                                                                    _dataProvider2.default.loadDataAndInitialize();
                                                                                } else {
                                                                                    _dataProvider2.default.loadDataOnly();
                                                                                }
                                                                            } else {
                                                                                controller.postMessage("can-use-sw-accepted");
                                                                            }

                                                                        case 1:
                                                                        case "end":
                                                                            return _context.stop();
                                                                    }
                                                                }
                                                            }, _callee, this);
                                                        })), 100);
                                                    } else {
                                                        console.log("navigator.serviceWorker.controller is null.");
                                                        console.log("AppClient.isNeedCountingOnServer = " + AppClient.isNeedCountingOnServer);
                                                        if (navigator.onLine === undefined || navigator.onLine === false || !JSON.parse(AppClient.isNeedCountingOnServer)) {
                                                            _dataProvider2.default.loadDataAndInitialize();
                                                        } else {
                                                            _dataProvider2.default.loadDataOnly();
                                                        }
                                                    }
                                                });

                                            case 4:
                                            case "end":
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, this);
                            }))();

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3, this);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }()

    //...
    );
} else {
    console.log('ServiceWorker not finded in navigator.');
    console.log("AppClient.isNeedCountingOnServer = " + AppClient.isNeedCountingOnServer);
    if (navigator.onLine === undefined || navigator.onLine === false || !JSON.parse(AppClient.isNeedCountingOnServer)) {
        _dataProvider2.default.loadDataAndInitialize();
    } else {
        _dataProvider2.default.loadDataOnly();
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Client.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var AppClient = function () {
    function AppClient() {
        (0, _classCallCheck3.default)(this, AppClient);
    }

    (0, _createClass3.default)(AppClient, null, [{
        key: "findWays",


        // Find optimal ways between two points. The start time, reserved time, going speed and transport types are known.
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr) {
                var findedOptimalWays, i;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                findedOptimalWays = null;

                                if (!JSON.parse(AppClient.isNeedCountingOnServer)) {
                                    _context4.next = 21;
                                    break;
                                }

                                _context4.prev = 2;
                                _context4.next = 5;
                                return getCountedOnServerWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);

                            case 5:
                                findedOptimalWays = _context4.sent;
                                _context4.next = 19;
                                break;

                            case 8:
                                _context4.prev = 8;
                                _context4.t0 = _context4["catch"](2);
                                _context4.prev = 10;
                                _context4.next = 13;
                                return getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);

                            case 13:
                                findedOptimalWays = _context4.sent;
                                _context4.next = 19;
                                break;

                            case 16:
                                _context4.prev = 16;
                                _context4.t1 = _context4["catch"](10);

                                console.log(_context4.t1);

                            case 19:
                                _context4.next = 30;
                                break;

                            case 21:
                                _context4.prev = 21;
                                _context4.next = 24;
                                return getCountedOnClientWays(fromPositionStr, toPositionStr, myStartTimeStr, my_dopTimeMinutes, my_speed, typesStr);

                            case 24:
                                findedOptimalWays = _context4.sent;
                                _context4.next = 30;
                                break;

                            case 27:
                                _context4.prev = 27;
                                _context4.t2 = _context4["catch"](21);

                                console.log(_context4.t2);

                            case 30:

                                if (findedOptimalWays != null && findedOptimalWays.length !== 0) {
                                    AppClient.findedOptimalWays = findedOptimalWays;

                                    AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalTimeSeconds);
                                    AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalGoingTimeSeconds);
                                    AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[0].totalTransportChangingCount);
                                    AppClient.minimalWaitingTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].totalWaitingTime);
                                    AppClient.minimalRiskTimeSeconds = parseFloat(AppClient.findedOptimalWays[0].minimalWaitingTime);
                                    for (i = 1; i < AppClient.findedOptimalWays.length; i++) {
                                        if (parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds) < AppClient.minimalTimeSeconds) AppClient.minimalTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalTimeSeconds);
                                        if (parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds) < AppClient.minimalGoingTimeSeconds) AppClient.minimalGoingTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalGoingTimeSeconds);
                                        if (parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount) < AppClient.minimalTransportChangingCount) AppClient.minimalTransportChangingCount = parseFloat(AppClient.findedOptimalWays[i].totalTransportChangingCount);
                                        if (parseFloat(AppClient.findedOptimalWays[i].totalWaitingTime) < AppClient.minimalWaitingTimeSeconds) AppClient.minimalWaitingTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].totalWaitingTime);
                                        if (parseFloat(AppClient.findedOptimalWays[i].minimalWaitingTime) < AppClient.minimalRiskTimeSeconds) AppClient.minimalRiskTimeSeconds = parseFloat(AppClient.findedOptimalWays[i].minimalWaitingTime);
                                    }
                                    if (AppClient.minimalTransportChangingCount < 1) AppClient.minimalTransportChangingCount = 1;
                                }
                                return _context4.abrupt("return", findedOptimalWays);

                            case 32:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[2, 8], [10, 16], [21, 27]]);
            }));

            function findWays(_x2, _x3, _x4, _x5, _x6, _x7) {
                return _ref4.apply(this, arguments);
            }

            return findWays;
        }()

        // Sort the finded ways with the importance of each criterion.

    }, {
        key: "customizeFindedOptimalWaysStart",
        value: function customizeFindedOptimalWaysStart(totalTimePercentValue, totalGoingTimePercentValue, totalTransportChangingCountPercentValue) {
            if (AppClient.findedOptimalWays != null) {
                AppClient.totalTimePercentValue = totalTimePercentValue;
                AppClient.totalGoingTimePercentValue = totalGoingTimePercentValue;
                AppClient.totalTransportChangingCountPercentValue = totalTransportChangingCountPercentValue;

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
        key: "findCurrentDestinationCoords",
        value: function () {
            var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var getCurrentPosition, position, findedLat, findedLng, coords, lastCnownPositionCoordsDescription, searchingPoint, resultCoords;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
                            case 0:
                                if (!navigator.geolocation) {
                                    _context6.next = 22;
                                    break;
                                }

                                getCurrentPosition = function () {
                                    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                                        var promise;
                                        return _regenerator2.default.wrap(function _callee5$(_context5) {
                                            while (1) {
                                                switch (_context5.prev = _context5.next) {
                                                    case 0:
                                                        promise = new Promise(function (resolve, reject) {
                                                            navigator.geolocation.getCurrentPosition(resolve, reject, {
                                                                timeout: 60000,
                                                                enableHighAccuracy: true,
                                                                maximumAge: Infinity
                                                            });
                                                        });
                                                        _context5.next = 3;
                                                        return promise;

                                                    case 3:
                                                        return _context5.abrupt("return", _context5.sent);

                                                    case 4:
                                                    case "end":
                                                        return _context5.stop();
                                                }
                                            }
                                        }, _callee5, this);
                                    }));

                                    return function getCurrentPosition() {
                                        return _ref6.apply(this, arguments);
                                    };
                                }();

                                _context6.next = 4;
                                return getCurrentPosition();

                            case 4:
                                position = _context6.sent;

                                if (!(position === undefined || position == null)) {
                                    _context6.next = 7;
                                    break;
                                }

                                return _context6.abrupt("return", null);

                            case 7:
                                findedLat = parseFloat(position.coords.latitude.toFixed(4));
                                findedLng = parseFloat(position.coords.longitude.toFixed(4));


                                localStorage["lastCnownPositionCoords"] = findedLat + "," + findedLng;

                                coords = { lat: findedLat, lng: findedLng };
                                _context6.next = 13;
                                return AppClient.getDesinationDescription(coords);

                            case 13:
                                lastCnownPositionCoordsDescription = _context6.sent;

                                if (!(lastCnownPositionCoordsDescription == null)) {
                                    _context6.next = 19;
                                    break;
                                }

                                _context6.next = 17;
                                return _pointsHistoryStorage2.default.tryFindByCoords(coords);

                            case 17:
                                searchingPoint = _context6.sent;

                                if (searchingPoint != null) {
                                    lastCnownPositionCoordsDescription = searchingPoint.description;
                                } else {
                                    lastCnownPositionCoordsDescription = "[" + findedLat + ", " + findedLng + "]";
                                }

                            case 19:
                                localStorage["lastCnownPositionCoordsDescription"] = lastCnownPositionCoordsDescription;

                                resultCoords = { lat: findedLat, lng: findedLng };
                                return _context6.abrupt("return", resultCoords);

                            case 22:
                                console.log("navigator.geolocation not supported.");
                                return _context6.abrupt("return", null);

                            case 24:
                            case "end":
                                return _context6.stop();
                        }
                    }
                }, _callee6, this);
            }));

            function findCurrentDestinationCoords() {
                return _ref5.apply(this, arguments);
            }

            return findCurrentDestinationCoords;
        }()
    }, {
        key: "findPointsByOsmGeocodingApi",
        value: function () {
            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(strReq) {
                var data, resultPoints, i, n, currentPoint;
                return _regenerator2.default.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:
                                _context7.prev = 0;
                                _context7.next = 3;
                                return getJsonFromUrl("https://nominatim.openstreetmap.org/search?q=" + strReq + "&format=json");

                            case 3:
                                data = _context7.sent;

                                if (!(data != null && data.length !== 0)) {
                                    _context7.next = 9;
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
                                return _context7.abrupt("return", resultPoints);

                            case 9:
                                return _context7.abrupt("return", null);

                            case 12:
                                _context7.prev = 12;
                                _context7.t0 = _context7["catch"](0);
                                return _context7.abrupt("return", null);

                            case 15:
                            case "end":
                                return _context7.stop();
                        }
                    }
                }, _callee7, this, [[0, 12]]);
            }));

            function findPointsByOsmGeocodingApi(_x8) {
                return _ref7.apply(this, arguments);
            }

            return findPointsByOsmGeocodingApi;
        }()
    }, {
        key: "getDesinationDescription",
        value: function () {
            var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(coords) {
                var findedPoints;
                return _regenerator2.default.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                _context8.prev = 0;
                                _context8.next = 3;
                                return AppClient.findPointsByOsmGeocodingApi(coords.lat + "," + coords.lng);

                            case 3:
                                findedPoints = _context8.sent;

                                if (!(findedPoints != null)) {
                                    _context8.next = 6;
                                    break;
                                }

                                return _context8.abrupt("return", findedPoints[0].description);

                            case 6:
                                return _context8.abrupt("return", null);

                            case 9:
                                _context8.prev = 9;
                                _context8.t0 = _context8["catch"](0);
                                return _context8.abrupt("return", null);

                            case 12:
                            case "end":
                                return _context8.stop();
                        }
                    }
                }, _callee8, this, [[0, 9]]);
            }));

            function getDesinationDescription(_x9) {
                return _ref8.apply(this, arguments);
            }

            return getDesinationDescription;
        }()
    }, {
        key: "isNeedCountingOnServer",
        get: function get() {
            var value = localStorage["isNeedCountingOnServer"];
            return value == null ? JSON.parse(localStorage["isNeedCountingOnServer"] = true) : JSON.parse(value);
        }
        /*static isStartFinalPointsSelected() {
            return AppClient.startOptimalRoutePoint != null && AppClient.finalOptimalRoutePoint != null;
        }
        static countWayButtonClicked = false;
        static isCountWayButtonClicked() {
            return AppClient.countWayButtonClicked;
        }*/

        ,
        set: function set(value) {
            if (value === JSON.stringify(true) || value === JSON.stringify(false)) localStorage["isNeedCountingOnServer"] = JSON.stringify(value);
        }
    }, {
        key: "totalTimePercentValue",
        get: function get() {
            var value = localStorage["totalTimePercentValue"];
            return value == null ? localStorage["totalTimePercentValue"] = 1 : value;
        },
        set: function set(value) {
            if (value >= 0 && value <= 1) localStorage["totalTimePercentValue"] = value;
        }
    }, {
        key: "totalGoingTimePercentValue",
        get: function get() {
            var value = localStorage["totalGoingTimePercentValue"];
            return value == null ? localStorage["totalGoingTimePercentValue"] = 1 : value;
        },
        set: function set(value) {
            if (value >= 0 && value <= 1) localStorage["totalGoingTimePercentValue"] = value;
        }
    }, {
        key: "totalTransportChangingCountPercentValue",
        get: function get() {
            var value = localStorage["totalTransportChangingCountPercentValue"];
            return value == null ? localStorage["totalTransportChangingCountPercentValue"] = 1 : value;
        },
        set: function set(value) {
            if (value >= 0 && value <= 1) localStorage["totalTransportChangingCountPercentValue"] = value;
        }
    }, {
        key: "goingSpeed",
        get: function get() {
            var value = localStorage["goingSpeed"];
            return value == null ? localStorage["goingSpeed"] = 5 : value;
        },
        set: function set(value) {
            if (value > 0) localStorage["goingSpeed"] = value;
        }
    }, {
        key: "dopTimeMinutes",
        get: function get() {
            var value = localStorage["dopTimeMinutes"];
            return value == null ? localStorage["dopTimeMinutes"] = 3 : value;
        },
        set: function set(value) {
            if (value >= 0) localStorage["dopTimeMinutes"] = value;
        }
    }]);
    return AppClient;
}();

AppClient.canUseSW = false;
AppClient.startOptimalRoutePoint = null;
AppClient.finalOptimalRoutePoint = null;
AppClient.myCurrentFindedPosition = null;
AppClient.findedOptimalWays = null;
AppClient.minimalTimeSeconds = 0;
AppClient.minimalGoingTimeSeconds = 0;
AppClient.minimalTransportChangingCount = 0;
AppClient.minimalWaitingTimeSeconds = 0;
AppClient.minimalRiskTimeSeconds = 0;
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