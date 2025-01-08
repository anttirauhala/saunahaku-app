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

const newSaunas = ['1989995a-a625-4697-810f-db5b8ab55686', '0fb39581-d4b6-472f-851c-d43b770b1325']

export const isNewSauna = (id: string): boolean => newSaunas.includes(id)

