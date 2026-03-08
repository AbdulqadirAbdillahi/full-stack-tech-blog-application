const { Model, DataTypes, Sequelize } = require("sequelize");
const sequelize = require("../config/connection");

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postedBy: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "User",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // optional: default to "Premier League"
    },
    createdOn: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "post",
  }
);

module.exports = Post;