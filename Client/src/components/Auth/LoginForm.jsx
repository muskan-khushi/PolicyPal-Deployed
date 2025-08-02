const LoginForm = () => (
  <div className="form-container">
    <form className="auth-form">
      <h2 className="auth-title">Already a member?</h2>
      
      <div className="input-group">
        <label htmlFor="login-username">Username</label>
        <input type="text" id="login-username" placeholder="Enter your username" />
      </div>
      
      <div className="input-group">
        <label htmlFor="login-password">Password</label>
        <input type="password" id="login-password" placeholder="Enter your password" />
      </div>
      
      <div className="options-container">
          <a href="#" className="forgot-password">Forgot password?</a>
      </div>

      <button type="submit" className="submit-button">
        Log In
      </button>
    </form>
  </div>
);

export default LoginForm;