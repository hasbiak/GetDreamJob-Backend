const connection = require('../config/mysql.js')

module.exports = {
  hireModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO hired_jobs SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
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
  notifModels: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        // `SELECT id_recruiter, jobs_needed, desc_jobs FROM hired_jobs WHERE id_pekerja = ${id}`,
        `SELECT image_recruiter, company_name, jobs_needed, hired_jobs.created_at FROM user_account JOIN hired_jobs ON id_user = id_recruiter JOIN profile_recruiter ON hired_jobs.id_recruiter = profile_recruiter.id_recruiter WHERE id_pekerja = ${id} && roles = 1 order by  hired_jobs.created_at DESC`,
        // `SELECT hired_jobs.jobs_needed, hired_jobs.desc_jobs, profile_recruiter.city_recruiter, profile_recruiter.image_recruiter FROM hired_jobs JOIN profile_recruiter ON hired_jobs.id_recruiter = profile_recruiter.id_recruiter = ${id}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getPekerjaById: (id) => {
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
  },
  getRecruiterById: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM profile_recruiter WHERE id_recruiter=${id}`,
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
  deleteNotifModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM hired_jobs WHERE id_pekerja = ${id}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  patchReadStatusModel: (set, id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'UPDATE hired_jobs SET ? WHERE id_pekerja = ?',
        [set, id],
        (error, result) => {
          if (!error) {
            const newResult = {
              id_pekerja: id,
              ...set
            }
            resolve(newResult)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  countNotifModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM hired_jobs WHERE id_pekerja = ${id} AND read_status = 'OFF'`,
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
