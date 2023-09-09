const { appDataSource } = require("./appDataSource");

const createPayment = async (userId, tid, planId, method, status, amount) => {
  return await appDataSource.query(
    `
      INSERT INTO Payments 
      (
        user_id,
        tid,
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
        ?
      )`,
    [userId, tid, planId, method, status, amount]
  );
};

module.exports = {
  createPayment,
};
