const express = require('express');
const router = express.Router()
const Item = require('../models/item');
const { v4: uuidv4 } = require('uuid');

router.post('/items', async (req, res) => {
    try {
        const data = new Item({
            name: req.body.name,
            surname: req.body.surname,
            ext_id: uuidv4(),
            valid_to: req.body.valid_to
        });
        const saved = await data.save();
        result = (
            ({name, surname, ext_id, created_at, valid_to}) =>
            ({name, surname, ext_id, created_at, valid_to})
        )(saved)

        res.status(200).json(result);
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

router.get('/items', async (req, res) => {
    try {
        const items = await Item.find()
        const resItems = items.map(
            ({name, surname, ext_id, created_at, valid_to}) =>
            ({name, surname, ext_id, created_at, valid_to})
        )
        res.status(200).json(resItems)
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

router.put('/items/:ext_id', (req, res) => {
    const updated = req.body
    delete updated.ext_id
    Item.updateOne({ ext_id: req.params.ext_id }, updated, function (err) {
        if (err) return res.send(500, {error: err})
        return res.status(200).json({status: "success"})
    })
})

router.delete('/items/:ext_id', (req, res) => {
    Item.deleteOne({ ext_id: req.params.ext_id }, function (err) {
        if (err) return res.send(500, {error: err})
        return res.status(200).json({status: "success"})
    })
})

module.exports = router;
