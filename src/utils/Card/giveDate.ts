export const giveDate = (encoded: string) => {
    const date = new Date(encoded);
    // const currentDate = new Date()
    // console.log(currentDate-date)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = date.getFullYear();
    const monthIndex = date.getMonth(); // Month index (0 - 11)
    const monthName = months[monthIndex];
    const day = date.getDate();
    return `${monthName} ${day}, ${year}`;
}