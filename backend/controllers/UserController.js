import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
async function createUser(req, res) {
  try {
    const { name, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({ msg: "Password tidak sama" });
    }   

    const encryptPassword = await bcrypt.hash(password, 5);

    await User.create({
      name,
      email,
      password: encryptPassword,
    });
    
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error.message);
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ msg: "Email sudah terdaftar." });
    }
    res.status(500).json({ msg: "Terjadi kesalahan saat mendaftar" });
  }
}

// LOGIN
async function loginHandler(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const decryptPassword = await bcrypt.compare(password, user.password);
      if (decryptPassword) {
        const userPlain = user.toJSON();
        // Pastikan id ada di safeUserData jika akan digunakan di token
        const { password: _, refresh_token: __, ...safeUserData } = userPlain;

        const accessToken = jwt.sign(safeUserData, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "30s", // Anda mungkin ingin memperpanjang ini untuk pengujian
        });
        const refreshToken = jwt.sign(safeUserData, process.env.REFRESH_TOKEN_SECRET, {
          expiresIn: "1d",
        });

        // req.userId = user.id; // Diubah dari req.userid untuk konsistensi
                              // Meskipun ini mungkin tidak krusial jika tidak digunakan
                              // langsung dalam rantai middleware yang sama setelah login.
                              // Yang lebih penting adalah payload token berisi id.

        await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "none", // Sesuaikan dengan kebutuhan production Anda (misal 'Lax' atau 'Strict')
          secure: true, // Harus true jika sameSite='None'
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
          status: "Success",
          message: "Login Berhasil",
          data: { // Membungkus data pengguna dan token dalam objek data
            id: safeUserData.id,
            name: safeUserData.name,
            email: safeUserData.email
          },
          accessToken,
        });
      } else {
        res.status(400).json({ status: "Failed", message: "Password atau email salah" });
      }
    } else {
      res.status(400).json({ status: "Failed", message: "Password atau email salah" });
    }
  } catch (error) {
    res.status(500).json({ status: "Error", message: error.message });
  }
}

// LOGOUT
async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // No content

    const user = await User.findOne({
      where: { refresh_token: refreshToken },
    });

    // Jika tidak ada user dengan refresh token tersebut atau token sudah null di DB
    if (!user || !user.refresh_token) {
        res.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: true });
        return res.sendStatus(204); // No content
    }

    const userId = user.id;
    await User.update({ refresh_token: null }, { where: { id: userId } });

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(200); // Berhasil logout
  } catch(error){
    console.log(error);
    res.status(500).json({message: "Terjadi kesalahan saat logout"});
  }
}

export { createUser, loginHandler, logout };