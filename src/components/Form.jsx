 
import React, { useState } from 'react';

function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    collegeEmail: '',
    rollNumber: '',
    numbers: '',
    alphabets: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);  
  const [errorMessage, setErrorMessage] = useState('');  
  const [responseData, setResponseData] = useState(null); 

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const validateForm = () => {
    const errors = {};

    if (!formData.fullName) errors.fullName = 'Full Name is required.';
    if (!formData.dob) errors.dob = 'Date of Birth is required.';
    if (!formData.collegeEmail) errors.collegeEmail = 'College Email is required.';
    if (!formData.rollNumber) errors.rollNumber = 'College Roll Number is required.';
    if (!formData.numbers) errors.numbers = 'Numbers array is required.';
    if (!formData.alphabets) errors.alphabets = 'Alphabets array is required.';

    setFormErrors(errors);

    return Object.keys(errors).length === 0;  
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data before sending to API:', formData);
  
    if (validateForm()) {
      try {
        setLoading(true); 
        setErrorMessage(''); 

        
        const numbersArray = formData.numbers.split(',').map(item => parseInt(item.trim(), 10));   
        const alphabetsArray = formData.alphabets.split(',').map(item => item.trim());  

      
        if (!numbersArray.length || !alphabetsArray.length) {
          setErrorMessage("Numbers and Alphabets arrays cannot be empty.");
          return;
        }

   
        const response = await fetch('http://localhost:5000/post/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            dob: formData.dob,
            collegeEmail: formData.collegeEmail,
            rollNumber: formData.rollNumber,
            numbers: numbersArray,  
            alphabets: alphabetsArray, 
          }),
        });

   
        if (response.ok) {
          const data = await response.json();
          setResponseData(data); 
          setSubmitted(true); 
        } else {
          const errorData = await response.json();
          console.log("API Error Response:", errorData); 
          throw new Error('Failed to submit form');
        }
      } catch (error) {
        setErrorMessage('Error: ' + error.message);  
      } finally {
        setLoading(false);  
      }
    }
  };

  return (
    <div className="form-container">
      <h1>Submit Your Details</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            1. What's your full name? *
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </label>
          {formErrors.fullName && <p className="error">{formErrors.fullName}</p>}
        </div>

        <div>
          <label>
            2. What's your D.O.B? [ddmmyyyy] *
            <input
              type="text"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              placeholder="dd/mm/yyyy"
              required
            />
          </label>
          {formErrors.dob && <p className="error">{formErrors.dob}</p>}
        </div>

        <div>
          <label>
            3. What's your college email ID? *
            <input
              type="email"
              name="collegeEmail"
              value={formData.collegeEmail}
              onChange={handleChange}
              required
            />
          </label>
          {formErrors.collegeEmail && <p className="error">{formErrors.collegeEmail}</p>}
        </div>

        <div>
          <label>
            4. What's your college roll number? *
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
            />
          </label>
          {formErrors.rollNumber && <p className="error">{formErrors.rollNumber}</p>}
        </div>

        <div>
          <label>
            5. Enter Numbers (comma separated) *
            <input
              type="text"
              name="numbers"
              value={formData.numbers}
              onChange={handleChange}
              placeholder="1, 2, 3"
              required
            />
          </label>
          {formErrors.numbers && <p className="error">{formErrors.numbers}</p>}
        </div>

        <div>
          <label>
            6. Enter Alphabets (comma separated) *
            <input
              type="text"
              name="alphabets"
              value={formData.alphabets}
              onChange={handleChange}
              placeholder="A, B, C"
              required
            />
          </label>
          {formErrors.alphabets && <p className="error">{formErrors.alphabets}</p>}
        </div>

        <button type="submit" disabled={loading}>Submit</button>

        {loading && <p className="loading">Submitting...</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>

      {submitted && !errorMessage && (
        <div className="response-data">
          <h2>Form Submitted Successfully!</h2>
          <p><strong>User ID:</strong> {responseData?.user_id}</p>
          <p><strong>College Email ID:</strong> {responseData?.email}</p>
          <p><strong>College Roll Number:</strong> {responseData?.roll_number}</p>
          <p><strong>Numbers Array:</strong> {responseData?.numbers.join(', ')}</p>
          <p><strong>Alphabets Array:</strong> {responseData?.alphabets.join(', ')}</p>
          <p><strong>Highest Lowercase Alphabet:</strong> {responseData?.highest_lowercase_alphabet.join(', ')}</p>
          <p><strong>Prime Number Found:</strong> {responseData?.is_prime_found ? 'Yes' : 'No'}</p>
          <p><strong>File Validity:</strong> {responseData?.file_valid ? 'Valid' : 'Invalid'}</p>
          <p><strong>File MIME Type:</strong> {responseData?.file_mime_type}</p>
          <p><strong>File Size (KB):</strong> {responseData?.file_size_kb}</p>
        </div>
      )}
    </div>
  );
}

export default Form;
