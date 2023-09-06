-- migrate:up
CREATE TABLE PlanTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL UNIQUE
);

-- migrate:down
DROP TABLE plans;
