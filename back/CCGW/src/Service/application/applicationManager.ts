import * as resp from 'simple-git/typings/response';

const _ = require('lodash');

// https://www.npmjs.com/package/simple-git
import gitP, {SimpleGit} from 'simple-git/promise';

const git: SimpleGit = gitP();

import {
    ASYNC_RESPONSE,
    VERSION,
} from '../../../../../classes/typings/all.typings';
import {Response} from 'simple-git/typings/simple-git';


export class ApplicationManager {


    private static instance: ApplicationManager = new ApplicationManager();

    versionData: VERSION;

    private constructor() {

        this.getBranchName([])
            .then((data: ASYNC_RESPONSE<VERSION>) => {
                this.versionData = data.data;
            })
            .catch((data: ASYNC_RESPONSE<VERSION>) => {

            });

        // this.getDynamicNfzFromWebServer();
    }


    private getBranchName = (requestData: string[]): Promise<ASYNC_RESPONSE<VERSION>> => {
        return new Promise((resolve, reject) => {
            const res: VERSION = {
                name: '',
                lastUpdate: '',
                lastUpdateNumber: 0,
            };
            const promiseBranch: Response<resp.BranchSummary> = git.branch(requestData);

            const promiseShow = git.show(requestData);

            Promise.all([promiseBranch, promiseShow])
                .then((results: any []) => {
                    res.name = results[0].current;
                    const comitDataString: string = results[1];
                    const comitDataStringARR: string[] = comitDataString.split('\n');
                    const index = this.findIndex(comitDataStringARR, 'Date: ');

                    if (index > -1) {
                        const dateString: string = comitDataStringARR[index];
                        const dateIndex = this.findIndex(comitDataStringARR, 'Date: ');

                        const resDateStringFull = dateString.substring(8);
                        const resDateString = dateString.substring(8, dateString.length - 6);

                        const dateNumber = new Date(resDateStringFull).getTime();
                        res.lastUpdate = resDateString;
                        res.lastUpdateNumber = dateNumber;
                    }

                    resolve({success: true, data: res});
                })
                .catch((data) => {
                    console.log(data);
                    res.name = data;
                    reject({success: false, data: res});
                });


        });
    }
    private findIndex = (arr: string[], key: string): number => {

        return arr.findIndex(element => element.startsWith(key));
    };
    // region API functions

    public static getBranchName = ApplicationManager.instance.getBranchName;

    // endregion API functions

}
