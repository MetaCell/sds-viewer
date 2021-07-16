import { WidgetStatus } from "@metacell/geppetto-meta-client/common/layout/model";

export const GraphWidget = {
    id: 'graphWidget',
    name: "Dataset Graph",
    component: "graph",
    panelName: "rightPanel",
    enableClose: true,
    enableRename: true,
    enableDrag: true,
    status: WidgetStatus.ACTIVE,
};