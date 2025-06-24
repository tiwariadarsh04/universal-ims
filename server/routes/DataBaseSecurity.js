const express = require('express');
const { createBackup, cleanOldBackups, downloadBackup, listBackups } = require('../controller/DataBaseSecuriry');
const router = express.Router();

router.post('/create-backup',createBackup);

router.post('/clean-backup', cleanOldBackups)

router.get('/download-backup/:filename',downloadBackup)

router.get('/backup-list',listBackups)

module.exports = router;