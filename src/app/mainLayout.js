import { useStore } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";

const useStyles = makeStyles({
    layoutContainer: {
        position: 'relative',
        width: '100%',
        height: '100%'
    }
});

/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const MainLayout = () => {
    const classes = useStyles();
    const store = useStore();
    const [LayoutManager, setComponent] = useState(undefined);

    useEffect(() => {
        // Workaround because getLayoutManagerInstance
        // is undefined when calling it in global scope
        // Need to wait until store is ready ...
        if (LayoutManager === undefined) {
            const myManager = getLayoutManagerInstance();

            myManager.model.visitNodes((node, level) => {
                node.setEventListener("resize", (node) => {
                    let visibleChild = myManager.model._activeTabSet._children.filter(element => 
                        element._visible
                    );
                    const event = new CustomEvent('nodeResized', {
                        detail: visibleChild
                    });
                    document.dispatchEvent(event);

                });
                node.setEventListener("visibility", (node, data) => {
                    let visibleChild = myManager.model._activeTabSet._children.filter(element => 
                        !element._visible
                    );
                    const event = new CustomEvent('nodeVisible', {
                        detail: visibleChild
                    });
                    document.dispatchEvent(event);

                });
            });

            if (myManager) {
                setComponent(myManager.getComponent());
            }
        }
    }, [store, LayoutManager])

    return (
        <div className={classes.layoutContainer}>
            {LayoutManager === undefined ? <CircularProgress /> : <LayoutManager />}
        </div>
    );
}

export default MainLayout;
