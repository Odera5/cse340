CREATE TABLE Organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description text NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


INSERT INTO Organizations
( name, description, email, logo_filename)
VALUES ( 'BrightFuture Builders','A nonprofit focused on improving community infrastructure through sustainable construction projects', 'info@brightfuturebuilders.org', 'brightfuture-logo.png');

INSERT INTO Organizations
(name,description,email,logo_filename)
VALUES ('GreenHarvest Growers','An urban farming collective promoting food sustainability and education in local neighborhoods','contact@greenharvest.org','greenharvest-logo.png');

INSERT INTO Organizations
(name, description, email, logo_filename)
VALUES ('UnityServe Volunteers','A volunteer coordination group supporting local charities and service initiatives','hello@unityserve.org','unityserve-logo.png');


CREATE TABLE service_project
(project_id SERIAL PRIMARY KEY,
 title VARCHAR(150) NOT NULL, 
 description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
   date DATE NOT NULL, 
   organization_id INTEGER NOT NULL,
   CONSTRAINT FK_Organization FOREIGN KEY(organization_id) REFERENCES Organizations(organization_id));

INSERT INTO service_project
(title,description, location, date, organization_id)
VALUES ('Community School Renovation','Renovate classrooms and improve learning facilities for local students','Ibadan','2026-09-20', 1),
('Clean Water Project','Provide clean and accessible drinking water for a local community','Ibadan','2026-10-05',1),
('Youth Skills Workshop','Teach young people practical skills to improve their employment opportunities','Ibadan','2026-10-18',1),
('Community Road Repair','Repair damaged sections of roads used by residents and businesses','Oyo','2026-11-02',1),
('Tree Planting Campaign','Plant trees and educate residents about protecting the local environment','Ibadan','2026-11-15',1);

INSERT INTO service_project
(title, description, location, date, organization_id)
VALUES
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