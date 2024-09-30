const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class Employee extends Model {}
  Employee.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // If image is optional, otherwise set to false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 15], // Ensures mobile number length
      },
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM('Male', 'Female', 'Other'), // Using ENUM for gender
      allowNull: false,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: true, // Make true if course is optional
    },
    createdate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Defaults to the current date/time
    },
  },
  {
    sequelize,
    modelName: 'Employee',
    timestamps: true,
  });
  return Employee;
};

