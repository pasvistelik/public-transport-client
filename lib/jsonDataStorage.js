"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//import ApiConfig from './config';

var dbName = "public_transport2";
var storeName = "json_data";

async function getJsonDataStorageConnection() {
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
            var objectStore = db.createObjectStore(storeName, { keyPath: "name" });
            objectStore.createIndex("json", "json", { unique: false });

            var result = await getJsonDataStorageConnection();
            resolve(result);
        };
    });
    return await promise;
}
async function tryPush(obj) {
    var promise = new Promise(async function (resolve, reject) {
        var db = await getJsonDataStorageConnection();
        //console.log(db);
        var transaction = db.transaction([storeName], "readwrite");
        var objectStore = transaction.objectStore(storeName);
        var request = objectStore.add({
            name: obj.name,
            json: obj.json
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
async function getItem(name) {
    var promise = new Promise(async function (resolve, reject) {
        var db = await getJsonDataStorageConnection();
        var transaction = db.transaction([storeName]);
        var objectStore = transaction.objectStore(storeName);

        var request = objectStore.get(name);
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
    });
    return await promise;
}

var JsonDataStorage = function () {
    function JsonDataStorage() {
        _classCallCheck(this, JsonDataStorage);
    }

    _createClass(JsonDataStorage, null, [{
        key: "getAllStations",
        value: async function getAllStations() {
            try {
                return await getItem('allStations');
            } catch (e) {
                return null;
            }
        }
    }, {
        key: "getAllRoutes",
        value: async function getAllRoutes() {
            try {
                return await getItem('allRoutes');
            } catch (e) {
                return null;
            }
        }
    }, {
        key: "getAllTimetables",
        value: async function getAllTimetables() {
            try {
                return await getItem('allTimetables');
            } catch (e) {
                return null;
            }
        }
    }, {
        key: "pushAllStations",
        value: async function pushAllStations(allStationsJson) {
            try {
                return await tryPush({
                    name: 'allStations',
                    json: allStationsJson
                });
            } catch (e) {
                return null;
            }
        }
    }, {
        key: "pushAllRoutes",
        value: async function pushAllRoutes(allRoutesJson) {
            try {
                return await tryPush({
                    name: 'allRoutes',
                    json: allRoutesJson
                });
            } catch (e) {
                return null;
            }
        }
    }, {
        key: "pushAllTimetables",
        value: async function pushAllTimetables(allTimetablesJson) {
            try {
                return await tryPush({
                    name: 'allTimetables',
                    json: allTimetablesJson
                });
            } catch (e) {
                return null;
            }
        }
    }]);

    return JsonDataStorage;
}();

exports.default = JsonDataStorage;