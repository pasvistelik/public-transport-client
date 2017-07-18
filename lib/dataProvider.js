'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _loadDataOnly = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee() {
        var response, _response, _response2;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return _jsonDataStorage2.default.getAllStations();

                    case 2:
                        allStationsJSON = _context.sent;
                        _context.next = 5;
                        return _jsonDataStorage2.default.getAllRoutes();

                    case 5:
                        allRoutesJSON = _context.sent;
                        _context.next = 8;
                        return _jsonDataStorage2.default.getAllTimetables();

                    case 8:
                        allTimetablesJSON = _context.sent;

                        if (allStationsLoaded) {
                            _context.next = 27;
                            break;
                        }

                        if (!(allStationsJSON == null)) {
                            _context.next = 24;
                            break;
                        }

                        //localStorage["allStationsJSON"] === undefined || localStorage["allStationsJSON"] == null
                        console.log("Downloading stations from server...");

                        _context.next = 14;
                        return fetch(_config2.default.apiGetStationsUrl);

                    case 14:
                        response = _context.sent;
                        _context.next = 17;
                        return response.text();

                    case 17:
                        allStationsJSON = _context.sent;

                        allStations = JSON.parse(allStationsJSON); //await response.json();

                        if (allStations !== undefined && allStations != null) _jsonDataStorage2.default.pushAllStations(allStationsJSON); //localStorage["allStationsJSON"] = allStationsJSON;
                        allStationsLoaded = true;
                        console.log("Stations loaded from server.");
                        _context.next = 27;
                        break;

                    case 24:
                        allStations = JSON.parse(allStationsJSON); //localStorage["allStationsJSON"]
                        allStationsLoaded = true;
                        console.log("Stations loaded from localStorage.");

                    case 27:
                        if (allRoutesLoaded) {
                            _context.next = 45;
                            break;
                        }

                        if (!(allRoutesJSON == null)) {
                            _context.next = 42;
                            break;
                        }

                        //localStorage["allRoutesJSON"] === undefined || localStorage["allRoutesJSON"] == null
                        console.log("Downloading routes from server...");

                        _context.next = 32;
                        return fetch(_config2.default.apiGetRoutesUrl);

                    case 32:
                        _response = _context.sent;
                        _context.next = 35;
                        return _response.text();

                    case 35:
                        allRoutesJSON = _context.sent;

                        allRoutes = JSON.parse(allRoutesJSON); //await response.json();

                        if (allRoutes !== undefined && allRoutes != null) _jsonDataStorage2.default.pushAllRoutes(allRoutesJSON); //localStorage["allRoutesJSON"] = allRoutesJSON;
                        allRoutesLoaded = true;
                        console.log("Routes loaded from server.");
                        _context.next = 45;
                        break;

                    case 42:
                        allRoutes = JSON.parse(allRoutesJSON); //localStorage["allRoutesJSON"]
                        allRoutesLoaded = true;
                        console.log("Routes loaded from localStorage.");

                    case 45:
                        if (allTimetablesLoaded) {
                            _context.next = 63;
                            break;
                        }

                        if (!(allTimetablesJSON == null)) {
                            _context.next = 60;
                            break;
                        }

                        //localStorage["allTimetablesJSON"] === undefined || localStorage["allTimetablesJSON"] == null
                        console.log("Downloading timetables from server...");

                        _context.next = 50;
                        return fetch(_config2.default.apiGetTimetablesUrl);

                    case 50:
                        _response2 = _context.sent;
                        _context.next = 53;
                        return _response2.text();

                    case 53:
                        allTimetablesJSON = _context.sent;

                        allTimetables = JSON.parse(allTimetablesJSON); //await response.json();

                        if (allTimetables !== undefined && allTimetables != null) _jsonDataStorage2.default.pushAllTimetables(allTimetablesJSON); //localStorage["allTimetablesJSON"] = allTimetablesJSON;
                        allTimetablesLoaded = true;
                        console.log("Timetables loaded from server.");
                        _context.next = 63;
                        break;

                    case 60:
                        allTimetables = JSON.parse(allTimetablesJSON); //localStorage["allTimetablesJSON"]
                        allTimetablesLoaded = true;
                        console.log("Timetables loaded from localStorage.");

                    case 63:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function _loadDataOnly() {
        return _ref.apply(this, arguments);
    };
}();

var loadData = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2() {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (loadingStarted) {
                            _context2.next = 5;
                            break;
                        }

                        loadingStarted = true;

                        _context2.next = 4;
                        return _loadDataOnly();

                    case 4:

                        if (allStationsLoaded && allRoutesLoaded && allTimetablesLoaded) {
                            (0, _publicTransportInitializeData2.default)(allStations, allRoutes, allTimetables);
                        }

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function loadData() {
        return _ref2.apply(this, arguments);
    };
}();

//loadData();

var _jsonDataStorage = require('./jsonDataStorage');

var _jsonDataStorage2 = _interopRequireDefault(_jsonDataStorage);

var _publicTransportInitializeData = require('public-transport-initialize-data');

var _publicTransportInitializeData2 = _interopRequireDefault(_publicTransportInitializeData);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var allStations = null;
var allRoutes = null;
var allTimetables = null;

//var updatingFromServerInterval = 5000;

var loadingStarted = false;

var allStationsLoaded = false,
    allRoutesLoaded = false,
    allTimetablesLoaded = false;
var allStationsJSON = null,
    allRoutesJSON = null,
    allTimetablesJSON = null;

var DataProvider = function () {
    function DataProvider() {
        (0, _classCallCheck3.default)(this, DataProvider);
    }

    (0, _createClass3.default)(DataProvider, null, [{
        key: 'getAllStations',
        value: function getAllStations() {
            return allStations;
        }
    }, {
        key: 'getAllRoutes',
        value: function getAllRoutes() {
            return allRoutes;
        }
    }, {
        key: 'getAllTimetables',
        value: function getAllTimetables() {
            return allTimetables;
        }
    }, {
        key: 'getAllStationsJSON',
        value: function getAllStationsJSON() {
            return allStationsJSON;
        }
    }, {
        key: 'getAllRoutesJSON',
        value: function getAllRoutesJSON() {
            return allRoutesJSON;
        }
    }, {
        key: 'getAllTimetablesJSON',
        value: function getAllTimetablesJSON() {
            return allTimetablesJSON;
        }
    }, {
        key: 'loadDataAndInitialize',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3() {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return loadData();

                            case 2:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function loadDataAndInitialize() {
                return _ref3.apply(this, arguments);
            }

            return loadDataAndInitialize;
        }()
    }, {
        key: 'loadDataOnly',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4() {
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return _loadDataOnly();

                            case 2:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function loadDataOnly() {
                return _ref4.apply(this, arguments);
            }

            return loadDataOnly;
        }()
    }]);
    return DataProvider;
}();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// End load data.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.default = DataProvider;