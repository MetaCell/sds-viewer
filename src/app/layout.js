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
    // borders: [
    //     {
    //         type: "border",
    //         location: "bottom",
    //         size: 100,
    //         children: [],
    //         barSize: 18,
    //     },
    // ],
    "layout": {
        "type": "tabset",
        "weight": 100,
        "id": "root",
        "children": [
            {
                "type": "row",
                "weight": 70,
                "children": [
                    {
                        "type": "tabset",
                        "weight": 100,
                        "id": "leftPanel",
                        "enableDeleteWhenEmpty": false,
                        "children": []
                    }
                ]
            },
            {
                "type": "row",
                "weight": 30,
                "children": [
                    {
                        "type": "tabset",
                        "weight": 100,
                        "id": "rightPanel",
                        "enableDeleteWhenEmpty": false,
                        "enableDrop": false,
                        "enableDrag": false,
                        "enableDivide": false,
                        "enableMaximize": false,
                        "enableTabStrip": false,
                        "tabStripHeight": "0px",
                        "children": []
                    }
                ]
            }
        ]
    }
};
