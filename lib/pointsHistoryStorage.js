"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getPointsHistoryStorageConnection = (() => {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var promise;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
                case 0:
                    promise = new Promise(function (resolve, reject) {
                        let request = indexedDB.open(dbName, 1);
                        request.onerror = function (event) {
                            reject(event.target.error);
                        };
                        request.onsuccess = function (event) {
                            resolve(event.target.result);
                        };
                        request.onupgradeneeded = (() => {
                            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
                                var db, objectStore, result;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) switch (_context.prev = _context.next) {
                                        case 0:
                                            db = event.target.result;
                                            objectStore = db.createObjectStore(storeName, { keyPath: "key", autoIncrement: true });

                                            objectStore.createIndex("description", "description", { unique: true });
                                            objectStore.createIndex("lat", "lat", { unique: false });
                                            objectStore.createIndex("lng", "lng", { unique: false });

                                            _context.next = 7;
                                            return getPointsHistoryStorageConnection();

                                        case 7:
                                            result = _context.sent;

                                            resolve(result);

                                        case 9:
                                        case "end":
                                            return _context.stop();
                                    }
                                }, _callee, this);
                            }));

                            return function (_x) {
                                return _ref2.apply(this, arguments);
                            };
                        })();
                    });
                    _context2.next = 3;
                    return promise;

                case 3:
                    return _context2.abrupt("return", _context2.sent);

                case 4:
                case "end":
                    return _context2.stop();
            }
        }, _callee2, this);
    }));

    return function getPointsHistoryStorageConnection() {
        return _ref.apply(this, arguments);
    };
})();

let getAllPoints = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var _ref4, promise;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
                case 0:
                    promise = new Promise((() => {
                        _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                            var items, db, transaction, objectStore, request;
                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                while (1) switch (_context3.prev = _context3.next) {
                                    case 0:
                                        items = [];
                                        _context3.next = 3;
                                        return getPointsHistoryStorageConnection();

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
                            }, _callee3, this);
                        }));
                        return function (_x2, _x3) {
                            return _ref4.apply(this, arguments);
                        };
                    })());
                    _context4.next = 3;
                    return promise;

                case 3:
                    return _context4.abrupt("return", _context4.sent);

                case 4:
                case "end":
                    return _context4.stop();
            }
        }, _callee4, this);
    }));

    return function getAllPoints() {
        return _ref3.apply(this, arguments);
    };
})();

let tryFindByCoords = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(coords) {
        var pointsHistory, candidate, i, n, currentPoint, findedDistance, currentDistance;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
                case 0:
                    _context5.next = 2;
                    return getAllPoints();

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
        }, _callee5, this);
    }));

    return function tryFindByCoords(_x4) {
        return _ref5.apply(this, arguments);
    };
})();

let tryPush = (() => {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(point) {
        var pointsHistory, i, n, currentPoint, _ref7, promise;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
                case 0:
                    _context7.next = 2;
                    return getAllPoints();

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
                    promise = new Promise((() => {
                        _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(resolve, reject) {
                            var db, transaction, objectStore, request;
                            return _regenerator2.default.wrap(function _callee6$(_context6) {
                                while (1) switch (_context6.prev = _context6.next) {
                                    case 0:
                                        _context6.next = 2;
                                        return getPointsHistoryStorageConnection();

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
                            }, _callee6, this);
                        }));
                        return function (_x6, _x7) {
                            return _ref7.apply(this, arguments);
                        };
                    })());
                    _context7.next = 13;
                    return promise;

                case 13:
                    return _context7.abrupt("return", _context7.sent);

                case 14:
                case "end":
                    return _context7.stop();
            }
        }, _callee7, this);
    }));

    return function tryPush(_x5) {
        return _ref6.apply(this, arguments);
    };
})();

var _geoCoordsDistance = require("geo-coords-distance");

var _geoCoordsDistance2 = _interopRequireDefault(_geoCoordsDistance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dbName = "public_transport";
const storeName = "points_history";

class PointsHistoryStorage {
    static getAllPoints() {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.next = 2;
                        return getAllPoints();

                    case 2:
                        return _context8.abrupt("return", _context8.sent);

                    case 3:
                    case "end":
                        return _context8.stop();
                }
            }, _callee8, _this);
        }))();
    }
    static tryPush(point) {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.next = 2;
                        return tryPush(point);

                    case 2:
                        return _context9.abrupt("return", _context9.sent);

                    case 3:
                    case "end":
                        return _context9.stop();
                }
            }, _callee9, _this2);
        }))();
    }
    static tryFindByCoords(coords) {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.next = 2;
                        return tryFindByCoords(coords);

                    case 2:
                        return _context10.abrupt("return", _context10.sent);

                    case 3:
                    case "end":
                        return _context10.stop();
                }
            }, _callee10, _this3);
        }))();
    }
}

exports.default = PointsHistoryStorage;