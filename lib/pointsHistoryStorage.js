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

var getPointsHistoryStorageConnection = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var promise;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
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
                            request.onupgradeneeded = function () {
                                var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(event) {
                                    var db, objectStore, result;
                                    return _regenerator2.default.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    db = event.target.result;
                                                    objectStore = db.createObjectStore(storeName, { keyPath: "key", autoIncrement: true });

                                                    objectStore.createIndex("description", "description", { unique: true });
                                                    objectStore.createIndex("lat", "lat", { unique: false });
                                                    objectStore.createIndex("lng", "lng", { unique: false });
                                                    objectStore.createIndex("favorite_type", "favorite_type", { unique: false });
                                                    objectStore.createIndex("last_used", "last_used", { unique: false });

                                                    _context.next = 9;
                                                    return getPointsHistoryStorageConnection();

                                                case 9:
                                                    result = _context.sent;

                                                    resolve(result);

                                                case 11:
                                                case "end":
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, this);
                                }));

                                return function (_x) {
                                    return _ref2.apply(this, arguments);
                                };
                            }();
                        });
                        _context2.next = 3;
                        return promise;

                    case 3:
                        return _context2.abrupt("return", _context2.sent);

                    case 4:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function getPointsHistoryStorageConnection() {
        return _ref.apply(this, arguments);
    };
}();

var _getAllPoints = function () {
    var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var promise;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        promise = new Promise(function () {
                            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(resolve, reject) {
                                var items, db, transaction, objectStore, request;
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
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
                                    }
                                }, _callee3, this);
                            }));

                            return function (_x2, _x3) {
                                return _ref4.apply(this, arguments);
                            };
                        }());
                        _context4.next = 3;
                        return promise;

                    case 3:
                        return _context4.abrupt("return", _context4.sent);

                    case 4:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, this);
    }));

    return function _getAllPoints() {
        return _ref3.apply(this, arguments);
    };
}();

var _tryFindByCoords = function () {
    var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(coords) {
        var pointsHistory, candidate, i, n, currentPoint, findedDistance, currentDistance;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.next = 2;
                        return _getAllPoints();

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
        }, _callee5, this);
    }));

    return function _tryFindByCoords(_x4) {
        return _ref5.apply(this, arguments);
    };
}();

var _tryPush = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(point) {
        var pointsHistory, i, n, currentPoint, promise;
        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        _context7.next = 2;
                        return _getAllPoints();

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
                        promise = new Promise(function () {
                            var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(resolve, reject) {
                                var db, transaction, objectStore, request;
                                return _regenerator2.default.wrap(function _callee6$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
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
                                                    description: point.description,
                                                    favorite_type: null,
                                                    last_used: new Date()
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
                                }, _callee6, this);
                            }));

                            return function (_x6, _x7) {
                                return _ref7.apply(this, arguments);
                            };
                        }());
                        _context7.next = 13;
                        return promise;

                    case 13:
                        return _context7.abrupt("return", _context7.sent);

                    case 14:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, this);
    }));

    return function _tryPush(_x5) {
        return _ref6.apply(this, arguments);
    };
}();

var _setPointAsFavorite = function () {
    var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(key, favoriteType) {
        var promise;
        return _regenerator2.default.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        promise = new Promise(function () {
                            var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(resolve, reject) {
                                var db, transaction, objectStore, getPointRequest;
                                return _regenerator2.default.wrap(function _callee8$(_context8) {
                                    while (1) {
                                        switch (_context8.prev = _context8.next) {
                                            case 0:
                                                _context8.next = 2;
                                                return getPointsHistoryStorageConnection();

                                            case 2:
                                                db = _context8.sent;
                                                transaction = db.transaction([storeName], "readwrite");
                                                objectStore = transaction.objectStore(storeName);
                                                getPointRequest = objectStore.get(key);

                                                getPointRequest.onsuccess = function () {
                                                    var point = getPointRequest.result;
                                                    if (favoriteType) point.favorite_type = favoriteType;else point.favorite_type = FavoriteTypes.unclassificed;
                                                    point.last_used = new Date();
                                                    var request = objectStore.put(point, key);
                                                    request.onsuccess = function (event) {
                                                        resolve(true);
                                                    };
                                                    request.onerror = function (event) {
                                                        reject(event.target.error);
                                                    };
                                                };
                                                getPointRequest.onerror = function (event) {
                                                    reject(event.target.error);
                                                };

                                            case 8:
                                            case "end":
                                                return _context8.stop();
                                        }
                                    }
                                }, _callee8, this);
                            }));

                            return function (_x10, _x11) {
                                return _ref9.apply(this, arguments);
                            };
                        }());
                        _context9.next = 3;
                        return promise;

                    case 3:
                        return _context9.abrupt("return", _context9.sent);

                    case 4:
                    case "end":
                        return _context9.stop();
                }
            }
        }, _callee9, this);
    }));

    return function _setPointAsFavorite(_x8, _x9) {
        return _ref8.apply(this, arguments);
    };
}();

var _removePointFromFavorites = function () {
    var _ref10 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11(key) {
        var promise;
        return _regenerator2.default.wrap(function _callee11$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        promise = new Promise(function () {
                            var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(resolve, reject) {
                                var db, transaction, objectStore, getPointRequest;
                                return _regenerator2.default.wrap(function _callee10$(_context10) {
                                    while (1) {
                                        switch (_context10.prev = _context10.next) {
                                            case 0:
                                                _context10.next = 2;
                                                return getPointsHistoryStorageConnection();

                                            case 2:
                                                db = _context10.sent;
                                                transaction = db.transaction([storeName], "readwrite");
                                                objectStore = transaction.objectStore(storeName);
                                                getPointRequest = objectStore.get(key);

                                                getPointRequest.onsuccess = function () {
                                                    var point = getPointRequest.result;
                                                    point.favorite_type = null;
                                                    point.last_used = new Date();
                                                    var request = objectStore.put(point, key);
                                                    request.onsuccess = function (event) {
                                                        resolve(true);
                                                    };
                                                    request.onerror = function (event) {
                                                        reject(event.target.error);
                                                    };
                                                };
                                                getPointRequest.onerror = function (event) {
                                                    reject(event.target.error);
                                                };

                                            case 8:
                                            case "end":
                                                return _context10.stop();
                                        }
                                    }
                                }, _callee10, this);
                            }));

                            return function (_x13, _x14) {
                                return _ref11.apply(this, arguments);
                            };
                        }());
                        _context11.next = 3;
                        return promise;

                    case 3:
                        return _context11.abrupt("return", _context11.sent);

                    case 4:
                    case "end":
                        return _context11.stop();
                }
            }
        }, _callee11, this);
    }));

    return function _removePointFromFavorites(_x12) {
        return _ref10.apply(this, arguments);
    };
}();

var _deletePoint = function () {
    var _ref12 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13(key) {
        var promise;
        return _regenerator2.default.wrap(function _callee13$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        promise = new Promise(function () {
                            var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12(resolve, reject) {
                                var db, transaction, objectStore, request;
                                return _regenerator2.default.wrap(function _callee12$(_context12) {
                                    while (1) {
                                        switch (_context12.prev = _context12.next) {
                                            case 0:
                                                _context12.next = 2;
                                                return getPointsHistoryStorageConnection();

                                            case 2:
                                                db = _context12.sent;
                                                transaction = db.transaction([storeName], "readwrite");
                                                objectStore = transaction.objectStore(storeName);
                                                request = objectStore.delete(key);

                                                request.onerror = function (event) {
                                                    reject(event.target.error);
                                                };
                                                request.onsuccess = function (event) {
                                                    resolve(true);
                                                };

                                            case 8:
                                            case "end":
                                                return _context12.stop();
                                        }
                                    }
                                }, _callee12, this);
                            }));

                            return function (_x16, _x17) {
                                return _ref13.apply(this, arguments);
                            };
                        }());
                        _context13.next = 3;
                        return promise;

                    case 3:
                        return _context13.abrupt("return", _context13.sent);

                    case 4:
                    case "end":
                        return _context13.stop();
                }
            }
        }, _callee13, this);
    }));

    return function _deletePoint(_x15) {
        return _ref12.apply(this, arguments);
    };
}();

var _geoCoordsDistance = require("geo-coords-distance");

var _geoCoordsDistance2 = _interopRequireDefault(_geoCoordsDistance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbName = "public_transport";
var storeName = "points_history";

var FavoriteTypes = {
    unclassificed: 0,
    home: 1,
    job: 2
};

var PointsHistoryStorage = function () {
    function PointsHistoryStorage() {
        (0, _classCallCheck3.default)(this, PointsHistoryStorage);
    }

    (0, _createClass3.default)(PointsHistoryStorage, null, [{
        key: "getAllPoints",
        value: function () {
            var _ref14 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
                return _regenerator2.default.wrap(function _callee14$(_context14) {
                    while (1) {
                        switch (_context14.prev = _context14.next) {
                            case 0:
                                _context14.next = 2;
                                return _getAllPoints();

                            case 2:
                                return _context14.abrupt("return", _context14.sent);

                            case 3:
                            case "end":
                                return _context14.stop();
                        }
                    }
                }, _callee14, this);
            }));

            function getAllPoints() {
                return _ref14.apply(this, arguments);
            }

            return getAllPoints;
        }()
    }, {
        key: "tryPush",
        value: function () {
            var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15(point) {
                return _regenerator2.default.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                _context15.next = 2;
                                return _tryPush(point);

                            case 2:
                                return _context15.abrupt("return", _context15.sent);

                            case 3:
                            case "end":
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function tryPush(_x18) {
                return _ref15.apply(this, arguments);
            }

            return tryPush;
        }()
    }, {
        key: "tryFindByCoords",
        value: function () {
            var _ref16 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16(coords) {
                return _regenerator2.default.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                _context16.next = 2;
                                return _tryFindByCoords(coords);

                            case 2:
                                return _context16.abrupt("return", _context16.sent);

                            case 3:
                            case "end":
                                return _context16.stop();
                        }
                    }
                }, _callee16, this);
            }));

            function tryFindByCoords(_x19) {
                return _ref16.apply(this, arguments);
            }

            return tryFindByCoords;
        }()
    }, {
        key: "setPointAsFavorite",
        value: function () {
            var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17(key) {
                return _regenerator2.default.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                _context17.prev = 0;
                                _context17.next = 3;
                                return _setPointAsFavorite(key);

                            case 3:
                                return _context17.abrupt("return", _context17.sent);

                            case 6:
                                _context17.prev = 6;
                                _context17.t0 = _context17["catch"](0);

                                console.log(_context17.t0);
                                return _context17.abrupt("return", false);

                            case 10:
                            case "end":
                                return _context17.stop();
                        }
                    }
                }, _callee17, this, [[0, 6]]);
            }));

            function setPointAsFavorite(_x20) {
                return _ref17.apply(this, arguments);
            }

            return setPointAsFavorite;
        }()
    }, {
        key: "removePointFromFavorites",
        value: function () {
            var _ref18 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18(key) {
                return _regenerator2.default.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                _context18.prev = 0;
                                _context18.next = 3;
                                return _removePointFromFavorites(key);

                            case 3:
                                return _context18.abrupt("return", _context18.sent);

                            case 6:
                                _context18.prev = 6;
                                _context18.t0 = _context18["catch"](0);

                                console.log(_context18.t0);
                                return _context18.abrupt("return", false);

                            case 10:
                            case "end":
                                return _context18.stop();
                        }
                    }
                }, _callee18, this, [[0, 6]]);
            }));

            function removePointFromFavorites(_x21) {
                return _ref18.apply(this, arguments);
            }

            return removePointFromFavorites;
        }()
    }, {
        key: "deletePoint",
        value: function () {
            var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19(key) {
                return _regenerator2.default.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                _context19.prev = 0;
                                _context19.next = 3;
                                return _deletePoint(key);

                            case 3:
                                return _context19.abrupt("return", _context19.sent);

                            case 6:
                                _context19.prev = 6;
                                _context19.t0 = _context19["catch"](0);

                                console.log(_context19.t0);
                                return _context19.abrupt("return", false);

                            case 10:
                            case "end":
                                return _context19.stop();
                        }
                    }
                }, _callee19, this, [[0, 6]]);
            }));

            function deletePoint(_x22) {
                return _ref19.apply(this, arguments);
            }

            return deletePoint;
        }()
    }]);
    return PointsHistoryStorage;
}();

exports.default = PointsHistoryStorage;