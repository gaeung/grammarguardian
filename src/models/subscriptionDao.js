const { appDataSource } = require("./appDataSource");

const createSubscription = async (userId, planId, startDate, endDate) => {
  return await appDataSource.query(
    `
      INSERT INTO Subscriptions 
          (
          user_id,
          plan_type_id,
          start_date,
          end_date
        )
        VALUES 
        (
          ?,
          ?,
          ?,
          ?
        )
      `,
    [userId, planId, startDate, endDate]
  );
};

module.exports = { createSubscription };
