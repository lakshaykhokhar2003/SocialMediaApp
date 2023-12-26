export const giveDate = (encoded: string) => {
    const date = new Date(encoded);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];
    const day = date.getDate();
    return `${monthName} ${day}, ${year}`;
}

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
