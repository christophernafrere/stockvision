export const DayList = [
    {
        full: "Dimanche",
        abbreged: "Di",
    },
    {
        full: "Lundi",
        abbreged: "Lu",
    },
    {
        full: "Mardi",
        abbreged: "Ma",
    },
    {
        full: "Mercredi",
        abbreged: "Me",
    },
    {
        full: "Jeudi",
        abbreged: "Je",
    },
    {
        full: "Vendredi",
        abbreged: "Ve",
    },
    {
        full: "Samedi",
        abbreged: "Sa",
    },
];

export function getTimeDifference(target: Date) {
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return {
        hours,
        minutes,
        milliseconds: difference,
    };
}

export function formatHour(date: Date) {
    return date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
