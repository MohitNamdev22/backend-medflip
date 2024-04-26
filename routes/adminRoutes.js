const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const router = express.Router();

const dataFilePath = path.join(__dirname, 'medications.json');
const duplicateDataFilePath = path.join(__dirname, 'medications_with_pricing.json');
const testimonialsFilePath = path.join(__dirname, 'testimonials.json');


// Medication data Routes Functions
function readDataFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return { medications: [] };
  }
}

function writeDataToFile(data, filePath) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
}

// Testimonials Route Functions
function readTestimonialsFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading testimonials from file:', error);
    return [];
  }
}

function writeTestimonialsToFile(testimonials, filePath) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(testimonials, null, 2));
  } catch (error) {
    console.error('Error writing testimonials to file:', error);
  }
}


router.use(cors())

//Medication Routes
router.post('/medications', (req, res) => {
  const { name, expirationDate, quantity } = req.body;
  const price = 0;
  let { medications } = readDataFromFile(dataFilePath);
  const id = medications.length > 0 ? Math.max(...medications.map(med => med.id)) + 1 : 1;
  medications.push({ id, name, expirationDate, quantity, price });
  writeDataToFile({ medications }, dataFilePath);

  let duplicateMedications = [...medications];
  duplicateMedications.forEach(medication => {
    medication.price = price; 
  });

  writeDataToFile({ medications: duplicateMedications }, duplicateDataFilePath);

  res.status(201).json({ message: 'Medication added successfully', id });
});

router.put('/medications/:id', (req, res) => {
  const medicationId = parseInt(req.params.id);
  const { name, expirationDate, quantity } = req.body;
  let { medications } = readDataFromFile(dataFilePath);
  const index = medications.findIndex(med => med.id === medicationId);

  if (index !== -1) {
    medications[index] = { id: medicationId, name, expirationDate, quantity };
    writeDataToFile({ medications }, dataFilePath);
    writeDataToFile({ medications }, duplicateDataFilePath);

    res.status(201).json({ message: 'Medication updated successfully' });
  } else {
    res.status(404).json({ message: 'Medication not found' });
  }
});

router.delete('/medications/:id', (req, res) => {
  const medicationId = parseInt(req.params.id);
  let { medications } = readDataFromFile(dataFilePath)
  medications = medications.filter(med => med.id !== medicationId);

  writeDataToFile({ medications }, dataFilePath); 
  writeDataToFile({ medications }, duplicateDataFilePath); 

  res.status(201).json({ message: 'Medication deleted successfully' });
});

// Retrieving all medications
router.get('/medications', (req, res) => {
  console.log("reached")
  const { medications } = readDataFromFile(duplicateDataFilePath);
  res.json(medications);
});



// Testimonial Routes
router.get('/testimonials', (req, res) => {
  const testimonials = readTestimonialsFromFile(testimonialsFilePath);
  res.json(testimonials);
});

router.post('/testimonials', (req, res) => {
  const { name, message } = req.body;
  const testimonials = readTestimonialsFromFile(testimonialsFilePath);
  const id = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
  testimonials.push({ id, name, message });

  writeTestimonialsToFile(testimonials, testimonialsFilePath);

  res.status(201).json({ message: 'Testimonial added successfully', id });
});




module.exports = router;
