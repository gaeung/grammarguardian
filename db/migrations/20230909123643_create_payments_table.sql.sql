-- migrate:up
CREATE TABLE Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tid VARCHAR(50) NOT NULL,
    plan_type_id INT NOT NULL,
    method VARCHAR(20) NOT NULL,
    status ENUM('Completed', 'Failed', 'Cancelled') NOT NULL,
    amount INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (plan_type_id) REFERENCES PlanTypes(id)
);

-- migrate:down
DROP TALBE Payments;
