/**
 *  Copyright 2019 superxrb <superxrb@163.com>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import * as C from "./Abstracts";
import { EventEmitter } from "events";

export enum ETaskState {
    IDLE,
    RUNNING,
    STOPPING
}

export interface ITaskRun {
    start(): Promise<void>;

    stop(): void;

    getState(): ETaskState;
}

export abstract class AbstractTask extends EventEmitter implements ITaskRun {
    public task: C.ITaskOptions;
    protected state: ETaskState;
    protected actives: number;
    public constructor(task: C.ITaskOptions) {

        super();

        this.task = task;

        this.state = ETaskState.IDLE;

        this.actives = 0;
    }

    public async start() {

        if (this.state !== ETaskState.IDLE) {

            return;
        }

        this.state = ETaskState.RUNNING;

        return this.run();
    }

    protected async waitExec() {

        return new Promise((resolve, reject) => {

            this.task.execute(this.task.args, (e: unknown) => {

                if (e) {

                    return reject(e as any);
                }

                return resolve();
            });

        });
    }

    public stop() {

        this.state = ETaskState.STOPPING;
    }

    public getState() {

        return this.state;
    }

    public abstract run(): Promise<void>;
}
