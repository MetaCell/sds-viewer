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
   ![image](https://user-images.githubusercontent.com/4562825/136596619-4cfb3ba9-48bb-42c4-b128-331d0bf7e6e8.png)


## SDS Viewer User Manual
Loading an external dataset:
- Click on 'Import a new dataset'
- On the window that opens up, select 'From a URL'
- Paste the dataset url onto the textfield. For this use case, we only need to enter the URL of the turtle file.
  URL example https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-06-21T103507%2C091927-0700/datasets/N%3Adataset%3A02d6f93c-56cd-471b-bbb9-99f65f47d203.ttl
  ![image](https://user-images.githubusercontent.com/4562825/136597116-4098f4eb-34ce-4abd-92fa-c6fbf6f2c92e.png)
- Click 'Load' and then 'Done'
- Dataset will be loaded

Loading an local dataset:
- Click on 'Import a new dataset'
- On the window that opens up, stay on 'Local System'.
- Add turtle and json file at the same time. 
  ![image](https://user-images.githubusercontent.com/4562825/136603905-83145d22-0bff-47b2-ae09-7117acc4c246.png)
- Click 'Done'
- Dataset will be loaded

### Datasets Used
The datasets we have been testing can be found here https://cassava.ucsd.edu/sparc/preview/archive/exports/2021-06-21T103507%2C091927-0700/

### Error Handling
- In the case of encountering an error, take a screenshot and report it with us please by opening an [issue](https://github.com/MetaCell/sds-viewer/issues/new)
- To go back , click on the 'x' to go back to the previous screen.
