const Sequelize = require("sequelize");
const db = new Sequelize("postgres://localhost/countryclub");
const express = require("express");
const { STRING, DATE } = Sequelize;
const app = express();

const facilities = db.define("facilities", {
  fac_name: {
    type: STRING,
    allowNull: false,
    unique: true
  },
});

const members = db.define("members", {
  first_name: {
    type: STRING,
    allowNull: false,
    unique: true
  },
});

const bookings = db.define("bookings", {
  startTime: {
    type: DATE,
    allowNull: false,
  },
  endTime: {
    type: DATE,
    allowNull: false
  }
});

bookings.belongsTo(members);
bookings.belongsTo(facilities);
members.hasMany(bookings);
members.belongsTo(members, {as: "sponsor"});

const syncAndSeed = async () => {
  await db.sync({ force: true });

  const [tennis_court, pool, golf] = await Promise.all(
    ["tennis_court", "pool", "golf"].map(fac_name => {
      facilities.create({fac_name})
    })
  );

  const [moe, larry, curly, joe] = await Promise.all(
    [members.create({ first_name: 'moe'}),
    members.create({ first_name: 'larry'}),
    members.create({ first_name: 'curly'}),
    members.create({ first_name: 'joe'})]
    
    
    // ["moe", "larry", "curly", "joe"].map(first_name => {
    //   members.create({first_name})
    // })
  );

  // const [moe, larry, curly, joe] = await Promise.all([
  //   members.create({ first_name: 'moe'}),
  //   members.create({ first_name: 'larry'}),
  //   members.create({ first_name: 'curly'}),
  //   members.create({ first_name: 'joe'})
  // ]);



//await bookings.create(
  console.log("---------------------------------------------");  
  console.log(larry.id);

  curly.sponsorId = moe.id;
  larry.sponsorId = joe.id
  await Promise.all([
    curly.save(), larry.save()
  ]);


await bookings.create({ startTime: new Date(), endTime: new Date(), memberId: 1, facilityId: 1,});
await bookings.create({ startTime: new Date(), endTime: new Date(), memberId: 2, facilityId: 2,});
await bookings.create({ startTime: new Date(), endTime: new Date(), memberId: 3, facilityId: 3,});




};


const init = async () => {
  try{
   await syncAndSeed();

// moe.sponsorId = larry.id;
// await moe.save();
   const port = process.env.PORT || 3000;
   app.listen(port, () => console.log("listening to port 3000"));
  }catch(ex){
    console.log(ex);
  }
};

init();
