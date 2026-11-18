const Siswa = require('../models/Siswa');

exports.getAllSiswa = async (req, res) => {
  try {
    const data = await Siswa.findAll();
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil data siswa',
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa',
      error: error.message
    });
  }
};

exports.getSiswaByKode = async (req, res) => {
  try {
    const { kode } = req.params;
    const siswa = await Siswa.findByKode(kode);
    if (!siswa) {
      return res.status(404).json({
        success: false,
        message: `Siswa dengan kode ${kode} tidak ditemukan`
      });
    }
    res.status(200).json({
      success: true,
      message: 'Berhasil mengambil detail siswa',
      data: siswa
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail siswa',
      error: error.message
    });
  }
};

exports.createSiswa = async (req, res) => {
  try {
    const { kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

    // Validasi input
    if (!kode_siswa || !nama_siswa || !alamat_siswa || !tgl_siswa || !jurusan_siswa) {
      return res.status(400).json({
        success: false,
        message: 'Semua field (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa) wajib diisi'
      });
    }

    // Cek duplikasi kode
    const existing = await Siswa.findByKode(kode_siswa);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Kode siswa ${kode_siswa} sudah digunakan`
      });
    }

    const created = await Siswa.create({
      kode_siswa,
      nama_siswa,
      alamat_siswa,
      tgl_siswa,
      jurusan_siswa
    });

    res.status(201).json({
      success: true,
      message: 'Data siswa berhasil ditambahkan',
      data: created
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan data siswa',
      error: error.message
    });
  }
};

exports.updateSiswa = async (req, res) => {
  try {
    const { kode } = req.params;
    const { nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa } = req.body;

    if (!nama_siswa || !alamat_siswa || !tgl_siswa || !jurusan_siswa) {
      return res.status(400).json({
        success: false,
        message: 'Semua field wajib diisi untuk pembaruan data'
      });
    }

    const updated = await Siswa.update(kode, {
      nama_siswa,
      alamat_siswa,
      tgl_siswa,
      jurusan_siswa
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Siswa dengan kode ${kode} tidak ditemukan`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data siswa berhasil diperbarui'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui data siswa',
      error: error.message
    });
  }
};

exports.deleteSiswa = async (req, res) => {
  try {
    const { kode } = req.params;
    const deleted = await Siswa.delete(kode);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Siswa dengan kode ${kode} tidak ditemukan`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Data siswa berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus data siswa',
      error: error.message
    });
  }
};
