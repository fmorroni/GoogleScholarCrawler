import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize('database', 'Franco', 'password', {
  dialect: 'sqlite',
  storage: './db.sqlite',
});
