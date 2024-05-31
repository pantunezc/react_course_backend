const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const phoneNumberValidator = (number) => {
  const regex = /^\d{2,3}-\d+$/;
  return regex.test(number) && number.length >= 8;
};

const personSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      required: true,
    },
    number: {
      type: String,
      validate: {
        validator: phoneNumberValidator,
        message: (props) => `${props.value} is not a valid phone number!`,
      },
      required: true,
    },
  },
  { collection: "person" }
);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
