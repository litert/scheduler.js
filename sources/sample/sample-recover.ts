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

import * as Scheduler from "../libs";
import * as Core from "@litert/core";
import { ETaskUnit } from "../libs";

async function execute( ) {
    // tslint:disable-next-line: no-console
    console.log("hello world");
}
(async () => {

    let Sche = Scheduler.createSchedulers();

    Sche.add({
        "id": "123",
        "name": "sdf",
        "unit": ETaskUnit.SECOND,
        "interval": 1,
        "execute": execute,
        "nextTime": 0
    });

    Sche.start();

    await Core.Async.sleep(10000);

    Sche.recover({
        "123": {
            "id": "123",
            "name": "sdf",
            "unit": ETaskUnit.SECOND,
            "interval": 1,
            "execute": execute,
            "nextTime": 12345
        }
    });

    Sche.stop();

    Sche.on("stop", () => {
        // tslint:disable-next-line: no-console
        console.log("stop:" + Date());
    });

})();
