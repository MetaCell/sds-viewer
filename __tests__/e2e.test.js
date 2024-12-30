import * as puppeteer from "puppeteer";
import * as selectors from "./selectors";
import { ONE_SECOND, ONE_MINUTE, TWO_MINUTES, TEN_MINUTES } from "./time_constants";
import 'expect-puppeteer';
import 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { time } from "console";
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

        await page.waitForSelector(selectors.EMPTY_DATASET_VIEWER_SELECTOR, { timeout: 30000 });
    });


    test("Home Page", async () => {
        await page.waitForSelector(selectors.EMPTY_DATASET_VIEWER_SELECTOR, { timeout: 30000 });

        await page.waitForSelector(selectors.EMPTY_DATASET_LIST_SELECTOR);
        console.log('Homepage loaded')
        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Home Page'
            });


    });


    test('Choose SPARC Dataset List', async () => {

        console.log('Opening SPARC Datasets')

        await page.waitForSelector(selectors.LOAD_BUTTONS_SELECTOR, { timeout: 30000 })

        const load_dataset_button = await page.$$(selectors.LOAD_BUTTONS_SELECTOR)
        for (var i = 0; i < load_dataset_button.length; i++) {
            load_dataset_button[0].click()

        }
        await page.waitForTimeout(ONE_SECOND * 3)
        await page.waitForSelector(selectors.DATASET_LIST_SELECTOR, {timeout: 60000})
        await page.waitForSelector(selectors.DATASET_ITEM_SELECTOR, {timeout: 60000})
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

        await page.waitForSelector(selectors.ENABLED_DONE_BUTTON_SELECTOR, {disabled: false, timeout: 30000})

    })


    test('Load and check SPARC Dataset', async () => {

        console.log('Loading a SPARC dataset')
        await page.waitForTimeout(ONE_SECOND )
        await page.waitForSelector(selectors.ENABLED_DONE_BUTTON_SELECTOR, {disabled: false, timeout: 30000})
        const import_button = await page.$$(selectors.ENABLED_DONE_BUTTON_SELECTOR)
        for (var i = 0; i < import_button.length; i++) {
            await import_button[1].click()
        }
        // await page.click(selectors.ENABLED_DONE_BUTTON_SELECTOR)
        await page.waitForSelector(selectors.LOADED_DATASET_SELECTOR)
        await page.waitForSelector(selectors.GRAPH_SELECTOR)

        console.log('Dataset loaded')

        const folder = await page.$$(selectors.LOADED_DATASET_SELECTOR)
        const folder_lenght = folder.length

        expect(folder_lenght).toBe(1)
        await page.waitForTimeout(3000)
        await page.waitForSelector(selectors.OPEN_FOLDER_BUTTON_SELECTOR)
        await page.click(selectors.OPEN_FOLDER_BUTTON_SELECTOR)
        await page.waitForSelector(selectors.SUBFOLDERS_SELECTOR)
        await page.waitForTimeout(3000)

        const folder_after_click = await page.$$(selectors.LOADED_DATASET_SELECTOR)
        const folder_lenght_after_click = folder_after_click.length
        expect(folder_lenght_after_click).toBeGreaterThan(folder_lenght)

        const data_folders = await page.$$eval(selectors.LOADED_DATASET_SELECTOR, data_folders => {
            return data_folders.map(data_folder => data_folder.innerHTML);
        });

        expect(data_folders).toContain('primary')
        expect(data_folders).toContain('source')
        expect(data_folders).toContain('derivative')
        expect(data_folders).toContain('subjects.xlsx')

        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Dataset Loaded'
            });

    })

    test('Change Graph Layout', async () => {
        console.log('Changing Graph Layout...')

        await page.waitForSelector('button[area-label="GraphLayout"]')
        await page.click('button[area-label="GraphLayout"]')
        await page.waitForSelector('ul[class="MuiList-root MuiMenu-list MuiList-padding"]')
        await page.click('ul[class="MuiList-root MuiMenu-list MuiList-padding"] > li:nth-child(1)');
        await page.waitForTimeout(3000)
        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Radial View'
        });

        await page.waitForSelector('button[area-label="GraphLayout"]')
        await page.click('button[area-label="GraphLayout"]')
        await page.waitForSelector('ul[class="MuiList-root MuiMenu-list MuiList-padding"]')
        await page.click('ul[class="MuiList-root MuiMenu-list MuiList-padding"] > li:nth-child(2)');
        await page.waitForTimeout(3000)
        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                    ...SNAPSHOT_OPTIONS,
                    customSnapshotIdentifier: 'Tree View'
        });
        

        await page.waitForSelector('button[area-label="GraphLayout"]')
        await page.click('button[area-label="GraphLayout"]')
        await page.waitForSelector('ul[class="MuiList-root MuiMenu-list MuiList-padding"]')
        await page.click('ul[class="MuiList-root MuiMenu-list MuiList-padding"] > li:nth-child(3)');
        await page.waitForTimeout(3000)
        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                    ...SNAPSHOT_OPTIONS,
                    customSnapshotIdentifier: 'Dataset Loaded'
        });
        console.log('Graph Layout Changed')
    })

    test('Load another SPARC Dataset', async () => {

        console.log('Loading another SPARC dataset')
        await page.waitForSelector(selectors.LOAD_BUTTONS_SELECTOR, { timeout: 30000 });
        const load_dataset_button = await page.$$(selectors.LOAD_BUTTONS_SELECTOR)

        for (var i = 0; i < load_dataset_button.length; i++) {
            load_dataset_button[0].click()

        }

        await page.waitForSelector(selectors.DATASET_LIST_SELECTOR, { timeout: 30000 })
        await page.waitForSelector(selectors.DATASET_ITEM_SELECTOR, { timeout: 30000 })
        await page.waitForSelector(selectors.DONE_BUTTON_SELECTOR, { disabled: true })
        await page.waitForSelector(selectors.SPARC_DATASET_LIST_SELECTOR, { hidden: false })
        const sparc_dataset_list = await page.$$(selectors.SPARC_DATASET_LIST_SELECTOR)
        const sparc_dataset_list_count = sparc_dataset_list.length
        for (var i = 0; i < sparc_dataset_list_count; i++) {
            await sparc_dataset_list[1].click()
        }

        await page.waitForSelector(selectors.ENABLED_DONE_BUTTON_SELECTOR, {disabled: false, timeout: 30000})

        const import_button = await page.$$(selectors.ENABLED_DONE_BUTTON_SELECTOR)
        for (var i = 0; i < import_button.length; i++) {
            await import_button[1].click()
        }
        await page.waitForSelector(selectors.LOADED_DATASET_SELECTOR)

        console.log('Dataset loaded')

        await page.waitForSelector(selectors.GRAPH_SELECTOR, { timeout: 30000 })
        await page.waitForTimeout(ONE_SECOND * 3)
        const folder = await page.$$(selectors.LOADED_DATASET_SELECTOR)
        const folder_lenght = folder.length

        expect(folder_lenght).toBeGreaterThan(2)

        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: '2 Datasets Loaded'
            });

    })

    test('Open Dataset through its ID', async () => {

        console.log('Opening a Dataset thorugh the ID')

        await page.goto(DEV_URL)
        await page.waitForSelector(selectors.EMPTY_DATASET_LIST_SELECTOR, { timeout: 30000 });
        await page.waitForTimeout(ONE_SECOND * 3)
        await page.goto(DEV_URL + '?id=' + DATASET_ID)
        await page.waitForTimeout(ONE_SECOND * 3)
        await page.waitForSelector(selectors.GRAPH_SELECTOR, { timeout: 30000 })

        console.log('Dataset loaded')

        const data_ids = await page.$$eval(selectors.DATA_ID_SELECTOR, data_ids => {
            return data_ids.map(data_id => data_id.innerHTML);
        });

        expect(data_ids[0]).toBe(DATASET_ID)

        await console.log('... taking snapshot ...')
        expect(await page.screenshot())
            .toMatchImageSnapshot({
                ...SNAPSHOT_OPTIONS,
                customSnapshotIdentifier: 'Dataset Loaded'
            });

    })

    test('Change Metadata Settings', async () => {
        await page.waitForSelector('button[title="DOI Copy"]');
        let doiCopyButtons = await page.$$('button[title="DOI Copy"]');
        expect(doiCopyButtons.length).toBeGreaterThan(1);

        await page.waitForSelector('button[class="MuiButtonBase-root MuiIconButton-root overlay-button"]', {hidden: false})
        await page.waitForTimeout(1000)
        await page.click('button[class="MuiButtonBase-root MuiIconButton-root overlay-button"]')
        await page.waitForSelector('.MuiListItem-root.MuiListItem-secondaryAction')
        await page.waitForSelector('button[aria-label="delete"]');
        const deleteButtons = await page.$$('button[aria-label="delete"]');
        await deleteButtons[0].click();
        await page.waitForSelector('.secondary-sidebar .MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-disableElevation.MuiButton-fullWidth')
        await page.click('.secondary-sidebar .MuiButtonBase-root.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-disableElevation.MuiButton-fullWidth')
        
        await page.waitForSelector('button[title="DOI Copy"]')
        doiCopyButtons = await page.$$('button[title="DOI Copy"]');
        expect(doiCopyButtons.length).toBe(1);

    })

    test('Check Help widgets', async () => {
        await page.waitForSelector('a[area-label="manual"]')
        await page.click('a[area-label="manual"]')

        const newPageTarget = await browser.waitForTarget(target => target.url() === 'https://github.com/MetaCell/sds-viewer/blob/development/README.md');
        const newPage = await newPageTarget.page();

        const url = newPage.url();
        expect(url).toBe('https://github.com/MetaCell/sds-viewer/blob/development/README.md');
    })

    // No Longer applicable
    test.skip('Load Dataset through URL', async () => {
        await page.goto(DEV_URL)
        await page.waitForSelector(selectors.EMPTY_DATASET_LIST_SELECTOR);

        const load_dataset_button = await page.$$(selectors.LOAD_BUTTONS_SELECTOR)

        for (var i = 0; i < load_dataset_button.length; i++) {
            load_dataset_button[0].click()
        }

        await page.waitForSelector(selectors.LOAD_DATA_POPUP_SELECTOR)
        await page.click(selectors.LOAD_THROUGH_URL_TAB_SELECTOR)
        await page.waitForSelector(selectors.URL_UPLOADER_SELECTOR)
        expect(page).toFill(selectors.URL_UPLOADER_SELECTOR, 'https://app.pennsieve.io/N:organization:618e8dd9-f8d2-4dc4-9abb-c6aaab2e78a0/datasets/N:dataset:0a5a2827-2b39-4085-87ea-2b7fbbe27cc8')
        await page.waitForTimeout(ONE_MINUTE)
        await page.waitForSelector(selectors.ENABLED_DONE_BUTTON_SELECTOR, { disabled: false })


    })

    // No Longer applicable
    test.skip('Load Dataset from Local System', async () => {
        await page.goto(DEV_URL)
        await page.waitForSelector(selectors.EMPTY_DATASET_LIST_SELECTOR);

        const CURATION_EXPORT_JSON_LINK = 'https://cassava.ucsd.edu/sparc/datasets/0075239e-a195-4ee3-8729-72ffd220fcf7/2022-08-16T172813%2C126986Z/curation-export.json'
        const CUTATION_EXPORT_TTL_LINK = 'https://cassava.ucsd.edu/sparc/datasets/0075239e-a195-4ee3-8729-72ffd220fcf7/2022-08-16T172813%2C126986Z/curation-export.ttl'

        await axios.get(CURATION_EXPORT_JSON_LINK, { responseType: "arraybuffer" }).then(response => {
            fs.writeFile('./Tests/assets/curation-export.json', response.data, (err) => {
                if (err) throw err;
                // console.log('curation-export.json file fetched');
            });
        });

        await axios.get(CUTATION_EXPORT_TTL_LINK, { responseType: "arraybuffer" }).then(response => {
            fs.writeFile('./Tests/assets/curation-export.ttl', response.data, (err) => {
                if (err) throw err;
                // console.log('curation-export.ttl file fetched');
            });
        });

        const load_dataset_button = await page.$$(selectors.LOAD_BUTTONS_SELECTOR)

        for (var i = 0; i < load_dataset_button.length; i++) {
            load_dataset_button[0].click()
        }

        await page.waitForSelector(selectors.LOCAL_UPLOAD_TAB_SELECTOR)
        await page.click(selectors.LOCAL_UPLOAD_TAB_SELECTOR)

        const [jsonfileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(selectors.LOCAL_SYSTEM_UPLOAD_BUTTON_SELECTOR)
        ]);
        await jsonfileChooser.accept([__dirname + '/assets/curation-export.json']);

        await page.waitForTimeout(ONE_MINUTE)

        const [ttlfileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click(selectors.LOCAL_SYSTEM_UPLOAD_BUTTON_SELECTOR)
        ]);
        await ttlfileChooser.accept([__dirname + '/assets/curation-export.ttl']);

        await page.waitForSelector(selectors.ENABLED_DONE_BUTTON_SELECTOR)

    })


})



