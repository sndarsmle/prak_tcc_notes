import { useState, useEffect } from "react";
import useAuth from "../auth/useAuth";
import axios from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

function Notes() {
  const { accessToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editNote, setEditNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/notes", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotes(res.data.data);
    } catch (err) {
      console.error("Gagal fetch catatan:", err);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
    setEditNote(null);
    setTitle("");
    setContent("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditNote(null);
    setTitle("");
    setContent("");
  };

  const handleEdit = (note) => {
    setShowForm(true);
    setEditNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus catatan ini?")) {
      try {
        await axios.delete(`/delete-notes/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        fetchNotes();
      } catch (err) {
        console.error("Gagal hapus catatan:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, content };
    const config = { headers: { Authorization: `Bearer ${accessToken}` } };

    try {
      if (editNote) {
        await axios.put(`/edit-notes/${editNote.id}`, payload, config);
      } else {
        await axios.post("/add-notes", payload, config);
      }
      fetchNotes();
      handleCancel();
    } catch (err) {
      console.error("Gagal simpan catatan:", err);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <Navbar />

        <div className="is-flex is-flex-direction-column is-align-items-center mb-5">
          <h1 className="title is-2 has-text-dark">AKSARA APP.</h1>
          <h4 className="subtitle is-6 has-text-grey">
            Ikat hasil buruanmu dengan tali, ikat ilmumu dengan tulisan
          </h4>
        </div>

        {!showForm && (
          <div className="is-flex is-justify-content-end mb-5">
            <button className="button is-primary" onClick={handleCreate}>
              ➕ Buat Catatan
            </button>
          </div>
        )}

        {showForm ? (
          <div className="card has-background-light mb-5" style={{ maxWidth: "500px", margin: "auto" }}>
            <header className="card-header">
              <p className="card-header-title has-text-dark">
                {editNote ? "Edit Catatan" : "Tambah Catatan Baru"}
              </p>
              <button className="button is-light is-small ml-3" onClick={handleCancel}>
                <FaArrowLeft /> Kembali
              </button>
            </header>
            <div className="card-content">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label className="label has-text-dark">Judul Catatan</label>
                  <div className="control">
                    <input
                      className="input is-primary"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label has-text-dark">Isi Catatan</label>
                  <div className="control">
                    <textarea
                      className="textarea is-info"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="field is-grouped is-justify-content-space-between">
                  <button type="submit" className={`button ${editNote ? "is-warning" : "is-success"}`}>
                    {editNote ? "Simpan Perubahan" : "Simpan Catatan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : notes.length === 0 ? (
          <p className="has-text-centered has-text-dark">Belum ada catatan.</p>
        ) : (
          <div className="columns is-multiline">
            {notes.map((note) => (
              <div key={note.id} className="column is-one-third">
                <div className="card has-background-light">
                  <header className="card-header">
                    <p className="card-header-title has-text-dark">{note.title}</p>
                    <div className="card-header-icon">
                      <button
                        className="button is-white is-small has-text-warning"
                        onClick={() => handleEdit(note)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="button is-white is-small has-text-danger"
                        onClick={() => handleDelete(note.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </header>
                  <div className="card-content has-text-dark">
                    <div className="content">{note.content}</div>
                    <p className="has-text-grey mt-3">
                      🕒 Dibuat:{" "}
                      {note.date_created
                        ? new Date(note.date_created).toLocaleDateString()
                        : "-"}{" "}
                      | 🔄 Diperbarui:{" "}
                      {note.date_updated
                        ? new Date(note.date_updated).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Notes;
