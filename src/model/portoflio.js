const connection = require('../config/mysql.js')

module.exports = {
  editPortofolioModel: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE portofolio SET ? WHERE id = ${id}`,
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: id,
              ...setData
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  deletePortofolioModel: (id, id_pekerja) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM portofolio WHERE id=${id} AND id_pekerja=${id_pekerja}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  addPortofolioModel: (setPorto) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO portofolio SET ?',
        setPorto,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setPorto
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  getPhotoPortofolioModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT image_portofolio AS photo FROM portofolio WHERE id=${id}`,
        (error, result) => {
          if (!error) {
            resolve(result[0].photo)
          } else {
            reject(error)
          }
        }
      )
    })
  },
  getPortofolioByIdModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM portofolio WHERE id_pekerja=?',
        id,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(error)
          }
        }
      )
    })
  },
  getPortofolioModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM profile_pekerja WHERE id_pekerja=${id}`,
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(error)
          }
        }
      )
    })
  }
}
