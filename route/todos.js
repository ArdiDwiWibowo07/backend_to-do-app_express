const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX todos
 */
router.get('', function (req, res) {
    
    
    let id = req.query.activity_group_id;
    //query
    connection.query(`SELECT * FROM todos WHERE activity_group_id = ${id}  ORDER BY todo_id desc`, function (err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: 'Success',
                message: 'Success',
                data: rows
            })
        }
    });
});


router.post('/', [

    //validation
    body('activity_group_id').notEmpty(),
    body('title').notEmpty(),
    body('is_active').notEmpty().isBoolean(),
    body('priority').notEmpty(),


], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        activity_group_id: req.body.activity_group_id,
        title: req.body.title,
        is_active: req.body.is_active,
        priority: req.body.priority,
    }

    // insert query
    connection.query('INSERT INTO todos SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status: 'Success',
                message: 'Success',
                data: formData
            })
        }
    })

});

router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM todos WHERE todo_id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if todo not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Todo Not Found!',
            })
        }
        // if todo found
        else {
            return res.status(200).json({
                status: 'Success',
                message: 'Success',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE todo
 */
router.patch('/:id', [

    //validation
    body('activity_group_id').notEmpty(),
    body('title').notEmpty(),
    body('is_active').notEmpty().isBoolean(),
    body('priority').notEmpty(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id todo
    let id = req.params.id;

    //data todo
    let formData = {
        activity_group_id: req.body.activity_group_id,
        title: req.body.title,
        is_active: req.body.is_active,
        priority: req.body.priority,
    }

    // update query
    connection.query(`UPDATE todos SET ? WHERE todo_id = ${id}`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: 'Success',
                message: 'Update Data Successfully!',
                data : formData
            })
        }
    })

});

router.delete('/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM todos WHERE todo_id = ${id}`, function(err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: "Not Found",
                message: "Todo with ID 21 Not Found",
            })
        } else {
            return res.status(200).json({
                status: 'Success',
                message: 'Success',
            })
        }
    })
});

module.exports = router;