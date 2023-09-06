-- migrate:up
CREATE TABLE SocialTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(255) NOT NULL UNIQUE
);

-- migrate:down
DROP TABLE SocialTypes;
