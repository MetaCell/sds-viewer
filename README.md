## SDS Viewer Running Instructions

1. Install node.js https://nodejs.org/en/
2. Open a terminal
3. Install yarn following these steps https://www.geeksforgeeks.org/how-to-install-yarn-in-macos-ubuntu-windows/ . You will need admin privileges for this step.
4. Install git https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
5. In terminal, type command `git clone -b feature/demo https://github.com/MetaCell/sds-viewer.git`
   - Output should be something like this.
   ![image](https://user-images.githubusercontent.com/4562825/136595047-0255afff-3b52-4cbe-9e2b-575ec4e46a66.png)

6. Then navigate inside the sds-viewer with command `cd sds-viewer`
7. Then type `yarn install --ignore-engines`
8. Finally, to run application type `yarn start`
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
- In the case of encountering an error, take a screenshot and report it with us please.
- To go back , click on the 'x' to go back to the previous screen.
