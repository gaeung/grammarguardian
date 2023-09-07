-- migrate:up
CREATE TABLE History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    kor_input_text TEXT NOT NULL,
    eng_input_text TEXT NOT NULL,
    feedback TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- migrate:down
DROP TABLE History;
