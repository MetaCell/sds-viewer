Deployed version : https://metacell.github.io/sds-viewer/
- [User Manual - Loading Datasets](https://github.com/MetaCell/sds-viewer/tree/development#sds-viewer-user-manual)
- [User Manual - Navigating the Components](https://github.com/MetaCell/sds-viewer/tree/development#navigating-the-sds-viewer)
- [Running Application Locally](https://github.com/MetaCell/sds-viewer/tree/development#sds-viewer-running-instructions)

## SDS Viewer User Manual 

Users can load datasets from the SPARC portal in a couple of ways:

1) Loading a SPARC Dataset from list:
   - Click on 'SPARC Datasets' button, it's located on the lower left corner.
   - On the window that opens up, select the dataset you want to load. 
   ![image](https://user-images.githubusercontent.com/4562825/166984322-83b4a8c2-aa29-4e6d-96e9-bcf4d125a3a9.png)
   - After selection, click 'Done'
   - Dataset will be loaded.

2) Loading a dataset specifying DOI as parameter
   - Users can specify the DOI of a SPARC Portal dataset as a parameter on the URL and load it this way.
   - For example, if user wants to load Dataset with DOI 10.26275/qskp-awpu, we can add the id as parameter : 
     https://metacell.github.io/sds-viewer/?doi=10.26275/qskp-awpu
     This will open up the SDS Viewer with the dataset already loaded.
     
![loadwithid](https://github.com/MetaCell/sds-viewer/assets/99416933/2daf28db-c604-4d2d-9a3f-c9de494d5d6f)

     
### Navigating the SDS Viewer
   - Users can search for subjects, folders and files on the sidebar. Selecting an item on the sidebar will display the Metadata for it and zoom the Graph to its corresponding node. 

![clickonitem](https://github.com/MetaCell/sds-viewer/assets/99416933/824f8c44-d8fd-473b-a9bd-ce2ebed701ad)

   - Selecting an item on the Graph will display its Metadata. 

![image](https://user-images.githubusercontent.com/4562825/186723085-c6573146-82dc-4fb7-ae95-588f7b1e4842.png)

   - Navigating the Graph Viewer can be done with the mouse. There's also controlers on the bottom right that allows the user to change the Layout view, zoom in/out, reset the view to its original state and expand all data in the viewer.

![controllers](https://github.com/MetaCell/sds-viewer/assets/99416933/30aa8bb3-ec61-46d8-9f83-55ade15b95c0)

   - Multiple Datasets can be loaded at the same time, which will open a new Graph Viewer Component for each dataset.

![multiple](https://github.com/MetaCell/sds-viewer/assets/99416933/a74fa033-ccd4-4609-b50f-852ce44d347a)


### Datasets Used
The SPARC SDS Viewer used SPARC Portal datasets. 

### Error Handling
- In the case of encountering an error, take a screenshot and report it with us please by opening an [issue](https://github.com/MetaCell/sds-viewer/issues/new)
- To go back , click on the 'x' to go back to the previous screen.

## SDS Viewer Running Instructions

1. Install node.js https://nodejs.org/en/
2. Open a terminal.
   - Mac
      - On your Mac, do one of the following:
         - Click the Launchpad icon  in the Dock <img src="https://help.apple.com/assets/5FDD15EE12A93C067904695E/5FDD15F412A93C0679046966/en_US/a1f94c9ca0de21571b88a8bf9aef36b8.png" alt="" height="15" width="15" originalimagename="SharedGlobalArt/AppIconTopic_Launchpad.png"> , type Terminal in the search field, then click Terminal.
         - In the Finder <img src="https://help.apple.com/assets/5FDD15EE12A93C067904695E/5FDD15F412A93C0679046966/en_US/058e4af8e726290f491044219d2eee73.png" alt="" height="15" width="15" originalimagename="SharedGlobalArt/AppIconTopic_Finder.png">, open the /Applications/Utilities folder, then double-click Terminal.
   -  Windows
      - Follow steps in [this link](https://www.howtogeek.com/194041/how-to-open-the-command-prompt-as-administrator-in-windows-8.1/) to open a terminal as administrator in your Windows machine. 
   - Linux
      -  Open a terminal
3. Install yarn:
   - Mac 
      - In the OS X terminal you need to type:
         `sudo npm install --global yarn`
          - NOTE: You'll be ask to enter your local system password.
      - If previous step fails, you can also install it with brew.  
         `brew install yarn`
   - Windows
      - In a Windows terminal, type command:
         `npm install --global yarn`
   
4. Install git
   - Mac
      - In a terminal, install git by typing : 
         `brew install git`  or `sudo yarn add git` 
   - Windows
      - Download installer from https://git-scm.com/download/win and run it.
   - Linux
      - Install it with 
         `sudo apt-get install git`
5. In terminal, type command `git clone -b development https://github.com/MetaCell/sds-viewer.git`
   - Output should be something like this.
   ![image](https://user-images.githubusercontent.com/4562825/136595047-0255afff-3b52-4cbe-9e2b-575ec4e46a66.png)

6. Then navigate to the sds-viewer folder with command `cd sds-viewer`
7. Then type `sudo yarn install --ignore-engines`
8. Finally, to run application type `sudo yarn start`
9. Last step should have opened a new browser tab with 'http://localhost:3000/', it will take a 1 minute before it finishes loading the first time.
   This should be the browser output.
   ![image](https://user-images.githubusercontent.com/4562825/166983757-c4ea69ba-5d9a-4792-881a-89113cb5b1b6.png)
