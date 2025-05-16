import db from "../config/Database.js";
import Notes from "./NotesModel.js";
import Users from "./UserModel.js";

Users.hasMany(Notes, {
  foreignKey: "user_id",  // Changed from 'userid' to 'user_id'
  onDelete: "CASCADE",
});

Notes.belongsTo(Users, {
  foreignKey: "user_id",  // Changed from 'userid' to 'user_id'
});

(async () => {
  try {
    await db.authenticate();
    console.log("Koneksi database berhasil!");

    await db.sync({ alter: true });
    console.log("Semua tabel berhasil disinkronisasi.");
  } catch (err) {
    console.error("Gagal konek DB:", err);
  }
})();

export { Users, Notes };
