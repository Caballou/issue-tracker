'use strict';
const mongoose = require('mongoose');
const IssueModel = require('../models.js').Issues

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_on,
        updated_on,
        created_by,
        assigned_to,
        open,
        status_text
      } = req.query
      
      const filter = Object.assign(req.query)
      filter['project'] = project

      //console.log(Object.keys(req.query).length)

      IssueModel.find(filter, (error, issuesFound) => {
          //console.log(projectFound)
          if (error || !issuesFound) {
            res.send('error')
          } else {
            res.json(issuesFound) 
          }
      })
    })
  
    
    .post(function (req, res){
      let project = req.params.project;

      const {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if ( !issue_title || !issue_text || !created_by ) {
        //console.log('error')
        res.json({ error: 'required field(s) missing' })
        return
      } else {

       const newIssue = new IssueModel({
          project,
          issue_title,
          issue_text,
          created_on: new Date(),
          updated_on: new Date(),
          created_by,
          assigned_to: assigned_to || '',
          open: true,
          status_text: status_text || ''
        });
        //console.log(newIssue)

        newIssue.save((error, data) => {
          //console.log(data)
          if (error || !data) {
            res.send('error')
          } else {
            res.json({
              issue_title: data.issue_title,
              assigned_to: data.assigned_to,
              open: data.open,
              issue_text: data.issue_text,
              created_by: data.created_by,
              created_on: data.created_on,
              updated_on: data.updated_on,
              status_text: data.status_text,
              _id: data._id
            })
          }
        })

      }
    })
    
    .put(function (req, res){
      const _id = req.body._id
      
      if (!_id) {
        //console.log('error')
        return res.json({ error: 'missing _id' })
      } else {
        
        let update = {}
        let keys = Object.keys(req.body)
        let values = Object.values(req.body)
      
        for (let i = 1; i < values.length; i++) {
          if (values[i]) {
            update[keys[i]] = values[i]
          }
        }
        //console.log(update)
        //console.log(Object.keys(update).length)
        if (Object.keys(update).length == 0) {
          res.json({ error: 'no update field(s) sent', _id})
        } else {
          IssueModel.findByIdAndUpdate(
            _id, 
            update, 
            { new: true },
            (error, issuesFound) => {
              if (error || !issuesFound) {
                res.json({ error: 'could not update', _id })
              } else {
                if (!issuesFound.open) {
                  res.json({ error: 'the issue is closed and cannot be updated' })
                } else {
                  issuesFound.updated_on = new Date()
                  issuesFound.save((error, data) => {
                    if (error || !data) {
                      res.json({ error: 'error during saving the update' })
                    } else {
                      res.json({ result: 'successfully updated', _id })
                    }
                  })
                }
              }
            }
          )
        }
      }
    })
    
    .delete(function (req, res){
      const _id = req.body._id
      
      //console.log(_id)

      if (!_id) {
        res.json({ error: 'missing _id' })
      } else {
        IssueModel.findByIdAndDelete( _id, (error, issuesFound) => {
            if(error || !issuesFound) {
              res.json({ error: 'could not delete', _id })
            } else {
              res.json({ result: 'successfully deleted', _id })
            }
          }
        )
      } 
    });
    
};
