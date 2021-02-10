const connection = require('../config/mysql')

module.exports = {
  createRoomModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO roomchat SET ?',
        setData,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  checkRoomModel: (a, b) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM roomchat WHERE sender = ? AND receiver = ?',
        [a, b],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  getRoomModel: (id_user) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT roomIdUniq, user_account.id_user,  user_account.username, profile_pekerja.image_pekerja, profile_recruiter.image_recruiter FROM roomchat RIGHT JOIN user_account ON user_account.id_user = receiver LEFT JOIN profile_pekerja ON user_account.id_user = profile_pekerja.id_pekerja LEFT JOIN profile_recruiter ON user_account.id_user = profile_recruiter.id_recruiter WHERE sender = ? ',
        [id_user],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  getRoom2UserModel: (sender, receiver) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * from roomchat WHERE sender = ? AND receiver = ? ',
        [sender, receiver],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  sendMessageModel: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO chat SET ?', setData, (error, result) => {
        !error ? resolve((result = setData)) : reject(new Error(error))
      })
    })
  },
  getMessageModel: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT roomIdUniq, user_account.id_user, user_account.username , chat.createdAt, message  FROM chat RIGHT JOIN user_account ON user_account.id_user = sender WHERE roomIdUniq = ?',
        [id],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  },
  getLastMessageModel: (a) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT message, createdAt FROM chat WHERE roomIdUniq = ? ORDER BY createdAt DESC LIMIT 1',
        [a],
        (error, result) => {
          if (!error) {
            resolve(result)
          } else {
            reject(new Error(error))
          }
        }
      )
    })
  }
}
