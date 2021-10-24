

import { PersistentSystem } from "./PersistentSystem";
import { VocabularyCollection, Vocabulary, Lesson, User, Test, Word, DATA_FIELDS, TIME_FIELDS } from '../types/Types';
import { VocabularyCalculator } from './VocabularyCalculator';
import { Util } from "../js_lib/Util";
import * as simpleGit from 'simple-git/promise';
import { VocabularyImpl } from "../types/VocabularyImpl";

const path = require('path');
const fs = require('fs');






/**
 *This interface extends User to provide a dictionary to access the used vocabularies in an easier way
 *
 * @interface ExtendedUser
 * @extends {User}
 */
interface InternalUser extends User {
    vocabularyMap: Map<string, Vocabulary>;

}


class PersistentFileSystem implements PersistentSystem {



    // id: vocabulary
    private vocabularies: Map<string, Vocabulary>;

    private pathVocabularies: string;
    private pathUsers: string;
    private users: Map<string, InternalUser>;

    constructor(directory: string) {

        this.pathVocabularies = path.join(directory, "Vocabularies" + '.json');
        this.vocabularies = this.readVocabularies();

        this.pathUsers = path.join(directory, "Users" + '.json');
        this.users = this.readUsers();

    }


    private readVocabularies(): Map<string, Vocabulary> {
        const vocabulariesDic = new Map<string, Vocabulary>();
        let vocabularies: VocabularyCollection;

        if (fs.existsSync(this.pathVocabularies)) {
            vocabularies = JSON.parse(fs.readFileSync(this.pathVocabularies))
        } else {
            vocabularies = [];
        }



        vocabularies.forEach((vocabulary) => {
            vocabulariesDic.set(vocabulary.id, vocabulary)
        });

        return vocabulariesDic;
    }

    readUsers(): Map<string, InternalUser> {
        const userDic = new Map<string, InternalUser>();
        let users: InternalUser[];

        if (fs.existsSync(this.pathUsers)) {
            users = JSON.parse(fs.readFileSync(this.pathUsers))
        } else {
            users = [{ name: "Sebastian", lessons: [], vocabularies: [], vocabularyMap: new Map() }];
        }

        // Blow up structure
        users.forEach((user) => {
            userDic.set(user.name, user);

            user.vocabularyMap = new Map();
            user.vocabularies.forEach((vocabulary) => {
                user.vocabularyMap.set(vocabulary.id, vocabulary);
            })

        })


        return userDic;
    }

    private writeVocabularies() {
        const json = JSON.stringify(Array.from(this.vocabularies.values()), null, 4);
        fs.writeFileSync(this.pathVocabularies, json);
    }

    private writeUsers() {
        const json = JSON.stringify(Array.from(this.users.values()) as User[], null, 4);
        fs.writeFileSync(this.pathUsers, json);
    }

    getVocabulariesOfChapter(chapter: string): VocabularyCollection {
        const vocabularies: VocabularyCollection = [];

        Array.from(this.vocabularies.values()).forEach((vocabulary) => {
            if (vocabulary.chapter === chapter) {
                vocabularies.push(vocabulary);
            }
        });

        return vocabularies;
    }

    getVocabulariesOfLesson(user: string, lesson: string, time: number): VocabularyCollection {
        const vocabularies: VocabularyCollection = [];
        let finalLesson: Lesson = null;

        const userEntry = this.getUser(user);

        // Search lesson
        if (null != userEntry) {
            for (const lessonEntry of userEntry.lessons) {
                if (lessonEntry.name === lesson) {
                    finalLesson = lessonEntry;
                    break;
                }
            }
        }

        // found lesson?
        if (null != finalLesson) {
            finalLesson.ids.forEach((id) => {

                // Make a clone because time history shall be modified
                const vocabularyClone = new VocabularyImpl(userEntry.vocabularyMap.get(id), time);
                vocabularies.push(vocabularyClone);
            })
        }
        return vocabularies;
    }


    getTests(user: string, lesson: string, number: number, wrapUpMode: boolean, startTime: number): Test[] {
        const vocabularies = this.getVocabulariesOfLesson(user, lesson, startTime);
        const calculator = new VocabularyCalculator(vocabularies, startTime);
        return calculator.getTests(number, wrapUpMode);
    }

    /**
     *
     *
     * @param {string} user
     * @param {Test} test
     * @param {boolean} correct. In case of cheated, null is overtaken
     * @returns {Test}
     * @memberof PersistentFileSystem
     */
    updateTest(user: string, test: Test, correct: boolean): Test {
        const userEntry = this.getUser(user);
        const vocabulary = userEntry.vocabularyMap.get(test.vocabulary.id);
        const word = vocabulary[test.questionFor] as Word;
        const time = (new Date()).getTime();
        if (correct == null) {
            if (word.cheatTime === undefined) {
                word.cheatTime = [];
            }
            word.cheatTime.push(time);
        } else if (correct) {
            if (word.trueTimes === undefined) {
                word.trueTimes = [];
            }
            word.trueTimes.push(time);
        } else {
            if (word.falseTime === undefined) {
                word.falseTime = [];
            }
            word.falseTime.push(time);
        }

        this.writeUsers();



        test.vocabulary = vocabulary;

        return test;



    }

    getVocabulary(lngIdx: number, vocabulary: string): Vocabulary {
        throw new Error("Method not implemented.");
    }

    addVocabularies(vocabularies: VocabularyCollection): VocabularyCollection {


        const time = (new Date()).getTime();
        let ctr = 0;

        vocabularies.forEach((vocabulary) => {
            if (vocabulary.id === "-1") {

                vocabulary.id = "" + time + "_" + ctr++;
                this.vocabularies.set(vocabulary.id, vocabulary);
            }
        })



        this.writeVocabularies();
        return Array.from(this.vocabularies.values());
    }

    updateVocabulariesOfLesson(user: string, lessonName: string, vocabularies: VocabularyCollection): VocabularyCollection {
        const userEntry = this.getUser(user);

        // Find existing lesson
        let existingLesson: Lesson = null;
        userEntry.lessons.forEach((lesson) => {
            if (lesson.name === lessonName) {
                existingLesson = lesson;
            }
        });

        // Delete existing lesson
        if (null != existingLesson) {
            const index = userEntry.lessons.indexOf(existingLesson);
            userEntry.lessons.splice(index, 1);
        }

        // Extend vocabularies
        const ids: string[] = [];
        vocabularies.forEach((vocabulary) => {
            const id = vocabulary.id;
            if (userEntry.vocabularyMap.has(id)) {
                // Vocabulary already known by the user
            } else {
                userEntry.vocabularies.push(vocabulary);
                userEntry.vocabularyMap.set(id, vocabulary);
            }
            ids.push(id);
        })

        // Create new lesson
        const newLesson: Lesson = {
            name: lessonName,
            ids: ids
        }

        // Embed new lesson
        userEntry.lessons.push(newLesson);

        // Write database
        this.writeUsers();

        return vocabularies;

    }
    updateVocabulary(vocabulary: Vocabulary): Vocabulary {
        throw new Error("Method not implemented.");
    }
    deRegister(vocabulary: Vocabulary, session: string): void {
        throw new Error("Method not implemented.");
    }

    getUsers(): User[] {
        return Array.from(this.users.values());
    }

    updateUser(user: InternalUser): User {
        this.users.set(user.name, user);
        this.writeUsers();
        return user;
    }

    getChapters(): string[] {
        const chapters = new Set<string>();
        this.vocabularies.forEach((value, key) => {
            chapters.add(value.chapter);
        });
        return Array.from(chapters);
    }

    getUsersName(): string[] {
        return Object.keys(this.users);
    }

    getUser(name: string): InternalUser {

        let user = this.users.get(name);
        if (user === undefined) {
            user = { name: name, lessons: [], vocabularies: [], vocabularyMap: new Map() };
            this.users.set(name, user);

        }
        return user;
    }

    getLessons(name: string): string[] {

        const lessons = [];

        const user = this.getUser(name);
        user.lessons.forEach((lesson) => {
            lessons.push(lesson.name)
        });

        return lessons;
    }

    deleteTrainingDay(user: string, dayToDelete: string): VocabularyCollection {
        const finalLesson: Lesson = null;

        const userEntry = this.getUser(user);

        if (null !== userEntry) {
            userEntry.vocabularies.forEach((vocabulary) => {
                DATA_FIELDS.forEach((field) => {
                    const dataField = vocabulary[field] as Word;
                    TIME_FIELDS.forEach((timeKey) => {
                        const timeSerial = dataField[timeKey] as number[];
                        if (undefined !== timeSerial) {
                            for (let i = timeSerial.length - 1; i >= 0; i--) {
                                const runningDateString = new Intl.DateTimeFormat('de-DE').format(new Date(timeSerial[i]));

                                if (dayToDelete === runningDateString) {
                                    timeSerial.splice(i, 1);
                                }
                            }
                        }
                    });
                });

            });
        }

        // Save the changes into the database
        this.writeVocabularies();

        return userEntry.vocabularies;
    }

    cleanUpDatabase(): VocabularyCollection {

        const idsToDelete: Set<string> = new Set();

        this.vocabularies.forEach((vocabulary: Vocabulary, id: string) => {
            DATA_FIELDS.forEach((field) => {
                if (vocabulary[field] == undefined //
                    || vocabulary[field].word == undefined //
                    || vocabulary[field].word.length == 0) {
                    idsToDelete.add(id);

                }
            });

        });

        this.deleteIds(idsToDelete);



        return Array.from(this.vocabularies.values());
    }

    deleteChapter(chapter: string): VocabularyCollection {
        const idsToDelete: Set<string> = new Set();

        this.vocabularies.forEach((vocabulary: Vocabulary, id: string) => {

            if (vocabulary.chapter === chapter) {
                idsToDelete.add(id);
            }
        });

        this.deleteIds(idsToDelete);

        return Array.from(this.vocabularies.values());

    }



    private deleteIds(idsToDelete: Set<string>) {
        idsToDelete.forEach((id: string) => {
            console.log(this.vocabularies.get(id));

            this.vocabularies.delete(id);
            // Go through all lessons and delete references to this vocabulary
            this.users.forEach((user: InternalUser, name: string) => {
                // Go through all lessons and delete id
                user.lessons.forEach((lesson) => {
                    Util.deleteElementFromArray(lesson.ids, id);
                });
                // Go through all user's assigned vocabularies and delete them
                const usersVocabulary = user.vocabularyMap.get(id);
                if (usersVocabulary !== undefined) {
                    Util.deleteElementFromArray(user.vocabularies, usersVocabulary);
                    user.vocabularyMap.delete(id);
                }
            });
        });

        // Save the changes into the database
        this.writeVocabularies();
        this.writeUsers();
    }

    commitGit(): void {
        const git = simpleGit('.');
        git.add('./*');
        git.commit((new Date()).toLocaleString());
    }







}

export { PersistentFileSystem };