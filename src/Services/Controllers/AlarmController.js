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
    console.log("audioFilename", audioFilename, userId, alarmId);
        await Alarm.update({ audioFilename }, { where: { id: alarmId, userId } });
    
        res.json({ message: 'File uploaded and alarm updated' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to upload file' });
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