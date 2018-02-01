"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    apiPublicTransportServer: "https://public-transport-api-server.herokuapp.com/",

    apiGetStationsUrl: "https://optimalway.github.io/json/stations_minsk_grodno.json?v=01022018", //"stations" minsk + grodno
    apiGetRoutesUrl: "https://optimalway.github.io/json/routes_minsk_grodno.json?v=01022018", //"routes" minsk + grodno
    apiGetTimetablesUrl: "https://optimalway.github.io/json/timetables_minsk_grodno.json?v=01022018", //"timetables" minsk + grodno

    //apiGetStationsUrl: "https://optimalway.github.io/json/stations.json?v=15012018", //"stations"
    //apiGetRoutesUrl: "https://optimalway.github.io/json/routes.json?v=15012018", //"routes"
    //apiGetTimetablesUrl: "https://optimalway.github.io/json/timetables.json?v=15012018", //"timetables"

    clientVsSwNoKillingMessageInterval: 30000
};