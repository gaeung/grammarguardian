const { appDataSource } = require("./appDataSource");

const createPayment = async (
  userId,
  tid,
  sid,
  planId,
  method,
  status,
  amount
) => {
  return await appDataSource.query(
    `
      INSERT INTO Payments 
      (
        user_id,
        tid,
        sid,
        plan_type_id,
        method,
        status,
        amount
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
      )`,
    [userId, tid, sid, planId, method, status, amount]
  );
};

module.exports = { createPayment };
