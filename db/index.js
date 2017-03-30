'use strict'

import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';


const Conn = new Sequelize(
  'portfolio_website',
  '00y',
  'postgres',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
)

const User = Conn.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
  twitterUsername: {
    type: Sequelize.STRING,
    allowNull: true
  },
  instagramUsername: {
    type: Sequelize.STRING,
    allowNull: true
  },
  youtubeUsername: {
    type: Sequelize.STRING,
    allowNull: true
  },
  bio: {
    type: Sequelize.TEXT,
    options: {length: 'medium'},
    allowNull: true
  }

})

const Video = Conn.define('video', {
  title:{
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING,
    // allowNull: false
  },
  category: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: null
  }

});

User.hasMany(Video);
Video.belongsTo(User);

Conn.sync({force:true}).then(() => {
  _.times(10, () =>{
    return User.create({
      name: Faker.name.firstName(),
      username: Faker.name.firstName(),
      email: Faker.internet.email(),
      password: Faker.name.lastName(),
      youtubeUsername: "TechGuyWeb"
    }).then(person => {
      return person.createVideo({
        title: `Sample Video by ${person.username}`
      })
    })
  })
})

export default Conn;
export { User, Video };
