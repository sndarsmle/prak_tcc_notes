import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosInstance";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/register", {
        name,
        email,
        password,
        confirm_password: confirm,
      });
      alert("Registrasi berhasil, silakan login.");
      navigate("/login");
    } catch (err) {
      alert("Gagal mendaftar. Pastikan data valid.");
    }
  };

  return (
    <section className="section is-flex is-justify-content-center is-align-items-center">
      <div className="auth-box">
        <h2 className="auth-title">Buat Akun Baru</h2>
        <form onSubmit={handleRegister}>
          <div className="field">
            <label className="label">Nama</label>
            <div className="control">
              <input
                className="input"
                placeholder="Nama lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Alamat email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Konfirmasi Password</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Ulangi password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="button is-success is-fullwidth mt-4">
            Daftar
          </button>
        </form>
        <p className="auth-subtext">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>
      </div>
    </section>
  );
}

export default RegisterPage;
