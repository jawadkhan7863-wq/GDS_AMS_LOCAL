const Authentication = require('../Models/Authentication');
const Employee = require('../Models/Employee');
const Attendance = require('../Models/Attendance');
const moment = require('moment-timezone');


function calculateSessionDuration(inTime, outTime) {
  const inTimeParts = inTime.split(':');
  const outTimeParts = outTime.split(':');

  const inMinutes = parseInt(inTimeParts[0]) * 60 + parseInt(inTimeParts[1]);
  const outMinutes = parseInt(outTimeParts[0]) * 60 + parseInt(outTimeParts[1]);

  return outMinutes - inMinutes;
}

exports.login = async (req, res) => {
  try {
    const { secretKey } = req.body;

    const authRecord = await Authentication.findOne({ Secretkey: secretKey }).populate('employeeId');
    if (!authRecord) {
      console.log('Invalid Secret Key provided.');
      return res.status(401).json({ error: 'Invalid Secret Key' });
    }

    const employee = authRecord.employeeId;

    const now = moment().tz('Asia/Karachi');
    const currentTime = now.format('HH:mm:ss');
    const today = now.format('YYYY-MM-DD');

    let attendanceDate;

    // Determine the correct attendance date
    if (currentTime < "08:00:00") {
      // If the login time is before 8:00 AM, attendance is for the previous day
      attendanceDate = now.subtract(1, 'day').format('YYYY-MM-DD');
      console.log(`Login Time: ${currentTime}`);
      console.log(`Attendance Date Adjusted to Previous Day: ${attendanceDate}`);
    } else {
      // Otherwise, attendance is for today
      attendanceDate = today;
      console.log(`Login Time: ${currentTime}`);
      console.log(`Attendance Date Set to Today: ${attendanceDate}`);
    }

    console.log(`Employee ${employee.name} (${employee._id}) is attempting to log in.`);
    console.log(`Determined Attendance Date: ${attendanceDate}`);
    console.log(`Current Time: ${currentTime}`);
    console.log(`Today's Date: ${today}`);

    // Find existing attendance record
    let attendance = await Attendance.findOne({
      employee: employee._id,
      date: attendanceDate,
    });

    if (!attendance) {
      // Record Time-In
      attendance = await Attendance.create({
        employee: employee._id,
        date: attendanceDate,
        in_time: currentTime,
        is_logged_in: true,
      });

      console.log(`New Attendance Record Created for ${employee.name} on ${attendanceDate}`);
      console.log(`Time-In Recorded: ${currentTime}`);

      return res.status(200).json({
        message: 'Login successful (Time-In recorded)',
        employeeId: employee._id,
        attendanceId: attendance._id,
        roleCompany: employee.role_company,
        employeeName: employee.name,
        inTime: attendance.in_time,
        isLoggedIn: attendance.is_logged_in,
        attendanceDate: attendance.date,
      });
    } else if (!attendance.out_time) {
      // Record Time-Out
      attendance.out_time = currentTime;
      attendance.session_duration = calculateSessionDuration(attendance.in_time, attendance.out_time);
      attendance.is_logged_in = false;
      await attendance.save();

      console.log(`Attendance Record Updated for ${employee.name} on ${attendanceDate}`);
      console.log(`Time-Out Recorded: ${currentTime}`);
      console.log(`Session Duration: ${attendance.session_duration}`);

      return res.status(200).json({
        message: 'Logout successful (Time-Out recorded)',
        employeeId: employee._id,
        employeeName: employee.name,
        roleCompany: employee.role_company,
        inTime: attendance.in_time,
        outTime: attendance.out_time,
        sessionDuration: attendance.session_duration,
        isLoggedIn: attendance.is_logged_in,
        attendanceDate: attendance.date,
      });
    } else {
      console.log(`Attendance already marked for ${employee.name} on ${attendanceDate}`);
      return res.status(400).json({ error: 'Attendance already marked for today' });
    }
  } catch (error) {
    console.error('Error processing login:', error);
    res.status(500).json({ error: 'This employee has been deleted from record.!' });
  }
};

exports.logout = async (req, res) => {
  try {
    // Extract secretKey and attendanceId from headers
    const secretKey = req.headers['secret-key']; // Header keys are case-insensitive
    const attendanceId = req.headers['attendance-id'];

    // Validate inputs
    if (!secretKey || !attendanceId) {
      return res.status(400).json({ error: 'Secret Key and Attendance ID are required.' });
    }

    console.log('Decoded Secret Key:', secretKey);
    console.log('Decoded Attendance ID:', attendanceId);

    // Validate secretKey in Authentication collection
    const authRecord = await Authentication.findOne({ Secretkey: secretKey }).populate('employeeId');
    if (!authRecord) {
      return res.status(401).json({ error: 'Invalid Secret Key.' });
    }

    const employee = authRecord.employeeId;
    console.log('Authentication Record Found:', authRecord);

    // Check for active attendance session
    const attendance = await Attendance.findOne({
      _id: attendanceId,
      employee: employee._id,
      is_logged_in: true, // Ensure the session is active
    });

    if (!attendance) {
      return res.status(400).json({
        error: 'Invalid Attendance ID or no active login session found.',
      });
    }

    console.log('Attendance Record Found:', attendance);

    // Record logout details
    const now = moment().tz('Asia/Karachi');
    attendance.out_time = now.format('HH:mm:ss'); // Set logout time
    attendance.session_duration = calculateSessionDuration(
      attendance.in_time,
      attendance.out_time
    );
    attendance.is_logged_in = false; // Mark the session as logged out

    await attendance.save();

    console.log('Logout Process Completed:', {
      outTime: attendance.out_time,
      sessionDuration: attendance.session_duration,
    });

    // Return success response
    return res.status(200).json({
      message: 'Logout successful (Time-Out recorded).',
      employeeId: employee._id,
      employeeName: employee.name,
      inTime: attendance.in_time,
      outTime: attendance.out_time,
      sessionDuration: attendance.session_duration,
      isLoggedIn: attendance.is_logged_in,
    });
  } catch (error) {
    console.error('Logout API Error:', error.message);
    return res.status(500).json({ error: 'Internal Server Error.' });
  }
};

