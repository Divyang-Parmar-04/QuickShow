function dateFormat(dateTime) {
    const date = new Date(dateTime);

    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });         // Tue
    const month = date.toLocaleDateString('en-US', { month: 'long' });              // November
    const day = date.getDate();                                                     // 11
    const time = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });                                                                             // 2:30 PM

    return `${weekday}, ${month} ${day} at ${time}`;
}

export default dateFormat;
