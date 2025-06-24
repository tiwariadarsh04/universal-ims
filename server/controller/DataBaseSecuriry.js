const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const path = require('path');
const fs = require('fs');
const { sendError } = require('../utils/helper');

exports.createBackup = async (req, res) => {
  let backupFolderPath;
  let zipPath;

  try {
    // Validate environment variable
    if (!process.env.MONGO_DB_CONNECTION) {
      return sendError(res, 'MongoDB connection string is not configured', 500);
    }

    // Create backup directory if it doesn't exist
    const rootDir = path.join(__dirname, '../');
    const backupDir = path.join(rootDir, 'backups');
    const date = new Date().toISOString().replace(/[:.]/g, '-');
    backupFolderPath = path.join(backupDir, `backup-${date}`);
    zipPath = path.join(backupDir, `backup-${date}.zip`);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Execute mongodump command
    console.log(`Creating MongoDB backup at ${backupFolderPath}`);
    const { stderr: dumpStderr } = await execPromise(
      `mongodump --uri="${process.env.MONGO_DB_CONNECTION}" --out="${backupFolderPath}"`
    );

    if (dumpStderr) {
      console.warn('Mongodump stderr:', dumpStderr);
    }

    // Verify mongodump created files
    const dumpFiles = fs.readdirSync(backupFolderPath);
    if (dumpFiles.length === 0) {
      throw new Error('Mongodump did not create any files');
    }

    // Compress using macOS's native ditto command (better than zip for this)
    console.log(`Compressing backup to ${zipPath}`);
    const { stderr: dittoStderr } = await execPromise(
      `ditto -c -k --sequesterRsrc --keepParent "${backupFolderPath}" "${zipPath}"`
    );

    if (dittoStderr) {
      console.warn('Ditto compression stderr:', dittoStderr);
    }

    // Verify zip was created
    if (!fs.existsSync(zipPath)) {
      throw new Error('Compressed backup file was not created successfully');
    }

    // Remove the uncompressed backup
    console.log(`Removing uncompressed backup at ${backupFolderPath}`);
    await execPromise(`rm -rf "${backupFolderPath}"`);

    res.status(200).json({
      success: true,
      message: 'Backup created and compressed successfully',
      backupFile: path.basename(zipPath),
      path: path.relative(rootDir, zipPath),
      size: fs.statSync(zipPath).size,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Backup error:', error);
    
    // Clean up any partial files
    try {
      if (backupFolderPath && fs.existsSync(backupFolderPath)) {
        await execPromise(`rm -rf "${backupFolderPath}"`);
      }
      if (zipPath && fs.existsSync(zipPath)) {
        await execPromise(`rm -rf "${zipPath}"`);
      }
    } catch (cleanupError) {
      console.error('Cleanup error:', cleanupError);
    }
    
    return sendError(res, `Backup failed: ${error.message}`, 500);
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const { filename } = req.params;
    const backupDir = path.join(__dirname, '../backups');
    const filePath = path.join(backupDir, filename);

    // Security check - prevent directory traversal
    if (!filename || filename.includes('../') || !fs.existsSync(filePath)) {
      return sendError(res, 'Invalid or missing backup file', 404);
    }

    // Set appropriate headers
    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    sendError(res, 'Failed to download backup', 500);
  }
};

exports.listBackups = async (req, res) => {
  try {
    const backupDir = path.join(__dirname, '../backups');
    console.log(`Looking for backups in: ${backupDir}`);

    // Check if directory exists
    if (!fs.existsSync(backupDir)) {
      console.log('Backup directory does not exist');
      return res.status(200).json({
        success: true,
        message: 'Backup directory does not exist',
        backups: [],
        directoryExists: false,
        absolutePath: backupDir
      });
    }

    // Read directory contents
    const allFiles = fs.readdirSync(backupDir);
    console.log('All files in directory:', allFiles);

    // Filter backup files (more flexible matching)
    const backupFiles = allFiles
      .filter(file => {
        const isBackup = file.startsWith('backup-') && 
                        (file.endsWith('.tar.gz') || 
                         file.endsWith('.zip') || 
                         /backup-.+T\d{2}-\d{2}-\d{2}-\d{3}Z/.test(file));
        
        if (!isBackup) {
          console.log(`Skipping non-backup file: ${file}`);
        }
        return isBackup;
      })
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          filename: file,
          size: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          created: stats.birthtime,
          modified: stats.mtime,
          downloadUrl: `/api/backups/download/${file}`,
          absolutePath: filePath
        };
      })
      .sort((a, b) => b.created - a.created);

    console.log(`Found ${backupFiles.length} backup files`);

    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedFiles = backupFiles.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      backups: paginatedFiles,
      directoryInfo: {
        path: backupDir,
        exists: true,
        totalFiles: allFiles.length
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(backupFiles.length / limit),
        totalBackups: backupFiles.length,
        hasNext: endIndex < backupFiles.length,
        hasPrevious: startIndex > 0
      },
      debug: process.env.NODE_ENV !== 'production' ? {
        allFiles,
        backupDirContents: fs.readdirSync(backupDir),
        backupDirStats: fs.statSync(backupDir)
      } : undefined
    });

  } catch (error) {
    console.error('Backup listing error:', error);
    sendError(res, `Failed to list backup files: ${error.message}`, 500);
  }
};

const MAX_BACKUPS = 10;

exports.cleanOldBackups = async (req, res) => {
  try {
    const rootDir = path.join(__dirname, '../');
    const backupDir = path.join(rootDir, 'backups');
    
    // Check if backup directory exists
    if (!fs.existsSync(backupDir)) {
      return res.status(200).json({
        success: true,
        message: 'Backup directory does not exist - nothing to clean',
        deletedCount: 0
      });
    }

    // Get all backup files (without requiring .zip extension)
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('backup-')) // Removed .zip check
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        ctime: fs.statSync(path.join(backupDir, file)).ctime.getTime()
      }))
      .sort((a, b) => b.ctime - a.ctime); // Newest first

    // Determine which files to delete
    const filesToDelete = files.slice(MAX_BACKUPS);
    
    // Delete old backups
    let deletedCount = 0;
    const deletionErrors = [];
    
    for (const file of filesToDelete) {
      try {
        fs.rmSync(file.path, { recursive: true, force: true }); // Handles both files and directories
        deletedCount++;
      } catch (err) {
        console.error(`Failed to delete ${file.name}:`, err);
        deletionErrors.push({
          file: file.name,
          error: err.message
        });
      }
    }

    // Prepare response
    const response = {
      success: true,
      message: deletedCount > 0 
        ? `Successfully deleted ${deletedCount} old backup(s)` 
        : files.length <= MAX_BACKUPS
          ? `No old backups to delete (${files.length}/${MAX_BACKUPS} backups kept)`
          : 'No backups were deleted (check errors)',
      backupDirectoryPath: backupDir,
      totalBackups: files.length,
      keptBackups: files.slice(0, MAX_BACKUPS).map(f => f.name),
      deletedCount,
      deletionErrors
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Backup cleanup error:', error);
    sendError(res, `Failed to clean old backups: ${error.message}`, 500);
  }
};