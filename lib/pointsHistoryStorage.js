"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _geoCoordsDistance = require("geo-coords-distance");

var _geoCoordsDistance2 = _interopRequireDefault(_geoCoordsDistance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var dbName = "public_transport";
var storeName = "points_history";

function getPointsHistoryStorageConnection() {
    var promise;
    return regeneratorRuntime.async(function getPointsHistoryStorageConnection$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    promise = new Promise(function (resolve, reject) {
                        var request = indexedDB.open(dbName, 1);
                        request.onerror = function (event) {
                            reject(event.target.error);
                        };
                        request.onsuccess = function (event) {
                            resolve(event.target.result);
                        };
                        request.onupgradeneeded = function _callee(event) {
                            var db, objectStore, result;
                            return regeneratorRuntime.async(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            db = event.target.result;
                                            objectStore = db.createObjectStore(storeName, { keyPath: "key", autoIncrement: true });

                                            objectStore.createIndex("description", "description", { unique: true });
                                            objectStore.createIndex("lat", "lat", { unique: false });
                                            objectStore.createIndex("lng", "lng", { unique: false });

                                            _context.next = 7;
                                            return regeneratorRuntime.awrap(getPointsHistoryStorageConnection());

                                        case 7:
                                            result = _context.sent;

                                            resolve(result);

                                        case 9:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            }, null, this);
                        };
                    });
                    _context2.next = 3;
                    return regeneratorRuntime.awrap(promise);

                case 3:
                    return _context2.abrupt("return", _context2.sent);

                case 4:
                case "end":
                    return _context2.stop();
            }
        }
    }, null, this);
}

function _getAllPoints() {
    var promise;
    return regeneratorRuntime.async(function getAllPoints$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    promise = new Promise(function _callee2(resolve, reject) {
                        var items, db, transaction, objectStore, request;
                        return regeneratorRuntime.async(function _callee2$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        items = [];
                                        _context3.next = 3;
                                        return regeneratorRuntime.awrap(getPointsHistoryStorageConnection());

                                    case 3:
                                        db = _context3.sent;

                                        //console.log(db);
                                        transaction = db.transaction([storeName]);
                                        objectStore = transaction.objectStore(storeName);

                                        //let request = objectStore.getAll();

                                        request = objectStore.openCursor();

                                        request.onsuccess = function (evt) {
                                            var cursor = evt.target.result;
                                            if (cursor) {
                                                items.push(cursor.value);
                                                cursor.continue();
                                            } else resolve(items);
                                        };
                                        request.onerror = function (event) {
                                            reject(event.target.error);
                                        };

                                    case 9:
                                    case "end":
                                        return _context3.stop();
                                }
                            }
                        }, null, this);
                    });
                    _context4.next = 3;
                    return regeneratorRuntime.awrap(promise);

                case 3:
                    return _context4.abrupt("return", _context4.sent);

                case 4:
                case "end":
                    return _context4.stop();
            }
        }
    }, null, this);
}
function _tryFindByCoords(coords) {
    var pointsHistory, candidate, i, n, currentPoint, findedDistance, currentDistance;
    return regeneratorRuntime.async(function tryFindByCoords$(_context5) {
        while (1) {
            switch (_context5.prev = _context5.next) {
                case 0:
                    _context5.next = 2;
                    return regeneratorRuntime.awrap(_getAllPoints());

                case 2:
                    pointsHistory = _context5.sent;
                    candidate = null;

                    for (i = 0, n = pointsHistory.length, currentPoint = pointsHistory[0], findedDistance = 150; i < n; currentPoint = pointsHistory[++i]) {
                        currentDistance = (0, _geoCoordsDistance2.default)(coords, { lat: currentPoint.lat, lng: currentPoint.lng });

                        if (currentDistance < findedDistance) {
                            findedDistance = currentDistance;
                            candidate = currentPoint;
                        }
                    }
                    return _context5.abrupt("return", candidate);

                case 6:
                case "end":
                    return _context5.stop();
            }
        }
    }, null, this);
}
function _tryPush(point) {
    var pointsHistory, i, n, currentPoint, promise;
    return regeneratorRuntime.async(function tryPush$(_context7) {
        while (1) {
            switch (_context7.prev = _context7.next) {
                case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(_getAllPoints());

                case 2:
                    pointsHistory = _context7.sent;
                    i = 0, n = pointsHistory.length, currentPoint = pointsHistory[0];

                case 4:
                    if (!(i < n)) {
                        _context7.next = 10;
                        break;
                    }

                    if (!((0, _geoCoordsDistance2.default)(point.coords, { lat: currentPoint.lat, lng: currentPoint.lng }) < 50)) {
                        _context7.next = 7;
                        break;
                    }

                    return _context7.abrupt("return", null);

                case 7:
                    currentPoint = pointsHistory[++i];
                    _context7.next = 4;
                    break;

                case 10:
                    promise = new Promise(function _callee3(resolve, reject) {
                        var db, transaction, objectStore, request;
                        return regeneratorRuntime.async(function _callee3$(_context6) {
                            while (1) {
                                switch (_context6.prev = _context6.next) {
                                    case 0:
                                        _context6.next = 2;
                                        return regeneratorRuntime.awrap(getPointsHistoryStorageConnection());

                                    case 2:
                                        db = _context6.sent;

                                        //console.log(db);
                                        transaction = db.transaction([storeName], "readwrite");
                                        objectStore = transaction.objectStore(storeName);
                                        request = objectStore.add({
                                            lat: point.coords.lat,
                                            lng: point.coords.lng,
                                            description: point.description
                                        });

                                        request.onerror = function (event) {
                                            reject(event.target.error);
                                        };
                                        request.onsuccess = function (event) {
                                            resolve(event.target.result);
                                        };

                                    case 8:
                                    case "end":
                                        return _context6.stop();
                                }
                            }
                        }, null, this);
                    });
                    _context7.next = 13;
                    return regeneratorRuntime.awrap(promise);

                case 13:
                    return _context7.abrupt("return", _context7.sent);

                case 14:
                case "end":
                    return _context7.stop();
            }
        }
    }, null, this);
}

var PointsHistoryStorage = function () {
    function PointsHistoryStorage() {
        _classCallCheck(this, PointsHistoryStorage);
    }

    _createClass(PointsHistoryStorage, null, [{
        key: "getAllPoints",
        value: function getAllPoints() {
            return regeneratorRuntime.async(function getAllPoints$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.next = 2;
                            return regeneratorRuntime.awrap(_getAllPoints());

                        case 2:
                            return _context8.abrupt("return", _context8.sent);

                        case 3:
                        case "end":
                            return _context8.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: "tryPush",
        value: function tryPush(point) {
            return regeneratorRuntime.async(function tryPush$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.next = 2;
                            return regeneratorRuntime.awrap(_tryPush(point));

                        case 2:
                            return _context9.abrupt("return", _context9.sent);

                        case 3:
                        case "end":
                            return _context9.stop();
                    }
                }
            }, null, this);
        }
    }, {
        key: "tryFindByCoords",
        value: function tryFindByCoords(coords) {
            return regeneratorRuntime.async(function tryFindByCoords$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.next = 2;
                            return regeneratorRuntime.awrap(_tryFindByCoords(coords));

                        case 2:
                            return _context10.abrupt("return", _context10.sent);

                        case 3:
                        case "end":
                            return _context10.stop();
                    }
                }
            }, null, this);
        }
    }]);

    return PointsHistoryStorage;
}();

exports.default = PointsHistoryStorage;