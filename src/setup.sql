CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


INSERT INTO organizations
( name, description, email, logo_filename)
VALUES ( 'BrightFuture Builders','A nonprofit focused on improving community infrastructure through sustainable construction projects', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers','An urban farming collective promoting food sustainability and education in local neighborhoods','contact@greenharvest.org','greenharvest-logo.png'),
('UnityServe Volunteers','A volunteer coordination group supporting local charities and service initiatives','hello@unityserve.org','unityserve-logo.png');

CREATE TABLE service_project
(project_id SERIAL PRIMARY KEY,
 title VARCHAR(150) NOT NULL, 
 description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
   date DATE NOT NULL, 
   organization_id INTEGER NOT NULL,
   CONSTRAINT FK_Organization FOREIGN KEY(organization_id) REFERENCES organizations(organization_id));

INSERT INTO service_project
(title, description, location, date, organization_id)
VALUES
('Community School Renovation','Renovate classrooms and improve learning facilities for local students','Ibadan','2026-09-20', 1),
('Clean Water Project','Provide clean and accessible drinking water for a local community','Ibadan','2026-10-05',1),
('Youth Skills Workshop','Teach young people practical skills to improve their employment opportunities','Ibadan','2026-10-18',1),
('Community Road Repair','Repair damaged sections of roads used by residents and businesses','Oyo','2026-11-02',1),
('Tree Planting Campaign','Plant trees and educate residents about protecting the local environment','Ibadan','2026-11-15',1),
('Food Distribution Drive',
 'Distribute food packages to families experiencing financial difficulties',
 'Ibadan',
 '2026-09-25',
 2),('Neighborhood Cleanup',
 'Organize volunteers to clean streets and remove accumulated waste',
 'Ibadan',
 '2026-10-10',
 2),('Elderly Support Program',
 'Provide companionship and basic assistance to elderly community members',
 'Ibadan',
 '2026-10-22',
 2),('School Supply Donation',
 'Collect and distribute educational supplies to students in need',
 'Ogbomoso',
 '2026-11-05',
 2),('Community Health Outreach',
 'Provide basic health education and community wellness services',
 'Ibadan',
 '2026-11-20',
 2),('Children''s Reading Program',
 'Help children develop reading skills through weekly community sessions',
 'Ibadan',
 '2026-09-28',
 3),('Women''s Entrepreneurship Workshop',
 'Provide business training and resources for women starting small businesses',
 'Ibadan',
 '2026-10-12',
 3),('Environmental Awareness Day',
 'Educate residents about waste management and environmental protection',
 'Oyo',
 '2026-10-26',
 3),('Community Garden Project',
 'Establish a community garden to encourage food production and cooperation',
 'Ibadan',
 '2026-11-08',
 3),('Digital Literacy Program',
 'Teach basic computer and internet skills to community members',
 'Ibadan',
 '2026-11-25',
 3);

 CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
INSERT INTO category (name)
VALUES
('Community Development'),
('Education'),
('Environment'),
('Healthcare'),
('Technology');

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
PRIMARY KEY (project_id, category_id),
CONSTRAINT fk_project
FOREIGN KEY (project_id)
REFERENCES service_project(project_id),
CONSTRAINT fk_category
FOREIGN KEY (category_id) REFERENCES category(category_id)
);


INSERT INTO project_category (project_id, category_id)
VALUES
(1, 2),
(1, 1),
(2, 1),
(2, 4),
(3, 2),
(3, 5),
(4, 1),
(5, 3),
(6, 1),
(6, 4),
(7, 3),
(7, 1),
(8, 4),
(8, 1),
(9, 2),
(10, 4),
(10, 1),
(11, 2),
(12, 2),
(12, 5),
(13, 3),
(13, 2),
(14, 3),
(14, 1),
(15, 5),
(15, 2);

