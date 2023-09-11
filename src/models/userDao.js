const { appDataSource } = require("./appDataSource");

const getUserInfo = async (value, field) => {
  if (field === "email") {
    const user = await appDataSource.query(
      `
      SELECT
        id,
        password        AS hashedPassword
      FROM
        Users
      WHERE
        email = ?;
      `,
      [value]
    );

    return user;
  }

  if (field === "socialUser") {
    const user = await appDataSource.query(
      `
      SELECT
        *
      FROM
        Users
      WHERE
        social_id = ?;
      `,
      [value]
    );

    return user;
  }

  if (field === "userId") {
    const user = await appDataSource.query(
      `
      SELECT
        plan_type_id
      FROM 
        Users
      WHERE
        id = ?;
      `,
      [value]
    );

    return user;
  }
};

const createUser = async (
  nickname,
  email,
  password,
  socialId,
  socialTypeId
) => {
  return appDataSource.query(
    `INSERT INTO Users (
      nickname,
      email,
      password,
      social_id,
      social_type_id
    )
    VALUES (
      ?,
      ?,
      ?,
      ?,
      ?
    )`,
    [nickname, email, password, socialId, socialTypeId]
  );
};

const updateGrade = async (userId, newGrade) => {
  return appDataSource.query(
    `
      UPDATE 
        Users
      SET 
        plan_type_id = ?
      WHERE 
        id = ?;
    `,
    [newGrade, userId]
  );
};

module.exports = {
  getUserInfo,
  createUser,
  updateGrade,
};
