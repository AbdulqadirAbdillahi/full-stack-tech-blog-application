const sequelize = require("./config/connection");
const { Post } = require("./models");

(async () => {
  try {
    await sequelize.sync({ alter: true }); // updates the table structure
    console.log("Tables synced!");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
})();