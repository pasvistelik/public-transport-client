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

async function getPointsHistoryStorageConnection() {
    var promise = new Promise(function (resolve, reject) {
        var request = indexedDB.open(dbName, 1);
        request.onerror = function (event) {
            reject(event.target.error);
        };
        request.onsuccess = function (event) {
            resolve(event.target.result);
        };
        request.onupgradeneeded = async function (event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore(storeName, { keyPath: "key", autoIncrement: true });
            objectStore.createIndex("description", "description", { unique: true });
            objectStore.createIndex("lat", "lat", { unique: false });
            objectStore.createIndex("lng", "lng", { unique: false });

            var result = await getPointsHistoryStorageConnection();
            resolve(result);
        };
    });
    return await promise;
}

async function _getAllPoints() {
    var promise = new Promise(async function (resolve, reject) {
        var items = [];
        var db = await getPointsHistoryStorageConnection();
        //console.log(db);
        var transaction = db.transaction([storeName]);
        var objectStore = transaction.objectStore(storeName);

        //let request = objectStore.getAll();

        var request = objectStore.openCursor();
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
    });
    return await promise;
}
async function _tryFindByCoords(coords) {
    var pointsHistory = await _getAllPoints();
    var candidate = null;
    for (var i = 0, n = pointsHistory.length, currentPoint = pointsHistory[0], findedDistance = 150; i < n; currentPoint = pointsHistory[++i]) {
        var currentDistance = (0, _geoCoordsDistance2.default)(coords, { lat: currentPoint.lat, lng: currentPoint.lng });
        if (currentDistance < findedDistance) {
            findedDistance = currentDistance;
            candidate = currentPoint;
        }
    }
    return candidate;
}
async function _tryPush(point) {
    var pointsHistory = await _getAllPoints();
    for (var i = 0, n = pointsHistory.length, currentPoint = pointsHistory[0]; i < n; currentPoint = pointsHistory[++i]) {
        if ((0, _geoCoordsDistance2.default)(point.coords, { lat: currentPoint.lat, lng: currentPoint.lng }) < 50) return null;
    }

    var promise = new Promise(async function (resolve, reject) {
        var db = await getPointsHistoryStorageConnection();
        //console.log(db);
        var transaction = db.transaction([storeName], "readwrite");
        var objectStore = transaction.objectStore(storeName);
        var request = objectStore.add({
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
    });
    return await promise;
}

var PointsHistoryStorage = function () {
    function PointsHistoryStorage() {
        _classCallCheck(this, PointsHistoryStorage);
    }

    _createClass(PointsHistoryStorage, null, [{
        key: "getAllPoints",
        value: async function getAllPoints() {
            return await _getAllPoints();
        }
    }, {
        key: "tryPush",
        value: async function tryPush(point) {
            return await _tryPush(point);
        }
    }, {
        key: "tryFindByCoords",
        value: async function tryFindByCoords(coords) {
            return await _tryFindByCoords(coords);
        }
    }]);

    return PointsHistoryStorage;
}();

exports.default = PointsHistoryStorage;