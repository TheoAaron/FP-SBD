"use client";

import { FaInstagram, FaLinkedin } from "react-icons/fa";

interface Member {
  name: string;
  role: string;
  image: string;
  instagram: string;
  linkedin: string;
}

const members: Member[] = [
  {
    name: "Yudi Ganteng",
    role: "mahasiswa IT",
    image: "/yudi.jpg",
    instagram: "https://instagram.com/yudinandanjaya_",
    linkedin: "https://www.linkedin.com/in/putu-yudi-nandanjaya-wiraguna-901377323/",
  },
  {
    name: "Aaron Smith",
    role: "mahasiswa IT",
    image: "/aaron.jpg",
    instagram: "https://instagram.com/theodorus.aaron",
    linkedin: "https://www.linkedin.com/in/theodorus-aaron-410603323/",
  },
  {
    name: "Alfarion",
    role: "mahasiswa IT",
    image: "/alfa.jpg",
    instagram: "https://instagram.com/alfaeran_auriga",
    linkedin: "https://www.linkedin.com/in/m-alfaeran-auriga-ruswandi-6a9b01322/",
  },
  {
    name: "Apin Girls Magnet",
    role: "mahasiswa IT",
    image: "/afin.jpg",
    instagram: "https://instagram.com/idzaanafin_",
    linkedin: "https://www.linkedin.com/in/ahmad-idza-anafin-0a5674235/",
  },
  {
    name: "Arul pencari janda",
    role: "mahasiswa IT",
    image: "/arul.jpg",
    instagram: "https://instagram.com/rizki.nas",
    linkedin: "https://www.linkedin.com/in/rizkinasrullah/",
  },
];

const image = "all.jpg";

const AboutSection = () => {
  const rows = [];
  const perRow = 3;

  for (let i = 0; i < members.length; i += perRow) {
    const rowMembers = members.slice(i, i + perRow);
    rows.push(rowMembers);
  }

  return (
    <div className="w-full px-4 py-10 bg-white">
      {/* Our Story */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            tokIT merupakan sebuah e-commerce yang diciptakan oleh 5 mahasiswa
            Teknologi Informasi ITS. Mereka merupakan mahasiswa yang gabut dalam
            membuat final project. Kami doakan agar Final Project Sistem Basis
            Data kami mendapatkan nilai yang maksimal Ibu Rizka.
          </p>
          <p className="text-gray-700">enjoyy web kitaaa gessss....</p>
        </div>
        <img
          src={image}
          alt="Our Story"
          className="rounded-lg shadow-md w-full"
        />
      </div>

      {/* Our Member */}
      <div className="max-w-6xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-10">Our Member</h2>

        {rows.map((row, index) => (
          <div
            key={index}
            className={`grid ${
              row.length < 3
                ? "grid-cols-2 place-items-center gap-x-0" 
                : "sm:grid-cols-2 md:grid-cols-3 gap-x-8"
            } gap-y-9 mb-8`}
          >
            {row.map((member, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center space-y-2"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-70 h-90 object-cover rounded-md shadow"
                />
                <h3 className="text-lg font-medium">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                <div className="flex space-x-4 text-gray-600">
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutSection;
