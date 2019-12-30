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

export enum ETaskUnit {
    YEAR,
    MONTH,
    DAY,
    HOUR,
    MINUTE,
    SECOND,
    MILLISECOND,
}

export enum ESchedulerState {
    IDLE,
    RUNNING,
    STOPPING,
}

export type TErrorCallback = (e?: unknown) => void;

export type TaskFeedbackCallbackStyle = (
    args: any,
    callback?: TErrorCallback
) => void;

export type TaskFeedbackPromiseStyle = (
    args: any
) => Promise<void>;

export type TaskFeedback = TaskFeedbackCallbackStyle | TaskFeedbackPromiseStyle;

export interface ITaskOptions  {

    /**
     * ID
     * 唯一标识，不可重复
     */
    "id": string;

    /**
     * 显示名称
     */
    "name": string;

    /**
     * 精确执行(定时执行)false,定期在固定时间执行,即每次开始执行时间的间隔一样
     * 间隔执行 true,不在固定时间定期执行,每次开始时间减去上次结束时间为间隔时间
     * 默认精确执行 false
     */
    "isInExact" ?: boolean;

    /**
     * 默认按分钟执行
     */
    "unit" ?: ETaskUnit;

    /**
     * 默认为1
     */
    "interval" ?: number;

    /**
     * 不写该字段就是立即执行
     */
    "notBefore" ?: number;

    /**
     * 停止时间戳,不再执行
     */
    "notAfter" ?: number;

    /**
     * 参数
     */
    args ?: any;

    /**
     * 执行的函数
     */
    "execute": TaskFeedback;

    /**
     * 下一次执行时间
     */
    "nextTime": number;

}

export interface IScheduler extends EventEmitter {

    on(ev: "stop", callback: () => void): this;

    on(ev: "error", callback: (e: unknown) => void): this;

    on(ev: string, callback: (...args: any[]) => void): this;
    start(): void;
    stop(): Promise <void>;
    add(task: ITaskOptions): boolean;
    remove(id: string): void;
    dump(): Record<string, ITaskOptions>;
    recover(sechedulers: Record<string, ITaskOptions>): void;
}
