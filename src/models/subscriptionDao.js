const { appDataSource } = require("./appDataSource");

const checkSubscription = async () => {
  return await appDataSource.query(
    `
      SELECT 
        id, 
        user_id         AS userId,
        plan_type_id    AS planId,
        tid, 
        sid
      FROM 
        Subscriptions
      WHERE 
        status = "Active" AND end_date > NOW();
    `
  );
};

const getSubscriptionInfo = async (userId) => {
  return await appDataSource.query(
    `
      SELECT
        tid,
        sid,
        plan_type_id  AS planId
      FROM
        Subscriptions
      WHERE
        status = "Active" AND user_id = ?
    `,
    [userId]
  );
};

const createSubscription = async (
  userId,
  planId,
  tid,
  sid,
  status,
  startDate,
  endDate
) => {
  return await appDataSource.query(
    `
      INSERT INTO Subscriptions 
        (
          user_id,
          plan_type_id,
          tid, 
          sid,
          status,
          start_date,
          end_date
        )
      VALUES 
        (
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
    `,
    [userId, planId, tid, sid, status, startDate, endDate]
  );
};

const updateSubscription = async (userId, sid, planId, endDate) => {
  return await appDataSource.query(
    `
      UPDATE 
        Subscriptions 
      Set 
        end_date = ? 
      WHERE 
        user_id = ? AND sid = ? AND plan_type_id = ?;
    `,
    [endDate, userId, sid, planId]
  );
};

module.exports = {
  checkSubscription,
  getSubscriptionInfo,
  createSubscription,
  updateSubscription,
};
