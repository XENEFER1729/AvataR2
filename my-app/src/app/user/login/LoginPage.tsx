'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const router = useRouter();

	const { login, isLoading, error } = useAuthStore();

	const handleLogin = async (e: { preventDefault: () => void; }) => {
		e.preventDefault();
		await login(email, password);
    router.push("/");
	};

	return (
		<div className="min-h-screen bg-white text-purple-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-purple-50 border border-purple-200 rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-purple-800">
          Log in to your account
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 font-semibold text-sm">{error}</p>}

          <div className="text-right text-sm mb-2">
            <a href="/user/forgot-password" className="text-purple-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-purple-700 text-white font-semibold rounded-lg hover:bg-purple-800 transition-colors duration-200"
          >
            {isLoading ? <Loader className="w-5 h-5 animate-spin mx-auto" /> : "Login"}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-purple-600">
            Don't have an account?{' '}
            <a href="/user/signup" className="text-purple-700 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
	);
};
export default LoginPage;
