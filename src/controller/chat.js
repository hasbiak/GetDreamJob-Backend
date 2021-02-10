const helper = require('../helper/helper')

const {
  createRoomModel,
  checkRoomModel,
  getRoomModel,
  sendMessageModel,
  getMessageModel,
  getRoom2UserModel,
  getLastMessageModel
} = require('../model/chat')

module.exports = {
  createRoom: async (request, response) => {
    const { sender, receiver } = request.body
    const checkRoom = await checkRoomModel(sender, receiver)
    if (checkRoom.length > 0) {
      return helper.response(response, 400, 'Chat-room Already exist')
    } else {
      const a = sender
      const b = receiver
      const roomIdUniq = Math.floor(Math.random() * 1000000 + 1)
      const setData1 = { sender: a, receiver: b, roomIdUniq }
      const setData2 = { sender: b, receiver: a, roomIdUniq }
      const setDataMsg = {
        roomIdUniq,
        sender,
        receiver,
        message: `Job Opportunity

        Hi Dream Job seeker,
        
        I would like to recruit you for new opportunity, may i have your contact number for further information?
        
        regards,
        Talent Acquisition
        `
      }
      try {
        const result1 = await createRoomModel(setData1)
        const result2 = await createRoomModel(setData2)
        const result3 = await sendMessageModel(setDataMsg)
        return helper.response(response, 200, 'Room Created', [
          { 'room id uniq': roomIdUniq },
          result3,
          result1,
          result2
        ])
      } catch (error) {
        return helper.response(response, 400, 'Bad Request', error)
      }
    }
  },
  getRoom: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getRoomModel(id)
      const arrResult = []
      for (let i = 0; i < result.length; i++) {
        let result2 = await getLastMessageModel(result[i].roomIdUniq)
        if (!result2[0]) {
          result2[0] = { message: '', createdAt: '' }
        }
        const result3 = {
          ...result[i],
          message: result2[0].message,
          createdAt: result2[0].createdAt
        }
        arrResult.push(result3)
      }

      return helper.response(
        response,
        200,
        'Here is your chat room list',
        arrResult
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getRoom2User: async (request, response) => {
    const { sender, receiver } = request.query
    try {
      const result = await getRoom2UserModel(sender, receiver)
      return helper.response(response, 200, 'Here is your room info', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  sendMessage: async (request, response) => {
    const { roomIdUniq, sender, receiver, message } = request.body
    const setData = {
      roomIdUniq,
      sender,
      receiver,
      message
    }
    try {
      const result = await sendMessageModel(setData)
      return helper.response(response, 200, 'Message Sent', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  getMessage: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getMessageModel(id)
      return helper.response(
        response,
        200,
        'Here is your message history',
        result
      )
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  }
}
