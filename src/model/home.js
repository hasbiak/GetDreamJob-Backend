const connection = require('../config/mysql')
module.exports = {
  getDataCountModel: (status) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) AS total FROM profile_pekerja ${status}`,
        (error, result) => {
          !error ? resolve(result[0].total) : reject(new Error(error))
        }
      )
    })
  },
  getDataLimit: (limit, offset, status, sorting) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT profile_pekerja.id_pekerja, fullname_pekerja,job_require,image_pekerja, job_desk, city_pekerja FROM profile_pekerja ${status} ${sorting} LIMIT ${limit} OFFSET ${offset}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  searchSorthModel: (limit, offset, searching, StatusNeedit, sorting) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT profile_pekerja.id_pekerja, fullname_pekerja,image_pekerja,job_require, job_desk, city_pekerja, skill_name FROM profile_pekerja JOIN skills_pekerja ON profile_pekerja.id_pekerja = skills_pekerja.id_pekerja WHERE skill_name LIKE '%${searching}%' ${StatusNeedit} ${sorting} group by skills_pekerja.id_pekerja LIMIT ${limit} OFFSET ${offset}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getSkill: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `select id, skill_name from skills_pekerja where id_pekerja = ${id}`,
        (err, result) => {
          !err ? resolve(result) : reject(new Error(err))
        }
      )
    })
  },
  getSearchCountModel: (search, status) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(*) as total FROM skills_pekerja join profile_pekerja on profile_pekerja.id_pekerja = skills_pekerja.id_pekerja WHERE skill_name LIKE "%${search}%" ${status} group by skills_pekerja.id_pekerja`,
        (err, result) => {
          !err ? resolve(result) : reject(new Error(err))
        }
      )
    })
  },
  getDataBySkillSortingModel: (limit, offset) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT profile_pekerja.id_pekerja, fullname_pekerja,image_pekerja,job_require, job_desk, city_pekerja, status_jobs, COUNT(skills_pekerja.skill_name) AS total_skill FROM skills_pekerja LEFT JOIN profile_pekerja ON skills_pekerja.id_pekerja = profile_pekerja.id_pekerja GROUP BY skills_pekerja.id_pekerja ORDER BY total_skill DESC LIMIT ${limit} OFFSET ${offset}`,
        (err, result) => {
          !err ? resolve(result) : reject(new Error(err))
        }
      )
    })
  },
  getCountSkillModel: () => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(skills_pekerja.id_pekerja) AS total_skill FROM skills_pekerja LEFT JOIN profile_pekerja ON skills_pekerja.id_pekerja = profile_pekerja.id_pekerja GROUP BY skills_pekerja.id_pekerja ORDER BY skills_pekerja.id_pekerja',
        (err, result) => {
          !err ? resolve(result) : reject(new Error(err))
        }
      )
    })
  }
}
