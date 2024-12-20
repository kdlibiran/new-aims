import Image from "next/image";
import NavBar from "../../components/NavBar";
type PersonProps = {
  name: string;
  email: string;
};

const Person = ({ name, email }: PersonProps) => (
  <div className="flex flex-col">
    <span className="text-base leading-4">{name}</span>
    <span className="text-graysubtitle text-[13px]">{email}</span>
  </div>
);

const people = [
  { name: "Gregorio, Herminio IV", email: "hlgregorio@up.edu.ph" },
  { name: "Libiran, Kyle David", email: "kglibiran@up.edu.ph" },
  { name: "Manguan, Ayen Unice", email: "ammanguan@up.edu.ph" },
];

export default async function Index() {
  return (
    <>
        <NavBar
          hasLogin={true}
          hasFullName={true}
          hasLinks={false}
          currentActive={""}
        />
        <div className="flex w-full flex-1 flex-col flex-wrap items-center justify-center gap-6 py-10 sm:flex-row sm:gap-0 bg-white">
          <div className="flex w-full flex-row justify-center sm:w-1/4">
            <Image
              src="/img/illus-landing-page.svg"
              alt="Woman carrying a box"
              width="0"
              height="0"
              sizes="100vw"
              className="h-[250px] w-[200px] sm:h-[500px] sm:w-[300px]"
            />
          </div>
          <div className="flex max-w-[650px] flex-col justify-center gap-2 px-10 text-center sm:justify-start sm:gap-5 sm:px-0 sm:text-left text-black">
            <h1>
              Streamline your business operations with
              <span className="text-purple font-bold"> AIMS</span>.
            </h1>
            <div className="sm:w-2/3">
              <h3>
                Keep track of products, know when to restock, know when to order
                more, and know when products will expire.
              </h3>
            </div>
          </div>
        </div>
        <footer className="bg-gray flex min-h-24 w-full flex-row items-center justify-center gap-0 border-t sm:gap-20 border-black">
          <div className="flex flex-col gap-4 p-6 pr-0 sm:flex-row sm:gap-8">
            <span className="border-purple border-l-[6px] pl-4 text-[23px] text-black">
              Contact us!
            </span>
            <div className="flex flex-wrap gap-2 sm:gap-9 text-black">
              {people.map((person, index) => (
                <Person key={index} name={person.name} email={person.email} />
              ))}
            </div>
          </div>
          <div className="text-graysubtitle flex items-center gap-2 p-6 py-5 pl-0 text-xs leading-3">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#6C63FF"
                className="h-4 w-4"
              >
                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                <path
                  fillRule="evenodd"
                  d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p>This is a web app developed for CS 191/192.</p>
          </div>
        </footer>
      </>
  );
}
