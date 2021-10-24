import { Vocabulary, Word, Test, DATA_FIELDS } from "./Types";
import { WordImpl } from './WordImpl';

class VocabularyImpl implements Vocabulary {
    id: string;
    DATA_A: WordImpl;
    DATA_B: WordImpl;
    description: WordImpl;
    chapter: string;
    bidirectional: boolean;

    constructor(vocabulary: Vocabulary, startTime: number) {
        this.id = vocabulary.id;
        this.DATA_A = new WordImpl(vocabulary.DATA_A, startTime);
        this.DATA_B = new WordImpl(vocabulary.DATA_B, startTime);
        this.description = new WordImpl(vocabulary.description, startTime);
        this.chapter = vocabulary.chapter;
        this.bidirectional = vocabulary.bidirectional;
    }

    getTests(wrapUpMode: boolean): Test[] {
        const tests: Test[] = [];

        // in WrapUpMode only vocabularies are returned which where answered wrong


        if (!(this.wasLastTestSuccessful("DATA_A") && wrapUpMode)) {
            tests.push({ questionFor: "DATA_A", answerFor: "DATA_B", vocabulary: this, rating: this.DATA_A.getRating() });
        }
        if (this.bidirectional) {
            if (!(this.wasLastTestSuccessful("DATA_B") && wrapUpMode)) {
                tests.push({ questionFor: "DATA_B", answerFor: "DATA_A", vocabulary: this, rating: this.DATA_B.getRating() });
            }
        }
        return tests;
    }

    wasLastTestSuccessful(field: string): boolean {
        return (this[field] as WordImpl).wasLastTestSuccessful();
    }


}

export { VocabularyImpl };