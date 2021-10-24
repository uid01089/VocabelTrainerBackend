import { Word } from './Types';

const PUNISHMENT = 1000;
const PUNISHMENT_CHEAT = 1000;
const PUNISHMENT_TRUE_FALSE = 1000;

class WordImpl implements Word {

    word: string;
    addendum: string;
    language: string;
    trueTimes?: number[];
    falseTime?: number[];
    cheatTime?: number[];


    constructor(word: Word, startTime: number) {
        this.word = word.word;
        this.addendum = word.addendum;
        this.language = word.language;
        this.trueTimes = this.limitTimeSequence(word.trueTimes, startTime);
        this.falseTime = this.limitTimeSequence(word.falseTime, startTime);
        this.cheatTime = this.limitTimeSequence(word.cheatTime, startTime);

    }



    wasLastTestSuccessful(): boolean {


        const falseTimeArray = this.getNormalizedArray(this.falseTime);
        const trueTimeArray = this.getNormalizedArray(this.trueTimes);

        const falseTime = falseTimeArray[falseTimeArray.length - 1];
        const trueTime = trueTimeArray[trueTimeArray.length - 1];

        return (trueTime > falseTime);
    }


    getRating(): number {

        let rating = 0;
        const time = (new Date()).getTime();
        const wasSuccessful = this.wasLastTestSuccessful();

        const falseTimeArray = this.getNormalizedArray(this.falseTime);
        const trueTimeArray = this.getNormalizedArray(this.trueTimes);

        const falseTime = falseTimeArray[falseTimeArray.length - 1];
        const trueTime = trueTimeArray[trueTimeArray.length - 1];



        if (wasSuccessful) {

            rating = time - trueTime;
            rating = rating + this.calcPunishment() * PUNISHMENT_TRUE_FALSE;
            rating = rating + this.calcPunishmentCheat() * PUNISHMENT_CHEAT;

        } else {
            rating = time - falseTime + PUNISHMENT;
        }
        return rating;

    }

    calcPunishment(): number {
        let ratioFalseTrue = 0;

        if (this.falseTime === undefined || this.falseTime === null || this.falseTime.length === 0) {
            ratioFalseTrue = 0;
        } else {
            if (this.trueTimes === undefined || this.trueTimes === null || this.trueTimes.length === 0) {
                ratioFalseTrue = 1;
            } else {
                ratioFalseTrue = this.falseTime.length / (this.trueTimes.length + this.falseTime.length);
            }
        }

        return ratioFalseTrue;
    }

    calcPunishmentCheat(): number {
        let ratioCheatTrue = 0;

        if (this.cheatTime === undefined || this.cheatTime === null || this.cheatTime.length === 0) {
            ratioCheatTrue = 0;
        } else {
            if (this.trueTimes === undefined || this.trueTimes === null || this.trueTimes.length === 0) {
                ratioCheatTrue = 1;
            } else {
                ratioCheatTrue = this.cheatTime.length / (this.trueTimes.length + this.cheatTime.length);
            }
        }

        return ratioCheatTrue;
    }

    /**
     *Returns all time stamps which are after the startTime or undefined
     *
     * @param {number[]} timeSequence
     * @param {number} startTime
     * @returns {number[]}
     * @memberof WordImpl
     */
    private limitTimeSequence(timeSequence: number[], startTime: number): number[] {
        let filterTimeSerial: number[] = undefined;

        if (timeSequence !== undefined && timeSequence !== null && timeSequence.length > 0) {
            const filterTimeSerial1 = [];
            timeSequence.forEach((timeStamp) => {
                if (timeStamp >= startTime) {
                    filterTimeSerial1.push(timeStamp);
                }
            });

            // in case there are really values existing, copy them into the returned collection, otherwise 
            // return undefined (needed as indicator that no values are existing)
            if (filterTimeSerial1.length != 0) {
                filterTimeSerial = filterTimeSerial1;
            }
        }



        return filterTimeSerial;
    }

    /**
     * This operation return an array with 0 in case the array is undefined or empty
     *
     * @param {number[]} uncheckedArray
     * @returns {number[]}
     * @memberof WordImpl
     */
    private getNormalizedArray(uncheckedArray: number[]): number[] {
        let normalizedArray = [0];

        if (uncheckedArray !== undefined && uncheckedArray != null && uncheckedArray.length > 0) {
            normalizedArray = uncheckedArray;
        }

        return normalizedArray;

    }




}
export { WordImpl };