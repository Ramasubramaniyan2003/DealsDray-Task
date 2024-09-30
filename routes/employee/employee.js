var models = require('../../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

exports.add = async function (req, res) {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }

    // Extract other fields from the request body
    const { name, email, mobile,  designation, gender, course } = req.body;

    // Save the image path (relative or absolute) in the database
    const newEmployee = await models.Employee.create({
      name,
      email,
      mobile,
      designation,
      gender,
      course,
      image: req.file.path, // Save the file path in the database
      createdate: new Date(),
    });

    res.status(201).send({
      success: true,
      message: 'Employee created successfully!',
      employee: newEmployee,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Error creating employee' });
  }
}

exports.update = async function (req, res) {
  try {
    const { name, email, mobile,  designation, gender, course } = req.body;
    const Employee = await models.Employee.update({ name, email, mobile, designation, gender, course },
      {
        where: {
          id: req.params.id
        }
      }
    );
    res.send({ success: true, data: Employee });
} catch (e) {
    console.log('error', e);
    console.log('/api/employee/update')
    res.send({ success: false, error:"Internal server error "+e  });

}
}

exports.delete = async function (req, res) {
  try {
    const Transaction = await models.Employee.destroy(
        {
            where: {
                id: req.params.id
            }
        }
    );
    res.send({ success: true, data: Transaction });
} catch (e) {
    console.log('error', e);
    console.log('/api/employees/delete')
    res.send({ success: false, error:"Internal server error "+e  });
}
}

exports.get = async function (req, res) {
  try{
      const Employees = await models.Employee.findAll();
      res.send({ success: true, data: Employees });
  } catch (e) {
    console.log(e);
    res.status(500).send({ success: false, message: 'Error getting employee' });
  }
}