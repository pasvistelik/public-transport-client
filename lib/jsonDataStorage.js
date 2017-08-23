"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

let getJsonDataStorageConnection = (() => {
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
                                            objectStore = db.createObjectStore(storeName, { keyPath: "name" });

                                            objectStore.createIndex("json", "json", { unique: false });

                                            _context.next = 5;
                                            return getJsonDataStorageConnection();

                                        case 5:
                                            result = _context.sent;

                                            resolve(result);

                                        case 7:
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

    return function getJsonDataStorageConnection() {
        return _ref.apply(this, arguments);
    };
})();

let tryPush = (() => {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(obj) {
        var _ref4, promise;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
                case 0:
                    promise = new Promise((() => {
                        _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                            var db, transaction, objectStore, request;
                            return _regenerator2.default.wrap(function _callee3$(_context3) {
                                while (1) switch (_context3.prev = _context3.next) {
                                    case 0:
                                        _context3.next = 2;
                                        return getJsonDataStorageConnection();

                                    case 2:
                                        db = _context3.sent;

                                        //console.log(db);
                                        transaction = db.transaction([storeName], "readwrite");
                                        objectStore = transaction.objectStore(storeName);
                                        request = objectStore.add({
                                            name: obj.name,
                                            json: obj.json
                                        });

                                        request.onerror = function (event) {
                                            reject(event.target.error);
                                        };
                                        request.onsuccess = function (event) {
                                            resolve(event.target.result);
                                        };

                                    case 8:
                                    case "end":
                                        return _context3.stop();
                                }
                            }, _callee3, this);
                        }));
                        return function (_x3, _x4) {
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

    return function tryPush(_x2) {
        return _ref3.apply(this, arguments);
    };
})();

let getItem = (() => {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(name) {
        var _ref6, promise;

        return _regenerator2.default.wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
                case 0:
                    promise = new Promise((() => {
                        _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(resolve, reject) {
                            var db, transaction, objectStore, request;
                            return _regenerator2.default.wrap(function _callee5$(_context5) {
                                while (1) switch (_context5.prev = _context5.next) {
                                    case 0:
                                        _context5.next = 2;
                                        return getJsonDataStorageConnection();

                                    case 2:
                                        db = _context5.sent;
                                        transaction = db.transaction([storeName]);
                                        objectStore = transaction.objectStore(storeName);
                                        request = objectStore.get(name);

                                        request.onsuccess = function (event) {
                                            if (event.target.result !== undefined) {
                                                resolve(event.target.result.json);
                                            } else {
                                                //resolve(null);
                                                reject(event.target.error);
                                            }
                                        };
                                        request.onerror = function (event) {
                                            reject(event.target.error);
                                        };

                                    case 8:
                                    case "end":
                                        return _context5.stop();
                                }
                            }, _callee5, this);
                        }));
                        return function (_x6, _x7) {
                            return _ref6.apply(this, arguments);
                        };
                    })());
                    _context6.next = 3;
                    return promise;

                case 3:
                    return _context6.abrupt("return", _context6.sent);

                case 4:
                case "end":
                    return _context6.stop();
            }
        }, _callee6, this);
    }));

    return function getItem(_x5) {
        return _ref5.apply(this, arguments);
    };
})();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//import ApiConfig from './config';

const dbName = "public_transport2";
const storeName = "json_data";

class JsonDataStorage {
    static getAllStations() {
        var _this = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.prev = 0;
                        _context7.next = 3;
                        return getItem('allStations');

                    case 3:
                        return _context7.abrupt("return", _context7.sent);

                    case 6:
                        _context7.prev = 6;
                        _context7.t0 = _context7["catch"](0);
                        return _context7.abrupt("return", null);

                    case 9:
                    case "end":
                        return _context7.stop();
                }
            }, _callee7, _this, [[0, 6]]);
        }))();
    }
    static getAllRoutes() {
        var _this2 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) switch (_context8.prev = _context8.next) {
                    case 0:
                        _context8.prev = 0;
                        _context8.next = 3;
                        return getItem('allRoutes');

                    case 3:
                        return _context8.abrupt("return", _context8.sent);

                    case 6:
                        _context8.prev = 6;
                        _context8.t0 = _context8["catch"](0);
                        return _context8.abrupt("return", null);

                    case 9:
                    case "end":
                        return _context8.stop();
                }
            }, _callee8, _this2, [[0, 6]]);
        }))();
    }
    static getAllTimetables() {
        var _this3 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) switch (_context9.prev = _context9.next) {
                    case 0:
                        _context9.prev = 0;
                        _context9.next = 3;
                        return getItem('allTimetables');

                    case 3:
                        return _context9.abrupt("return", _context9.sent);

                    case 6:
                        _context9.prev = 6;
                        _context9.t0 = _context9["catch"](0);
                        return _context9.abrupt("return", null);

                    case 9:
                    case "end":
                        return _context9.stop();
                }
            }, _callee9, _this3, [[0, 6]]);
        }))();
    }
    static pushAllStations(allStationsJson) {
        var _this4 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
            return _regenerator2.default.wrap(function _callee10$(_context10) {
                while (1) switch (_context10.prev = _context10.next) {
                    case 0:
                        _context10.prev = 0;
                        _context10.next = 3;
                        return tryPush({
                            name: 'allStations',
                            json: allStationsJson
                        });

                    case 3:
                        return _context10.abrupt("return", _context10.sent);

                    case 6:
                        _context10.prev = 6;
                        _context10.t0 = _context10["catch"](0);
                        return _context10.abrupt("return", null);

                    case 9:
                    case "end":
                        return _context10.stop();
                }
            }, _callee10, _this4, [[0, 6]]);
        }))();
    }
    static pushAllRoutes(allRoutesJson) {
        var _this5 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
            return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) switch (_context11.prev = _context11.next) {
                    case 0:
                        _context11.prev = 0;
                        _context11.next = 3;
                        return tryPush({
                            name: 'allRoutes',
                            json: allRoutesJson
                        });

                    case 3:
                        return _context11.abrupt("return", _context11.sent);

                    case 6:
                        _context11.prev = 6;
                        _context11.t0 = _context11["catch"](0);
                        return _context11.abrupt("return", null);

                    case 9:
                    case "end":
                        return _context11.stop();
                }
            }, _callee11, _this5, [[0, 6]]);
        }))();
    }
    static pushAllTimetables(allTimetablesJson) {
        var _this6 = this;

        return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
            return _regenerator2.default.wrap(function _callee12$(_context12) {
                while (1) switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.prev = 0;
                        _context12.next = 3;
                        return tryPush({
                            name: 'allTimetables',
                            json: allTimetablesJson
                        });

                    case 3:
                        return _context12.abrupt("return", _context12.sent);

                    case 6:
                        _context12.prev = 6;
                        _context12.t0 = _context12["catch"](0);
                        return _context12.abrupt("return", null);

                    case 9:
                    case "end":
                        return _context12.stop();
                }
            }, _callee12, _this6, [[0, 6]]);
        }))();
    }
}

exports.default = JsonDataStorage;