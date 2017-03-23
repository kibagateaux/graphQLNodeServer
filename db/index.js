import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';

const Connection = new Sequelize(
  'portfolio_website',
  '00y',
  'postgres',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
);

const User = Connection.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  age: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  interests: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  twitterUsername: {
    type: Sequelize.STRING,
    allowNull: true
  },
  facebookUsername: {
    type: Sequelize.STRING,
    allowNull: true
  },
  youtubeUsername: {
    type: Sequelize.STRING,
    allowNull: true
  },
  isInfluencer:{
    type: Sequelize.BOOLEAN,
    allowNull: false
  }

})


const Video = Connection.define('video', {
  title: {
    type: Sequelize.STRING,
    allowNull: true
  }
});

// Relations
User.hasMany(Video);
Video.belongsTo(User);


Connection.sync({ force: true }).then(()=> {
  _.times(10, ()=> {
    return User.create({
      username: Faker.name.firstName() + Faker.name.lastName(),
      isInfluencer: false,
      email: Faker.internet.email()
    }).then(user => {
      return user.createVideo({
        title: `Sample post by ${user.username}`
      });
    });
  });
});


export default Connection
