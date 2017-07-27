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

var _jsonDataStorage = require('./jsonDataStorage');

var _jsonDataStorage2 = _interopRequireDefault(_jsonDataStorage);

var _publicTransportInitializeData = require('public-transport-initialize-data');

var _publicTransportInitializeData2 = _interopRequireDefault(_publicTransportInitializeData);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DataProvider = function () {
    function DataProvider() {
        (0, _classCallCheck3.default)(this, DataProvider);
    }

    (0, _createClass3.default)(DataProvider, null, [{
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
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (DataProvider.loadingStarted) {
                                    _context.next = 5;
                                    break;
                                }

                                DataProvider.loadingStarted = true;

                                _context.next = 4;
                                return DataProvider.loadDataOnly();

                            case 4:

                                if (DataProvider.allStationsLoaded && DataProvider.allRoutesLoaded && DataProvider.allTimetablesLoaded) {
                                    (0, _publicTransportInitializeData2.default)(DataProvider.allStations, DataProvider.allRoutes, DataProvider.allTimetables);
                                }

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function loadDataAndInitialize() {
                return _ref.apply(this, arguments);
            }

            return loadDataAndInitialize;
        }()
    }, {
        key: 'loadDataOnly',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
                var response, _response, _response2;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return _jsonDataStorage2.default.getAllStations();

                            case 2:
                                DataProvider.allStationsJSON = _context2.sent;
                                _context2.next = 5;
                                return _jsonDataStorage2.default.getAllRoutes();

                            case 5:
                                DataProvider.allRoutesJSON = _context2.sent;
                                _context2.next = 8;
                                return _jsonDataStorage2.default.getAllTimetables();

                            case 8:
                                DataProvider.allTimetablesJSON = _context2.sent;

                                if (DataProvider.allStationsLoaded) {
                                    _context2.next = 27;
                                    break;
                                }

                                if (!(DataProvider.allStationsJSON == null)) {
                                    _context2.next = 24;
                                    break;
                                }

                                console.log("Downloading stations from server...");

                                _context2.next = 14;
                                return fetch(_config2.default.apiGetStationsUrl);

                            case 14:
                                response = _context2.sent;
                                _context2.next = 17;
                                return response.text();

                            case 17:
                                DataProvider.allStationsJSON = _context2.sent;

                                DataProvider.allStations = JSON.parse(DataProvider.allStationsJSON);

                                if (DataProvider.allStations !== undefined && DataProvider.allStations != null) _jsonDataStorage2.default.pushAllStations(DataProvider.allStationsJSON);
                                DataProvider.allStationsLoaded = true;
                                console.log("Stations loaded from server.");
                                _context2.next = 27;
                                break;

                            case 24:
                                DataProvider.allStations = JSON.parse(DataProvider.allStationsJSON);
                                DataProvider.allStationsLoaded = true;
                                console.log("Stations loaded from localStorage.");

                            case 27:
                                if (DataProvider.allRoutesLoaded) {
                                    _context2.next = 45;
                                    break;
                                }

                                if (!(DataProvider.allRoutesJSON == null)) {
                                    _context2.next = 42;
                                    break;
                                }

                                console.log("Downloading routes from server...");

                                _context2.next = 32;
                                return fetch(_config2.default.apiGetRoutesUrl);

                            case 32:
                                _response = _context2.sent;
                                _context2.next = 35;
                                return _response.text();

                            case 35:
                                DataProvider.allRoutesJSON = _context2.sent;

                                DataProvider.allRoutes = JSON.parse(DataProvider.allRoutesJSON);

                                if (DataProvider.allRoutes !== undefined && DataProvider.allRoutes != null) _jsonDataStorage2.default.pushAllRoutes(DataProvider.allRoutesJSON);
                                DataProvider.allRoutesLoaded = true;
                                console.log("Routes loaded from server.");
                                _context2.next = 45;
                                break;

                            case 42:
                                DataProvider.allRoutes = JSON.parse(DataProvider.allRoutesJSON);
                                DataProvider.allRoutesLoaded = true;
                                console.log("Routes loaded from localStorage.");

                            case 45:
                                if (DataProvider.allTimetablesLoaded) {
                                    _context2.next = 63;
                                    break;
                                }

                                if (!(DataProvider.allTimetablesJSON == null)) {
                                    _context2.next = 60;
                                    break;
                                }

                                console.log("Downloading timetables from server...");

                                _context2.next = 50;
                                return fetch(_config2.default.apiGetTimetablesUrl);

                            case 50:
                                _response2 = _context2.sent;
                                _context2.next = 53;
                                return _response2.text();

                            case 53:
                                DataProvider.allTimetablesJSON = _context2.sent;

                                DataProvider.allTimetables = JSON.parse(DataProvider.allTimetablesJSON);

                                if (DataProvider.allTimetables !== undefined && DataProvider.allTimetables != null) _jsonDataStorage2.default.pushAllTimetables(DataProvider.allTimetablesJSON);
                                DataProvider.allTimetablesLoaded = true;
                                console.log("Timetables loaded from server.");
                                _context2.next = 63;
                                break;

                            case 60:
                                DataProvider.allTimetables = JSON.parse(DataProvider.allTimetablesJSON);
                                DataProvider.allTimetablesLoaded = true;
                                console.log("Timetables loaded from localStorage.");

                            case 63:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function loadDataOnly() {
                return _ref2.apply(this, arguments);
            }

            return loadDataOnly;
        }()
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