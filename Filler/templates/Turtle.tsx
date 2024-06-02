class Turtle {
    static readonly HAPPINESS_DEAD = 0;
    static readonly HAPPINESS_INIT = 100;
    public name: string;
    public value: number;

    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
        console.log(this.value);
    }

    isHappy() : boolean {
        console.log("isHappy called");
        return (
            this.value > Turtle.HAPPINESS_DEAD
        );
    }

    play() {
        console.log('play called');
        this.value += 20;
    }
}

export default Turtle;