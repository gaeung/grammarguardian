const { appDataSource } = require("./appDataSource");

const createHistory = async (userId, korText, engText, feedback) => {
  return appDataSource.query(
    `
    INSERT INTO 
      History 
    (
      user_id,
      kor_input_text,
      eng_input_text,
      feedback
    )
    VALUES 
    (
      ?,
      ?,
      ?,
      ?
    )
    `,
    [userId, korText, engText, feedback]
  );
};

module.exports = {
  createHistory,
};
