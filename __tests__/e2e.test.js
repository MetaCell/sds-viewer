import * as puppeteer from "puppeteer";
import * as selectors from "./selectors";
import { ONE_SECOND, ONE_MINUTE, TWO_MINUTES, TEN_MINUTES } from "./time_constants";
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


    test('Choose from SPARC Dataset List', async () => {

        console.log('Opening SPARC Datasets')

        await page.waitForSelector(selectors.LOAD_BUTTONS_SELECTOR)

        const load_dataset_button = await page.$$(selectors.LOAD_BUTTONS_SELECTOR)

        for (var i = 0; i < load_dataset_button.length; i++) {
            load_dataset_button[1].click()

        }

        await page.waitForSelector(selectors.DATASET_LIST_SELECTOR)
        await page.waitForSelector(selectors.DATASET_ITEM_SELECTOR)
        await page.waitForSelector(selectors.DONE_BUTTON_SELECTOR, { disabled: true })
        const sparc_dataset_counts = await page.$$eval(selectors.DATASET_COUNT_NUMBER_SELECTOR, sparc_dataset_counts => {
            return sparc_dataset_counts.map(sparc_dataset_count => sparc_dataset_count.innerHTML);
        });
        const sparc_dataset_list = await page.$$(selectors.SPARC_DATASET_LIST_SELECTOR)
        const sparc_dataset_list_count = sparc_dataset_list.length
        const sparc_dataset_list_count_string = sparc_dataset_list_count.toString();

        expect(sparc_dataset_counts[0]).toContain(sparc_dataset_list_count_string)

        for (var i = 0; i < sparc_dataset_list_count; i++) {
            await sparc_dataset_list[0].click()
        }

        await page.waitForSelector(selectors.ENABLED_DONE_BUTTON_SELECTOR)

    })


    test('Load and check SPARC Dataset', async () => {

        console.log('Loading a SPARC dataset')
    
        await page.click(selectors.ENABLED_DONE_BUTTON_SELECTOR)
        await page.waitForSelector(selectors.LOADED_DATASET_SELECTOR)
        await page.waitForSelector(selectors.GRAPH_SELECTOR)
    
        console.log('Dataset loaded')
    
        const folder = await page.$$(selectors.LOADED_DATASET_SELECTOR)
        const folder_lenght = folder.length
    
        expect(folder_lenght).toBe(1)
    
        await page.click(selectors.OPEN_FOLDER_BUTTON_SELECTOR)
    
        const data_folders = await page.$$eval(selectors.LOADED_DATASET_SELECTOR, data_folders => {
          return data_folders.map(data_folder => data_folder.innerHTML);
        });
    
        expect(data_folders).toContain('primary')
        expect(data_folders).toContain('source')
        expect(data_folders).toContain('derivative')
        expect(data_folders).toContain('subjects.xlsx')
    
      })

})