const NavbarList = [
    {
        name: "Workout Buddy",
        link: "/",
    }
]

const Navbar =() => {
    return (
        <nav className="md:px-30 px-3 py-5">
            <ul className="flex space-x-4">
                {NavbarList.map((item, index) => (
                    <li key={index}>
                        <a href={item.link} className="text-2xl font-extrabold hover:text-gray-800">
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;