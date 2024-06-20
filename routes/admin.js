const express = require('express');
const router = express.Router();
const Commission = require('../models/Commission');
const Service = require('../models/Service');
const SalesRep = require('../models/SalesRep');
const Admin = require('../models/User');
const bcrypt = require('bcryptjs');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const commissions = await Commission.find();
    res.render('admin', { commissions });
});

router.get('/edit/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const record = await Commission.findById(req.params.id);
    const salesReps = await SalesRep.find();
    const services = await Service.find({});
    res.render('edit', { record, salesReps,services });
});

router.post('/edit/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const { customerName, contact, email, salesRep, service, numberOfPeople } = req.body;
    const services = await Service.findOne({ name: service });
    const commission = numberOfPeople * services.baseCommission;

    try {
        await Commission.findByIdAndUpdate(req.params.id, {
            customerName,
            contact,
            email,
            salesRep,
            service,
            numberOfPeople,
            commission
        });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating the record.");
    }
});

// Delete Record
router.post('/delete/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    try {
        await Commission.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting the record.");
    }
});

// Dashboard
router.get('/dashboard', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const commissions = await Commission.aggregate([
        { $group: { _id: "$salesRep", totalCommission: { $sum: "$commission" } } }
    ]);
    const salesReps = commissions.map(c => c._id);
    const totalCommissions = commissions.map(c => c.totalCommission);
    res.render('dashboard', { salesReps, commissions: totalCommissions });
});

router.get('/manage-sales-reps', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const salesReps = await SalesRep.find();
    res.render('manage-sales-reps', { salesReps });
});

router.post('/manage-sales-reps', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const {name} = req.body;
    try {
        await SalesRep.create({name});
        res.redirect('/admin/manage-sales-reps');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding the sales rep.");
    }
});

router.post('/manage-sales-reps/delete/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    try {
        await SalesRep.findByIdAndDelete(req.params.id);
        res.redirect('/admin/manage-sales-reps');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting the sales rep.");
    }
});

router.post('/manage-sales-reps/edit/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const { name } = req.body;
    try {
        await SalesRep.findByIdAndUpdate(req.params.id, { name });
        res.redirect('/admin/manage-sales-reps');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating the sales rep.");
    }
});

// Service Management
router.get('/manage-services', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const services = await Service.find();
    res.render('manage-services', { services });
});

router.post('/manage-services', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const { name, baseCommission } = req.body;
    try {
        await Service.create({ name, baseCommission });
        res.redirect('/admin/manage-services');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding the service.");
    }
});

router.post('/manage-services/delete/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.redirect('/admin/manage-services');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting the service.");
    }
});

router.post('/manage-services/edit/:id', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login');
    const { baseCommission } = req.body;
    try {
        await Service.findByIdAndUpdate(req.params.id, { baseCommission });
        res.redirect('/admin/manage-services');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating the service.");
    }
});

router.get('/change-password', async (req, res) => {
    if (!req.session.loggedIn) return res.redirect('/auth/login'); 
    res.render('change');
});

router.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findOne({ username: 'admin' });

    const match = await bcrypt.compare(currentPassword, admin.password);
    if (!match) {
        return res.redirect('/admin?error=Incorrect current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    
    res.redirect('/admin?success=Password updated successfully');
});

module.exports = router;