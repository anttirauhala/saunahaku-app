import { ISauna } from "../models/SaunaInterfaces";

/**
 * Builds the URL of the sauna list endpoint from the Vite environment.
 *
 * `VITE_BACKEND_HOST` is either a plain host (development, a local backend) or
 * a complete endpoint URL (production, API Gateway). `VITE_BACKEND_PORT` and
 * `VITE_API_PATH` are appended only when they are set, so an empty pair leaves
 * the production URL untouched and the `/list` suffix is only added in
 * development.
 */
export const getBackendUrl = (): string => {
    const srv = import.meta.env.VITE_BACKEND_HOST;
    const port = import.meta.env.VITE_BACKEND_PORT;
    const apiPath = import.meta.env.VITE_API_PATH;

    return `${srv}${port ? ":" + port : ""}${apiPath ? apiPath + "/list" : ""}`;
};

export const convertWeekday = (weekday: string): string => {
    switch (weekday) {
        case "MONDAY":
            return "Maanantai";
        case "TUESDAY":
            return "Tiistai";
        case "WEDNESDAY":
            return "Keskiviikko";
        case "THURSDAY":
            return "Torstai";
        case "FRIDAY":
            return "Perjantai";
        case "SATURDAY":
            return "Lauantai";
        case "SUNDAY":
            return "Sunnuntai";
        default:
            return "Ei tiedossa";
    }
}

export const convertPriceType = (priceType: string): string => {
    switch (priceType) {
        case "ADULT":
            return "Aikuinen";
        case "CHILD":
            return "Lapsi";
        case "PENSIONER":
            return "Eläkeläinen";
        case "CONSRIPT":
            return "Varusmies";
        case "STUDENT":
            return "Opiskelija";
        case "UNEMPLOYED":
            return "Työtön";
        default:
            return "Ei tiedossa";
    }
}

export const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

export const formatPrice = (price: number): string => {
    return price % 1 === 0 ? `${price}` : `${price.toFixed(2)}`;
};

export const formatTemperature = (temperature: number): string => {
    return temperature.toLocaleString("fi-FI", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    });
};

export const getCurrentWeekday = (): string => {
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const today = new Date();
    return days[today.getDay()].toUpperCase();
};

const parseTimeToMinutes = (time: string): number | null => {
    if (!time) {
        return null;
    }
    const [hours, minutes] = time.split(":").map((part) => Number.parseInt(part, 10));
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
    }
    return hours * 60 + minutes;
};

/**
 * Returns true when the sauna has an opening hour entry for the current
 * weekday and the current time falls inside that opening window.
 * Supports opening windows that continue past midnight.
 */
export const isSaunaOpenNow = (sauna: ISauna): boolean => {
    const currentWeekday = getCurrentWeekday();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return sauna.openingHours.some((oh) => {
        if (oh.weekday !== currentWeekday) {
            return false;
        }
        const opening = parseTimeToMinutes(oh.openingTime);
        const closing = parseTimeToMinutes(oh.closingTime);
        if (opening === null || closing === null) {
            return false;
        }
        if (closing <= opening) {
            // Opening window continues past midnight
            return currentMinutes >= opening || currentMinutes < closing;
        }
        return currentMinutes >= opening && currentMinutes < closing;
    });
};

