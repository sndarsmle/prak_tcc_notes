import { DataTypes } from "sequelize";
import db from "../config/Database.js";

// Membuat tabel "user"
const Users = db.define(
  "users", // Nama Tabel
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Kolom id otomatis bertambah setiap pengguna baru
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Pastikan field ini diisi
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // Pastikan email diisi
      unique: true, // Menambahkan constraint agar email tidak duplikat
      validate: {
        isEmail: true, // Validasi format email
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Pastikan password diisi
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true, // Bisa kosong pada awalnya
    },
  },
  {
    freezeTableName: true,
  }
);

db.sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Error syncing database:", err));

export default Users;
