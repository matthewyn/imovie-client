import LoginCard from "../components/LoginCard";
import cloudsImg from "../assets/clouds.jpg";

function Login() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-blue-100 relative overflow-hidden">
        {/* Background clouds effect */}
        <div
          className="absolute inset-0 bg-cover opacity-40"
          style={{ backgroundImage: `url(${cloudsImg})` }}
        ></div>

        {/* Card */}
        <LoginCard />
      </div>
    </>
  );
}

export default Login;
