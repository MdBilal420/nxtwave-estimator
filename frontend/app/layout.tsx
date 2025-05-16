import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "./components/Navigation";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Career & Salary Estimator",
	description:
		"Get personalized career insights and upskilling recommendations",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Navigation />
				<main className='container mx-auto px-4 pt-20 pb-8 max-w-6xl'>
					{children}
				</main>
			</body>
		</html>
	);
}
