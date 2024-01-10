const random_color = () => {
    const colors = [
        "green",
        "pink",
        "yellow",
        "red",
        "purple",
        "blue",
        "orange",
    ];
    return `var(--${colors.at(Math.floor(Math.random() * colors.length-1) + 1)})`;
};
const animate_text = (event: any, value: String) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ12";
    let iterations = 0;
    const interval = setInterval(() => {
        event.target.innerText = event.target.innerText.split("").map((letter: String, index: number) => {
            letter;
            if (index < iterations) {
                return value[index]
            }
            return letters[Math.floor(Math.random() * 26)]
        }).join("")
        if (iterations >= value.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30)

}
export {
    random_color,
    animate_text
}