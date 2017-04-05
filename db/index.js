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
    allowNull: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  twitter_username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  instagram_username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  youtube_username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  bio: {
    type: Sequelize.TEXT,
    options: {length: 'medium'},
    allowNull: true
  },
  facebook_id: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true
  },
  facebook_access_token: {
    type: Sequelize.STRING,
    allowNull: true
  },
  has_applied: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_influencer: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_influencer: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  has_agency: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  agency_name: {
    type: Sequelize.STRING,
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
  type: {
    type: Sequelize.STRING
  }

});

const Medium = Conn.define('medium', {
  caption:{
    type: Sequelize.STRING
  },
  source_url: {
    type: Sequelize.STRING,
    // allowNull: false
  },
  category: {
    type: Sequelize.ARRAY(Sequelize.STRING),
    defaultValue: ["fashion", "money", "entrepreneurship"]
  },
  media_type: {
    type: Sequelize.STRING
  }

});


User.hasMany(Video);
Video.belongsTo(User);

User.hasMany(Medium);
Medium.belongsTo(User);

Conn.sync({force:true}).then(() => {
  _.times(10, () =>{
    return User.create({
      name: Faker.name.firstName(),
      username: Faker.name.firstName(),
      email: Faker.internet.email()
    }).then(person => {
      return person.createMedium({
        title: `Sample Video by ${person.username}`
      })
    })
  })
})

export default Conn;
export { User, Video, Medium };
