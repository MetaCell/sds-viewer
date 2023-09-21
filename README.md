Deployed version : https://metacell.github.io/sds-viewer/
- [User Manual - Loading Datasets](https://github.com/MetaCell/sds-viewer/tree/development#sds-viewer-user-manual)
- [User Manual - Navigating the Components](https://github.com/MetaCell/sds-viewer/tree/development#navigating-the-sds-viewer)

## SDS Viewer User Manual 

The SDS Viewer can now be launched directly from datasets and models on the SPARC Portal (https://sparc.science/). From the landing page for your dataset or model of interest, simply click the SDS Viewer button, it will launch the viewer with it already loaded. In addition, users can load SPARC datasets using two other methods:

1) Loading a SPARC Dataset from list:
   - Click on 'SPARC Datasets' button, it's located on the lower left corner.
   - On the window that opens up, select the dataset you want to load. 
   ![image](https://user-images.githubusercontent.com/4562825/166984322-83b4a8c2-aa29-4e6d-96e9-bcf4d125a3a9.png)
   - After selection, click 'Done'
   - Dataset will be loaded.
   

2) Loading a dataset specifying DOI as parameter:
   - Users can specify the DOI of a SPARC Portal dataset as a parameter on the URL and load it this way.
   - For example, if user wants to load Dataset with DOI 10.26275/qskp-awpu, we can add the id as parameter : 
     https://metacell.github.io/sds-viewer/?doi=10.26275/qskp-awpu
     This will open up the SDS Viewer with the dataset already loaded.

##### Loaded dataset example #####
![Screenshot 2023-09-21 at 3 50 49 PM](https://github.com/MetaCell/sds-viewer/assets/4562825/e7247cf1-df5e-498d-a418-4cbc7f4c4de2)
##### SPARC Dataset used #####
![Screenshot 2023-09-21 at 3 53 33 PM](https://github.com/MetaCell/sds-viewer/assets/4562825/f3e287ed-f93a-436b-b3b0-b85cb1c0857c)

     
### Navigating the SDS Viewer
   - Users can search for subjects, folders and files on the sidebar. Selecting an item on the sidebar will display the Metadata for it and zoom the Graph to its corresponding node. 
![Screenshot 2023-09-21 at 4 04 23 PM](https://github.com/MetaCell/sds-viewer/assets/4562825/b64ea659-607f-42f7-b58f-edb01e31ab40)


   - Selecting an item on the Graph will display its Metadata. 

![image](https://user-images.githubusercontent.com/4562825/186723085-c6573146-82dc-4fb7-ae95-588f7b1e4842.png)

   - Navigating the Graph Viewer can be done with the mouse. There's also controlers on the bottom right that allows the user to change the Layout view, zoom in/out, reset the view to its original state and expand all data in the viewer.

![controllers](https://github.com/MetaCell/sds-viewer/assets/99416933/30aa8bb3-ec61-46d8-9f83-55ade15b95c0)

   - Multiple Datasets can be loaded at the same time, which will open a new Graph Viewer Component for each dataset.

![multiple](https://github.com/MetaCell/sds-viewer/assets/99416933/a74fa033-ccd4-4609-b50f-852ce44d347a)


### Datasets Used
The SPARC SDS Viewer uses SPARC Portal datasets. 

### Error Handling
- In the case of encountering an error, take a screenshot and report it with us please by opening an [issue](https://github.com/MetaCell/sds-viewer/issues/new)-clicking the Bug icon will take you to this page. If you don't have a GitHub account, please feel free to use the [SPARC Contact form](https://sparc.science/contact-us?source_url=%2F) to provide your feedback.
- To go back , click on the 'x' to go back to the previous screen.
