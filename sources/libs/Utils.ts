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

import { ETaskUnit } from "./Abstracts";
import * as E from "./Errors";

export function getSameOfNeighboringTimeStamp(
    date: number,
    unit: ETaskUnit,
    interval: number = 1
): Date {

    let dt = new Date(date);

    switch (unit) {

        case ETaskUnit.MILLISECOND:

        return new Date(
                dt.getFullYear(),
                dt.getMonth(),
                dt.getDate(),
                dt.getHours(),
                dt.getMinutes(),
                dt.getSeconds(),
                dt.getMilliseconds() + interval
            );

        case ETaskUnit.SECOND:

        return new Date(
                dt.getFullYear(),
                dt.getMonth(),
                dt.getDate(),
                dt.getHours(),
                dt.getMinutes(),
                dt.getSeconds() + interval,
                dt.getMilliseconds()
            );

        case ETaskUnit.MINUTE:

        return new Date(
                dt.getFullYear(),
                dt.getMonth(),
                dt.getDate(),
                dt.getHours(),
                dt.getMinutes() + interval,
                dt.getSeconds(),
                dt.getMilliseconds()
            );

        case ETaskUnit.HOUR:

        return new Date(
                dt.getFullYear(),
                dt.getMonth(),
                dt.getDate(),
                dt.getHours() + interval,
                dt.getMinutes() ,
                dt.getSeconds(),
                dt.getMilliseconds()
            );

        case ETaskUnit.DAY:

        return new Date(
                dt.getFullYear(),
                dt.getMonth(),
                dt.getDate() + interval,
                dt.getHours(),
                dt.getMinutes() ,
                dt.getSeconds(),
                dt.getMilliseconds()
            );

        case ETaskUnit.YEAR:

        interval = interval * 12;

        break;

        case ETaskUnit.MONTH:

        break;

        default:

        throw new E.E_INVALID_TIME_UNIT();
    }

    const nextDate = new Date(
        dt.getFullYear(),
        dt.getMonth() + interval,
        dt.getDate(),
        dt.getHours(),
        dt.getMinutes(),
        dt.getSeconds(),
        dt.getMilliseconds()
    );

    const r = (dt.getMonth() + interval) % 12;

    if (r === nextDate.getMonth()) {

        return nextDate;
    }

    return new Date(
        dt.getFullYear(),
        dt.getMonth() + interval + 1,
        0,
        dt.getHours(),
        dt.getMinutes(),
        dt.getSeconds(),
        dt.getMilliseconds()
    );
}
