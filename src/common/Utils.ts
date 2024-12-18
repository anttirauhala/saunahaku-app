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
