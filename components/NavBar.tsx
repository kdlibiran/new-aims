import Image from "next/image";
import Link from "next/link";

export default async function NavBar({
  hasLogin,
  hasFullName,
  hasLinks,
  currentActive,
}: {
  hasLogin: boolean;
  hasFullName: boolean;
  hasLinks: boolean;
  currentActive: string;
}) {
  const isActive = (page: string) => {
    return page === currentActive
      ? "underline underline-offset-4"
      : "text-black";
  };

  return (
    <nav className="border-b-foreground/10 bg-gray flex h-24 w-full flex-col justify-center border-b border-black-500/100">
      <div className="flex flex-row justify-center">
        <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
          <div className="flex gap-1">
            <Link href="/">
              <Image src="/img/logo.svg" alt="Logo" width={70} height={70} />
            </Link>
            {hasFullName && (
              <div className="flex w-[200px] flex-col justify-center text-[18px] leading-4">
                <p className="hidden sm:flex text-black">
                  Automated Inventory Management System
                </p>
                <p className="flex sm:hidden text-black">AIMS</p>
              </div>
            )}
            {hasLinks && (
              <ul className="flex gap-4 flex-row justify-center items-center pl-5 text-lg">
                <li className={isActive("home")}>
                  <Link href="/main">Home</Link>
                </li>
                <li className={isActive("inventory")}>
                  <Link href="/inventory">Inventory</Link>
                </li>
              </ul>
            )}
          </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="btn-generic whitespace-nowrap text-xs sm:text-sm"
              >
                Log In
              </Link>   
            </div>  
          </div>
      </div>
    </nav>
  );
}
