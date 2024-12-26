'use client';
import { useEffect, useState } from "react";
import countries from '../../../utils/countries.json'
import axios from "axios";
import { useRouter } from "next/navigation";
import { verify } from "crypto";
const SignUp = () => {
  const route=useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstname:"",
    middlename:"",
    lastname:"",
    gender:"",
    email:"",
    phone_number:"",
    dob:"",
    country:"",
    profile_photo_url:"",
    password:""
  });
  const [loading, setLoading] = useState(false);
  const [resend,setResend]=useState(false);
  const [nativeLanguage,setNativeLanguage]=useState("");
  const [learningLanguage,setlearningLanguage] =useState("");
  const [id,setID]=useState(-1);
  const [otp,setOtp]=useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword]= useState("")


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };




  const sendOTP = async(email:string) => {
    const user =await verifyEmail();
    console.log('*******************,',user)
    if(user===false){
      alert("user already exists")
    }
    else{
    setLoading(true);
    setResend(true);
    try {
        await axios.post('http://localhost:5000/users/send-otp', {
            email: email,
        }).then((res)=>{
            setID(res.data.key)
        });
        alert('OTP sent successfully');
    } catch (err) {
        console.error('Something went wrong', err);
    } finally {
        setLoading(false); 
    }
  }

  };

  const submitForm = async() => {
    try {
      const response= await axios.post('http://localhost:5000/users/create-user',{
        formData
      })
      console.log(response)
      if(response.status===201){
       await axios.post('http://localhost:5000/users/login',{
        email:formData.email,
        password:formData.password
       }).then((res)=>{
        console.log(res);
        if(res.status===200){
          alert("Account created successfully")
          route.push('/Home')
        }
       })
      }

    } catch (error) {
      console.log(error)
    }
   
  };



  const handleVerify =async(e)=>{
    if(otp.length<4){
    setOtp(e.target.value);
    }
  }

  useEffect(()=>{
    
    const verify =async()=>{
    if(otp.length==4){
        const enteredOtp=otp;
            setOtp("")
            await axios.post('http://localhost:5000/users/verify-otp', { email: formData.email, enteredOtp: enteredOtp }).then((res)=>{
                console.log(step);
                console.log("otp verified succeess fully");
                setStep(step+1);
                console.log(step);

            }).catch((err)=>{
                console.log(err);
            })
    }
    }
    verify();
  },[otp])

  const nextStep = async () => {
    if (await validateStep()) {
      setStep(step + 1);
    }
  };
    const prevStep = () => setStep(step - 1);

    const verifyEmail =async()=>{
      const response =await axios.get(`http://localhost:5000/users/verify-user?email=${formData.email}`)
      if(response.status===201){
        return true;
      }
      return false;
    }

  const validateStep = async () => {
    switch (step) {
      case 1:
        if (!formData.firstname || !formData.lastname) {
          alert("First Name and Last Name are required.");
          return false;
        }
        break;
      case 2:
        if (!formData.dob) {
          alert("Date of Birth is required.");
          return false;
        }
        break;
      case 3:
        if (!formData.gender) {
          alert("Please select a gender.");
          return false;
        }
        break;
      case 4:
        if (!formData.email) {
        
          alert("Email is required.");
          return false;
        }
        
        break;
      
      case 5:
        if(password !==confirmPassword){
          alert("Password Mismatch")
        }
        break;
      case 6:
        if (!formData.country) {
          alert("Please select a country.");
          return false;
        }
        break;
      case 7:
        if (!nativeLanguage || !learningLanguage) {
          alert("Please select both native and learning languages.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };
  
  
 
  

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="form-step">
            <h2> Enter Your Name</h2>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
             <input
              type="text"
              name="middlename"
              value={formData.middlename}
              onChange={handleChange}
              placeholder="Middle Name (Optional)"
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />


            <div className="buttons">
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="form-step">
            <h2>Step 2: Enter Date of Birth</h2>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
            <div className="buttons">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="form-step">
            <h2>Step 3: Select Gender</h2>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="buttons">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="form-step">
            <h2>Step 4: Verify Email</h2>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            {loading===false && resend===false ?<button onClick={()=>sendOTP(formData.email)}  disabled={loading}>Send OTP</button>:<></>}
            {resend===true ?<button onClick={()=>sendOTP(formData.email)}  disabled={loading}>ReSend OTP</button>:<></>}
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e)=>handleVerify(e)}
              placeholder="Enter OTP"
              required
            />
            <div className="buttons">
              <button onClick={prevStep}>Back</button>
            </div>
        </div>
        );

    case 5:
        return (
          <div className="form-step">
            <label htmlFor="">Password</label>
            <input type="password" 
             name="password"
             value={password}
             placeholder="create Password"
             onChange={(e)=>setPassword(e.target.value)}
             required
             />

             <input type="text" name="confirmPassword" 
             value={confirmPassword}
             onChange={(e)=>setConfirmPassword(e.target.value)}
             required
             placeholder="confirm password"
              />

              <div className="buttons">
                <button onClick={nextStep}>Next</button>
              </div>

            
          </div>
        );


    case 6:
        return (
          <div className="form-step">
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Select Country</option>
              {countries.map((data, index) => (
                <option key={index} value={data.country}>
                  {data.country}
                </option>
              ))}
            </select>

            <div className="buttons">
              <button onClick={prevStep}>Back</button>
              <button onClick={nextStep}>Next</button>
            </div>
          </div>
        );
    case 7:
        return (
          <div className="form-step">
            <h2>Your Native language</h2>
            <select
              value={nativeLanguage}
              onChange={(e) => setNativeLanguage(e.target.value)}
              required
            >
              <option value="Tamil">Tamil</option>
              <option value="English">English</option>
            </select>
            <h2>Learning Language</h2>
            <select
              value={learningLanguage}
              onChange={(e) => setlearningLanguage(e.target.value)}
            >
              <option value="Malayalam">Malayalam</option>
              <option value="Eela Thamizh">Eela Thamizh</option>
            </select>
            <div className="buttons">
              <button onClick={prevStep}>Back</button>
              <button onClick={submitForm}>Submit</button>
            </div>
          </div>
        );
    
      default:
        return <h2>Sign Up Completed!</h2>;
    }
  };

  return (
    <div className="signup-container">
      {renderStep()}
      <style>{`
        .signup-container {
          max-width: 400px;
          margin: 50px auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: Arial, sans-serif;
        }
        .form-step {
          margin-bottom: 20px;
        }
        h2 {
          font-size: 18px;
          margin-bottom: 10px;
        }
        input, select {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
        }
        .buttons {
          display: flex;
          justify-content: space-between;
        }
        button {
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
