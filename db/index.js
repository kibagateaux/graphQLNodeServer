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

User.hasMany(Medium);
Medium.belongsTo(User);

const fakeUsers = [
  {
    username: "KSIO",
    name: "KSIO",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17076342_280499869046646_5497105290413211648_n.jpg",
    youtube_username: "KSIOlajidebt",
    instagram_username: "ksi",
    twitter_username: "KSIOlajidebt"
  },
  {
    username: "songofstyle",
    name: "songofstyle",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17817736_800697973419926_6567410440496742400_n.jpg",
    youtube_username:"songofstyleblog",
    instagram_username: "songofstyle",
    twitter_username: null
  },
  {
    username: "Vsauce",
    name: "Vsauce",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17817416_1299195360165700_2397822955083005952_n.jpg",
    youtube_username: "Vsauce",
    instagram_username: "electricpants",
    twitter_username: "tweetsauce"
  },
  {
    username:"PewDiePie",
    name:"PewDiePie",
    email:Faker.internet.email(),
    profile_img: "PewDiePie",
    youtube_username: "PewDiePie",
    instagram_username: "pewdiepie",
    twitter_username: "pewdiepie"
  },
  {
    username: "smosh",
    name: "smosh",
    email:Faker.internet.email(),
    profile_img:"https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17596779_1713872738911015_148903535445016576_n.jpg",
    youtube_username: "smosh",
    instagram_username: "smosh",
    twitter_username: "smosh"
  },
  {
    username: "marcusbutler",
    name: "Marcus Butler",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17438427_1240022316119176_4868692553567830016_n.jpg",
    youtube_username: "MarcusButlerTV",
    instagram_username: "marcusbutler",
    twitter_username: "MarcusButler"
  },
  {
    username: "rhettandlink2",
    name: "rhettandlink2",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e15/11252873_557509537730789_377840788_n.jpg",
    youtube_username: "rhettandlink2",
    instagram_username: "rhettandlink2",
    twitter_username: "rhettandlink2"
  },
  {
    username: "MichellePhan",
    name: "Michelle Phan",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/12237343_829856133797698_1069637161_n.jpg",
    youtube_username: "MichellePhan",
    instagram_username: "michellephan",
    twitter_username: "MichellePhan"
  },
  {
    username: "RoosterTeeth",
    name: "RoosterTeeth",
    email:Faker.internet.email(),
    profile_img:"https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/15337342_198677357261250_3298754046919180288_n.jpg",
    youtube_username: "RoosterTeeth",
    instagram_username: "roosterteeth",
    twitter_username: "RoosterTeeth",
  },
  {
    username: "nashgrier",
    name: "Nash Grier",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/sh0.08/e35/p750x750/17663368_164734870716091_2647108337321115648_n.jpg",
    youtube_username: "griernash",
    instagram_username: "nashgrier",
    twitter_username: "Nashgrier"
  },
  {
    username: "ingridnilsen",
    name: "Ingrid Nilsen",
    email: Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17662984_1657386311236371_2128762482557190144_n.jpg",
    youtube_username: "missglamorazzi",
    instagram_username: "ingridnilsen",
    twitter_username: "ingridnilsen"
  },
  {
    username: "KSIO",
    name: "KSIO",
    email:Faker.internet.email(),
    profile_img: "https://scontent-lga3-1.cdninstagram.com/t51.2885-15/e35/17076342_280499869046646_5497105290413211648_n.jpg",
    youtube_username: "KSIOlajidebt",
    instagram_username: "ksi",
    twitter_username: "KSIOlajidebt"
  }
];

let i = -1;

Conn.sync({force:true}).then(() => {
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
