-- migrate:up
CREATE TABLE Subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_type_id INT NOT NULL,
    tid VARCHAR(50) NOT NULL,
    sid VARCHAR(50) NOT NULL,
    status ENUM('Active', 'Inactive') NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (plan_type_id) REFERENCES PlanTypes(id)
);

-- migrate:down
DROP TABLE Subscriptions;
