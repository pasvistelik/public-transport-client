"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import ApiConfig from './config';

var dbName = "public_transport2";
var storeName = "json_data";

function getJsonDataStorageConnection() {
    var promise;
    return regeneratorRuntime.async(function getJsonDataStorageConnection$(_context2) {
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
                                            objectStore = db.createObjectStore(storeName, { keyPath: "name" });

                                            objectStore.createIndex("json", "json", { unique: false });

                                            _context.next = 5;
                                            return regeneratorRuntime.awrap(getJsonDataStorageConnection());

                                        case 5:
                                            result = _context.sent;

                                            resolve(result);

                                        case 7:
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
function tryPush(obj) {
    var promise;
    return regeneratorRuntime.async(function tryPush$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    promise = new Promise(function _callee2(resolve, reject) {
                        var db, transaction, objectStore, request;
                        return regeneratorRuntime.async(function _callee2$(_context3) {
                            while (1) {
                                switch (_context3.prev = _context3.next) {
                                    case 0:
                                        _context3.next = 2;
                                        return regeneratorRuntime.awrap(getJsonDataStorageConnection());

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
function getItem(name) {
    var promise;
    return regeneratorRuntime.async(function getItem$(_context6) {
        while (1) {
            switch (_context6.prev = _context6.next) {
                case 0:
                    promise = new Promise(function _callee3(resolve, reject) {
                        var db, transaction, objectStore, request;
                        return regeneratorRuntime.async(function _callee3$(_context5) {
                            while (1) {
                                switch (_context5.prev = _context5.next) {
                                    case 0:
                                        _context5.next = 2;
                                        return regeneratorRuntime.awrap(getJsonDataStorageConnection());

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
                            }
                        }, null, this);
                    });
                    _context6.next = 3;
                    return regeneratorRuntime.awrap(promise);

                case 3:
                    return _context6.abrupt("return", _context6.sent);

                case 4:
                case "end":
                    return _context6.stop();
            }
        }
    }, null, this);
}

var JsonDataStorage = function () {
    function JsonDataStorage() {
        _classCallCheck(this, JsonDataStorage);
    }

    _createClass(JsonDataStorage, null, [{
        key: "getAllStations",
        value: function getAllStations() {
            return regeneratorRuntime.async(function getAllStations$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            _context7.prev = 0;
                            _context7.next = 3;
                            return regeneratorRuntime.awrap(getItem('allStations'));

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
                }
            }, null, this, [[0, 6]]);
        }
    }, {
        key: "getAllRoutes",
        value: function getAllRoutes() {
            return regeneratorRuntime.async(function getAllRoutes$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.prev = 0;
                            _context8.next = 3;
                            return regeneratorRuntime.awrap(getItem('allRoutes'));

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
                }
            }, null, this, [[0, 6]]);
        }
    }, {
        key: "getAllTimetables",
        value: function getAllTimetables() {
            return regeneratorRuntime.async(function getAllTimetables$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _context9.prev = 0;
                            _context9.next = 3;
                            return regeneratorRuntime.awrap(getItem('allTimetables'));

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
                }
            }, null, this, [[0, 6]]);
        }
    }, {
        key: "pushAllStations",
        value: function pushAllStations(allStationsJson) {
            return regeneratorRuntime.async(function pushAllStations$(_context10) {
                while (1) {
                    switch (_context10.prev = _context10.next) {
                        case 0:
                            _context10.prev = 0;
                            _context10.next = 3;
                            return regeneratorRuntime.awrap(tryPush({
                                name: 'allStations',
                                json: allStationsJson
                            }));

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
                }
            }, null, this, [[0, 6]]);
        }
    }, {
        key: "pushAllRoutes",
        value: function pushAllRoutes(allRoutesJson) {
            return regeneratorRuntime.async(function pushAllRoutes$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _context11.prev = 0;
                            _context11.next = 3;
                            return regeneratorRuntime.awrap(tryPush({
                                name: 'allRoutes',
                                json: allRoutesJson
                            }));

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
                }
            }, null, this, [[0, 6]]);
        }
    }, {
        key: "pushAllTimetables",
        value: function pushAllTimetables(allTimetablesJson) {
            return regeneratorRuntime.async(function pushAllTimetables$(_context12) {
                while (1) {
                    switch (_context12.prev = _context12.next) {
                        case 0:
                            _context12.prev = 0;
                            _context12.next = 3;
                            return regeneratorRuntime.awrap(tryPush({
                                name: 'allTimetables',
                                json: allTimetablesJson
                            }));

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
                }
            }, null, this, [[0, 6]]);
        }
    }]);

    return JsonDataStorage;
}();

exports.default = JsonDataStorage;