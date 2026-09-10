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