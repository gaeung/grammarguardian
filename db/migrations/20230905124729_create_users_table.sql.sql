-- migrate:up
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nickname VARCHAR(255) UNIQUE NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    social_id BIGINT NULL,
    social_type_id INT NOT NULL,
    plan_id INT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (social_type_id) REFERENCES SocialTypes(id),
    FOREIGN KEY (plan_type_id) REFERENCES Plans(id)
);

-- migrate:down
DROP TABLE Users;
