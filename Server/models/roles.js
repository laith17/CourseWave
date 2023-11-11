// const { DataTypes } = require("sequelize");
// const sequelize = require("../db/db");

// const roles = sequelize.define(
//   "roles",
//   {
//     role_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     roleName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   },
//   {
//     timestamps: false, // This disables the createdAt and updatedAt columns
//   }
// );

// const initialRoles = [{ roleName: "Admin" }, { roleName: "User" }];

// // Synchronize the model with the database
// roles.sync({ force: true }).then(async () => {
//   // Bulk insert initial roles into the database
//   await roles.bulkCreate(initialRoles);
//   console.log("Roles initialized successfully");
// });

// module.exports = roles;
