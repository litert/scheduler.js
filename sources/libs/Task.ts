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

import * as Abstract from "./Abstracts";
import { getSameOfNeighboringTimeStamp } from "./Utils";
import * as Core from "@litert/core";
import * as I from "./Internal";
export class InExactTask extends I.AbstractTask {
    public async run(): Promise<void> {

        while (true) {

            await Core.Async.sleep(1000);

            if (this.state !== I.ETaskState.RUNNING) {

                this.state = I.ETaskState.IDLE;

                return;
            }

            try {

                let now = Date.now();

                if (this.task.notAfter && this.task.notAfter < now) {

                    this.state = I.ETaskState.IDLE;

                    return;
                }

                if (this.task.notBefore && this.task.notBefore > now) {

                    continue;
                }

                if (this.task.nextTime > now) {

                    continue;
                }

                if (this.task.execute.length >= 2) {

                    await this.waitExec();
                }
                else {

                    await this.task.execute(this.task.args);
                }

                this.task.nextTime = getSameOfNeighboringTimeStamp(
                    Date.now(),
                    this.task.unit || Abstract.ETaskUnit.MINUTE,
                    this.task.interval || 1,
                ).getTime();
            }
            catch (e) {

                this.emit("error", e);
            }

        }

    }

}

export class ExactTask extends I.AbstractTask {

    private _counter: number = 0;

    public stop() {

        if (this._counter) {

            this.state = I.ETaskState.STOPPING;
        }
        else {

            this.state = I.ETaskState.IDLE;

            this.emit("stop");
        }

    }

    public async run(): Promise<void> {

        return new Promise(async (resolve) => {

            this.once("stop", resolve);

            while (true) {

                await Core.Async.sleep(1000);

                if (this.state !== I.ETaskState.RUNNING) {

                    this.stop();
                    return;
                }

                try {

                    let now = Date.now();

                    if (this.task.notAfter && this.task.notAfter < now) {

                        this.stop();

                        return;
                    }

                    if (this.task.notBefore && this.task.notBefore > now) {

                        continue;
                    }

                    if (this.task.nextTime > now) {

                        continue;
                    }

                    this.task.nextTime = getSameOfNeighboringTimeStamp(
                        this.task.nextTime || now,
                        this.task.unit || Abstract.ETaskUnit.MINUTE,
                        this.task.interval || 1,
                    ).getTime();

                    this._counter++;

                    const fn = this._onCompleted.bind(this);

                    const re = this.task.execute(this.task.args, fn);

                    if (re instanceof Promise) {

                        re.then(fn).catch(fn);
                    }

                }
                catch (e) {

                    this.emit("error", e);
                }

            }

        });

    }

    private _onCompleted(e: unknown) {

        if (e) {

            this.emit("error", e);
        }

        this._counter--;

        if (this._counter === 0 &&
            this.state === I.ETaskState.STOPPING) {

            this.state = I.ETaskState.IDLE;

            this.emit("stop");
        }
    }

}
