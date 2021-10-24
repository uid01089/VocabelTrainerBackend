

const DATA_FIELDS = ['DATA_A', 'DATA_B'];
const TIME_FIELDS = ['trueTimes', 'falseTime', 'cheatTime'];

interface User {
    name: string;
    lessons: Lesson[];
    vocabularies: VocabularyCollection
}



interface Lesson {
    name: string;
    ids: string[];

}


interface Word {
    word: string;
    language: string;
    addendum: string;
    trueTimes?: number[];
    falseTime?: number[];
    cheatTime?: number[];

}

interface Test {
    questionFor: string;
    answerFor: string;
    vocabulary: Vocabulary;
    rating: number;
}

interface Vocabulary {
    id: string;
    bidirectional: boolean;
    DATA_A: Word;
    DATA_B: Word;
    description: Word;
    chapter: string;

}
type VocabularyCollection = Vocabulary[];



export { VocabularyCollection, Vocabulary, Word, User, Lesson, Test, DATA_FIELDS, TIME_FIELDS };


