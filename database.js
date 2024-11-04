let mongoose = require('mongoose');
const server = '127.0.0.1:27017'; // REMPLACER PAR VOTRE SERVEUR DE BASE DE DONNÉES
const database = 'myDB'; // REPLACEZ AVEC LE NOM DE VOTRE BASE DE DONNÉES

class Database {

  constructor() {

    this.connect()

  }

  connect() {

    mongoose.connect(`mongodb://${server}/${database}`)

      .then(() => {

        console.log('Database connection successful')

      })

      .catch(err => {

        console.error('Erreur de connexion à la base de données')

      })

  }

}

const newdatabase = new Database()
newdatabase.connect()


// Définition du schéma de la personne
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Champ requis
  },
  age: {
    type: Number,
    min: 0 // Age ne peut pas être négatif
  },
  favoriteFoods: {
    type: [String], // Tableau de chaînes
    default: [] // Valeur par défaut est un tableau vide
  }
});
/******************************** */
// Définir le modèle
const Person = mongoose.model('Person', personSchema);

// Create one person
let person1 = new Person({
  name: 'sallah',
  age: 20,
  favoriteFoods: ["salad", "pasta"]
})
// person1.save()
//   .then(doc => {

//     console.log(doc)

//   })
//   .catch(err => {

//     console.error(err)

//   })



// Vérifier si on est déjà connecté
if (mongoose.connection.readyState === 0) {
  // Si non connecté, alors se connecter
  mongoose.connect('mongodb://127.0.0.1:27017/test');
}

// Données à insérer
const arrayOfPeople = [
  {
    name: "Jean",
    age: 25,
    favoriteFoods: ["pizza", "pâtes"]
  },
  {
    name: "Marie",
    age: 30,
    favoriteFoods: ["salade", "fruits"]
  },
  {
    name: "Pierre",
    age: 35,
    favoriteFoods: ["burger", "frites"]
  }
];

// Fonction de création
async function createManyPeople() {
  try {
    const data = await Person.create(arrayOfPeople);
    console.log('Personnes créées:', data);
  } catch (err) {
    console.error('Erreur:', err);
  }
}
// Fonction de recherche par aliment
async function findOneByFood(food) {
  try {
    const result = await Person.findOne({ favoriteFoods: food });
    console.log("Personne trouvée :", result);
  } catch (err) {
    console.error("Erreur :", err);
  }
}





async function updateFavoriteFood(personId) {
  try {
    // Trouver la personne par ID
    const person = await Person.findById(personId);

    if (!person) {
      console.log("Personne non trouvée avec cet ID.");
      return;
    }

    // Ajouter "hamburger" à la liste des aliments préférés
    person.favoriteFoods.push("hamburger");

    // Marquer le champ comme modifié (optionnel si le type est déjà spécifié comme [String])
    person.markModified('favoriteFoods');

    // Sauvegarder la personne mise à jour
    const updatedPerson = await person.save();
    console.log("Personne mise à jour :", updatedPerson);
  } catch (err) {
    console.error("Erreur lors de la mise à jour de la personne :", err);
  }
}




async function findByName(personName) {
  try {
    const result = await Person.find({ name: personName });
    console.log("Personnes trouvées :", result);
  } catch (err) {
    console.error("Erreur recherche :", err);
  }
}
/************************************************ */
async function updateAgeByName(personName) {
  try {
    // Utilisation de findOneAndUpdate pour mettre à jour l'âge
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },  // Critère de recherche
      { age: 20 },          // Nouvelle valeur d'âge
      { new: true }         // Options pour renvoyer le document mis à jour
    );

    // Vérification si la personne a été trouvée
    if (!updatedPerson) {
      console.log("Aucune personne trouvée avec ce nom.");
    } else {
      console.log("Personne mise à jour :", updatedPerson);
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour :", err);
  }
}
/**************************************************************** */

//const Person = require('./models/Person');

async function findPersonById(personId) {
  try {
    return await Person.findById(personId);
  } catch (err) {
    console.error('Erreur :', err);
    throw err;
  }
}

const personId = '6728b7660620825aa3b4b259';

findPersonById(personId)
  .then((person) => {
    if (person) {
      console.log('Personne trouvée :', person);
    } else {
      console.log('Aucune personne trouvée avec cet _id');
    }
  })
  .catch((err) => {
    console.error('Erreur :', err);
  });


/************************************** */
async function deletePersonById(personId) {
  try {
    const deletedPerson = await Person.findByIdAndDelete(personId); // Utiliser findByIdAndDelete
    if (!deletedPerson) {
      console.log("Aucune personne trouvée avec cet ID.");
    } else {
      console.log("Personne supprimée :", deletedPerson);
    }
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
  }
}
/****************************************************** removePeopleByName*/
async function removePeopleByName(name) {
  try {
    const result = await Person.deleteMany({ name: name }); // Utiliser deleteMany
    console.log(`Nombre de personnes supprimées : ${result.deletedCount}`);
  } catch (err) {
    console.error("Erreur lors de la suppression des personnes :", err);
  }
}
/********************************************************************* */
async function findPeopleWhoLikeBurritos() {
  try {
    const data = await Person.find({ favoriteFoods: "burrito" }) // Find people who like burritos
      .sort({ name: 1 }) // Sort by name
      .limit(2) // Limit to 2 results
      .select('-age'); // Exclude age from results

    console.log(data); // Log the results
  } catch (err) {
    console.error('Erreur:', err); // Handle the error
  }
}


// Exécution
// createManyPeople();
// findByName("Jean");
//findOneByFood("pizza");
//findPersonById("6728b7660620825aa3b4b25a")
// updateFavoriteFood("67289e028027481e5672609c");
//updateAgeByName("Jean");
//deletePersonById("67289501e2ac723c60b2b29f")
//removePeopleByName("sallah");
//findPeopleWhoLikeBurritos()