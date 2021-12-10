// eslint-disable-next-line import/newline-after-import
import './set-env';

import sequelizePkg from 'sequelize';

const { Sequelize, Model, DataTypes } = sequelizePkg;

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
} = process.env;

const sequelize = new Sequelize(
  POSTGRES_DATABASE,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    dialect: 'postgres',
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export class AccountModel extends Model {}
AccountModel.init(
  {
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    organizationId: { type: DataTypes.INTEGER },
    lineThirdPartyId: { type: DataTypes.STRING },
    facebookThirdPartyId: { type: DataTypes.STRING },
    googleThirdPartyId: { type: DataTypes.STRING },
  },
  { sequelize, modelName: 'account' },
);

(async () => {
  await sequelize.sync({ alter: true });
})();
