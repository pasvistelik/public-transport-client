'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jsonDataStorage = require('./jsonDataStorage');

var _jsonDataStorage2 = _interopRequireDefault(_jsonDataStorage);

var _publicTransportInitializeData = require('public-transport-initialize-data');

var _publicTransportInitializeData2 = _interopRequireDefault(_publicTransportInitializeData);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DataProvider = function () {
    function DataProvider() {
        _classCallCheck(this, DataProvider);
    }

    _createClass(DataProvider, null, [{
        key: 'getAllStations',
        value: function getAllStations() {
            return DataProvider.allStations;
        }

        //static updatingFromServerInterval = 5000;

    }, {
        key: 'getAllRoutes',
        value: function getAllRoutes() {
            return DataProvider.allRoutes;
        }
    }, {
        key: 'getAllTimetables',
        value: function getAllTimetables() {
            return DataProvider.allTimetables;
        }
    }, {
        key: 'getAllStationsJSON',
        value: function getAllStationsJSON() {
            return DataProvider.allStationsJSON;
        }
    }, {
        key: 'getAllRoutesJSON',
        value: function getAllRoutesJSON() {
            return DataProvider.allRoutesJSON;
        }
    }, {
        key: 'getAllTimetablesJSON',
        value: function getAllTimetablesJSON() {
            return DataProvider.allTimetablesJSON;
        }
    }, {
        key: 'loadDataAndInitialize',
        value: async function loadDataAndInitialize() {
            if (!DataProvider.loadingStarted) {
                DataProvider.loadingStarted = true;

                await DataProvider.loadDataOnly();

                if (DataProvider.allStationsLoaded && DataProvider.allRoutesLoaded && DataProvider.allTimetablesLoaded) {
                    (0, _publicTransportInitializeData2.default)(DataProvider.allStations, DataProvider.allRoutes, DataProvider.allTimetables);
                }
            }
        }
    }, {
        key: 'loadDataOnly',
        value: async function loadDataOnly() {
            DataProvider.allStationsJSON = await _jsonDataStorage2.default.getAllStations();
            DataProvider.allRoutesJSON = await _jsonDataStorage2.default.getAllRoutes();
            DataProvider.allTimetablesJSON = await _jsonDataStorage2.default.getAllTimetables();

            if (!DataProvider.allStationsLoaded) {
                if (DataProvider.allStationsJSON == null) {
                    console.log("Downloading stations from server...");

                    var response = await fetch(_config2.default.apiGetStationsUrl);
                    DataProvider.allStationsJSON = await response.text();
                    DataProvider.allStations = JSON.parse(DataProvider.allStationsJSON);

                    if (DataProvider.allStations !== undefined && DataProvider.allStations != null) _jsonDataStorage2.default.pushAllStations(DataProvider.allStationsJSON);
                    DataProvider.allStationsLoaded = true;
                    console.log("Stations loaded from server.");
                } else {
                    DataProvider.allStations = JSON.parse(DataProvider.allStationsJSON);
                    DataProvider.allStationsLoaded = true;
                    console.log("Stations loaded from localStorage.");
                }
            }

            if (!DataProvider.allRoutesLoaded) {
                if (DataProvider.allRoutesJSON == null) {
                    console.log("Downloading routes from server...");

                    var _response = await fetch(_config2.default.apiGetRoutesUrl);
                    DataProvider.allRoutesJSON = await _response.text();
                    DataProvider.allRoutes = JSON.parse(DataProvider.allRoutesJSON);

                    if (DataProvider.allRoutes !== undefined && DataProvider.allRoutes != null) _jsonDataStorage2.default.pushAllRoutes(DataProvider.allRoutesJSON);
                    DataProvider.allRoutesLoaded = true;
                    console.log("Routes loaded from server.");
                } else {
                    DataProvider.allRoutes = JSON.parse(DataProvider.allRoutesJSON);
                    DataProvider.allRoutesLoaded = true;
                    console.log("Routes loaded from localStorage.");
                }
            }

            if (!DataProvider.allTimetablesLoaded) {
                if (DataProvider.allTimetablesJSON == null) {
                    console.log("Downloading timetables from server...");

                    var _response2 = await fetch(_config2.default.apiGetTimetablesUrl);
                    DataProvider.allTimetablesJSON = await _response2.text();
                    DataProvider.allTimetables = JSON.parse(DataProvider.allTimetablesJSON);

                    if (DataProvider.allTimetables !== undefined && DataProvider.allTimetables != null) _jsonDataStorage2.default.pushAllTimetables(DataProvider.allTimetablesJSON);
                    DataProvider.allTimetablesLoaded = true;
                    console.log("Timetables loaded from server.");
                } else {
                    DataProvider.allTimetables = JSON.parse(DataProvider.allTimetablesJSON);
                    DataProvider.allTimetablesLoaded = true;
                    console.log("Timetables loaded from localStorage.");
                }
            }
        }
    }]);

    return DataProvider;
}();

DataProvider.allStations = null;
DataProvider.allRoutes = null;
DataProvider.allTimetables = null;
DataProvider.loadingStarted = false;
DataProvider.allStationsLoaded = false;
DataProvider.allRoutesLoaded = false;
DataProvider.allTimetablesLoaded = false;
DataProvider.allStationsJSON = null;
DataProvider.allRoutesJSON = null;
DataProvider.allTimetablesJSON = null;
exports.default = DataProvider;