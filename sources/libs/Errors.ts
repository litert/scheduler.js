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

import * as L from "@litert/core";
export const ErrorHub = L.createErrorHub("@litert/scheduler");

export const E_INVALID_TIME_UNIT = ErrorHub.define(
    null,
    "E_INVALID_TIME_UNIT",
    "The input unit of time is invalid."
);

export const E_DUPLICATE_TASK = ErrorHub.define(
    null,
    "E_DUPLICATE_TASK",
    "The task already exists."
);

export const E_TASK_NOT_FOUND = ErrorHub.define(
    null,
    "E_TASK_NOT_FOUND",
    "The task doesn't exist."
);

export const E_SCHEDULER_STOPPING = ErrorHub.define(
    null,
    "E_SCHEDULER_STOPPING",
    "The scheduler is being stopped."
);
