const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://pantunezc:${password}@cluster0.o06pavs.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema(
  {
    name: String,
    number: String,
  },
  { collection: "person" }
);

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  if (process.argv.length === 5) {
    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    person.save().then(() => {
      console.log(`added ${process.argv[3]} number to ${process.argv[4]} phonebook`);
      mongoose.connection.close();
    });
  } else {
    console.log("missing arguments");
    process.exit(1);
  }
}
