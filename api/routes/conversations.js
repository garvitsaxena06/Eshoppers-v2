const router = require('express').Router()
const Conversation = require('../models/Conversation')

//new conversation

router.post('/', async (req, res) => {
  const { senderId, receiverId } = req.body
  const newConversation = new Conversation({
    members: [senderId, receiverId],
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(201).json(savedConversation)
  } catch (err) {
    res.status(500).json(err)
  }
})

//get conversation of a user

router.get('/:userId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    })
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err)
  }
})

//get conversation if 2 users
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    })
    if (conversation)
      return res.status(200).json({ data: conversation })
    else {
      const newConversation = new Conversation({
        members: [req.params.firstUserId, req.params.secondUserId],
      })
      const savedConversation = await newConversation.save()
      res.status(200).json({ data: savedConversation, new: true })
    }
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
