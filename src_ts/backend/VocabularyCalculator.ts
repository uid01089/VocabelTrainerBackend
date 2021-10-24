
import { VocabularyCollection, Vocabulary, Lesson, User, Test } from '../types/Types';
import { VocabularyImpl } from '../types/VocabularyImpl';
import { Util } from '../js_lib/Util';


class VocabularyCalculator {
    private vocabularies: VocabularyImpl[];

    constructor(vocabularies: VocabularyCollection, startTime: number) {
        this.vocabularies = [];
        vocabularies.forEach((vocabulary) => {
            this.vocabularies.push(new VocabularyImpl(vocabulary, startTime));
        });


    }

    getTests(number: number, wrapUpMode: boolean): Test[] {

        const tests: Test[] = [];
        this.vocabularies.forEach((vocabulary) => {
            vocabulary.getTests(wrapUpMode).forEach((test) => {
                tests.push(test);
            });
        });

        // shuffle (scramble) array
        Util.shuffleArray1(tests, 10);

        const sortedTests = tests.sort((a, b) => { return (b.rating - a.rating) });

        return sortedTests.slice(0, number);

    }
}

export { VocabularyCalculator };