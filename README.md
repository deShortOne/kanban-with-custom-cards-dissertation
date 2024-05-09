# Kanban with Custom Cards
This project have basic features of popular online kanban boards like Trello and Monday.com but has the option of allowing users to customise the fields inside the card types.
This will allow different companies and teams to more clearly outline what data is required from their members.

## Running the application
1) Clone the project
2) Duplicate .env.example and rename to .env
3) Fill in the values for .env
4) Run
```bash
docker compose up
```
5) Navigate to localhost:3000/select-board. It will ask you to sign in via GitHub. All data will remain either inside the docker databases, your GitHub account and your GitHub App.

This shouldn't make a difference but I ran docker in Ubuntu 22.04.4 LTS

## Sample data shown at project fair
To restore the database backup I used during the project fair to showcase my project, first start the application in docker.
Afer it has started, open a new terminal, naviate to the project then follow the next steps
1) Run this command to copy the backup file into the docker container
```bash
docker cp database-backup/backup.sql database:/backup.sql
```
2) Then run this command to enter the docker container
```bash
docker exec -it database sh
```
3) Then run this command to run the sql file in the database, making sure to change the values appropriately
```bash
mysql -u root -p db < backup.sql
```
You will need to replace root with the value set for DOCKER_DB_UNAME in the .env file  
You will need to replace db with the value set for DOCKER_DB_DATABASE in the .env file  
After pressing enter, it will ask you for the password, type or paste the value for DOCKER_DB_PWD  
If you've not edited the bottom half of the .env file, then simply copy and paste the command

Would recommend mainly checking out the board titled Board shown on online brochure

## Testing
1) First start the application.
2) Ctrl+shift+j to open the browser tools, navigate to Application in the top nav bar.
3) Copy the value for next-auth.session-token and replace TESTING_CYPRESS_TOKEN in cypress.env.json.
4) Ensure there exists a user with the correct details for that token in the database.
```SQL
USE diss;
INSERT INTO User (email, githubId) VALUES ('email here', githubId);
```
5) Then run 
```bash
npm run cypress:open
```
6) Choose E2E Testing.
7) Choose the environment you want to test in.
8) Then run spec.cy.ts.

If you want to test in environment that is not listed, ensure that it is installed and accessible by cypress. 

Not setting baseUrl because the following still requires the URL anyways...
```jsx
cy.url().should("eq", Cypress.env('URL') + "select-board/new")
```
(I know I can use include instead of eq)
