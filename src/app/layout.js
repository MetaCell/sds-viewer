/**
 * The default layout of the application.
 *
 * Will be loaded by FlexLayout.
 */
export const layout = {
    global: {
        tabEnableClose: true,
        tabSetHeaderHeight: 18,
        tabSetTabStripHeight: 18,
        enableEdgeDock: false,
        sideBorders: 8,
    },
    borders: [
        {
            type: "border",
            location: "bottom",
            size: 100,
            children: [],
            barSize: 18,
        },
    ],
    layout: {
        type: "tabset",
        weight: 100,
        id: "root",
        children: [
            {
                type: 'tab',
                name: 'empty',
                config: {
                    id: 'empty',
                    component: 'emptyComponent',
                },
            },
        ],
    },
};
