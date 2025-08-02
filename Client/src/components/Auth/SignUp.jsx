const SignUp = () => (
  <div className="form-container">
    <form className="auth-form">
      <h2 className="auth-title">Create an Account</h2>
      
      <div className="input-group">
        <label htmlFor="signup-name">Name</label>
        <input type="text" id="signup-name" placeholder="Enter your full name" />
      </div>

      <div className="input-group">
        <label htmlFor="signup-email">Email</label>
        <input type="email" id="signup-email" placeholder="Enter your email" />
      </div>

      <div className="input-group">
        <label htmlFor="signup-username">Set Username</label>
        <input type="text" id="signup-username" placeholder="Choose a username" />
      </div>
      
      <div className="input-group">
        <label htmlFor="signup-password">Set Password</label>
        <input type="password" id="signup-password" placeholder="Choose a strong password" />
      </div>
      
      <button type="submit" className="submit-button">
        Sign Up
      </button>
    </form>
  </div>
);

export default SignUp;