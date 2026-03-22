import SignUpCard from "../components/SignUpCard";
import cloudsImg from "../assets/clouds.jpg";

function SignUp() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-blue-100 relative overflow-hidden">
        {/* Background clouds effect */}
        <div
          className="absolute inset-0 bg-cover opacity-40"
          style={{ backgroundImage: `url(${cloudsImg})` }}
        ></div>

        {/* Card */}
        <SignUpCard />
      </div>
    </>
  );
}

export default SignUp;
