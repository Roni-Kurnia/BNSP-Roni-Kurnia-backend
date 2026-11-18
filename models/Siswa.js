const db = require("../config/database");

class Siswa {
  constructor({
    id,
    kode_siswa,
    nama_siswa,
    alamat_siswa,
    tgl_siswa,
    jurusan_siswa,
  }) {
    this.id = id;
    this.kode_siswa = kode_siswa;
    this.nama_siswa = nama_siswa;
    this.alamat_siswa = alamat_siswa;
    this.tgl_siswa = tgl_siswa;
    this.jurusan_siswa = jurusan_siswa;
  }

  static async findAll() {
    const [rows] = await db.query("SELECT * FROM siswa ORDER BY id DESC");
    return rows;
  }

  static async findByKode(kode_siswa) {
    const [rows] = await db.query("SELECT * FROM siswa WHERE kode_siswa = ?", [
      kode_siswa,
    ]);
    return rows.length ? new Siswa(rows[0]) : null;
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM siswa WHERE id = ?", [id]);
    return rows.length ? new Siswa(rows[0]) : null;
  }

  static async create(payload) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const query = `
        INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [result] = await connection.query(query, [
        payload.kode_siswa,
        payload.nama_siswa,
        payload.alamat_siswa,
        payload.tgl_siswa,
        payload.jurusan_siswa,
      ]);

      await connection.commit();
      return { id: result.insertId, ...payload };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(kode_siswa, payload) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const query = `
        UPDATE siswa
        SET nama_siswa = ?, alamat_siswa = ?, tgl_siswa = ?, jurusan_siswa = ?
        WHERE kode_siswa = ?
      `;
      const [result] = await connection.query(query, [
        payload.nama_siswa,
        payload.alamat_siswa,
        payload.tgl_siswa,
        payload.jurusan_siswa,
        kode_siswa,
      ]);

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async delete(kode_siswa) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [result] = await connection.query(
        "DELETE FROM siswa WHERE kode_siswa = ?",
        [kode_siswa],
      );

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Siswa;
