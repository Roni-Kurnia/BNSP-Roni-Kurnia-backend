const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/database');
const siswaRoutes = require('./routes/siswaRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/siswa', siswaRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'Backend API Siswa - Sertifikasi BNSP Web Developer'
  });
});

// Cek koneksi basis data sebelum listen
db.getConnection()
  .then((conn) => {
    console.log('✅ Terhubung ke database MySQL (db_sekolah)');
    conn.release();
    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ Peringatan: Tidak dapat terhubung ke MySQL secara langsung:', err.message);
    console.warn('⚠️ Pastikan MySQL (Laragon/XAMPP) sudah dijalankan dan database db_sekolah sudah di-import.');
    app.listen(PORT, () => {
      console.log(`🚀 Server tetap berjalan di http://localhost:${PORT} (menunggu koneksi database)`);
    });
  });
