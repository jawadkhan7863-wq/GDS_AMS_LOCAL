const Attendance = require('../Models/Attendance');
const Employee = require('../Models/Employee');
const moment = require('moment-timezone');



exports.getLoggedInEmployeeAttendance = async (req, res) => {
  try {
    const currentTime = moment().tz('Asia/Karachi');  
    let attendanceDate;
    if (currentTime.hour() < 8) {
      attendanceDate = currentTime.subtract(1, 'day').format('YYYY-MM-DD');
    } else {
      attendanceDate = currentTime.format('YYYY-MM-DD');
    }

    console.log(`Attendance query being executed for date: ${attendanceDate}`);

    const startOfDay = moment(attendanceDate).startOf('day').toDate();
    const endOfDay = moment(attendanceDate).endOf('day').toDate();

    console.log('Start of day:', startOfDay);
    console.log('End of day:', endOfDay);

    // Fetch attendance records for the calculated attendance date
    const attendanceRecords = await Attendance.aggregate([
      {
        $match: {
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      },
      { 
        $lookup: { 
          from: 'employees', 
          localField: 'employee', 
          foreignField: '_id', 
          as: 'employeeDetails' 
        } 
      },
      { $unwind: { path: '$employeeDetails', preserveNullAndEmptyArrays: true } },
      { 
        $lookup: { 
          from: 'designations', 
          localField: 'employeeDetails.designation', 
          foreignField: '_id', 
          as: 'designationDetails' 
        } 
      },
      { $unwind: { path: '$designationDetails', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          'employeeDetails.role': '$designationDetails.role',
        },
      },
    ]);

    console.log('Fetched Attendance Records:', attendanceRecords); 

    if (attendanceRecords.length === 0) {
      console.log('No attendance records found for the given date.');
    }

    // Fetch all employees
    const allEmployees = await Employee.find();
    const totalEmployeeCount = allEmployees.length;

    let loggedInEmployees = [];
    let leaveEmployees = [];

    attendanceRecords.forEach((record) => {
      const { employeeDetails, in_time, out_time, is_logged_in, date } = record;
      console.log('Employee In-Time from Attendance:', in_time);

      // Retrieve employee's in_time from the Employee model
      const employeeInTime = employeeDetails?.in_time || '09:00'; // Default to 09:00 if not available

      // Compare the login time with employee's in_time (Use HH:mm format to ignore seconds)
      const formattedInTime = in_time ? moment(in_time, 'HH:mm:ss').tz('Asia/Karachi').format('HH:mm') : 'Not Logged In';
      console.log('Formatted In-Time:', formattedInTime);

      const employeeData = {
        employeeId: employeeDetails?._id || 'Unknown',
        employeeName: employeeDetails?.name || 'Unknown',
        employeeEmail: employeeDetails?.email || 'Unknown',
        designation: employeeDetails?.role || 'Unknown',
        loginTime: formattedInTime,
        logoutTime: out_time || (is_logged_in ? 'Not Logged Out Yet' : 'Not Logged Out Yet'),
        isLoggedIn: is_logged_in,
        date: moment(date).tz('Asia/Karachi').format('YYYY-MM-DD'),
        totalEmployees: totalEmployeeCount,
      };

      if (formattedInTime !== 'Not Logged In' || is_logged_in) {
        // Convert the employee's in_time to a moment object with HH:mm format (no seconds)
        const expectedLoginMoment = moment(employeeInTime, 'HH:mm').tz('Asia/Karachi');
        
        // Convert the attendance in_time to a moment object with HH:mm format (no seconds)
        const loginMoment = moment(formattedInTime, 'HH:mm').tz('Asia/Karachi');

        // Calculate the difference in minutes
        const timeDifference = loginMoment.diff(expectedLoginMoment, 'minutes'); // Get difference in minutes

        // If the time difference is within 15 minutes, mark as on time
        if (timeDifference <= 15 && timeDifference >= -15) {
          employeeData.status = 'On Time';
        } else {
          employeeData.status = 'Late';
        }

        loggedInEmployees.push(employeeData);
        console.log(`${employeeDetails?.name} (Employee ID: ${employeeDetails?._id}) - Login Status: ${employeeData.status}`);
      } else {
        employeeData.status = 'Leave';
        leaveEmployees.push(employeeData);
      }
    });

    // Identify employees not in attendance records
    allEmployees.forEach((employee) => {
      if (!attendanceRecords.some((record) => String(record.employee) === String(employee._id))) {
        leaveEmployees.push({
          employeeId: employee._id,
          employeeName: employee.name,
          employeeEmail: employee.email,
          designation: employee.designation?.role || 'Unknown',
          loginTime: 'Not Logged In',
          logoutTime: 'Not Logged Out Yet',
          isLoggedIn: false,
          date: attendanceDate,
          status: 'Leave',
          totalEmployees: totalEmployeeCount,
        });
      }
    });

    return res.status(200).json({ loggedInEmployees, leaveEmployees });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Get all attendance records for a specific employee by employeeId
exports.getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from URL params

    // Validate if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Fetch all attendance records for the employee and populate breaks
    const attendanceRecords = await Attendance.find({ employee: employeeId })
      .populate('employee', 'name email')
      .populate('breaks')  // Populate the breaks field to get all breaks
      .lean();

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: 'No attendance records found for this employee' });
    }

    // Initialize counters for total presents, leaves, and breaks
    let totalPresents = 0;
    let totalLeaves = 0;
    let totalBreakMinutes = 0;

    // Format attendance records and calculate total presents, leaves, and breaks
    const formattedRecords = attendanceRecords.map(record => {
      const { in_time, out_time, is_logged_in, date, breaks } = record;

      // Ensure 'date' is a valid Date object and format it properly
      const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;

      // Count presents and leaves
      if (in_time && out_time) {
        totalPresents += 1; // Count present if both login and logout times are present
      } else {
        totalLeaves += 1; // Count leave if either login or logout time is missing
      }

      // Calculate total break duration for the day
      let dailyBreakDuration = 0;
      const breakDetails = breaks.map(b => {
        const breakStart = b.break_start;
        const breakEnd = b.break_end || new Date().toISOString().split('T')[1];  // Use current time if not ended

        // Calculate break duration in minutes
        const breakStartTime = new Date(`1970-01-01T${breakStart}Z`);
        const breakEndTime = new Date(`1970-01-01T${breakEnd}Z`);
        const breakDuration = Math.round((breakEndTime - breakStartTime) / 60000); // duration in minutes

        dailyBreakDuration += breakDuration;

        return {
          breakStartTime: breakStart,
          breakEndTime: breakEnd,
          breakDuration: formatDuration(breakDuration), // Format break duration
          breakType: b.break_type,
          breakNotes: b.notes,
        };
      });

      // Add the total break time for this attendance record
      totalBreakMinutes += dailyBreakDuration;

      return {
        loginTime: in_time || 'Not Logged In',
        logoutTime: is_logged_in ? 'Not Logged Out Yet' : out_time || 'Not Logged Out Yet',
        isLoggedIn: is_logged_in,
        date: formattedDate,
        breaks: breakDetails,
        dailyBreakDuration: formatDuration(dailyBreakDuration), // Format total break duration for the day
        employee,
      };
    });

    // Return the attendance records along with the counts for presents, leaves, and break details
    return res.status(200).json({
      attendanceRecords: formattedRecords,
      totalPresents,
      totalLeaves,
      totalBreakMinutes: formatDuration(totalBreakMinutes),  // Total break time formatted
    });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Function to format duration in hours and minutes
function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  let formattedDuration = '';

  if (hours > 0) {
    formattedDuration += `${hours} hour${hours > 1 ? 's' : ''}`;
  }

  if (remainingMinutes > 0) {
    if (hours > 0) {
      formattedDuration += ' and ';
    }
    formattedDuration += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }

  return formattedDuration || '0 minutes';
}




// Get all present employee record
exports.getPresentEmployees = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employeeId from URL params


    
    // Validate if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Fetch attendance records where the employee was present (both in_time and out_time are present)
    const presentRecords = await Attendance.find({
      employee: employeeId,
      in_time: { $ne: null },
      out_time: { $ne: null },
    })
      .populate('employee', 'name designation') // Fetch only name and designation from the employee
      .lean();

    if (presentRecords.length === 0) {
      return res.status(404).json({ message: 'No present attendance records found for this employee' });
    }

    // Extract only name and designation from each present record
    const presentEmployeeDetails = presentRecords.map(record => ({
      name: record.employee.name,
      designation: record.employee.designation,
    }));
    // Return the names and designations of employees present
    return res.status(200).json({
      presentEmployees: presentEmployeeDetails,
    });

  } catch (error) {
     return res.status(500).json({ error: 'Internal Server Error' });
  }
};


