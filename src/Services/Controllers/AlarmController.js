const Alarm = require("../../../models/alarm");

module.exports.createAlarm = async (req, res, next) => {
    console.log("running");

    try {
        const { alarmName, userId } = req.body;

        // Validate input
        if (!alarmName) {
            return res.status(400).json({ error: 'Please enter a name for the alarm.' });
        }

        // Check for existing alarm with the same name for the same user
        const existingAlarm = await Alarm.findOne({
            where: { alarmName, userId }
        });

        if (existingAlarm) {
            return res.status(400).json({ error: 'An alarm with this name already exists.' });
        }

        // Create new alarm
        const newAlarm = await Alarm.create({
            alarmName,
            userId,
            audioFilename: null,
        });

        res.status(201).json({ message: 'Alarm created', alarm: newAlarm });
    } catch (error) {
        console.error('Error creating alarm:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


  
module.exports.uploadAlarmSound = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { alarmId } = req.params;
    const audioFilename = req.file.filename;

    // Log the incoming request details
    console.log(`UserID: ${userId}, AlarmID: ${alarmId}, AudioFilename: ${audioFilename}`);

    // Extract the part of the filename after the hyphen
    const getFilenamePart = (filename) => {
      const parts = filename.split('-');
      return parts.length > 1 ? parts.slice(1).join('-').toLowerCase() : filename.toLowerCase();
    };

    // Fetch the existing alarm
    const existingAlarm = await Alarm.findOne({
      where: { id: alarmId, userId }
    });

    // Log the existing alarm details
    console.log('Existing Alarm:', existingAlarm);

    // Extract the part of the existing filename after the hyphen
    const existingFilenamePart = existingAlarm
      ? getFilenamePart(existingAlarm.audioFilename)
      : null;

    // Extract the part of the new filename after the hyphen
    const newFilenamePart = getFilenamePart(audioFilename);

    console.log('Existing Filename Part:', existingFilenamePart);
    console.log('New Filename Part:', newFilenamePart);

    // Check if the extracted filename parts are the same
    if (existingFilenamePart === newFilenamePart) {
      console.log("File already exists for this alarm:", existingAlarm, existingFilenamePart, newFilenamePart);
      return res.status(400).json({ message: 'File already exists for this alarm' });
    }

    // Update the alarm with the new audio filename
    await Alarm.update({ audioFilename }, { where: { id: alarmId, userId } });

    res.json({ message: 'File uploaded and alarm updated', audioFilename, userId, alarmId });
  } catch (error) {
    console.error('Error in uploadAlarmSound:', error); // Log error to server console
    res.status(500).json({ message: 'Failed to upload file' });
  }
};








module.exports.getAlarmsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const alarms = await Alarm.findAll({ where: { userId } });
    res.json({ alarms }); 
  } catch (error) {
    console.error('Failed to get alarms:', error);
    res.status(500).json({ error: 'Failed to get alarms' });
  }
};