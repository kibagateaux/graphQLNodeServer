import Sequelize from 'sequelize';
import _ from 'lodash';
import Faker from 'faker';


const DB = new Sequelize(
  'portfolio_website',
  'kiba',
  'db_type e.g. postgres',
  {
    dialect: 'postgres',
    host: 'localhost'
  }
)

const User = DB.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bio: {
    type: Sequelize.TEXT,
    options: {length: 'medium'},
    allowNull: true
  }
})

const Video = DB.define('video', {
  caption:{
    type: Sequelize.STRING
  },
  media_type:{
    type: Sequelize.STRING,
    defaultValue: 'video',
    allowNull: false
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING)
  },
  source_url: {
    type: Sequelize.STRING,
    allowNull: false
  }
});


User.hasMany(Video);
Video.belongsTo(User);

DB.sync({force:true}).then(() => {
  _.times(10, () =>{
    const username = Faker.name.findName();
    return User.create({
      username,
      name: Faker.name.findName(),
      email: Faker.internet.email(),
      bio: Faker.name.jobDescriptor(),
    }).then(person => {
      return person.createVideo({
        media_type: 'video',
        caption: `Sample Video by ${username}`,
        source_url: Faker.internet.url()
      })
    })
  })
})

export { DB, User, Video };
