const connection = require('../config/mysql.js')

module.exports = {
  getExperienceModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM experiance_pekerja WHERE id_pekerja=${id}`,
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
  getExperienceByIdModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM experiance_pekerja WHERE id=?',
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
  addExperienceModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'insert into experiance_pekerja set ?',
        setData,
        (err, result) => {
          const newResult = {
            ...setData
          }
          !err ? resolve(newResult) : reject(new Error(err))
        }
      )
    })
  },
  editExperienceModel: (setData, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `UPDATE experiance_pekerja SET ? WHERE id=${id}`,
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
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
  deleteExperienceModel: (id, id_pekerja) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM experiance_pekerja WHERE id=${id} AND id_pekerja=${id_pekerja}`,
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  deleteAllModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM experiance_pekerja WHERE id_pekerja = ${id}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  }
}
