const mongoose = require("mongoose");

// Use your MongoDB URL directly
const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";

// Load your Client model
const Client = require("../models/client"); // <-- adjust path if needed

// Your email → salutation mapping
const emailSalutations = [
    { email: "haripfm@gmail.com", salutation: "Hari" },
    { email: "rajahuja49@gmail.com", salutation: "Raj" },
    { email: "sharado@gmail.com", salutation: "Sharad" },
    { email: "hemant.pandey17@gmail.com", salutation: "Hemant" },
    { email: "sandeepmoonka@gmail.com", salutation: "Sandeep" },
    { email: "arjunleo21@gmail.com", salutation: "Dr. Arjun" },
    { email: "sameergoel@yahoo.com", salutation: "Sameer" },
    { email: "nabhojit@gmail.com", salutation: "Nabhojit" },
    { email: "mohammedmayan@gmail.com", salutation: "Mohammed" },
    { email: "murali.medisetty@gmail.com", salutation: "Murali" },
    { email: "mthakur2792@gmail.com", salutation: "Mayank" },
    { email: "jadhavm0099@gmail.com", salutation: "Mayur" },
    { email: "prabhu9621@gmail.com", salutation: "Prabhu" },
    { email: "arnavgo1998@gmail.com", salutation: "Arnav" },
    { email: "rahul.fernandes@gmail.com", salutation: "Rahul" },
    { email: "sidpanix@gmail.com", salutation: "Siddharth" },
    { email: "aayushsingh90@yahoo.com", salutation: "Aayush" },
    { email: "deepakdorai@gmail.com", salutation: "Deepak" },
    { email: "onlineshripad@gmail.com", salutation: "Shripad" },
    { email: "prasadreddych@hotmail.com", salutation: "Prasad" },
    { email: "deepak.s.parmani@gmail.com", salutation: "Deepak" },
    { email: "priyanka.ramanujam@gmail.com", salutation: "Priyanka" },
    { email: "engaksiit@gmail.com", salutation: "Akshay" },
    { email: "geetaroy001@gmail.com", salutation: "Geeta" },
    { email: "vamsi.vinta@gmail.com", salutation: "Vamsi" },
    { email: "gchat1971@gmail.com", salutation: "Ajaya" },
    { email: "gupta13mg@gmail.com", salutation: "Monanshi" },
    { email: "arjunkachru@gmail.com", salutation: "Arjun" },
    { email: "sourav.revo@gmail.com", salutation: "Kumar" },
    { email: "kaptakartik@gmail.com", salutation: "Kartik" },
    { email: "kamat.gautam@gmail.com", salutation: "Gautam" },
    { email: "harshshpr@gmail.com", salutation: "Harsh" },
    { email: "gaurav17nov@gmail.com", salutation: "Gaurav" },
    { email: "prateek@shifuventures.com", salutation: "Prateek" },
    { email: "chitra.khatri28@gmail.com", salutation: "Chitra" },
    { email: "jaiswalankur90@gmail.com", salutation: "Ankur" },
    { email: "prachipatel.2506@gmail.com", salutation: "Prachi" },
    { email: "nehaarikaatalwar@gmail.com", salutation: "Nehaarikaa" },
    { email: "kulkarniprathik@gmail.com", salutation: "Prathik" },
    { email: "neerav.gada@gmail.com", salutation: "Neerav" },
    { email: "manu.chadha87@gmail.com", salutation: "Manu" },
    { email: "anuragdev114@gmail.com", salutation: "Anurag" },
    { email: "ravihanda@gmail.com", salutation: "Ravi" },
    { email: "mehul_rad@yahoo.co.in", salutation: "Mehul" },
    { email: "tarkeshwarrpsingh@gmail.com", salutation: "Tarak" },
    { email: "abhishekpatil1221@gmail.com", salutation: "Abhishek" },
    { email: "vrvadodariya@gmail.com", salutation: "Vivek" },
    { email: "gupta.chinmay98@gmail.com", salutation: "Chinmay" },
    { email: "gyan.117@gmail.com", salutation: "Raunak" },
    { email: "akhil20187@gmail.com", salutation: "Akhilesh" },
    { email: "anindya.maity@gmail.com", salutation: "Anindya" },
    { email: "ib.shikha@gmail.com", salutation: "Shikha" },
    { email: "vinayprasad.hnr@gmail.com", salutation: "Vinay" },
    { email: "ashwinknan@gmail.com", salutation: "Ashwin" },
    { email: "vidhu84@gmail.com", salutation: "Vidhya" },
    { email: "venueppala@icloud.com", salutation: "Venu" },
    { email: "x.customersondemand@gmail.com", salutation: "Sagar" },
    { email: "sumanth.koushik@gmail.com", salutation: "Sumanth" },
    { email: "kshitijnagvekar@gmail.com", salutation: "Kshitij" },
    { email: "soumil0606@gmail.com", salutation: "Soumil" },
    { email: "ajay.jain788@gmail.com", salutation: "Ajay" },
    { email: "mohdbabu111@gmail.com", salutation: "Lt. Col. Babu" },
    { email: "captvaibhavpandey@gmail.com", salutation: "Capt. Vaibhav" },
    { email: "swapnil34@gmail.com", salutation: "Swapnil" },
    { email: "ankur.agr2207@gmail.com", salutation: "Ankur" },
    { email: "ashraymathur@gmail.com", salutation: "Ashray" },
    { email: "saurabhjambure@gmail.com", salutation: "Saurabh" },
    { email: "raunaqjaisinghani@gmail.com", salutation: "Raunaq" },
    { email: "h.srivstva@gmail.com", salutation: "Harshita" },
    { email: "hariteja.526@gmail.com", salutation: "Hari" },
    { email: "chitresh.iitkgp@gmail.com", salutation: "Chitresh" },
    { email: "ps.sharma.111@gmail.com", salutation: "Pratiksha" },
    { email: "guptapratyush98@gmail.com", salutation: "Pratyush" },
    { email: "vaibhav.smarty@gmail.com", salutation: "Vaibhav" },
    { email: "connectnishantsinha@gmail.com", salutation: "Nishant" },
    { email: "rahuln92@gmail.com", salutation: "Rahul" },
    { email: "kishorelr@gmail.com", salutation: "Kishore" },
    { email: "ansh.luthra@gmail.com", salutation: "Ansh" },
    { email: "agrawal.shubham1729@gmail.com", salutation: "Shubham" },
    { email: "inamdarshashank08@gmail.com", salutation: "Shashank" },
    { email: "gaurav.j.keskar@gmail.com", salutation: "Gaurav" },
    { email: "ahujanit@gmail.com", salutation: "Deepak" },
    { email: "hariniit24@gmail.com", salutation: "Harini" },
    { email: "prasuj@gmail.com", salutation: "Prasuj" },
    { email: "kalrarahul95@gmail.com", salutation: "Rahul" },
    { email: "nishant.chandra@gmail.com", salutation: "Nishant" },
    { email: "madhvar@yahoo.com", salutation: "Raghuram" },
    { email: "ramakrishnan.nivedita@gmail.com", salutation: "Nivedita" },
    { email: "shubham.rnc@gmail.com", salutation: "Shubham" },
    { email: "gauravkr580@gmail.com", salutation: "Gaurav" },
    { email: "abhishankgupta15@gmail.com", salutation: "Abhishank" },
    { email: "sharmishthabalwan@gmail.com", salutation: "Sharmishtha" },
    { email: "shubhamupasani46@gmail.com", salutation: "Shubham" },
    { email: "abhishek2iitr@gmail.com", salutation: "Abhishek" },
    { email: "raveeshupahuja@gmail.com", salutation: "Raveeshu" },
    { email: "rituraj131113@gmail.com", salutation: "Ritu" },
    { email: "ragarwal3348@gmail.com", salutation: "Rohit" },
    { email: "anilkumar.manukonda@gmail.com", salutation: "Anil" },
    { email: "dineshvimmala@gmail.com", salutation: "Dinesh ji" },
    { email: "pranav.25.arora@gmail.com", salutation: "Pranav" },
    { email: "akshay.kanjalkar@gmail.com", salutation: "Akshay" },
    { email: "ranjitachandra@gmail.com", salutation: "Ranjita" },
    { email: "rohitchauhan.mail@gmail.com", salutation: "Rohit" },
    { email: "harsh.shrimal@gmail.com", salutation: "Harsh" },
    { email: "rahulmohan1307@gmail.com", salutation: "Rahul" },
    { email: "financedinesh83@gmail.com", salutation: "Dinesh" },
    { email: "harshasks@gmail.com", salutation: "Harsha" },
    { email: "manyu4605@gmail.com", salutation: "Abhimanyu" },
    { email: "rajug058@gmail.com", salutation: "Kennedy" },
    { email: "aditya.garg666@gmail.com", salutation: "Aditya" },
];

async function updateSalutations() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Connected to MongoDB");

        const bulkOps = emailSalutations.map(item => ({
            updateOne: {
                filter: { email: { $in: [item.email] } }, // FIXED for array field
                update: { $set: { salutation: item.salutation } } // FIXED field name
            }
        }));

        const result = await Client.bulkWrite(bulkOps);
        console.log(`🎉 Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Error updating salutations:", err);
        mongoose.connection.close();
    }
}


updateSalutations();
