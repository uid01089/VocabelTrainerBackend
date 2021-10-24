class Util {

    /**
     * See https://stackoverflow.com/questions/31001901/how-to-count-the-number-of-zero-decimals-in-javascript
     * 
     *
     * @static
     * @param {number} number
     * @returns {number} Counted numbers of zero decimals in javascript
     * 
     * 0.00001 > 4
     * 0.000015 > 4
     * 0.0000105 > 4
     * 0.001 > 2
     * @memberof Util
     */
    public static getNumberOfDigitsAfterComma(num: number): number {
        const m = -Math.floor(Math.log(num) / Math.log(10) + 1);
        return m;
    }



    public static string2float(input: string | number): number {
        const stringInput = (input == null ? "0" : input.toString().replace(/,/g, '.'));

        const number = parseFloat(stringInput);
        return number;
    }

    /**
     * Return a string with 0 in front (if needed to fill to length). Length of string is l
     * @param number 
     * @param length
     */
    public static zeroPad(number: number, length: number): string {
        let r = number.toString();
        while (r.length < length) {
            r = '0' + r;
        }
        return r;
    }

    /**
     *Returns the Time as string
     *
     * @static
     * @param {Date} date
     * @returns {string}
     * @memberof Util
     */
    public static timeAsString(date: Date): string {
        return `${Util.zeroPad(date.getHours() - 1, 2)}:${Util.zeroPad(date.getMinutes(), 2)}:${Util.zeroPad(date.getSeconds(), 2)}`
    }

    public static isScrolledIntoView(elementToCheck: HTMLElement, container: HTMLElement): boolean {
        const rect = elementToCheck.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        // Only completely visible elements return true:
        const isVisible = (elemTop >= 0) && (elemBottom <= container.clientHeight);
        // Partially visible elements return true:
        //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
        return isVisible;
    }

    public static cloneObject<T>(obj: T): T {
        const clone = Object.create(Object.getPrototypeOf(obj));

        for (const i in obj) {
            if ((obj[i] != null) && (typeof (obj[i]) === "object"))
                clone[i] = Util.cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
    }

    public static async wait(ms: number): Promise<any> {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    public static round(zahl: number, n_stellen: number): number {

        //https://www.tutorials.de/threads/math-round-objekt-2-nachkommastellen.209005/
        return (Math.round(zahl * n_stellen) / n_stellen);

    }


    // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
    public static hashCode(string: string): number {
        let hash = 0, i, chr;
        if (string.length === 0) return hash;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // Durstenfeld shuffle
    public static shuffleArray<T>(array: Array<T>): void {
        for (let numberShuffle = 0; numberShuffle < 3; numberShuffle++) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];

            }
        }
    }

    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    // Fisher-Yates (aka Knuth) Shuffle
    public static shuffleArray1<T>(array: Array<T>, nrShuffles: number): void {
        for (let i = 0; i < nrShuffles; i++) {
            let currentIndex = array.length;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                const randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                const temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
        }

    }


    //https://stackoverflow.com/questions/500606/deleting-array-elements-in-javascript-delete-vs-splice
    /**
     * This operations deletes an element within an array.
     * @param array  
     * 
     * @param element 
     */
    public static deleteElementFromArray<T>(array: Array<T>, element: T): void {
        const index = array.indexOf(element);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }



}





export { Util };