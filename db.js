require('dotenv').config();
const CyclicDB = require('cyclic-dynamodb');
const db = CyclicDB(process.env.idCyclicDB);

const run = async function(){
    let animals = db.collection('reminders')

    let leo = await animals.set('status', {
        lastrun: Date.now(),
    })

    // get an item at key "leo" from collection animals
    let item = await animals.get('status')
    console.log(item.updated)
}
// run();
// from the docs of cyclic
var date = new Date();
console.log(date)
console.log(date.toDateString());