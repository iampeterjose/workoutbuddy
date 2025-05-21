import { Link } from "react-router-dom";

const NavbarList = [
  {
    name: "🏋️ Workout Buddy",
    link: "/",
  }
];

const Navbar = () => {
  return (
    <nav className="w-full bg-white/80 backdrop-blur shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        <ul className="flex space-x-6">
          {NavbarList.map((item, index) => (
            <li key={index}>
              <Link
                to={item.link}
                className="text-2xl font-extrabold text-teal-700 tracking-tight hover:text-cyan-600 transition"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {/* You can add more nav items or a user menu here in the future */}
      </div>
    </nav>
  );
};

export default Navbar;