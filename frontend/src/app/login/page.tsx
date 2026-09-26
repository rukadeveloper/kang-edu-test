import LoginBox from "./LoginBox";

export default async function LoginPage() {
    return (
        <div id="loginWrap" className="w-full bg-gradient-to-b from-[#1E2F3F] to-[#2F4961] flex justify-center items-center">
            <LoginBox />
        </div>
    )
}