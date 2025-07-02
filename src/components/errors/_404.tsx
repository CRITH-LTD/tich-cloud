import { Link } from "react-router-dom";
import { Logo } from "../Common/Logo";
// import MueaHall from "../../assets/images/green_blue_balloons_arrangement.jpg";

export default function Error404() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-no-repeat bg-center flex items-center justify-center text-center animate__animated animate__fadeIn"
      // style={{ backgroundImage: `url(${MueaHall})` }}
    >
      <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Logo theme="dark" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">Not bad you arrived here</p>
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow"
        >
          Please Start Over
        </Link>
      </div>
    </div>
  );
}
