'use client';

import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { SetStateAction, useState } from "react";
//import { Link, useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import Link from "next/link";

const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	//const navigate = useNavigate();
	const router = useRouter();

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();

		try {
			await signup(email, password, name);
			//navigate("/");
			router.push("/");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-white via-purple-100 to-purple-200 flex items-center justify-center relative overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='max-w-md w-full bg-white bg-opacity-80 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden'
			>
				<div className='p-8'>
					<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text'>
						Create Account
					</h2>

					<form onSubmit={handleSignUp}>
						<Input
							icon={User}
							type='text'
							placeholder='Username'
							value={name}
							onChange={(e: { target: { value: SetStateAction<string>; }; }) => setName(e.target.value)}
						/>
						<Input
							icon={Mail}
							type='email'
							placeholder='Email'
							value={email}
							onChange={(e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value)}
						/>
						<Input
							icon={Lock}
							type='password'
							placeholder='Password'
							value={password}
							onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}
						/>
						{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

						<motion.button
							className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white transition duration-200'
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Sign Up"}
						</motion.button>
					</form>
				</div>

				<div className='px-8 py-4 bg-white bg-opacity-60 flex justify-center'>
					<p className='text-sm text-gray-600'>
						Already have an account?{" "}
						<Link href="/user/login" className='text-purple-600 hover:underline'>
							Login
						</Link>
					</p>
				</div>
			</motion.div>
		</div>
	);
};

export default SignUpPage;
