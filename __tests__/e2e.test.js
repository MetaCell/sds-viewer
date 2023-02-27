import * as puppeteer from "puppeteer";
import * as selectors from "./selectors";
import { ONE_SECOND, ONE_MINUTE, TWO_MINUTES, TEN_MINUTES} from "./time_constants";
import 'expect-puppeteer';
import 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
expect.extend({ toMatchImageSnapshot })
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
var scriptName = path.basename(__filename, '.js');


const DEV_URL = 'https://metacell.github.io/sds-viewer/'
const DATASET_ID = '0a5a2827-2b39-4085-87ea-2b7fbbe27cc8'

//SNAPSHOT
const SNAPSHOT_OPTIONS = {
    customSnapshotsDir: './__tests__/snapshots',
    comparisonMethod: 'ssim',
    failureThresholdType: 'percent',
    failureThreshold: 0.25
};




jest.setTimeout(TEN_MINUTES);



describe("SDS Viewer e2e Test: Sparc Dataset", () => {
    beforeAll(async () => {

        console.log(
            "Checking page", DEV_URL
        );
        await page
            .goto(DEV_URL, {
                waitUntil: "networkidle0",
            })
            .catch(() => { });

        await page.waitForSelector(selectors.EMPTY_DATASET_VIEWER_SELECTOR);
    });

    test("Home Page", async () => {
        await page.waitForSelector(selectors.EMPTY_DATASET_VIEWER_SELECTOR);

        await page.waitForSelector(selectors.EMPTY_DATASET_LIST_SELECTOR);
        console.log('Homepage loaded')
        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Home Page'
            });


    });

})