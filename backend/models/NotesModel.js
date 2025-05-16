import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Notes = db.define(
  "notes",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Kolom id otomatis bertambah setiap catatan baru
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false, // Pastikan field ini diisi
    },

    content: {
      type: DataTypes.TEXT,
      allowNull: false, // Pastikan field ini diisi
    },

    // Menambahkan user_id untuk relasi dengan User
    user_id: {  // Changed from 'userid' to 'user_id'
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: "date_created",
    updatedAt: "date_updated",
  }
);

export default Notes;

(async () => {
  await db.sync();
})();
