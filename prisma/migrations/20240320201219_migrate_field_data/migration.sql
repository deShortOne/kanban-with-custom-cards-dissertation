-- InsertIntoTable
INSERT INTO `FieldType` (name, description, implemented) VALUES 
('Text field', "A single line text field", true),
('Text area', "A multi line text field", true),
('Date picker', "A calendar that picks a date from a calendar", true),
('Comment', "Comment section", false),
('File upload', "Area to upload and download files", false),
('Check boxes', "A checkbox area", true),
('Drop down', "Drop down", true),
('Track Github branch', "Tracks the status of branches in a repo", true);

INSERT INTO `CardType` (name) VALUES ('task'), ('bug');
