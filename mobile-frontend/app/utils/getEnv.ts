import Constants from "expo-constants";

let API_URL: string;

if (Constants.expoConfig == null || Constants.expoConfig.extra == null) {
    API_URL = "http://localhost:3000";
} else {
    API_URL = Constants.expoConfig.extra.API_URL || "http://localhost:3000";
}

export { API_URL };
