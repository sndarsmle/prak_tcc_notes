import Notes from "../models/NotesModel.js";

// CREATE
export const createNotes = async (req, res) => {
  const { title, content } = req.body;
  const user_id = req.userId;

  console.log("data param", req.body);
  console.log("User ID from token:", user_id);

  if (!user_id) {
    return res.status(400).json({ message: "User ID tidak ditemukan. Pastikan token valid." });
  }

  try {
    const notes = await Notes.create({
      title,
      content,
      user_id, // biarkan Sequelize tangani date_created dan date_updated
    });

    res.status(201).json({
      message: "Notes baru berhasil dibuat",
      user_id,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET
export const getNotes = async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId;
  
  if (!user_id) {
    return res.status(400).json({ message: "User ID tidak ditemukan. Pastikan token valid." });
  }

  try {
    const notes = id
      ? await Notes.findAll({ where: { id, user_id: user_id } }) // Changed from 'userid' to 'user_id'
      : await Notes.findAll({ where: { user_id: user_id } }); // Changed from 'userid' to 'user_id'

    res.status(200).json({
      message: "Notes berhasil diambil",
      id: id,
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateNotes = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const user_id = req.userId; // Changed from 'userid' to 'user_id'

  if (!user_id) {
    return res.status(400).json({ message: "User ID tidak ditemukan. Pastikan token valid." });
  }

  try {
    const [updatedRows] = await Notes.update( // Sequelize update mengembalikan array [jumlahBarisYangDiupdate]
      {
        title,
        content,
      },
      {
        where: {
          id,
          user_id: user_id, 
        },
      }
    );

    if (updatedRows > 0) {
        const updatedNote = await Notes.findOne({ where: { id, user_id: user_id } });
        res.status(200).json({
          message: "Notesmu berhasil diupdate",
          data: updatedNote
        });
    } else {
        res.status(404).json({
            message: "Notes tidak ditemukan atau Anda tidak memiliki hak untuk mengupdate."
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deleteNotes = async (req, res) => {
  const { id } = req.params;
  const user_id = req.userId; // Tambahkan ini untuk memastikan hanya pemilik yang bisa menghapus

  if (!user_id) {
    return res.status(400).json({ message: "User ID tidak ditemukan. Pastikan token valid." });
  }

  try {
    const deletedRows = await Notes.destroy({
      where: {
        id,
        user_id: user_id, // Hanya hapus jika user_id cocok
      },
    });

    if (deletedRows > 0) {
        res.status(200).json({
          message: "Notesmu baru saja dihapus",
        });
    } else {
        res.status(404).json({
            message: "Notes tidak ditemukan atau Anda tidak memiliki hak untuk menghapus."
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
