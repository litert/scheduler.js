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

import { EventEmitter } from "events";
import * as Abstract from "./Abstracts";
import * as Internal from "./Internal";
import * as E from "./Errors";
import { ExactTask, InExactTask } from "./Task";

class CScheduler
extends EventEmitter
implements Abstract.IScheduler {
    private _tasks: Record<string, Internal.AbstractTask>;
    private _state: Abstract.ESchedulerState;
    public constructor() {

        super();

        this._tasks = {};

        this._state = Abstract.ESchedulerState.IDLE;
    }

    private async _run(id: string) {

        let task = this._tasks[id];

        if (!task) {

            throw new E.E_TASK_NOT_FOUND();
        }

        return task.start();
    }

    private _waitResultCallback(promise: Promise<void>) {

        promise.then(() => {

            for (let id in this._tasks) {

                let task = this._tasks[id];

                if (task.getState() !== Internal.ETaskState.IDLE) {

                    return ;
                }
            }

            this.emit("stop");

        }).catch((e) => {

            this.emit("error", e);
        });
    }

    public start() {

        switch (this._state) {

            case Abstract.ESchedulerState.RUNNING:

            return;

            case Abstract.ESchedulerState.STOPPING:

            throw new E.E_SCHEDULER_STOPPING();
        }

        this._state = Abstract.ESchedulerState.RUNNING;

        for (let id in this._tasks) {

            this._waitResultCallback(this._run(id));
        }

    }
    public async stop() {

        this._state = Abstract.ESchedulerState.STOPPING;

        for (let id in this._tasks) {

            this._tasks[id].stop();
        }
    }
    public dump() {

        let tasks: Record<string, Abstract.ITaskOptions> = {};

        for (let id in this._tasks) {

            tasks[id] = this._tasks[id].task;
        }

        return tasks;
    }

    /**
     * 增加计划任务
     * @param schedulers
     */
    public add(task: Abstract.ITaskOptions) {

        if (this._tasks[task.id]) {

            throw new E.E_DUPLICATE_TASK();
        }

        if (task.isInExact) {

            this._tasks[task.id] = new InExactTask(task);
        }
        else {

            this._tasks[task.id] = new ExactTask(task);
        }

        if (this._state === Abstract.ESchedulerState.RUNNING) {

            this._waitResultCallback(this._tasks[task.id].start());
        }

        return true;
    }
    /**
     * 删除计划任务
     * @param ids
     */
    public remove(id: string) {

        if (!this._tasks[id]) {

            throw new E.E_TASK_NOT_FOUND();
        }

        this._tasks[id].stop();

        delete this._tasks[id];
    }
    public recover(tasks: Record<string, Abstract.ITaskOptions>) {

        let now = Date.now();

        for (let id in tasks) {
            // 如果加载的配置有不存在的计划任务,则跳过
            if (this._tasks[id]) {

                if (tasks[id].nextTime < now) {

                    this._tasks[id].task.nextTime = now;
                }
                else {

                    this._tasks[id].task.nextTime = tasks[id].nextTime;
                }

            }
        }
    }

}

export function createSchedulers() {

    return new CScheduler();
}
