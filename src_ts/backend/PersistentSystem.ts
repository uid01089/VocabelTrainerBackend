import { VocabularyCollection, Vocabulary, User, Test } from '../types/Types';

interface PersistentSystem {
    commitGit();
    deleteChapter(chapter: string): VocabularyCollection;
    cleanUpDatabase(): VocabularyCollection;
    deleteTrainingDay(user: string, dayToDelete: string): VocabularyCollection;
    updateTest(user: string, test: Test, correct: boolean): Test;
    getTests(user: string, lesson: string, number: number, wrapUpMode: boolean, startTime: number): Test[];
    updateVocabulariesOfLesson(user: string, lesson: string, vocabularies: any): VocabularyCollection;
    getVocabulariesOfLesson(user: string, lesson: string, time: number): VocabularyCollection;
    getLessons(user: string): string[];
    getUsersName(): string[];
    getUser(name: string): User;
    getChapters(): string[];
    updateUser(user: User);
    getUsers(): User[];
    getVocabulariesOfChapter(chapter: string): VocabularyCollection;
    getVocabulary(lngIdx: number, vocabulary: string): Vocabulary;
    addVocabularies(vocabularies: VocabularyCollection): VocabularyCollection;
    updateVocabulary(vocabulary: Vocabulary): Vocabulary;
    deRegister(vocabulary: Vocabulary, session: string);
}

export { PersistentSystem }
