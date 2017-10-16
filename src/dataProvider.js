import JsonDataStorage from './jsonDataStorage';
import initialize from 'public-transport-initialize-data';
import ApiConfig from './config';

export default class DataProvider {
    static allStations = null;
    static allRoutes = null;
    static allTimetables = null;

    //static updatingFromServerInterval = 5000;

    static loadingStarted = false;

    static allStationsLoaded = false;
    static allRoutesLoaded = false;
    static allTimetablesLoaded = false;
    static allStationsJSON = null;
    static allRoutesJSON = null;
    static allTimetablesJSON = null;

    static getAllStations() {
        return DataProvider.allStations;
    }
    static getAllRoutes() {
        return DataProvider.allRoutes;
    }
    static getAllTimetables() {
        return DataProvider.allTimetables;
    }
    static getAllStationsJSON() {
        return DataProvider.allStationsJSON;
    }
    static getAllRoutesJSON() {
        return DataProvider.allRoutesJSON;
    }
    static getAllTimetablesJSON() {
        return DataProvider.allTimetablesJSON;
    }
    static async loadDataAndInitialize() {
        if(!DataProvider.loadingStarted){
            DataProvider.loadingStarted = true;

            await DataProvider.loadDataOnly();

            if (DataProvider.allStationsLoaded && DataProvider.allRoutesLoaded && DataProvider.allTimetablesLoaded) {
                initialize(DataProvider.allStations, DataProvider.allRoutes, DataProvider.allTimetables);
            }
        }
    }
    static async loadDataOnly() {
        DataProvider.allStationsJSON = JsonDataStorage.getAllStations();
        DataProvider.allRoutesJSON = JsonDataStorage.getAllRoutes();
        DataProvider.allTimetablesJSON = JsonDataStorage.getAllTimetables();

        (async function() {    
            if(!DataProvider.allStationsLoaded){
                const startLoadingStationsTime = Date.now();
                if (DataProvider.allStationsJSON == null) {
                    console.log("Downloading stations from server...");

                    let response = await fetch(ApiConfig.apiGetStationsUrl);
                    DataProvider.allStationsJSON = await response.text();
                    DataProvider.allStations = JSON.parse(DataProvider.allStationsJSON);

                    if (DataProvider.allStations != null) JsonDataStorage.pushAllStations(DataProvider.allStationsJSON);
                    DataProvider.allStationsLoaded = true;
                    console.log("Stations loaded from server. Time = "+(Date.now() - startLoadingStationsTime) + "ms.");
                }
                else {
                    DataProvider.allStations = JSON.parse(DataProvider.allStationsJSON);
                    DataProvider.allStationsLoaded = true;
                    console.log("Stations loaded from localStorage. Time = "+(Date.now() - startLoadingStationsTime) + "ms.");
                }
            }
        })();

        (async function() {  
            if(!DataProvider.allRoutesLoaded){
                const startLoadingRoutesTime = Date.now();
                if (DataProvider.allRoutesJSON == null) {
                    console.log("Downloading routes from server...");

                    let response = await fetch(ApiConfig.apiGetRoutesUrl);
                    DataProvider.allRoutesJSON = await response.text();
                    DataProvider.allRoutes = JSON.parse(DataProvider.allRoutesJSON);

                    if (DataProvider.allRoutes != null) JsonDataStorage.pushAllRoutes(DataProvider.allRoutesJSON);
                    DataProvider.allRoutesLoaded = true;
                    console.log("Routes loaded from server. Time = " + (Date.now() - startLoadingRoutesTime) + "ms.");
                }
                else {
                    DataProvider.allRoutes = JSON.parse(DataProvider.allRoutesJSON);
                    DataProvider.allRoutesLoaded = true;
                    console.log("Routes loaded from localStorage. Time = " + (Date.now() - startLoadingRoutesTime) + "ms.");
                }
            }
        })();

        (async function() {  
            if(!DataProvider.allTimetablesLoaded){
                const startLoadingTimetablesTime = Date.now();
                if (DataProvider.allTimetablesJSON == null) {
                    console.log("Downloading timetables from server...");

                    let response = await fetch(ApiConfig.apiGetTimetablesUrl);
                    DataProvider.allTimetablesJSON = await response.text();
                    DataProvider.allTimetables = JSON.parse(DataProvider.allTimetablesJSON);

                    if (DataProvider.allTimetables != null) JsonDataStorage.pushAllTimetables(DataProvider.allTimetablesJSON);
                    DataProvider.allTimetablesLoaded = true;
                    console.log("Timetables loaded from server. Time = " + (Date.now() - startLoadingTimetablesTime) + "ms.");
                }
                else {
                    DataProvider.allTimetables = JSON.parse(DataProvider.allTimetablesJSON);
                    DataProvider.allTimetablesLoaded = true;
                    console.log("Timetables loaded from localStorage. Time = " + (Date.now() - startLoadingTimetablesTime) + "ms.");
                }
            }
        })();
    }
}