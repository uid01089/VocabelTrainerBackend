import { VocabularyCollection } from "./Types";
import { VocabularyImpl } from "./VocabularyImpl";

class VocabularyCollectionImpl {
    vocabularyCollection: VocabularyImpl[] = [];

    constructor(vocabularyCollection: VocabularyCollection, startTime: number) {
        vocabularyCollection.forEach((vocabulary) => {
            this.vocabularyCollection.push(new VocabularyImpl(vocabulary, startTime));
        });
    }

    getVocabularyCollection(): VocabularyCollection {

        const vocabularyCollection: VocabularyCollection = [];

        this.vocabularyCollection.forEach((vocabulary) => {
            vocabularyCollection.push(vocabulary);
        })

        return vocabularyCollection;
    }



}

export { VocabularyCollectionImpl };