Deployed version : https://metacell.github.io/sds-viewer/
- [User Manual - Loading Datasets](https://github.com/MetaCell/sds-viewer/tree/development#sds-viewer-user-manual)
- [User Manual - Navigating the Components](https://github.com/MetaCell/sds-viewer/tree/development#navigating-the-sds-viewer)

## SDS Viewer User Manual 

The SDS Viewer can now be launched directly from datasets and models on the SPARC Portal (https://sparc.science/). From the landing page for your dataset or model of interest, simply click the SDS Viewer button, it will launch the viewer with it already loaded. In addition, users can load SPARC datasets using two other methods:

1) Loading a SPARC Dataset from app:
   - Click on 'SPARC Datasets' button, it's located on the lower left corner.
   - On the window that opens up, select the dataset you want to load. You can search 
   by dataset title and id. 
   ![image](https://user-images.githubusercontent.com/4562825/166984322-83b4a8c2-aa29-4e6d-96e9-bcf4d125a3a9.png)
   - After selection, click 'Done'
   - Dataset will be loaded.
   

2) Loading a dataset specifying DOI as parameter:
   - Users can specify the DOI of a SPARC Portal dataset as a parameter on the URL and load it this way.
   - For example, if user wants to load Dataset with DOI 10.26275/qskp-awpu, we can add the id as parameter : 
     https://metacell.github.io/sds-viewer/?doi=10.26275/qskp-awpu
     This will open up the SDS Viewer with the dataset already loaded.

##### Loaded dataset example #####
![image](https://github.com/MetaCell/sds-viewer/assets/4562825/9ea43afd-28cc-4b37-8c72-96be2f821f1a)

##### SPARC Dataset used #####
![image](https://github.com/MetaCell/sds-viewer/assets/4562825/16d878e2-d5bb-4dbd-9695-dfbd7ae5207f)

     
### Navigating the SDS Viewer
   - Users can search for subjects, folders and files on the sidebar. Selecting an item on the sidebar will display the Metadata for it and zoom the Graph to its corresponding folder or file. 
![image](https://github.com/MetaCell/sds-viewer/assets/4562825/7b013f5a-eead-4996-b7d2-20b3bf35a294)


   - Selecting an item on the Graph will display its Metadata. Users can view Metadata for the Dataset's Subjects and Samples, along with its folders and files contents. Users can find links to the SPARC Portal for Subjects, Samples, Folders and Files.

![image](https://user-images.githubusercontent.com/4562825/186723085-c6573146-82dc-4fb7-ae95-588f7b1e4842.png)


   - Navigating the Graph Viewer can be done with the mouse. There are also controllers on the bottom right that allow user to change the Graph Layout view, zoom in/out of the graph, reset the Layout to its original state and expand/collapse all data in the viewer.

![controllers](https://github.com/MetaCell/sds-viewer/assets/99416933/30aa8bb3-ec61-46d8-9f83-55ade15b95c0)


   - Use the Metadata Settings button to control which properties to view on the Metadata panel. Toggle on and off properties on each Object type and click Save.

![image](https://github.com/MetaCell/sds-viewer/assets/4562825/6385b5a1-3598-4815-8aa1-f1223debe063)
![image](https://github.com/MetaCell/sds-viewer/assets/4562825/d5876581-2dfd-4f13-9213-d46907e443c8)


   - Multiple Datasets can be loaded at the same time, a new Graph Viewer Component will be opened for each dataset.

![Multiple](https://github.com/MetaCell/sds-viewer/assets/4562825/9abe621a-a406-4e6b-8d6a-165622014425)


### Datasets Used
The SPARC SDS Viewer uses SPARC Portal datasets. 

### Error Handling
- In the case of encountering an error, take a screenshot and report it with us please by opening an [issue](https://github.com/MetaCell/sds-viewer/issues/new)-clicking the Bug icon will take you to this page. If you don't have a GitHub account, please feel free to use the [SPARC Contact form](https://sparc.science/contact-us?source_url=%2F) to provide your feedback.
- To go back , click on the 'x' to go back to the previous screen.
