const express = require('express');
const router = express.Router();

//import express validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/database');

/**
 * INDEX activity
 */
router.get('/', function (req, res) {
    //query
    connection.query('SELECT * FROM activities ORDER BY activity_id desc', function (err, rows) {
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
    body('title').notEmpty(),
    body('email').notEmpty().isEmail(),

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //define formData
    let formData = {
        title: req.body.title,
        email: req.body.email
    }

    // insert query
    connection.query('INSERT INTO activities SET ?', formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(201).json({
                status:  'Success',
                message:  'Success',
                data: formData
            })
        }
    })

});

router.get('/(:id)', function (req, res) {

    let id = req.params.id;

    connection.query(`SELECT * FROM activities WHERE activity_id = ${id}`, function (err, rows) {

        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        }

        // if activity not found
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Data Activity Not Found!',
            })
        }
        // if activity found
        else {
            return res.status(200).json({
                status:  'Success',
                message:  'Success',
                data: rows[0]
            })
        }
    })
})

/**
 * UPDATE activity
 */
router.patch('/:id', [

    //validation
    body('title').notEmpty(),
    body('email').notEmpty().isEmail()

], (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }

    //id activity
    let id = req.params.id;

    //data activity
    let formData = {
        title: req.body.title,
        email: req.body.email
    }

    // update query
    connection.query(`UPDATE activities SET ? WHERE activity_id = ${id}`, formData, function (err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Internal Server Error',
            })
        } else {
            return res.status(200).json({
                status: 'Success',
                message: 'Success'
            })
        }
    })

});

router.delete('/(:id)', function(req, res) {

    let id = req.params.id;
     
    connection.query(`DELETE FROM activities WHERE activity_id = ${id}`, function(err, rows) {
        //if(err) throw err
        if (err) {
            return res.status(500).json({
                status: 'Not Found',
                message: `Activity with ID ${id} Not Found`,
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