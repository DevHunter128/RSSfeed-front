function Footer() {
  return (
    <footer className="z-20 w-full p-2 border-t shadow md:flex md:items-center md:justify-between md:p-3 bg-gray-800 border-gray-600">
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400 md:inline-block md:w-auto md:mr-6">
        © 2023{" "}
        <a href="https://flowbite.com/" className="hover:underline">
          Tom Lasater™
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <a href="#" className="mr-4 hover:underline md:mr-6">
            About
          </a>
        </li>
        <li>
          <a href="#" className="mr-4 hover:underline md:mr-6">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="mr-4 hover:underline md:mr-6">
            Licensing
          </a>
        </li>
        <li>
          <a href="#" className="hover:underline">
            Contact
          </a>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
