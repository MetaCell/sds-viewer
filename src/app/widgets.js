import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const GraphWidget = {
    id: 'graphWidget',
    name: "Dataset Graph",
    component: "graphComponent",
    panelName: "leftPanel",
    enableClose: true,
    enableRename: true,
    enableDrag: true,
    status: WidgetStatus.ACTIVE,
};


export const NodeViewWidget = {
    id: 'nodeViewWidget',
    name: "Node View",
    component: "nodeView",
    panelName: "rightPanel",
    enableClose: true,
    enableRename: false,
    enableDrag: false,
    status: WidgetStatus.ACTIVE,
};


// export const EmptyWidget = {
//     id: 'emptyWidget',
//     name: "Dataset Empty",
//     component: "emptyComponent",
//     panelName: "rightPanel",
//     enableClose: true,
//     enableRename: true,
//     enableDrag: true,
//     status: WidgetStatus.ACTIVE,
// };
