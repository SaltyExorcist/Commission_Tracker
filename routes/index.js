const express = require('express');
const router = express.Router();
const Commission = require('../models/Commission');
const Service = require('../models/Service');
const SalesRep = require('../models/SalesRep');


router.get('/filter', async (req, res) => {
    const { service, salesRep } = req.query;
    let filter = {};
  
    if (service) {
      filter.service = service;
    }
  
    if (salesRep) {
      filter.salesRep = salesRep;
    }
  
    const commissions = await Commission.find(filter);
    const services = await Service.find();
    res.render('index', { commissions, services });
  });

router.get('/', async (req, res) => {
    const commissions = await Commission.find({});
    const salesReps = await SalesRep.find();
    const services = await Service.find();
    res.render('index', { commissions,salesReps,services });
});

router.post('/add', async (req, res) => {
    const { customerName, contact, email, salesRep, service, numberOfPeople } = req.body;
    const selectedService = await Service.findOne({ name: service });
    const commission = numberOfPeople * selectedService.baseCommission;
    const newCommission = new Commission({ customerName, contact, email, salesRep, service, numberOfPeople, commission });
    await newCommission.save();
    res.redirect('/');
});

router.get('/download', async (req, res) => {
    const commissions = await Commission.find({});
    const json2csv = require('json2csv').parse;
    const fields = ['customerName', 'contact', 'email', 'salesRep', 'service', 'numberOfPeople','commission', 'date'];
    const csv = json2csv(commissions, { fields });
    res.attachment('commissions.csv').send(csv);
});

module.exports = router;
