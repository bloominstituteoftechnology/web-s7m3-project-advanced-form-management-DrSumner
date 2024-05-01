// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import { isValid } from 'ipaddr.js'
import React, { useState, useEffect }from 'react'
import axios from 'axios'
import * as yup from 'yup'

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}
const endPoint = 'https://webapis.bloomtechdev.com/registration'
// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.
const formSchema = yup.object().shape({

  username: yup
  .string()
  .min(3, e.usernameMin)
  .max(20, e.usernameMax)
  .required(e.usernameRequired),

  favLanguage: yup
  .string()
  .oneOf(["javascript", 'rust'], e.favLanguageOptions)
  .required(e.favLanguageRequired),

  favFood: yup
  .string()
  .oneOf(["broccoli", 'spaghetti', 'pizza'], e.favFoodOptions)
  .required(e.favFoodRequired),

  agreement: yup
  .boolean()
  .oneOf([true], e.agreementOptions)
  .required(e.agreementRequired)
})
const initialValues = {username: '', favLanguage: '', favFood: '', agreement: false}
export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({username: '', favLanguage: '', favFood: '', agreement: ''})
  const [enabled, setEnabled] = useState(false)
  const [success, setSucess] = useState('')
  const [failure, setFailure] = useState('')
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.

  // ✨ TASK: BUILD YOUR EFFECT HERE
  useEffect(() => {
    formSchema.isValid(values).then(isValid => {
      setEnabled(isValid)
    })
  }, [values])
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.

  const onChange = evt => {
    // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
    let {type, checked, name, value} = evt.target
    if (type === 'checkbox') value = checked
    setValues({...values, [name]: value})
    // The logic is a bit different for the checkbox, but you can check
    // whether the type of event target is "checkbox" and act accordingly.
    // At every change, you should validate the updated value and send the validation
    // error to the state where we track frontend validation errors.
    yup
    .reach(formSchema, name)
    .validate(value)
    .then(() => { setErrors({...errors, [name]: ''}) })
    .catch((error) => {setErrors({...errors, [name]:error.errors[0]}) })
  }

  const onSubmit = evt => {
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    evt.preventDefault()
    axios.post(endPoint, values)
    .then(res =>{
      setValues(initialValues)
      setSucess(res.data.message)
      setFailure('')
    })
    .catch(err => {
        console.log(err.response.data.message)
      setFailure(err.response.data.message)
      setSucess('')
    })
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit}>
        
        { success && <h4 className="success">{success} </h4>}
        { failure && <h4 className="error">{failure} </h4>}

        <div className="inputGroup">{/* USERNAME */}
          <label htmlFor="username" >Username:</label>
          <input onChange={onChange} value={values.username} id="username" name="username" type="text" placeholder="Type Username" />
          {errors.username && <div className="validation">{errors.username}</div>}
          {/* <div className="validation">username is required</div> */}
        </div>

        <div className="inputGroup">{/* RADIO OPTION */}
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input 
              onChange={onChange} 
              checked={values.favLanguage === 'javascript'}
              type="radio" name="favLanguage" value="javascript" />
              JavaScript
            </label>
            <label>
              <input 
              onChange={onChange} 
              checked={values.favLanguage === 'rust'}
              type="radio" name="favLanguage" value="rust" />
              Rust
            </label>
          </fieldset>
          {errors.favLanguage && <div className="validation">{errors.favLanguage}</div>}
        </div>

        <div className="inputGroup"> {/* DROP DOWN OPTION */}
          <label htmlFor="favFood">Favorite Food:</label>
          <select onChange={onChange} value={values.favFood} id="favFood" name="favFood">
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {errors.favFood && <div className="validation">{errors.favFood}</div>}
        </div>

        <div className="inputGroup"> {/* CHECKBOX */}
          <label>
            <input onChange={onChange} checked={values.agreement} id="agreement" type="checkbox" name="agreement" />
            Agree to our terms
          </label>
          {errors.agreement && <div className="validation">{errors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={!enabled} />
        </div>
      </form>
    </div>
  )
}
