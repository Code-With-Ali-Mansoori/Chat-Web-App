export const handle_Time_in_HR = (time : Date | string) => {
    const formatted = new Date(time).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase();

    return formatted;
};
