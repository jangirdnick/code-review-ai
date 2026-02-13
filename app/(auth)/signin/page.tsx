import SigninButton from "@/modules/auth/components/signin-button";
import ToolsGrid from "@/modules/auth/components/tools-grid";
import TopSection from "@/modules/auth/components/top-section";
import Image from "next/image";

export default function LoginPage() {


  return (
    <div className="w-full h-screen grid grid-cols-1 md:grid-cols-2 md:gap-2 p-4 overflow-hidden bg-black text-white">
      <div className="hidden md:block w-full h-full bg-linear-to-br from-orange-700/80 via-orange-800 to-orange-950 rounded-2xl overflow-hidden">
        <Image
        src={"https://i.pinimg.com/1200x/65/0d/0a/650d0a76d85b864fc23cf6ae7c5a5e5a.jpg"}
        alt=""
        width={500}
        height={1000}
        className="w-full h-full object-cover opacity-60" />
      </div>

      <div className="w-full h-full flex flex-col justify-between  lg:px-6">
        <TopSection />

        <div className="space-y-10">
          <SigninButton />

          <ToolsGrid />
        </div>
      </div>
    </div>
  );
}