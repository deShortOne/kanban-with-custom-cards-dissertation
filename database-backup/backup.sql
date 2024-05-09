-- MySQL dump 10.13  Distrib 8.3.0, for Linux (x86_64)
--
-- Host: localhost    Database: diss
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ActiveCardTypes`
--

DROP TABLE IF EXISTS `ActiveCardTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ActiveCardTypes` (
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `version` int NOT NULL,
  `cardTypeId` int NOT NULL,
  `kanbanId` int NOT NULL,
  PRIMARY KEY (`cardTypeId`,`kanbanId`),
  UNIQUE KEY `ActiveCardTypes_version_cardTypeId_kanbanId_key` (`version`,`cardTypeId`,`kanbanId`),
  KEY `ActiveCardTypes_cardTypeId_idx` (`cardTypeId`),
  KEY `ActiveCardTypes_kanbanId_idx` (`kanbanId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ActiveCardTypes`
--

LOCK TABLES `ActiveCardTypes` WRITE;
/*!40000 ALTER TABLE `ActiveCardTypes` DISABLE KEYS */;
INSERT INTO `ActiveCardTypes` VALUES (1,2,1,2),(1,1,1,3),(1,3,2,2),(1,1,2,3),(1,5,3,1),(0,3,4,1),(0,3,5,1),(0,3,6,1),(1,4,7,1),(0,3,8,1),(0,3,9,1),(0,2,10,1),(0,3,11,3);
/*!40000 ALTER TABLE `ActiveCardTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Card`
--

DROP TABLE IF EXISTS `Card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Card` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `columnId` int NOT NULL,
  `swimLaneId` int NOT NULL,
  `kanbanId` int NOT NULL,
  `cardTemplateId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Card_columnId_idx` (`columnId`),
  KEY `Card_swimLaneId_idx` (`swimLaneId`),
  KEY `Card_kanbanId_idx` (`kanbanId`),
  KEY `Card_cardTemplateId_idx` (`cardTemplateId`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Card`
--

LOCK TABLES `Card` WRITE;
/*!40000 ALTER TABLE `Card` DISABLE KEYS */;
INSERT INTO `Card` VALUES (1,'Start here',1,NULL,-1,-1,1,1),(4,'Fix window constant reload',1,NULL,5,4,2,31),(5,'Add user profile picture',1,NULL,6,3,2,29),(6,'Cache user data',1,NULL,4,3,2,29),(7,'Implement side bar',1,NULL,4,4,2,29),(8,'Start here',1,NULL,-1,-1,3,32);
/*!40000 ALTER TABLE `Card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CardTabField`
--

DROP TABLE IF EXISTS `CardTabField`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CardTabField` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `cardId` int NOT NULL,
  `cardTemplateTabFieldId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CardTabField_cardId_idx` (`cardId`),
  KEY `CardTabField_cardTemplateTabFieldId_idx` (`cardTemplateTabFieldId`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CardTabField`
--

LOCK TABLES `CardTabField` WRITE;
/*!40000 ALTER TABLE `CardTabField` DISABLE KEYS */;
INSERT INTO `CardTabField` VALUES (1,'Create new cards by clicking New Task above the card',1,1),(2,'You can create Bug cards by clicking on the down arrow next to New Task\nAlternatively, you can customise the cards as you see fit!',1,2),(3,'This is to be implemented in the future',1,3),(11,'Navigate to site X',4,108),(12,'Page constantly reloads',4,109),(13,'Side bar should be displayed without page reloading ever',4,110),(14,',2,1,0',4,111),(15,'Show profile picture in the top right of page',5,96),(16,'Add some personalisation',5,97),(17,'2024-05-13T21:14:10.000Z',5,98),(18,'/board/[id]',5,99),(19,'0',5,100),(20,'John Doe',5,101),(21,'Email: X\nPhone: Y\nCan call between 10am to 3pm',5,102),(22,'Current plan is to use GitHub profile picture but may allow users to upload their own image',5,103),(23,'Improve speed for when many people want to access',6,96),(24,'During DSUM, many people will visit the Kanban board at the same time. ',6,97),(25,'2024-05-13T21:15:34.000Z',6,98),(26,'/board/[id]',6,99),(27,'1',6,100),(28,'',6,101),(29,'',6,102),(30,'',6,103),(31,'Allow easier navigation between additional pages',7,96),(32,'Improves UX, reduce number of clicks needed to go to sites C, F and R',7,97),(33,'2024-05-13T21:16:50.000Z',7,98),(34,'/board/[id]',7,99),(35,'',7,100),(36,'',7,101),(37,'',7,102),(38,'',7,103),(39,'Create new cards by clicking New Task above the card',8,112),(40,'You can create Bug cards by clicking on the down arrow next to New Task\nAlternatively, you can customise the cards as you see fit!',8,113),(41,'This is to be implemented in the future',8,114);
/*!40000 ALTER TABLE `CardTabField` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CardTemplate`
--

DROP TABLE IF EXISTS `CardTemplate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CardTemplate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` int NOT NULL,
  `cardTypeId` int NOT NULL,
  `kanbanId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CardTemplate_version_cardTypeId_kanbanId_key` (`version`,`cardTypeId`,`kanbanId`),
  KEY `CardTemplate_cardTypeId_idx` (`cardTypeId`),
  KEY `CardTemplate_kanbanId_idx` (`kanbanId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CardTemplate`
--

LOCK TABLES `CardTemplate` WRITE;
/*!40000 ALTER TABLE `CardTemplate` DISABLE KEYS */;
INSERT INTO `CardTemplate` VALUES (1,'task',1,3,1),(2,'bug',1,7,1),(3,'task',2,3,1),(4,'task',1,5,1),(5,'task',1,6,1),(6,'task',1,4,1),(7,'task',2,4,1),(8,'task',3,3,1),(9,'task',2,5,1),(10,'task',2,6,1),(11,'bug',2,7,1),(12,'bug',1,10,1),(13,'bug',1,8,1),(14,'bug',1,9,1),(15,'bug',3,7,1),(16,'bug',2,8,1),(17,'bug',2,9,1),(18,'bug',2,10,1),(19,'f simple',4,3,1),(20,'feat medium',3,4,1),(21,'feat hard',3,5,1),(22,'bug simple',4,7,1),(23,'bug medium',3,8,1),(24,'bug hard',3,9,1),(25,'feat simple',5,3,1),(26,'feat',3,6,1),(27,'task',1,1,2),(28,'bug',1,2,2),(29,'task',2,1,2),(30,'bug',2,2,2),(31,'bug',3,2,2),(32,'task',1,1,3),(33,'bug',1,2,3),(34,'Test',1,11,3),(35,'Test',2,11,3),(36,'Test',3,11,3);
/*!40000 ALTER TABLE `CardTemplate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CardTemplateTab`
--

DROP TABLE IF EXISTS `CardTemplateTab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CardTemplateTab` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `sizeX` int NOT NULL,
  `sizeY` int NOT NULL,
  `cardTemplateId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `CardTemplateTab_order_cardTemplateId_key` (`order`,`cardTemplateId`),
  KEY `CardTemplateTab_cardTemplateId_idx` (`cardTemplateId`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CardTemplateTab`
--

LOCK TABLES `CardTemplateTab` WRITE;
/*!40000 ALTER TABLE `CardTemplateTab` DISABLE KEYS */;
INSERT INTO `CardTemplateTab` VALUES (1,'Base information',1,1,2,1),(2,'Github',2,1,1,1),(3,'Error',1,2,2,2),(4,'Base information',1,2,2,3),(5,'Base information',1,2,2,4),(6,'Base information',1,2,2,6),(7,'Base information',1,2,2,5),(8,'Base information',1,2,2,7),(9,'Base information',1,2,2,8),(10,'Base information',1,2,2,9),(11,'Base information',1,2,2,10),(12,'Error',1,2,2,11),(13,'Error',1,2,2,13),(14,'Error',1,2,2,14),(15,'Error',1,2,2,12),(16,'Error',1,2,2,15),(17,'Error',1,2,2,16),(18,'Error',1,2,2,17),(19,'Error',1,2,2,18),(20,'Base information',1,2,2,19),(21,'Base information',1,2,2,20),(22,'Base information',1,2,2,21),(23,'Error',1,2,2,22),(24,'Error',1,2,2,23),(25,'Error',1,2,2,24),(26,'Base information',1,2,2,25),(27,'Base information',1,2,2,26),(28,'Base information',1,1,2,27),(29,'Github',2,1,1,27),(30,'Error',1,2,2,28),(31,'Base information',1,3,3,29),(32,'Error',1,2,2,30),(33,'Error',1,2,2,31),(34,'Base information',1,1,2,32),(35,'Github',2,1,1,32),(36,'Error',1,2,2,33),(37,'Base information',1,1,2,34),(38,'Github',2,1,1,34),(39,'Base information',1,2,3,35),(40,'Checkbox',2,1,2,35),(41,'Date picker',3,3,3,35),(42,'Dropdown',4,1,2,35),(43,'Tab 5',5,1,1,35),(44,'Base information',1,2,3,36),(45,'Checkbox',2,1,2,36),(46,'Date picker',3,3,3,36),(47,'Dropdown',4,1,2,36),(48,'GitHub',5,1,1,36);
/*!40000 ALTER TABLE `CardTemplateTab` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CardTemplateTabField`
--

DROP TABLE IF EXISTS `CardTemplateTabField`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CardTemplateTabField` (
  `id` int NOT NULL AUTO_INCREMENT,
  `data` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `posX` int NOT NULL,
  `posY` int NOT NULL,
  `fieldTypeId` int NOT NULL,
  `cardTemplateTabId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `CardTemplateTabField_fieldTypeId_idx` (`fieldTypeId`),
  KEY `CardTemplateTabField_cardTemplateTabId_idx` (`cardTemplateTabId`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CardTemplateTabField`
--

LOCK TABLES `CardTemplateTabField` WRITE;
/*!40000 ALTER TABLE `CardTemplateTabField` DISABLE KEYS */;
INSERT INTO `CardTemplateTabField` VALUES (1,'Short description',1,1,1,1),(2,'Extended description',1,2,2,1),(3,'To be done',1,1,8,2),(4,'Steps to reproduce error',1,1,2,3),(5,'Actual results',1,2,1,3),(6,'Expected result',2,2,1,3),(7,'Short description',1,1,1,4),(8,'Extended description',1,2,2,4),(9,'Expected due date;;0;undefined',2,1,3,4),(10,'Short description',1,1,1,5),(11,'Extended description',1,2,2,5),(12,'Expected due date;;0;undefined',2,1,3,5),(13,'Short description',1,1,1,6),(14,'Extended description',1,2,2,6),(15,'Expected due date;;0;undefined',2,1,3,6),(16,'Short description',1,1,1,7),(17,'Extended description',1,2,2,7),(18,'Expected due date;;0;undefined',2,1,3,7),(19,'Short description',1,1,1,8),(20,'Extended description',1,2,2,8),(21,'Expected due date;add 2 day;0;undefined',2,1,3,8),(22,'Short description',1,1,1,9),(23,'Extended description',1,2,2,9),(24,'Expected due date;add 1 day;0;undefined',2,1,3,9),(25,'Short description',1,1,1,10),(26,'Extended description',1,2,2,10),(27,'Expected due date;add 4 day;0;undefined',2,1,3,10),(28,'Short description',1,1,1,11),(29,'Extended description',1,2,2,11),(30,'Expected due date;add 8 day;0;undefined',2,1,3,11),(31,'Steps to reproduce error',1,1,2,12),(32,'Actual results',1,2,1,12),(33,'Expected result',2,2,1,12),(34,'Expected due date;;0;undefined',2,1,3,12),(35,'Steps to reproduce error',1,1,2,13),(36,'Actual results',1,2,1,13),(37,'Expected result',2,2,1,13),(38,'Expected due date;;0;undefined',2,1,3,13),(39,'Steps to reproduce error',1,1,2,14),(40,'Actual results',1,2,1,14),(41,'Expected result',2,2,1,14),(42,'Expected due date;;0;undefined',2,1,3,14),(43,'Steps to reproduce error',1,1,2,15),(44,'Actual results',1,2,1,15),(45,'Expected result',2,2,1,15),(46,'Expected due date;;0;undefined',2,1,3,15),(47,'Steps to reproduce error',1,1,2,16),(48,'Actual results',1,2,1,16),(49,'Expected result',2,2,1,16),(50,'Expected due date;add 2 day;0;undefined',2,1,3,16),(51,'Steps to reproduce error',1,1,2,17),(52,'Actual results',1,2,1,17),(53,'Expected result',2,2,1,17),(54,'Expected due date;add 3 day;0;undefined',2,1,3,17),(55,'Steps to reproduce error',1,1,2,18),(56,'Actual results',1,2,1,18),(57,'Expected result',2,2,1,18),(58,'Expected due date;add 5 day;0;undefined',2,1,3,18),(59,'Steps to reproduce error',1,1,2,19),(60,'Actual results',1,2,1,19),(61,'Expected result',2,2,1,19),(62,'Expected due date;add 9 day;0;undefined',2,1,3,19),(63,'Short description',1,1,1,20),(64,'Extended description',1,2,2,20),(65,'Expected due date;add 1 day;0;undefined',2,1,3,20),(66,'Short description',1,1,1,21),(67,'Extended description',1,2,2,21),(68,'Expected due date;add 2 day;0;undefined',2,1,3,21),(69,'Short description',1,1,1,22),(70,'Extended description',1,2,2,22),(71,'Expected due date;add 4 day;0;undefined',2,1,3,22),(72,'Steps to reproduce error',1,1,2,23),(73,'Actual results',1,2,1,23),(74,'Expected result',2,2,1,23),(75,'Expected due date;add 2 day;0;undefined',2,1,3,23),(76,'Steps to reproduce error',1,1,2,24),(77,'Actual results',1,2,1,24),(78,'Expected result',2,2,1,24),(79,'Expected due date;add 3 day;0;undefined',2,1,3,24),(80,'Steps to reproduce error',1,1,2,25),(81,'Actual results',1,2,1,25),(82,'Expected result',2,2,1,25),(83,'Expected due date;add 5 day;0;undefined',2,1,3,25),(84,'Short description',1,1,1,26),(85,'Extended description',1,2,2,26),(86,'Expected due date;add 1 day;0;undefined',2,1,3,26),(87,'Short description',1,1,1,27),(88,'Extended description',1,2,2,27),(89,'Expected due date;add 8 day;0;undefined',2,1,3,27),(90,'Short description',1,1,1,28),(91,'Extended description',1,2,2,28),(92,'To be done',1,1,8,29),(93,'Steps to reproduce error',1,1,2,30),(94,'Actual results',1,2,1,30),(95,'Expected result',2,2,1,30),(96,'Description of feature;Short description;0;undefined',1,1,1,31),(97,'Business justification;Reason for this job;0;undefined',1,2,2,31),(98,'Expected deadline;add 1 week;0;undefined',2,1,3,31),(99,'Location;Websites, servers or domains;0;undefined',2,2,2,31),(100,'Priority;0:Low,1:Medium,2:High;0;undefined',3,1,7,31),(101,'Customer\'s name;Or company/ group name;0;undefined',1,3,1,31),(102,'Customer\'s contact details;Email, phone, misc information;0;undefined',2,3,2,31),(103,'Misc information;Any other bits and bobs;0;undefined',3,3,2,31),(104,'Steps to reproduce error',1,1,2,32),(105,'Actual results',1,2,1,32),(106,'Expected result',2,2,1,32),(107,'Affected areas;0:Testing,1:Staging,2:Production;0;undefined',2,1,7,32),(108,'Steps to reproduce error',1,1,2,33),(109,'Actual results',1,2,1,33),(110,'Expected result',2,2,1,33),(111,'Affected areas;0:Testing,1:Staging,2:Production;0;undefined',2,1,6,33),(112,'Short description',1,1,1,34),(113,'Extended description',1,2,2,34),(114,'To be done',1,1,8,35),(115,'Steps to reproduce error',1,1,2,36),(116,'Actual results',1,2,1,36),(117,'Expected result',2,2,1,36),(118,'Short description',1,1,1,37),(119,'Extended description',1,2,2,37),(120,'To be done',1,1,8,38),(121,'Single line w/o placeholder optional;;0;undefined',1,1,1,39),(122,'Single line w placeholder optional;Single line placeholder goes here;0;undefined',1,2,2,39),(123,'Single line w placeholder required;A placeholder here;1;Custom error message for single line',1,3,1,39),(124,'Multi line w/o placeholder optional;;0;undefined',2,1,2,39),(125,'Multi line w placeholder optional;Custom multi line placeholder;0;undefined',2,2,2,39),(126,'Multi line w placeholder required;A placeholder goes here;1;Custom error message for multi line input',2,3,2,39),(127,'CBox optional;0:Choice i,1:Choice ii,2:Choice iii;0;undefined',1,1,6,40),(128,'CBox required;0:Choice a,1:Choice b,2:Choice c;1;Please select at least 1',1,2,6,40),(129,'Datepicker no default required;;1;You must choose a date',1,1,3,41),(130,'Datepicker 2 weeks ago optional;sub 2 week;0;undefined',1,2,3,41),(131,'Datepicker no default optional;;0;undefined',1,3,3,41),(132,'Datepicker today optional;today;0;undefined',2,1,3,41),(133,'Datepicker 3 months hence optional;add 3 month;0;undefined',2,2,3,41),(134,'Datepicker yesterday optional;sub 1 day;0;undefined',3,1,3,41),(135,'Datepicker 1 year hence optional;add 1 year;0;undefined',3,2,3,41),(136,'Drop down optional;0:Choice 1,1:Choice 2,2:Choice 3;0;undefined',1,1,7,42),(137,'Drop down required;0:Choice A,1:Choice B,2:Choice C;1;You must select an option!!',1,2,7,42),(138,'GitHub branch tracker',1,1,8,43),(139,'Single line w/o placeholder optional;;0;undefined',1,1,1,44),(140,'Single line w placeholder optional;Single line placeholder goes here;0;undefined',1,2,2,44),(141,'Single line w placeholder required;A placeholder here;1;Custom error message for single line',1,3,1,44),(142,'Multi line w/o placeholder optional;;0;undefined',2,1,2,44),(143,'Multi line w placeholder optional;Custom multi line placeholder;0;undefined',2,2,2,44),(144,'Multi line w placeholder required;A placeholder goes here;1;Custom error message for multi line input',2,3,2,44),(145,'CBox optional;0:Choice i,1:Choice ii,2:Choice iii;0;undefined',1,1,6,45),(146,'CBox required;0:Choice a,1:Choice b,2:Choice c;1;Please select at least 1',1,2,6,45),(147,'Datepicker no default required;;1;You must choose a date',1,1,3,46),(148,'Datepicker 2 weeks ago optional;sub 2 week;0;undefined',1,2,3,46),(149,'Datepicker no default optional;;0;undefined',1,3,3,46),(150,'Datepicker today optional;today;0;undefined',2,1,3,46),(151,'Datepicker 3 months hence optional;add 3 month;0;undefined',2,2,3,46),(152,'Datepicker yesterday optional;sub 1 day;0;undefined',3,1,3,46),(153,'Datepicker 1 year hence optional;add 1 year;0;undefined',3,2,3,46),(154,'Drop down optional;0:Choice 1,1:Choice 2,2:Choice 3;0;undefined',1,1,7,47),(155,'Drop down required;0:Choice A,1:Choice B,2:Choice C;1;You must select an option!!',1,2,7,47),(156,'GitHub branch tracker',1,1,8,48);
/*!40000 ALTER TABLE `CardTemplateTabField` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CardType`
--

DROP TABLE IF EXISTS `CardType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CardType` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CardType`
--

LOCK TABLES `CardType` WRITE;
/*!40000 ALTER TABLE `CardType` DISABLE KEYS */;
INSERT INTO `CardType` VALUES (1,'task'),(2,'bug'),(3,'feat - 1'),(4,'feat - 2'),(5,'feat - 4'),(6,'feat - 8'),(7,'bug - 1'),(8,'bug - 2'),(9,'bug - 4'),(10,'bug - 8'),(11,'CTest');
/*!40000 ALTER TABLE `CardType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FieldType`
--

DROP TABLE IF EXISTS `FieldType`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FieldType` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `implemented` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FieldType`
--

LOCK TABLES `FieldType` WRITE;
/*!40000 ALTER TABLE `FieldType` DISABLE KEYS */;
INSERT INTO `FieldType` VALUES (1,'Text field','A single line text field',1),(2,'Text area','A multi line text field',1),(3,'Date picker','A calendar that picks a date from a calendar',1),(4,'Comment','Comment section',0),(5,'File upload','Area to upload and download files',0),(6,'Check boxes','A checkbox area',1),(7,'Drop down','Drop down',1),(8,'Track Github branch','Tracks the status of branches in a repo',1);
/*!40000 ALTER TABLE `FieldType` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Kanban`
--

DROP TABLE IF EXISTS `Kanban`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Kanban` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Kanban`
--

LOCK TABLES `Kanban` WRITE;
/*!40000 ALTER TABLE `Kanban` DISABLE KEYS */;
INSERT INTO `Kanban` VALUES (1,'Card cost'),(2,'Board shown on online brochure'),(3,'Board shown in test');
/*!40000 ALTER TABLE `Kanban` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KanbanColumn`
--

DROP TABLE IF EXISTS `KanbanColumn`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KanbanColumn` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `boardId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `KanbanColumn_boardId_idx` (`boardId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KanbanColumn`
--

LOCK TABLES `KanbanColumn` WRITE;
/*!40000 ALTER TABLE `KanbanColumn` DISABLE KEYS */;
INSERT INTO `KanbanColumn` VALUES (1,'To do',1,1),(2,'Doing',1,1),(3,'Done',2,1),(4,'To do',1,2),(5,'Doing',1,2),(6,'Done',2,2),(7,'To do',1,3),(8,'Doing',1,3),(9,'Done',2,3);
/*!40000 ALTER TABLE `KanbanColumn` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `KanbanSwimLane`
--

DROP TABLE IF EXISTS `KanbanSwimLane`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `KanbanSwimLane` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order` int NOT NULL,
  `boardId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `KanbanSwimLane_boardId_idx` (`boardId`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `KanbanSwimLane`
--

LOCK TABLES `KanbanSwimLane` WRITE;
/*!40000 ALTER TABLE `KanbanSwimLane` DISABLE KEYS */;
INSERT INTO `KanbanSwimLane` VALUES (1,'Team 1',1,1),(2,'Team 2',2,1),(3,'Team 1',1,2),(4,'Team 2',2,2),(5,'Team 1',1,3),(6,'Team 2',2,3);
/*!40000 ALTER TABLE `KanbanSwimLane` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `LastKanbanUpdate`
--

DROP TABLE IF EXISTS `LastKanbanUpdate`;
/*!50001 DROP VIEW IF EXISTS `LastKanbanUpdate`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `LastKanbanUpdate` AS SELECT 
 1 AS `kanbanId`,
 1 AS `lastChange`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `TrackChanges`
--

DROP TABLE IF EXISTS `TrackChanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TrackChanges` (
  `timestamp` bigint NOT NULL,
  `dataCenterId` int NOT NULL,
  `machineId` int NOT NULL,
  `sequenceNumber` int NOT NULL,
  `userId` int NOT NULL,
  `kanbanId` int NOT NULL,
  `updateCardPositions` tinyint(1) NOT NULL DEFAULT '0',
  `updateColumnPositions` tinyint(1) NOT NULL DEFAULT '0',
  `updateSwimLanePositions` tinyint(1) NOT NULL DEFAULT '0',
  `updateCardTemplates` tinyint(1) NOT NULL DEFAULT '0',
  `updateCardData` tinyint(1) NOT NULL DEFAULT '0',
  `updatedCardId` int DEFAULT NULL,
  PRIMARY KEY (`timestamp`,`dataCenterId`,`machineId`,`sequenceNumber`),
  KEY `TrackChanges_userId_idx` (`userId`),
  KEY `TrackChanges_kanbanId_idx` (`kanbanId`),
  KEY `TrackChanges_updatedCardId_idx` (`updatedCardId`),
  CONSTRAINT `CHK_IncludeCardId` CHECK ((((`updateCardData` = true) and (`updatedCardId` is not null)) or ((`updateCardData` = false) and (`updatedCardId` is null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TrackChanges`
--

LOCK TABLES `TrackChanges` WRITE;
/*!40000 ALTER TABLE `TrackChanges` DISABLE KEYS */;
INSERT INTO `TrackChanges` VALUES (1713428232559,1,1,0,55034724,1,0,0,0,0,0,NULL),(1713428254362,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428267551,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428279074,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428285513,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428296005,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428304418,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428334962,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428347597,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428357581,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428368370,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428388638,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428397223,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428451833,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428463802,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428471634,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428486671,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428493965,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428499005,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428514314,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428531054,1,1,0,55034724,1,0,0,0,1,0,NULL),(1713428570841,1,1,0,55034724,2,0,0,0,0,0,NULL),(1713428682150,1,1,0,55034724,2,0,0,0,1,0,NULL),(1713428713268,1,1,0,55034724,2,0,0,0,1,0,NULL),(1713428718719,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428737632,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428752295,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428760687,1,1,0,55034724,2,0,0,0,1,0,NULL),(1713428764322,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428792585,1,1,0,55034724,2,0,0,0,0,1,4),(1713428798897,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428799354,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428867922,1,1,0,55034724,2,0,0,0,0,1,5),(1713428869496,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428870236,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428871684,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428873724,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428883482,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428946391,1,1,0,55034724,2,0,0,0,0,1,6),(1713428948956,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428951988,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428954108,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428954673,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428955296,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428955738,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428959462,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428961053,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428961583,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428964352,1,1,0,55034724,2,0,0,0,0,1,7),(1713428967133,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713428969339,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713429014434,1,1,0,55034724,2,0,0,0,0,1,7),(1713429016671,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713429030022,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713429031534,1,1,0,55034724,2,1,0,0,0,0,NULL),(1713478460955,1,0,0,55034724,3,0,0,0,0,0,NULL),(1713478539830,1,0,0,55034724,3,0,0,0,1,0,NULL),(1713479127794,1,0,0,55034724,3,0,0,0,1,0,NULL),(1713483933511,1,0,0,55034724,3,0,0,0,1,0,NULL);
/*!40000 ALTER TABLE `TrackChanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `githubId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_githubId_key` (`githubId`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'jingshianggu@gmail.com',55034724);
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserRoleKanban`
--

DROP TABLE IF EXISTS `UserRoleKanban`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserRoleKanban` (
  `userId` int NOT NULL,
  `kanbanId` int NOT NULL,
  `permission` enum('EDITOR','VIEWER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`userId`,`kanbanId`),
  KEY `UserRoleKanban_userId_idx` (`userId`),
  KEY `UserRoleKanban_kanbanId_idx` (`kanbanId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserRoleKanban`
--

LOCK TABLES `UserRoleKanban` WRITE;
/*!40000 ALTER TABLE `UserRoleKanban` DISABLE KEYS */;
INSERT INTO `UserRoleKanban` VALUES (1,1,'EDITOR'),(1,2,'EDITOR'),(1,3,'EDITOR');
/*!40000 ALTER TABLE `UserRoleKanban` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserToken`
--

DROP TABLE IF EXISTS `UserToken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserToken` (
  `githubId` int NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `refreshToken` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refreshExpiresAt` datetime(3) NOT NULL,
  PRIMARY KEY (`githubId`),
  KEY `UserToken_githubId_idx` (`githubId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserToken`
--

LOCK TABLES `UserToken` WRITE;
/*!40000 ALTER TABLE `UserToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('2b4881fa-3e96-4e87-8fb5-75141965d727','f9092db661d86e62e4b7a44a2f4d102a7dc8e8bbbbb068dc9ec23d5165c2f43d','2024-05-06 16:43:59.980','20240318142217_last_kanban_change_view',NULL,NULL,'2024-05-06 16:43:59.966',1),('3552e8b2-22f8-4dd6-b33f-9826316a2071','4b3ef81c645b9a1791f1016fa7d046b290abb86b20b27d597c23397595253e5c','2024-05-06 16:43:59.899','20240302212716_include_github_id',NULL,NULL,'2024-05-06 16:43:59.785',1),('4f6b284e-6d4e-462f-bec4-95595182cb1e','2b236228c69cbc2ac666b4a88a493598324b2e004943418eae8b8b954ab27113','2024-05-06 16:44:00.190','20240319160332_check_constraint',NULL,NULL,'2024-05-06 16:43:59.985',1),('5eaf2895-1007-41dd-bf18-289893ee4aa8','2ac047873fcec2114fd0677a56883422f20f0954420fb9fdb888c4feaa84e21e','2024-05-06 16:44:00.230','20240320201219_migrate_field_data',NULL,NULL,'2024-05-06 16:44:00.201',1),('8cf9b97c-9be1-4c29-a61e-38491a4c66e0','7d64728f049aba870d244951fa0c55cb1bb69a41bde2d7d7deb7bf5626f31100','2024-05-06 16:43:59.961','20240317141216_track_kanban_changes',NULL,NULL,'2024-05-06 16:43:59.904',1),('a20bd1cd-241d-42e1-9efa-6cc8d031b4bb','a6969c768955a3e01fcd6e32a272598335570015faaefee44896d346976377f7','2024-05-06 16:43:59.779','20240229000801_init',NULL,NULL,'2024-05-06 16:43:59.313',1),('d1452ff6-bb68-40f5-9ab9-bf28563f1ebd','33ab1827e5ab3c5fec9b5cd3b093b15708e127a4044245d324ee0001185c8d6c','2024-05-06 16:44:00.366','20240419205233_track_active_card_types',NULL,NULL,'2024-05-06 16:44:00.236',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `LastKanbanUpdate`
--

/*!50001 DROP VIEW IF EXISTS `LastKanbanUpdate`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `LastKanbanUpdate` AS select `TrackChanges`.`kanbanId` AS `kanbanId`,max(`TrackChanges`.`timestamp`) AS `lastChange` from `TrackChanges` group by `TrackChanges`.`kanbanId` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-07 12:33:22
