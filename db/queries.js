const pool = require("./pool");

exports.findByUsername = async (username) => {
  const { rows } = await pool.query(
    "select * from members where username = $1",
    [username]
  );
  return rows[0];
};

exports.pushMember = async (username, fullName, password, status) => {
  await pool.query(
    "insert into members (username, fullname, password, status) values ($1, $2, $3, $4)",
    [username, fullName, password, status]
  );
};

exports.addMessage = async (message, date, username) => {
  await pool.query(
    "insert into messages (message, date, username) values ($1, $2, $3)",
    [message, date, username]
  );
};

exports.getAllMessages = async () => {
  const { rows } = await pool.query("select * from messages");
  return rows;
};

exports.deleteMessage = async (messageid) => {
  await pool.query("delete from messages where messageid = $1", [messageid]);
};
