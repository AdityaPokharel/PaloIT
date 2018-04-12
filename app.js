const bodyParser = require('body-parser'),
      mongoose   = require("mongoose"),
      express    = require("express"),
      app        = express();
      
mongoose.connect("mongodb://localhost/name_app");

app.use(bodyParser.urlencoded({extended: true}));


let nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});

let Name = mongoose.model("Name", nameSchema);

// Name.create({
//     firstName: "Ann",
//     lastName: "Other"
// });

app.get("/", (req, res) => {
    
    Name.find({}, (err, names) => {
        let nameAndZeros = []
        names.forEach((name) => {
            const fullName = name.firstName + ' ' + name.lastName;
            nameAndZeros.push({fullName: fullName, zeroCount: calculate(fullName)})
        });
        
        if(err) {
            console.log(err);
        } else {
            res.render("index.ejs", {names: nameAndZeros})
        }
    });
    // res.render("index.ejs", {Names: Names});
});

app.post("/names", (req, res) => {
    // Create a new name
    Name.create(req.body.name, (err, newName) => {
        if(err){
            let errorMessage = "Something went wrong. Please try again.";
            res.render("/", {errorMessage: errorMessage}); // TODO: Add error handling in index.ejs.
        } else {
            res.redirect("/");
        }
    });
});

function calculate(fullName){
    // Convert each character to ASCII and add the ASCII value to variable sum.
    let sum = 0;
    for(let i = 0; i < fullName.length; i++){
        sum += fullName.charCodeAt(i);
    }
    console.log("Name: ", fullName);
    console.log("Sum is: ", sum); // for debugging.
    
    // Convert the sum to binary string
    const binarySum = sum.toString(2);
    console.log("Binary sum is: ", binarySum);  // for debugging.
    
    // Calculate the largest number of consecutive 0's in the string.
    let maxZeroCount = 0;
    let currentZeroCount = 0;
    for(let i = 0; i < binarySum.length; i++){
        if(binarySum[i] === '0'){
            currentZeroCount += 1;
        }
        else {
            if(currentZeroCount > maxZeroCount) {
                maxZeroCount = currentZeroCount;
            }
            currentZeroCount = 0;
        }
    }
    
    return maxZeroCount;
}

console.log(calculate("Ann Other"));

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is running!");
});